import { omit } from '@/components/utils/utils'
import { goodIconSize } from '@/components/voyage/mapUtils'
import maplibregl from 'maplibre-gl'
import { useEffect, useMemo, useState } from 'react'

/*
 * TODO
 * This component is not optimized, and may feel clumsy
 *
 * - we limit the nb of images since there could be 10 000 images in a single bbox
 * - wikimedia can return images on a localised small part of the bbox because of that limit
 * - solution ? Use the coord instead of bbox, and expect the user to drag to view more images
 * - when you do a search somewhere, then drag the map, the new search should be done only in the added surface
 * - it would be cool to use the "featured" or "quality" image tags from commons, but it does not look possible in one request https://stackoverflow.com/questions/24529853/how-to-get-more-info-within-only-one-geosearch-call-via-wikipedia-api
 * - etc
 *
 *
 */
const serializeBbox = (bbox) => {
	if (!bbox) return null

	const [[lng2, lat1], [lng1, lat2]] = bbox,
		bboxString = `${lat2}|${lng2}|${lat1}|${lng1}`
	return bboxString
}

export const handleWikimediaGeosearchImages = (json) =>
	json?.query
		? Object.values(json.query.pages).map((page) => {
				const {
					GPSLatitude: { value: lat },
					GPSLongitude: { value: lon },
					Assessments: { value: assessment } = {},
					DateTime: { value: date } = {},
					Artist: { value: artistHtmlTag },
					ImageDescription: { value: description } = {},
				} = page.imageinfo[0].extmetadata

				return {
					...omit(['imageinfo'], page),
					lat,
					lon,
					assessment,
					date,
					artistHtmlTag,
					description,
				}
		  })
		: []

// Thanks https://stackoverflow.com/questions/24529853/how-to-get-more-info-within-only-one-geosearch-call-via-wikipedia-api
// We'd also like to sort query results by good `assessment` or by other
// factors, but were unable to find documentation on this complex API
export const getWikimediaGeosearchUrl = (bboxString: string) =>
	`https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&generator=geosearch&ggsbbox=${bboxString}&ggsnamespace=6&ggslimit=30&format=json&origin=*`

export default function useImageSearch(
	map,
	setBboxImages,
	zoom,
	bbox,
	active,
	focusImage
) {
	const [imageCache, setImageCache] = useState([])

	const bboxString = serializeBbox(bbox)

	// We could memoize the selection of images that is in the bbox view,
	// but MapLibre probably doesn't draw images outside of the window ! At least
	// we hope so
	// ... but we need to filter them for the content view !
	const bboxImages = useMemo(
		() =>
			imageCache.filter(
				({ lat, lon }) =>
					lon > bbox[0][0] &&
					lon < bbox[1][0] &&
					lat < bbox[1][1] &&
					lat > bbox[0][1]
			),
		[imageCache, bboxString]
	)
	useEffect(() => {
		setBboxImages(bboxImages)
	}, [bboxImages])

	useEffect(() => {
		if (!active) return
		if (!bboxString) return
		const makeRequest = async () => {
			const url = getWikimediaGeosearchUrl(bboxString)

			const request = await fetch(url)

			const json = await request.json()
			const newImages = handleWikimediaGeosearchImages(json)

			console.log('green', newImages)
			const trulyNewImages = newImages.filter(
				(newImage) =>
					!imageCache.find((image) => image.pageid === newImage.pageid)
			)

			if (trulyNewImages.length)
				setImageCache((old) => [...old, ...trulyNewImages])
		}
		makeRequest()
	}, [setImageCache, bboxString, imageCache, active])

	useEffect(() => {
		if (!map) return
		if (!active) return

		if (!bboxImages.length) return
		const markers = bboxImages.map((image) => {
			const size = goodIconSize(zoom, 1.3) + 'px'

			const img = document.createElement('img')
			img.src = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(
				image.title
			)}&width=150`
			img.style.cssText = `
			width: ${size};height: ${size};border-radius: ${size};
			object-fit: cover
			`
			img.alt = image.title

			img.addEventListener('click', () => {
				focusImage(image)
			})

			const marker = new maplibregl.Marker({ element: img })
				.setLngLat({ lng: image.lon, lat: image.lat })
				.addTo(map)
			return marker
		})
		return () => {
			markers.map((marker) => marker.remove())
		}
	}, [map, zoom, bboxImages, active])
}
