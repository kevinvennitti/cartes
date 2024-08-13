import Content from './Content'

export default function SideSheet(props) {
	return (
		<div
			className="sidesheet"
		>
			<Content {...props} sideSheet={true} />
		</div>
	)
}
