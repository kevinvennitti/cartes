import Image from 'next/image'

export default function ModalSheetReminder({ setOpen }) {
	return (
		<div
			className="modalsheet-reminder"
			onClick={() => setOpen(true)}
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
