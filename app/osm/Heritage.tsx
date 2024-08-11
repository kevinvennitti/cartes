import Image from 'next/image'

export const isHeritageTag = (tag) =>
	['heritage', 'whc'].some((el) => tag.startsWith(el))

export default function Heritage({ tags }) {
	console.log('TAGS', tags)
	const { heritage } = tags
	if (!heritage) return

	let heritageLabel = ''

	if (heritage == 1 && tags['heritage:operator'] == 'whc')
		heritageLabel = 'Patrimoine mondial de l\'UNESCO'

	if (heritage == 2) 
		heritageLabel = 'Classé monument historique'

	if (heritage == 3) 
		heritageLabel = 'Inscrit monument historique'

	return (
		<div css={`
			display:flex;
			align-items:center;
			flex-direction:row;
			gap:6px;
		`}>
		<Image
			src="/icons/monument-historique.svg"
			width="20"
			height="20"
			alt="Icône Monument historique"
		/>
			
			<span css={`
				color:var(--lighterTextColor);
				`}>
				{heritageLabel}
			</span>
		</div>
	)
}
