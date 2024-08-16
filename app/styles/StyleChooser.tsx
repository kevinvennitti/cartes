import css from '@/components/css/convertToJs'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { ModalCloseButton } from '../UI'
import { styles } from './styles'
import { useLocalStorage } from 'usehooks-ts'

const styleList = Object.entries(styles)
export default function StyleChooser({ style, setStyleChooser, setSnap }) {
	const setSearchParams = useSetSearchParams()
	return (
		<section
			css={`
				position: relative;
  			padding: 1rem;

				h2 {
					margin-top: 0;
				}
			`}
		>

			<div
				css={`
				display:flex;
				align-items:center;
				gap:6px;
				flex:none;
			`}
			>
				<h1
					className="heading-l"
					css={`
						flex:1;
						margin-bottom:0;
					`}>
					Choisir le fond de carte
				</h1>
				<ModalCloseButton
					title="Fermer l'encart de choix du style"
					onClick={() => {
						setTimeout(() => setSnap(3), 200)
						setSearchParams({ 'choix du style': undefined })
					}}
				/>
			</div>
			<Styles
				styleList={styleList.filter(([, el]) => !el.secondary)}
				setSearchParams={setSearchParams}
				style={style}
			/>
			<details
				css={`
					margin-top:1rem;

					&[open] > summary {
						margin-bottom:1rem;
					}
				`}
			>
				<summary
					css={`
						color: var(--lighterTextColor);
					`}
				>
					Autres styles
				</summary>
				<Styles
					styleList={styleList.filter(([, el]) => el.secondary)}
					setSearchParams={setSearchParams}
					style={style}
				/>
			</details>
		</section>
	)
}

const Styles = ({ style, styleList, setSearchParams }) => {
	const [localStorageStyleKey, setLocalStorageStyleKey] = useLocalStorage(
		'style',
		null
	)
	return (
		<ul
			style={css`
				display: flex;
				justify-content: flex-start;
				flex-wrap: wrap;
				align-items: flex-start;
				list-style-type: none;
				margin-top: .5rem;
				gap:.5rem;
			`}
		>
			{styleList.map(([k, { name, imageAlt, title, image: imageProp }]) => {
				const image = (imageProp || k) + '.png'

				return (
					<li
						key={k}
						css={`
							width:calc((24rem - 1rem) / 3);
						`}
					>
						<Link
							href={setSearchParams({ style: k }, true, false)}
							onClick={() => setLocalStorageStyleKey(k)}
							title={'Passer au style ' + (title || name)}
							css={`
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								text-decoration: none;
								color: var(--lighterTextColor);
								font-weight:500;

								${style.key === k && `
									color: var(--color50); 
									font-weight: bold
								`}
							`}
						>
							<img
								src={'/styles/' + image}
								width="50"
								height="50"
								alt={imageAlt}
								css={`
									border-radius: 0.4rem;
									width:100%;
									height:auto;
									aspect-ratio:1/1;
									margin-bottom:.25rem;
									outline:solid 1px rgba(0,0,0,.25);
									${style.key === k &&
									`border: 4px solid var(--color50);
									outline:none;
								`}
								`}
							/>
							<div>{name}</div>
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
