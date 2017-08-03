import R from 'ramda'
import {expect} from 'chai'
import daggy from 'daggy'
import {Maybe as M} from 'ramda-fantasy'

describe('simplified tree walks', function() {

	// Notre domaine peut se simplifier à une liste d'équations à trous:
	// a: 45
	// b: a + c
	// d: a + 4
	// e: b + d
	// Disons que je veux connaitre "e", alors il va me manquer "c"
	// Si je connais "c", alors je peux calculer "e"
	// Et mon ambition est aussi de pouvoir visualiser le calcul en HTML
	// Donc j'ai une structure plate que je transforme en arbre (ce n'est pas
	// le focus de la présente exploration), je veux pouvoir demander des choses
	// diverses à cet arbre: l'évaluer, repérer les trous, le transformer en HTML

	// Plus tard je vais avoir des trucs plus sophistiqués, par exemple:
	// 	b: a + (bleu: b, vert: c)
	// qui est équivalent à:
	// 	b: b-bleu + b-vert
	// 	b-bleu: a + b
	// 	b-vert: a + c
	// Le but du jeu est de pouvoir le représenter de façon compacte, mais
	// d'avoir un arbre simple à manipuler

	// Pour intégrer dans le simulateur, il faut remplir les exigences
	// suivantes:
	// - décorer l'arbre avec une valeur à chaque noeud
	// - réaliser le calcul de façon efficiente (1 fois par variable)
	// - savoir "court-circuiter" le calcul de variables manquantes dans les conditionnelles
	// - avoir un moyen de gérer les composantes et filtrage

	const Fx = daggy.tagged('Fx',['x'])
	const unFix = R.prop('x')

	// Chaque élément de notre liste est une définition:

	const Def = daggy.taggedSum('Def', {
		Formula: 	 ['expr'],
		Conditional: ['cond','expr'], // Applicable si
		Blocked: 	 ['cond','expr'], // Non applicable si
	})
	const {Formula, Conditional, Blocked} = Def

	// Ce qu'on décrit est un framework de programmation déclarative: on stipule des
	// définitions (salaire net = brut - cotisations) mais on les donne sans ordre
	// impératif, on laisse au moteur le soin de calculer les dépendances

	// Par contre, à l'exécution, il faut bien calculer des "effets de bord"
	// pour rester performant: chaque évaluation d'une définition doit mettre
	// à jour le 'dictionnaire' des valeurs connues, puis le mettre à disposition
	// de la suite du calcul

	// La partie droite d'une définition est une expression:

	const Expr = daggy.taggedSum('Expr',{
		Num: ['x'],
		Add: ['x', 'y'],
		Var: ['name']
//		NotIf: ['condition','formule'],
//		AnyOf: ['conditions'],
//		AllOf: ['conditions'],
	})
	const {Num, Add, Var} = Expr

	// fold :: Functor f => (f a -> a) -> Fix f -> a
	const fold = R.curry((alg, x) => R.compose(alg, R.map(fold(alg)), unFix)(x))

	// Cette fonction fournit la traversée
	Expr.prototype.map = function(f) {
		return this.cata({
			Num: (x) => this, // fixed
			Add: (x, y) => Add(f(x), f(y)),
			Var: (name) => this
		})
	}

	// Celle-ci l'évaluation
	const evaluator = state => a => {
		return a.cata({
			Num: (x) => x,
			Add: (x, y) => R.lift(R.add)(x,y),
			Var: (name) => M.toMaybe(state[name]) // Doesn't typecheck
		})
	}

	// Celle-ci la collecte des variables manquantes
	const collector = state => a => {
		return a.cata({
			Num: (x) => [],
			Add: (x, y) => R.concat(x,y),
			Var: (name) => state[name] ? [] : [name]
		})
	}

	let evaluate = (expr, state={}) =>
		fold(evaluator(state), expr)
		.getOrElse(null) // for convenience

	let missing = (expr, state={}) =>
		fold(collector(state), expr)

	let num = x => Fx(Num(M.Just(x)))
	let add = (x, y) => Fx(Add(x,y))
	let ref = (name) => Fx(Var(name))

	const ExprAnn = daggy.taggedSum('ExprAnn',{
		NumAnn: ['v', 'x'],
		AddAnn: ['v', 'x', 'y'],
	})
	const {NumAnn, AddAnn} = ExprAnn

	const annotate = a => {
		return a.cata({
			NumAnn: (v,x) => NumAnn(x,x),
			AddAnn: (v,x,y) => {
				let ax = annotate(x),
					ay = annotate(y),
					vv = ax.val()+ay.val()
				return AddAnn(vv,ax,ay)
			}
		})
	}

	ExprAnn.prototype.val = function() {
		return this.cata({
			NumAnn: (v,x) => v,
			AddAnn: (v,x,y) => v
		})
	}

	it('should annotate nodes', function() {
		let tree = NumAnn(null,45),
			result = annotate(tree)
		expect(result.val()).to.equal(45)
	});

	it('should annotate trees', function() {
		let tree = AddAnn(null,NumAnn(null,25),NumAnn(null,45)),
			result = annotate(tree)
		expect(result.x.val()).to.equal(25)
		expect(result.y.val()).to.equal(45)
		expect(result.val()).to.equal(70)
	});

	it('should provide a protocol for evaluation', function() {
		let tree = num(45),
			result = evaluate(tree)
		expect(result).to.equal(45)
	});

	it('should evaluate expressions', function() {
		let tree = add(num(45),num(25)),
			result = evaluate(tree)
		expect(result).to.equal(70)
	});

	it('should evaluate nested expressions', function() {
		let tree = add(num(45),add(num(15),num(10))),
			result = evaluate(tree)
		expect(result).to.equal(70)
	});

	it('should evaluate expressions involving variables', function() {
		let tree = add(num(45),ref("a")),
			result = evaluate(tree,{a:25})
		expect(result).to.equal(70)
	});

	it('should evaluate expressions involving missing variables', function() {
		let tree = add(num(45),ref("b")),
			result = evaluate(tree,{a:25})
		expect(result).to.equal(null)
	});

	it('should provide a protocol for missing variables', function() {
		let tree = ref("a"),
			result = missing(tree)
		expect(result).to.deep.equal(["a"])
	});

	it('should locate missing variables in expressions', function() {
		let tree = add(num(45),ref("a")),
			result = missing(tree)
		expect(result).to.deep.equal(["a"])
	});

	it('should locate missing variables in nested expressions', function() {
		let tree = add(add(num(35),ref("a")),num(25)),
			result = missing(tree)
		expect(result).to.deep.equal(["a"])
	});

	it('should locate missing variables in nested expressions', function() {
		let tree = add(add(num(35),ref("a")),num(25)),
			result = missing(tree,{a:25})
		expect(result).to.deep.equal([])
	});

});
