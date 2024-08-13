import Content from './Content'
import { modalSheetBoxShadow } from './ModalSheetReminder'

export default function SideSheet(props) {
	return (
		<div
			className="sidesheet"
		>
			<Content {...props} sideSheet={true} />
		</div>
	)
}
