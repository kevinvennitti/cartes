import css from '@/components/css/convertToJs'

import { Tag } from '@/components/Tags'

export default function Brand({ brand, brandWikidata, brandWikipedia }) {

	if (!(brand || brandWikidata || brandWikipedia)) return null

	if (!brandWikipedia)
		return (brand ? (
			<Tag
				label={'Marque'}
				value={brand}
			/>
		) : null)

	const [presumedLang, presumedName] = brandWikipedia.split(':'),
		lang = presumedName ? presumedLang : 'fr',
		name = presumedName || presumedLang,
		url = `https://${lang}.wikipedia.org/wiki/${name}`

	return (
		<>
			<div
				css={`
				display:flex;
				align-items: center;
			`}
			>
				<span css={`
				color:var(--lighterTextColor);	
			`}>
					Marque :&nbsp;
				</span>

				<a
					href={url}
					target="_blank"
					className="link">

					<img
						src={'/wikipedia.svg'}
						alt="Logo de Wikipedia"
						width="20"
						height="20"
					/>
					{brand}
				</a>
			</div>
			{brandWikidata &&
				<div>
					<Wikidata id={brandWikidata} />
				</div>
			}
		</>
	)
}

export const Wikidata = ({ id }) => (
	<a
		href={`https://wikidata.org/wiki/${id}`} target="_blank"
		className="link emphasis"
	>
		<img
			src={'/wikidata.svg'}
			alt="Logo de Wikidata"
			width="20"
			height="20"
		/>{' '}
		<small>wikidata</small>
	</a>
)
