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
	
	if (!email && !facebook && !instagram && !whatsapp && !youtube && !linkedin && !siret) return

	return (
		<div
			css={`
				margin-bottom: 0.6rem;
				line-height:140%;
				display:flex;
				flex-direction:column;
				gap:4px;
			`}
		>
			{email && (
				<a
					href={`mailto:${email}`}
					target="_blank"
					title="Contacter via courriel"
					className="link">
					
					<Image
						src="/ui/mail.svg"
						width="20"
						height="20"
						alt="Icône Mail"
						className="icon-light"
					/>
						Contacter via courriel
				</a>
			)}
			{facebook && (
				<a
					href={atOrUrl(facebook, 'https://facebook.com')}
					target="_blank"
					title="Compte Facebook"
					className="link">

					<Image
						src="/ui/facebook.svg"
						width="20"
						height="20"
						alt="Icône Facebook"
						className="icon-light"
					/>
							
					Facebook
				</a>
			)}
			{whatsapp && (
				<a
					href={atOrUrl(whatsapp, 'https://wa.me')}
					target="_blank"
					title="Discuter sur Whatsapp"
					className="link">

					<Image
						src="/ui/whatsapp.svg"
						width="20"
						height="20"
						alt="Icône Whatsapp"
						className="icon-light"
					/>
						
					Contacter via Whatsapp
				</a>
			)}
			{instagram && (
				<a
					href={atOrUrl(instagram, 'https://instagram.com')}
					target="_blank"
					title="Compte Instagram"
					className="link">
						
					<Image
						src="/ui/instagram.svg"
						width="20"
						height="20"
						alt="Icône Instagram"
						className="icon-light"
					/>
					
					Instagram
				</a>
			)}
			{youtube && (
				<a
					href={atOrUrl(youtube, 'https://youtube.com')}
					target="_blank"
					title="Chaîne Youtube"
					className="link">

					<Image
						src="/ui/youtube.svg"
						width="20"
						height="20"
						alt="Icône Youtube"
						className="icon-light"
					/>
						
					Chaîne Youtube
				</a>
			)}
			{linkedin && (
				<a
					href={atOrUrl(linkedin, 'https://linkedin.com/company')}
					target="_blank"
					title="Compte LinkedIn"
					className="link">

					<Image
						src="/ui/linkedin.svg"
						width="20"
						height="20"
						alt="Icône LinkedIn"
						className="icon-light"
					/>
					
					Linkedin
				</a>
			)}
			{siret && (
				<a
					href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${siret}`}
					target="_blank"
					title="Fiche entreprise sur l'annuaire officiel des entreprises"
					className="link">
						
					<Image
						src={'/ui/france.png'}
						alt="logo Marianne représentant l'annuaire des entreprises"
						width="20"
						height="20"
					/>
					<span>Fiche entreprise</span>
				</a>
			)}
		</div>
	)
}
