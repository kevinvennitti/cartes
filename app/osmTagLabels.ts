import rawData from '@openstreetmap/id-tagging-schema/dist/translations/fr.json'

const { presets, fields } = rawData.fr.presets

export const getTagLabels = (key, value) => {
	const fullPreset = presets[key + '/' + value]
	if (fullPreset) return [fullPreset.name]

	const field = fields[key]

	if (!field) return [key, translateBasics(value)]

	const values = value.split(';'),
		translatedValues = values.map((v) => {
			const optionValue = field.options?.[v]
			switch (typeof optionValue) {
				case 'string':
					return optionValue
				case 'object':
					if (optionValue.title) return optionValue.title
					break
				default:
					return translateBasics(v)
			}
		})
	return [field.label, translatedValues.join(' - ')]
}

const translateBasics = (value: string) => {
	const found = { yes: 'Oui', no: 'Non' }[value]
	return found || value
}

export const tagNameCorrespondance = (key: string) => {
	const found = {
		alt_name:'Autre nom',
		books: 'Livres',
		artist_name: 'Nom de l\'artiste',
		'brand:website': 'Site de la marque',
		'building:architecture': 'Style architectural',
		'building:levels': "Nombre d'étages",
		'building:part': 'Partie d\'un bâtiment',
		bulk_purchase: 'Achat en vrac',
		'capacity:disabled': 'Place de parking PMR',
		'check_date:opening_hours': 'Horaires vérifiés le',
		'diet:vegan': 'Végan',
		'diet:vegetarian': 'Végétarien',
		'emergency:phone': "Numéro d'urgence",
		female: 'Pour les femmes',
		indoor_seating: "Sièges à l'intérieur",
		'internet_access:fee': 'Accès Internet payant',
		male: 'Pour les hommes',
		official_name: 'Nom officiel',
		old_name: 'Ancien nom',
		'opening_hours:emergency': "Horaires en cas d'urgence",
		'opening_hours:signed': 'Horaires affichés',
		pastry: 'Pâtisserie',
		'payment:card': 'Paiement par carte',
		'payment:cash': 'Paiement en liquide',
		'payment:contactless': 'Paiement sans contact',
		'service:bicycle:cleaning': 'Lavage de vélos',
		'service:bicycle:diy': "Atelier d'autoréparation de vélos",
		'service:bicycle:pump': 'Pompe à vélo en libre-service',
		'service:bicycle:rental': 'Location de vélos',
		'service:bicycle:repair': 'Réparation de vélos',
		'service:bicycle:retail': 'Vente de vélos',
		'service:bicycle:second_hand': "Vente de vélos d'occasion",
		short_name: 'Diminutif',
		tobacco: 'Vente de tabac',
		'website:menu': 'Menu',
		'ref:INSEE': 'Code INSEE',
		'ref:FR:SIREN': 'Code SIREN',
		'ref:FR:NAF': 'Code NAF',
		'ref:FR:FANTOIR': 'Code FANTOIR',
		'ref:FR:FINESS': 'Code FINESS',
		passenger_information_display: "Écran d'information voyageur",
		'survey:date': 'Dernière date de vérification',

		'STIF:zone': 'Zone STIF',
		'subway': 'Métro',
		'train': 'Train',
		'bus': 'Bus',
		'type:RATP': 'Infrastructure RATP',
		'station': 'Type de station',
		'ref:FR:RATP': 'Code RATP',
		'ref:FR:STIF': 'Code STIF',
		'ref:FR:STIF:stop_id': 'ID STIF de l\'arrêt',
		'ref:SNCF': 'Type de ligne SNCF',
		'ref:SNCF:RER': 'Ligne RER SNCF',
		'note:fr' : 'Information',
		'roof:shape': 'Forme du toit',
		'internet_access:operator': 'Fournisseur d\'accès Internet',
		'source:population': 'Source des données de la population',
		'source:wheelchair': 'Source de l\'accessibilité PMR',
		'year': 'Année',
		'phone:for_group': 'Numéro de téléphone pour les groupes',
		'route_ref': 'Ligne(s) de bus à l\'arrêt',
		'postal_code': 'Code postal',
		'population:date': 'Date des données de population',
		'seamark:type': 'Type de balise maritime',
		'opening_hours:url': 'URL des horaires',
		'motor_vehicle': 'Accès aux véhicules motorisés',
	}[key]
	return found || key
}
export const tagValueCorrespondance = (key: string, tagName: string) => {
	const translations = {
		children: 'Enfant',
		only: 'Uniquement',
		subway: 'Métro',
		metro: 'Métro',
	}

	const specificTranslations = {
		'seamark:type': {
			'harbour': 'Port',
		},
		'type:RATP': {
			'rer': 'RER',
		}
	}

	const formats = {
		'route_ref': (v) => v.split(';').join(', '),
		// 'opening_hours:url': (v) => "<a href={v}>{v}</a>", // TODO: replace with link
	}
	
	return formats[tagName] ? formats[tagName](key) : (
		specificTranslations[tagName] ? (
			specificTranslations[tagName][key] ?? (translations[key] ?? key)
		) 
			: (translations[key] ?? key))
}
