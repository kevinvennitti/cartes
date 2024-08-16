'use client'

import closeIcon from '@/public/ui/close.svg'
import Image from 'next/image'
import styled from 'styled-components'

export const MapContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #faf5e4;
	> div:last-child {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	> a {
		position: absolute;
		left: 10px;
		bottom: 10px;
		z-index: 999;
	}
	color: var(--textColor);
`

export const ContentWrapper = styled.div`
	position: absolute;
	top: min(1.5vh, 0.5rem);
	left: min(3vw, 1.5rem);
	z-index: 10;
`

const size = 1.3
export const ModalCloseButton = (props) => (
	<ModalCloseButtonButton {...props}>
		<Image src={closeIcon} alt="Fermer" />
	</ModalCloseButtonButton>
)
export const ModalCloseButtonButton = styled.button`
	// position: absolute;
	// top: 0rem;
	// right: 0rem;
	margin: 0;
	border-radius: 2rem;
	font-size: 150%;
	width: 36px;
	height: 36px;

	text-align: center;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		background:var(--color95);
	}

	&:active {
		background:var(--color90);
	}

	> img {
		width: 24px;
		height:24px;
		margin: 0;
		filter: invert(18%) sepia(96%) saturate(2431%) hue-rotate(198deg) brightness(93%) contrast(91%);
	}
`

export const DialogButton = styled.button`
	background: var(--darkColor);
	color: white;
`
