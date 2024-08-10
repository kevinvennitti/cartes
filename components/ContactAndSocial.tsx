import Emoji from './Emoji'
import Image from 'next/image'
import css from './css/convertToJs'
import { atOrUrl } from '@/app/utils'

export default function ContactAndSocial({
	email,
	facebook,
	instagram,
	whatsapp,
	youtube,
	linkedin,
	siret,
}) {
	return (
		<div
			css={`
				margin-bottom: 0.6rem;
			`}
		>
			{email && (
				<a
					href={`mailto:${email}`}
					target="_blank"
					title="Contacter via courriel"
					css={`
						color:var(--linkColor);
						text-decoration:none;
						display:flex;
						align-items:center;
						gap:6px;
						width:fit-content;
					`}
				>
					
					<Image
						src="/ui/mail.svg"
						width="20"
						height="20"
						alt="Icône Mail"
						css={`
							filter: invert(52%) sepia(31%) saturate(231%) hue-rotate(187deg) brightness(96%) contrast(85%);
						`}
					/>
						Contacter via courriel
				</a>
			)}
			{facebook && (
				<a
					href={atOrUrl(facebook, 'https://facebook.com')}
					target="_blank"
					title="Compte Facebook"
					css={`
						color:var(--linkColor);
						text-decoration:none;
						display:flex;
						align-items:center;
						gap:6px;
						width:fit-content;
					`}
				>
					<Emoji extra="E042" /> Facebook
				</a>
			)}
			{whatsapp && (
				<a
					href={atOrUrl(whatsapp, 'https://wa.me')}
					target="_blank"
					title="Discuter sur Whatsapp"
					css={`
						color:var(--linkColor);
						text-decoration:none;
						display:flex;
						align-items:center;
						gap:6px;
						width:fit-content;
					`}
				>
					<Emoji extra="E248" /> Contacter via Whatsapp
				</a>
			)}
			{instagram && (
				<a
					href={atOrUrl(instagram, 'https://instagram.com')}
					target="_blank"
					title="Compte Instagram"
					css={`
						color:var(--linkColor);
						text-decoration:none;
						display:flex;
						align-items:center;
						gap:6px;
						width:fit-content;
					`}
				>
					<Emoji extra="E043" /> Instagram
				</a>
			)}
			{youtube && (
				<a
					href={atOrUrl(youtube, 'https://youtube.com')}
					target="_blank"
					title="Chaîne Youtube"
					css={`
						color:var(--linkColor);
						text-decoration:none;
						display:flex;
						align-items:center;
						gap:6px;
						width:fit-content;
					`}
				>
					<Emoji extra="E044" /> Chaîne Youtube
				</a>
			)}
			{linkedin && (
				<a
					href={atOrUrl(linkedin, 'https://linkedin.com/company')}
					target="_blank"
					title="Compte LinkedIn"
					css={`
						color:var(--linkColor);
						text-decoration:none;
						display:flex;
						align-items:center;
						gap:6px;
						width:fit-content;
					`}
				>
					<Emoji extra="E046" /> Linkedin
				</a>
			)}
			{siret && (
				<a
					href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${siret}`}
					target="_blank"
					title="Fiche entreprise sur l'annuaire officiel des entreprises"
					css={`
						color:var(--linkColor);
						text-decoration:none;
						display:flex;
						align-items:center;
						gap:6px;
						width:fit-content;
					`}
				>
					<Image
						src={'/annuaire-entreprises.svg'}
						alt="logo Marianne représentant l'annuaire des entreprises"
						style={css`
							margin: 0 0.3rem 0 0.2rem;
							width: 1.4rem;
							height: auto;
						`}
						width={14}
						height={14}
					/>
					<span>Fiche entreprise</span>
				</a>
			)}
		</div>
	)
}
