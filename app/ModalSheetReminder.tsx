import Image from 'next/image'

export const modalSheetBoxShadow = `box-shadow: rgba(0, 0, 0, 0.3) 0px -2px 16px;`
const popSize = 6
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
