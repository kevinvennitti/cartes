import Image from 'next/image'

export default function ModalSheetReminder({ setOpen }) {
	return (
		<div
			onClick={() => setOpen(true)}
			css={`
				position: fixed;
				bottom: 1rem;
				left: 1rem;
				background: var(--color60);
				width: 3rem;
				height: 3rem;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid rgba(0, 0, 0, .5);
				box-shadow: rgba(0, 0, 0, 0.3) 0px -2px 16px;
				cursor: pointer;
				border-radius: 3rem;
			
				img {
					filter: invert(99%) sepia(100%) saturate(0%) hue-rotate(5deg) brightness(105%) contrast(100%);
				}

				> span {
					position: absolute;
					top: 0.9rem;
					right: 0.9rem;
				}
			`}
		>

			<Image
				src="/ui/search.svg"
				alt="Icône Rechercher"
				width="24"
				height="24"
			/>

		</div>
	)
}
