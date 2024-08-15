'use client'

export default function FeatureImage(props) {
	const className = props.className ? props.className + ' feature-image' : 'feature-image';

	return (
		<img
			{...props}
			className={className}
			css={`
				box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
				height: 12rem;
				object-fit: cover;
				width: auto;
				border-radius: 0.3rem;
				max-width: calc(26rem - 1rem - 1rem);
				outline: solid 1px rgba(0, 0, 0, 0.2);
				outline-offset: -1px;

				${(props.isMainImage && props.isMainImage === true) && `
					width: 100%;
				`}
			`}
		/>
	)
}
