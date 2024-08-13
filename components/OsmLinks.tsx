import osmLogo from '@/public/openstreetmap.svg'
import Image from 'next/image'
export default function OsmLinks({
	data: { type: featureType2, featureType: featureType1, id },
}) {
	const featureType = featureType1 || featureType2
	return (
		<div
			css={`
				margin-top:1rem;
			`}
			className="buttons"
		>
			<a
				href={`https://openstreetmap.org/${featureType}/${id}`}
				target="_blank"
				title="Voir la fiche OpenStreetMap de ce lieu"
				className="button"
			>
				<Image
					src={osmLogo}
					width="30"
					height="30"
					alt="Logo d'OpenStreetMap"
				/>
				Voir la fiche OpenStreetMap
			</a>

			<a
				href={`https://openstreetmap.org/edit?${featureType}=${id}`}
				target="_blank"
				title="Ajouter des informations à ce lieu sur OpenStreetMap"
				className="button"
			>
				Compléter ce lieu sur OpenStreetMap
			</a>
		</div>
	)
}
