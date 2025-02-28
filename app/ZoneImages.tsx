import { getThumb } from '@/components/wikidata'
import { useEffect, useState } from 'react'
import { createSearchBBox } from './createSearchPolygon'
import FeatureImage from './FeatureImage'
import Image from 'next/image'
import {
	getWikimediaGeosearchUrl,
	handleWikimediaGeosearchImages,
} from './effects/useImageSearch'

export function useZoneImages({ latLngClicked, setLatLngClicked }) {
	const [wikimedia, setWikimedia] = useState(null)
	const [panoramax, setPanoramax] = useState(null)

	useEffect(() => {
		if (!latLngClicked) return
		const makeRequest = async () => {
			const { lat1, lng1, lat2, lng2 } = createSearchBBox(latLngClicked)
			const bboxString = `${lat2}|${lng2}|${lat1}|${lng1}`

			const url = getWikimediaGeosearchUrl(bboxString)

			setWikimedia([])
			const request = await fetch(url)

			const json = await request.json()

			const images = handleWikimediaGeosearchImages(json)

			if (images.length) setWikimedia(images)
			if (!images.length) {
				setWikimedia(null)
				setLatLngClicked(null)
			}
		}
		makeRequest()
	}, [latLngClicked, setLatLngClicked])

	useEffect(() => {
		if (!latLngClicked) return
		const makeRequest = async () => {
			const { lat1, lng1, lat2, lng2 } = createSearchBBox(latLngClicked)

			const url = `https://api.panoramax.xyz/api/search?limit=1&bbox=${lng2},${lat1},${lng1},${lat2}`
			setPanoramax([])
			const request = await fetch(url)

			const json = await request.json()
			const images = json.features
			if (images.length) setPanoramax(images)
			if (!images.length) {
				setPanoramax(null)
				setLatLngClicked(null)
			}
		}
		makeRequest()
	}, [latLngClicked, setLatLngClicked])
	return [
		wikimedia,
		panoramax,
		() => {
			setWikimedia(null)
			setPanoramax(null)
		},
	]
}

export function ZoneImages({ zoneImages, panoramaxImages, focusImage }) {

	const panoramaxImage = panoramaxImages && panoramaxImages[0],
		panoramaxThumb = panoramaxImage?.assets?.thumb

	console.log('======');
	console.log('panoramaxImage', panoramaxImage);
	console.log('panoramaxThumb', panoramaxThumb);

	const images =
		zoneImages &&
		zoneImages.map((json) => {
			const title = json.title,
				url = getThumb(title, 400)
			return {
				...json,
				url,
			}
		})

	console.log('======');
	console.log('images', images);

	if (!panoramaxImage && !images) return

	return (
		(panoramaxThumb || images?.length > 0) && (
			<div
				css={`
						overflow: scroll;
						white-space: nowrap;
						margin: 8px -1rem 0;
						padding-bottom: 8px;
						
						&::-webkit-scrollbar {
							display: none;
						}
	
						> ul {
							display: flex;
							list-style-type: none;
							padding: 0 1rem;
							gap: 8px;
						}
	
						> ul:after {
							content: '';
							display: block;
							position: relative;
							width: calc(1rem - 8px);
							height: 1rem;
							flex: none;
						}
	
						> ul > li {
							margin:0;
							padding:0;
						}
					`}
			>
				<ul>
					{panoramaxThumb && (
						<a
							href={`https://api.panoramax.xyz/#focus=pic&map=${window.location.hash.slice(
								1
							)}&pic=${panoramaxImage.id}`}
							target="_blank"
						>
							<div
								css={`
									position: relative;
									> img:first-child {
										position: absolute;
										bottom: 0.8rem;
										left: 0.4rem;
										width: 2.2rem;
										height: auto;
									}
									> img:last-child {
										border: 2px solid #83328a;
									}
								`}
								title="Cette zone est visualisable depuis la rue grâce au projet Panoramax"
							>
								<Image
									src={`/panoramax.svg`}
									width="10"
									height="10"
									alt="Logo du projet Panoramax"
								/>
								<FeatureImage
									src={panoramaxThumb.href}
									alt="Image de terrain issue de Panoramax"
									width="150"
									height="150"
								/>
							</div>
						</a>
					)}

					{
						(images &&
							images.length > 0) &&
						images.map((image) => {
							const { url } = image
							return (
								<li
									key={url}
								>
									<button
										onClick={() => focusImage(image)}
										css={`
											margin: 0;
											padding: 0;
										`}
									>
										<FeatureImage
											src={url}
											alt="Image de terrain issue de Wikimedia Commons"
											width="250"
											height="250"
										/>
									</button>
								</li>
							)
						})
					}
				</ul>
			</div>
		))

}
