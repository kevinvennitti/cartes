import distance from '@turf/distance'
import Image from 'next/image'
import { useLocalStorage } from 'usehooks-ts'
import { PlaceButton } from './PlaceButtonsUI'

export const pointHash = (point) => point.geometry.coordinates.join('|')

export default function BookmarkButton({ geocodedClickedPoint, osmFeature }) {
	const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', [])
	const properties = geocodedClickedPoint
		? geocodedClickedPoint.data?.features?.length > 0 &&
		  geocodedClickedPoint.data.features[0].properties
		: { ...(osmFeature.tags || {}), id: osmFeature.id, type: osmFeature.type }

	const coordinates = geocodedClickedPoint
		? [
				geocodedClickedPoint.longitude.toFixed(4), // this is ~ 10 m precision, we don't want more than one bookmark every 10 meters
				geocodedClickedPoint.latitude.toFixed(4),
		  ]
		: [osmFeature.lon.toFixed(4), osmFeature.lat.toFixed(4)]

	const feature = {
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates,
		},
		properties,
	}

	const same = bookmarks.find((point) => {
		if (point.geometry.type !== 'Point') return false
		return pointHash(point) === pointHash(feature)
	})
	return (
		<PlaceButton>
			<div
				role="button"
				className="sidesheet-main-action-button"
				onClick={() =>
					same
						? setBookmarks(
								bookmarks.filter((point) => {
									if (point.geometry.type !== 'Point') return true
									return pointHash(point) !== pointHash(feature)
								})
						  )
						: setBookmarks([...bookmarks, feature])
				}
				title={same ? 'Enlever des favoris' : 'Mettre en favori'}
			>
				<Image
					src={same ? '/ui/star-active.svg' : '/ui/star-inactive.svg'}
					alt="Icône d'ajout de favori"
					width="50"
					height="50"
				/>
					
				<span>Favori</span>
			</div>
		</PlaceButton>
	)
}
