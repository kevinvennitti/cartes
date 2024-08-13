'use client'

export default function FeatureImage(props) {
	const className = props.className ? props.className + ' feature-image' : 'feature-image';

	return (
		<img
			{...props}
			className={className}
		/>
	)
}
