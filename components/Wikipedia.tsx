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

	const shortenText = text && text.split(' ').slice(0, 100).join(' ')

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
						shortenText?.length > 400 &&
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
			
			<p>

				{shortenText}

			</p>

			<a href={url} target="_blank" css={`
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
					margin-top:1rem;

					&:hover {
					background:var(--color90);
					}
				`}>

				<Image
					src={wikipediaLogo}
					alt="Logo de Wikipedia"
					width="25"
					height="25"
				/>
				
				Lire l'article Wikipédia
			</a>
		</div>
	)
}
