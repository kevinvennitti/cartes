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
import Image from 'next/image'

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

	if (!closestFeatures || closestFeatures.length === 0) return

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
	const iconUrl = categoryIconUrl(category)
	return (
		<section
			css={`
				h3 {
					margin:0 0 0.75rem 0;
					font-size:1.25rem;
					letter-spacing:-0.01em;
					font-weight:700;
				}
			`}
		>

			{(
				closestFeatures
				&& closestFeatures.length > 0) && (
					<>
						{' '}
						<h3>{title} à proximité</h3>
						<NodeList
							nodes={closestFeatures.slice(0, 10)}
							setSearchParams={setSearchParams}
							isOpenByDefault={isOpenByDefault}
							iconUrl={iconUrl}
						/>

						{closestFeatures.length > 10 && (
							<details
								css={`
								margin-top: 1rem;
								margin-bottom: 0.4rem;
							`}
							>
								<summary>Afficher tout</summary>
								<NodeList
									nodes={closestFeatures.slice(10)}
									setSearchParams={setSearchParams}
									isOpenByDefault={isOpenByDefault}
									iconUrl={iconUrl}
								/>
							</details>
						)}
					</>
				)}
		</section>
	)
}

const NodeList = ({ nodes, setSearchParams, isOpenByDefault, iconUrl = null }) => (
	<ul
		css={`
			list-style-type: none;
			display: flex;
			flex-direction: column;
			gap: 4px;

			> li > a {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 16px;
				min-height: 28px;
				text-decoration: none;
				position: relative;

				&:after {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
					right: 0;
					margin: -4px -.5rem -4px -4px;
					border-radius: .5rem;
					display: none;
				}
				
				&:hover:after {
					display: block;
					background: var(--color99);
				}
				
				&:active:after {
					display: block;
					background: var(--color95);
				}

				> * {
					position: relative;
					z-index: 1;
				}

				> div {
				 	font-weight: bold;
					color: var(--linkColor);
					text-decoration: none;
					line-height: 120%;
					display: flex;
					align-items: center;
				}

				&:hover > div {
					color: var(--linkColorHover);
					text-decoration: underline;
				}

				&:hover > small {
  				color: var(--linkColorHover);
				}

				> div > div {
					margin-right: 8px;
					width: 36px;
					height: 36px;
					background: var(--color60);
					border-radius: 8px;
					flex: none;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				> small {
					flex: none;
					display: flex;
					align-items: center;
					gap: 4px;
					line-height: 1rem;
					color: var(--lighterTextColor);
					font-size: 0.8125rem;
				}
			}
		`}
	>
		{nodes.map((f) => {
			const humanDistance = computeHumanDistance(f.distance * 1000)
			const oh = f.tags.opening_hours
			const { isOpen } = oh ? getOh(oh) : {}
			return (
				<li
					key={f.id}
				>

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
					>
						<div>
							<div>

								{iconUrl ? (
									<Image
										src={iconUrl}
										width="24"
										height="24"
										alt={'Icône ' + f.tags.name}
									/>
								) : (
									<Image
										src="/ui/adress.svg"
										width="24"
										height="24"
										alt="Icône Lieu"
									/>
								)}

							</div>

							{f.tags.name}
						</div>

						<small>

							{!isOpenByDefault &&
								(oh != null && (
									<OpenIndicatorInListItem isOpen={isOpen === 'error' ? false : isOpen} />
								))}

							à {humanDistance[0]} {humanDistance[1]}
						</small>
					</Link>{' '}
				</li>
			)
		})}
	</ul>
)
