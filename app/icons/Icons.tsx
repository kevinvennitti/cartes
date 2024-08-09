import getIcons from './getIcons'

export default function Icons({ tags }) {
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
				}
				li:last-child {
					margin-right: 0;
				}

				filter: invert(16%) sepia(24%) saturate(3004%) hue-rotate(180deg)
					brightness(89%) contrast(98%);
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
