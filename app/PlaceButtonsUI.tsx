'use client'

import styled from 'styled-components'

export const PlaceButtonList = styled.ul`
	padding: 0;
	list-style-type: none;
	margin: 1vh auto;
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
		background:var(--color95);
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
			background:var(--color90);
		}

		> div:first-child {
			height: 24px;
			width: 24px;

			img,
			svg {
				width: 100%;
				height: 100%;
			}
		}
	}

	:first-child button {
		background:var(--color60);
		color:white;
	}
`
