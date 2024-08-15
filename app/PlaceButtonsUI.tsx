'use client'

export function PlaceButtonList({ children }) {
	return (
		<ul css={`
			padding: 0;
			list-style-type: none;
			margin: .75rem 0 0;
			display: flex;
			align-items: center;
			gap: 6px;
		`}>
			{children}
		</ul>
	)
}

export function PlaceButton({ children }) {
	return (
		<li css={`
			flex: 1;

			> div,
			> a {
				width: 100%;
				padding: 10px 16px;
				background: var(--color90);
				border-radius: 10px;
				color: var(--linkColor);
				font-weight: 600;
				text-align: center;
				text-decoration: none;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 6px;
				cursor: pointer;

				&:hover {
					color: var(--linkColorHover);
					background: var(--color85);
				}

				&:active {
					color: var(--linkColorHover);
					background: var(--color80);
				}

				& img,
				& svg {
					height: 24px;
					width: 24px;
					filter: invert(18%) sepia(96%) saturate(2431%) hue-rotate(198deg) brightness(93%) contrast(91%);
				}

				&.primary {
					background: var(--color60);
					color: white;
					text-decoration: none;

					&:hover {
						background: var(--color50);
					}

					&:active {
						background: var(--color40);
					}

					& img,
					& svg {
  					filter: invert(99%) sepia(100%) saturate(0%) hue-rotate(5deg) brightness(105%) contrast(100%);
					}
				}
			}
		`}>
			{children}
		</li>
	)
}