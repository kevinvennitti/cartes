import { useEffect, useState } from 'react'
import css from '../css/convertToJs'
import Image from 'next/image'
import wikipediaLogo from '@/public/wikipedia.svg'

export default function Wikipedia({ name }) {
	const [text, setText] = useState(null)
	const [lang, title] = name.split(':')
	const ApiUrl = `https://${lang}.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&explaintext=false&exintro&titles=${encodeURIComponent(
			title
		)}&redirects=1`,
		url = `https://${lang}.wikipedia.org/wiki/${title}`

	useEffect(() => {
		const doFetch = async () => {
			const request = await fetch(ApiUrl),
				json = await request.json()
			const pages = json?.query?.pages
			if (!pages) return
			const { extract } = Object.values(pages)[0]
			setText(extract)
		}
		doFetch()
	}, [ApiUrl])

	const shortenText = text && text.split(' ').slice(0, 50).join(' ')

	return (
		<div
			css={`
				margin-top: 1.5rem;
				padding-top:1.5rem;
				border-top:solid 1px var(--separatorColor);
				
				position: relative;
				
				}
				p {
					line-height: 1.3rem;
					margin-bottom:0;
					position:relative;

					${
						shortenText?.length > 100 &&
						`
					&:after {
						position: absolute;
						bottom: 0;
						left: 0;
						height: 100%;
						max-height:2.5rem;
						width: 100%;
						content: '';
						background: linear-gradient(
							to bottom,
							color-mix(in srgb, white 0%, transparent) 20%,
							color-mix(in srgb, white 100%, transparent) 80%
						);
						pointer-events: none; /* so the text is still selectable */
					`
					}
				}
				p > a {
				
			`}
		>
			<div css={`
					display:flex;
					align-items:center;
					gap:6px;
					margin-bottom:6px;
				`}>
				<Image
					src={wikipediaLogo}
					alt="Logo de Wikipedia"
					width="25"
					height="25"
				/>
				<a href={url} target="_blank">
					<small>Wikipedia</small>
				</a>
			</div>
			<p>

				{shortenText}

			</p>

			<a href={url} target="_blank" css={`
					font-weight:600;
					color:var(--linkColor);
					text-decoration:none;
				`}>
				Lire l'article
			</a>
		</div>
	)
}
