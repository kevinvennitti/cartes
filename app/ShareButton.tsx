'use client'
import { useEffect, useState } from 'react'
import { PlaceButton } from './PlaceButtonsUI'
import { buildAllezPart } from './SetDestination'
import { encodePlace } from './utils'
import shareIcon from '@/public/ui/share.svg'
import Image from 'next/image'
import { getFetchUrlBase } from './serverUrls'
import getName from './osm/getName'

export default function ShareButton({ osmFeature, geocodedClickedPoint }) {
	console.log('purple share', osmFeature, geocodedClickedPoint)

	const urlBase = getFetchUrlBase()
	const [navigatorShare, setNavigatorShare] = useState(false)

	useEffect(() => {
		if (navigator.share) setNavigatorShare(true)
	}, [setNavigatorShare])

	const url = encodeURI(
		`${urlBase}/?allez=${osmFeature
			? buildAllezPart(
				osmFeature.tags?.name,
				encodePlace(osmFeature.type, osmFeature.id),
				osmFeature.lon,
				osmFeature.lat
			)
			: buildAllezPart(
				'Point sur la carte',
				null,
				geocodedClickedPoint.longitude,
				geocodedClickedPoint.latitude
			)
		}`
	)
	const text =
		geocodedClickedPoint &&
		(getName(osmFeature?.tags || {}) ||
			`Lon ${geocodedClickedPoint.longitude} | lat ${geocodedClickedPoint.lat}`)

	return (
		<PlaceButton>
			{navigatorShare ? (
				<div
					role="button"
					title="Cliquez pour partager le lien"
					onClick={() => {
						navigator
							.share({
								text,
								url,
								title: text,
							})
							.then(() => console.log('Successful share'))
							.catch((error) => console.log('Error sharing', error))
					}}
				>
					<Image
						src="/ui/share.svg"
						alt="Icône de partage"
					/>
					<span>Partager</span>
				</div>
			) : (
				<DesktopShareButton {...{ url }} />
			)}
		</PlaceButton>
	)
}

export const DesktopShareButton = ({ url }) => {
	const [copySuccess, setCopySuccess] = useState(false)

	function copyToClipboard(e) {
		navigator.clipboard.writeText(url).then(
			function () {
				setCopySuccess(true)
				console.log('Async: Copying to clipboard was successful!')

				setTimeout(() => {
					setCopySuccess(false)
				}, 2500)
			},
			function (err) {
				console.error('Async: Could not copy text: ', err)
			}
		)
		e.preventDefault()
		return null
	}

	return (
		<div
			role="button"
			onClick={copyToClipboard}
		>
			<Image
				src={shareIcon}
				alt="Icône de partage"
			/>

			{!copySuccess ? (
				'Partager'
			) : (
				<span
					css={`
						color: var(--linkColor);
					`}
				>
					Copié !
				</span>
			)}
		</div>
	)
}
