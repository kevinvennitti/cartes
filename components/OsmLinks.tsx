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
				display: flex;
				flex-direction: column;
				align-items: center;
				gap:8px;
				
				a {
					width:100%;
					padding:10px 16px;
					background:var(--color95);
					border-radius:10px;
					color:var(--linkColor);
					font-weight:bold;
					text-align:center;
					text-decoration:none;
					display:flex;
					align-items:center;
					justify-content:center;
					gap:6px;

					&:hover {
					background:var(--color90);
					}
				}
			`}
		>
			<a
				href={`https://openstreetmap.org/${featureType}/${id}`}
				target="_blank"
				title="Voir la fiche OpenStreetMap de ce lieu"
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
			>
				Compléter ce lieu sur OpenStreetMap
			</a>
		</div>
	)
}
