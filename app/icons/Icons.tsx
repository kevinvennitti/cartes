import getIcons from './getIcons'

export default function Icons({ tags, isColored = false }) {
	const icons = typeof tags === 'string' ? [tags] : getIcons(tags)
	
	if (icons.length === 0) return null;

	return (
		<ul
			css={`
				display: inline-flex;
				align-items: center;
				list-style-type: none;
				

				li {
					margin-right: 0.2rem;
					filter: ${isColored ? 'invert(18%) sepia(96%) saturate(2431%) hue-rotate(198deg) brightness(93%) contrast(91%)' : 'filter: invert(52%) sepia(31%) saturate(231%) hue-rotate(187deg) brightness(96%) contrast(85%)'};
				}

				li:last-child {
					margin-right: 0;
				}
				
				img {
					width: 1.2rem;
					height: 1.2rem;
					filter: invert(1);
					vertical-align: sub;
				}
			`}
		>
			{icons.map((icon) => (
				<li key={icon}>
					<img src={icon} width="10" height="10" />
				</li>
			))}
		</ul>
	)

}
