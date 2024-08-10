'use client'

import styled from 'styled-components'

export const PlaceButtonList = styled.ul`
	padding: 0;
	list-style-type: none;
	margin: .75rem 0;
	display: flex;
	align-items: center;
	gap:6px;
`

export const PlaceButton = styled.li`
	flex:1;
	text-decoration:none;

	button {
		width:100%;
		padding:10px 16px;
		background:var(--color90);
		border-radius:10px;
		color:var(--linkColor);
		font-weight:600;
		text-align:center;
		text-decoration:none;
		display:flex;
		align-items:center;
		justify-content:center;
		gap:6px;

		&:hover {
			background:var(--color85);
		}

		> div:first-child {
			height: 24px;
			width: 24px;

			img,
			svg {
				width: 100%;
				height: 100%;
				filter: invert(18%) sepia(96%) saturate(2431%) hue-rotate(198deg) brightness(93%) contrast(91%);
			}
		}
	}

	:first-child button {
		background:var(--color60);
		color:white;
		text-decoration:none;

		> div:first-child img {
			filter: invert(99%) sepia(100%) saturate(0%) hue-rotate(5deg) brightness(105%) contrast(100%);
		}
	}
`
