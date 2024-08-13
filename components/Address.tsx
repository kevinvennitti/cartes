// Inspired by https://github.com/zbycz/osmapp/blob/master/src/services/helpers.ts#L107

import styled from 'styled-components'
import { buildAddress } from './osm/buildAddress'
import Image from 'next/image'

export const addressKeys = [
	'addr:place',
	'addr:street',
	'addr:housenumber',
	'addr:city',
	'addr:state',
	'addr:postcode',
	'contact:city',
	'contact:housenumber',
	'contact:postcode',
	'contact:street',
]

export default function Address({ tags, noPrefix }) {
	const address = buildAddress(tags, noPrefix);

	return (address && (
		<address
			css={`
				color:var(--lighterTextColor);
				font-style:normal;
				display:flex;
				align-items:flex-start;
				gap:6px;
				width:fit-content;

				> img {
				 	margin-top:1px;
				}
			`}
		>
			<Image
				src="/ui/address.svg"
				width="20"
				height="20"
				alt="Icône Adresse"
				className="icon-light"
			/>

			{address}
		</address>
	))
}

export const AddressDisc = ({ t, noPrefix = false }) => {
	const g = (key) => {
		const value = noPrefix ? t[key] : t[`addr:` + key] || t['contact:' + key]
		if (value == null) return ''
		const shorterValue = [
			['avenue', 'av.'],
			['boulevard', 'bd.'],
			['rue', 'r.'],
			['carrefour', 'car.'],
		].reduce((memo, [from, to]) => memo.replace(from, to), value.toLowerCase())
		return shorterValue || ''
	}
	return (
		<AddressDiscContainer>
			<strong>{g('housenumber')}</strong>
			<span>{g('street')}</span>
		</AddressDiscContainer>
	)
}

export const AddressDiscContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0.6rem 0;
	justify-content: space-between;
	width: 4rem;
	height: 4rem;
	border-radius: 4rem;
	background: var(--darkColor);
	color: white;
	font-size: 80%;
	overflow: hidden;
	> span,
	> strong {
		text-align: center;
		line-height: 0.9rem;
		max-width: 4rem;
	}
	img {
		filter: invert(0) !important;
	}
`
