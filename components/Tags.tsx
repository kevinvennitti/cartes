import Icons from '@/app/icons/Icons'
import { isHeritageTag } from '@/app/osm/Heritage'
import {
	getTagLabels,
	tagNameCorrespondance,
	tagValueCorrespondance,
} from '@/app/osmTagLabels'

const beginningsOfSecondaryTags = ['source', 'fixme:', 'note', 'ref:']

const isSecondary = ([k, v]) =>
	beginningsOfSecondaryTags.some((begining) => k.startsWith(begining))

export default function Tags({ tags }) {
	if (!tags || tags.length <= 0) return null

	return (
		<ul
			css={`
				margin-top: 1rem;
				padding-top:1rem;
				border-top:solid 1px var(--separatorColor);

				padding-left: 0;
				list-style-type: none;
				line-height: 1.3rem;
				img {
					opacity: 0.7;
				}
				display: flex;
				flex-direction: column;
			`}
		>
			{tags.map(([raw, [k, v]], i) => (
				<li
					key={k + v}
					css={`

						// min-height:26px;
						
						${isSecondary(Object.entries(raw)[0]) &&
						`
						font-size: 0.8165rem; 
						order: ${1000 + i};
						// min-height:24px;
						`}
					`}
				>	
						<span css={`
							display:flex;
							align-items:center;
							flex-direction:row;
							gap:4px;
							margin-right:4px;
							float:left;
						`}>
							<Icons tags={raw}/>
							
							<span css={`
								color:var(--lighterTextColor);
								`}>
								{tagNameCorrespondance(k)}
								{' '}:
							</span>
						</span>

						<span css={`
							font-weight:700;
							overflow: hidden;
							text-overflow: ellipsis;
							max-width: 100%;
							display: inline-block;
						`}>{tagValueCorrespondance(v, k)}
						</span>
				</li>
			))}
		</ul>
	)
}
const isFrenchAdministration = (tags) => {
	if (!tags) return false

	tags['ref:FR:SIREN'] || tags['ref:INSEE'] // this is an attempt, edge cases can exist
}

export const getFrenchAdminLevel = (tags, adminLevel) =>
	isFrenchAdministration(tags) &&
	{
		3: 'Outre-mer français',
		4: 'Région française',
		5: 'Circonscription départementale',
		6: 'Département',
		7: 'Arrondissement départemental',
		8: 'Commune',
		9: 'Arrondissement municipal',
		10: 'Quartier',
	}[adminLevel]

export const processTags = (filteredRest) => {
	const translatedTags = Object.entries(filteredRest)
			// Tags to exclude because handled by other components that provide a test function
			.filter(([k, v]) => !isHeritageTag(k))
			.map(([key, value]) => {
				const tagLabels = getTagLabels(key, value)
				return [{ [key]: value }, tagLabels]
			}),
		keyValueTags = translatedTags.filter(([, t]) => t.length === 2),
		soloTags = translatedTags.filter(([, t]) => t.length === 1)

	return [keyValueTags, soloTags]
}

export function SoloTags({ tags, iconsOnly, compact }) {
	return (
		<ul
			css={`
				list-style-type: none;
				display: flex;
				align-items: center;
				overflow: scroll;
				white-space: nowrap;
				scrollbar-width: none;
				position:relative;
				padding-right:1rem;

				gap: ${compact ? '0' : '12px'};

				> li {
					display: flex;
					align-items: center;
				}

				&::-webkit-scrollbar {
					width: 0px;
					background: transparent; /* Disable scrollbar Chrome/Safari/Webkit */
				}
					
				> li > span {
					line-height: 1.4rem;
				}
			`}
		>
			{tags.map(([raw, tag]) => (
				<li key={tag} css={`
					display:flex;
					align-items:center;
					gap:6px;
				`}>
					<span css={`
						width:28px;
						height:28px;
						border-radius:6px;
						background:var(--color90);
						display:flex;
						align-items:center;
						justify-content:center;
					`}>
					<Icons tags={raw} isColored={true}/>
					</span>

					{!iconsOnly && <span css={`
						color:var(--linkColor);
						font-weight:600;
					`}>{tag}</span>}
				</li>
			))}
		</ul>
	)
}
