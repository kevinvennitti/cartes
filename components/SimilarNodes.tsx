import { computeHumanDistance } from '@/app/RouteRésumé'
import { buildAllezPart } from '@/app/SetDestination'
import categories from '@/app/categories.yaml'
import moreCategories from '@/app/moreCategories.yaml'
import useOverpassRequest from '@/app/effects/useOverpassRequest'
import { encodePlace } from '@/app/utils'
import turfDistance from '@turf/distance'
import Link from 'next/link'
import useSetSearchParams from './useSetSearchParams'
import { capitalise0, sortBy } from './utils/utils'
import { OpenIndicator, OpenIndicatorInListItem, getOh } from '@/app/osm/OpeningHours'
import { categoryIconUrl } from '@/app/QuickFeatureSearch'

// This is very scientific haha
const latDifferenceOfRennes = 0.07,
	lonDifferenceOfRennes = 0.15,
	latDiff = latDifferenceOfRennes / 2,
	lonDiff = lonDifferenceOfRennes / 2
// 48.07729814876498,-1.7461581764997334,48.148123804291316,-1.5894174840209132
/* compute km2 to check
	const earthRadius = 6371008.8
	const [south, west, north, east] = bbox

	const surface =
		(earthRadius *
			earthRadius *
			Math.PI *
			Math.abs(Math.sin(rad(south)) - Math.sin(rad(north))) *
			(east - west)) /
		180

	// rad is:
	function rad(num) {
		return (num * Math.PI) / 180
	}
	*/

const allCategories = [...categories, ...moreCategories]

export default function SimilarNodes({ node }) {
	const { tags } = node

	const setSearchParams = useSetSearchParams()

	const category = allCategories.find(({ query: queryRaw }) => {
		const query = Array.isArray(queryRaw) ? queryRaw : [queryRaw]

		return query.every((queryLine) => {
			return Object.entries(tags).find(
				([k, v]) => queryLine.includes(k) && queryLine.includes(v)
			)
		})
	})

	const { lat, lon } = node
	const bbox = [
		lat - latDiff / 2,
		lon - lonDiff / 2,
		lat + latDiff / 2,
		lon + lonDiff / 2,
	]

	const [features] = useOverpassRequest(bbox, category)
	if (!category || !features?.length) return

	const reference = [lon, lat]
	const featuresWithDistance =
		features &&
		features
			.filter((feature) => feature.id !== node.id && feature.tags.name)
			.map((feature) => {
				const { lon: lon2, lat: lat2 } = feature
				return { ...feature, distance: turfDistance([lon2, lat2], reference) }
			})

	const closestFeatures =
		features && sortBy(({ distance }) => distance)(featuresWithDistance)
	console.log('node', closestFeatures)
	/*
	 * Trouver la catégorie du lieu
	 * lancer une requête Overpass pour les éléments similaires autour
	 * afficher les plus proches surtout pour le SEO dans un premier temps, puis graphiquement
	 * comme des cartes sur google dans un second temps
	 * mettre un lien vers la recherche category=
	 * ajouter une liste de résultats à la recherche par catégorie
	 *
	 * */

	const title = category.title || capitalise0(category.name)
	const isOpenByDefault = category['open by default']
	const imageUrl = categoryIconUrl(category)
	return (
		<section
			css={`
				margin-top: 1.5rem;
				padding-top:1.5rem;
				border-top:solid 1px var(--separatorColor);
				
				h3 {
					margin:0 0 0.75rem 0;
					font-size:1.25rem;
					letter-spacing:-0.01em;
					font-weight:700;
				}
			`}
		>
			{closestFeatures && (
				<>
					{' '}
					<h3>{title} proches</h3>
					<NodeList
						nodes={closestFeatures.slice(0, 10)}
						setSearchParams={setSearchParams}
						isOpenByDefault={isOpenByDefault}
					/>
					<details
						css={`
							margin-top: 1rem;
							margin-bottom: 0.4rem;
						`}
					>
						<summary>Tous les {title} proches</summary>
						<NodeList
							nodes={closestFeatures.slice(10)}
							setSearchParams={setSearchParams}
							isOpenByDefault={isOpenByDefault}
						/>
					</details>
				</>
			)}
		</section>
	)
}

const NodeList = ({ nodes, setSearchParams, isOpenByDefault }) => (
	<ul
		css={`
			list-style-type: none;
			display:flex;
			flex-direction:column;
			gap:4px;
		`}
	>
		{nodes.map((f) => {
			const humanDistance = computeHumanDistance(f.distance * 1000)
			const oh = f.tags.opening_hours
			const { isOpen } = oh ? getOh(oh) : {}
			return (
				<li key={f.id} css={`
					display:flex;
					align-items:center;
					justify-content:space-between;
					gap:16px;
					min-height:28px;
				`}>
					
					<Link
						href={setSearchParams(
							{
								allez: buildAllezPart(
									f.tags.name,
									encodePlace(f.type, f.id),
									f.lon,
									f.lat
								),
							},
							true
						)}

						css={`
							font-weight:bold;
							color:var(--textColor) !important;
							text-decoration:none;
							line-height:120%;
							display:flex;
							align-items:center;
							justify-content:space-between;
						`}
					>
						<div css={`
							margin-right:8px;
							width:36px;
							height:36px;
							background:var(--color60);
							border-radius:8px;
							flex:none;
						`}>

						</div>

						{f.tags.name}
					</Link>{' '}
					<small css={`
							flex:none;
							display:flex;
							align-items:center;
							gap:4px;
						`}>
						
						{!isOpenByDefault &&
						(oh == null ? (
							<span
								css={`
									display: inline-block;
									width: 1.8rem;
								`}
							></span>
						) : (
							<OpenIndicatorInListItem isOpen={isOpen === 'error' ? false : isOpen} />
						))}
							
						à {humanDistance[0]} {humanDistance[1]}
					</small>
				</li>
			)
		})}
	</ul>
)
