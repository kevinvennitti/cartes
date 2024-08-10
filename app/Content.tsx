import useSetSearchParams from '@/components/useSetSearchParams'
import { getThumb } from '@/components/wikidata'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import BookmarkButton from './BookmarkButton'
import Bookmarks from './Bookmarks'
import ClickedPoint from './ClickedPoint'
import { ContentSection, ContentWrapper, ExplanationWrapper } from './ContentUI'
import ElectionsContent from './Elections'
import { FeatureImage } from './FeatureImage'
import OsmFeature from './OsmFeature'
import { PlaceButtonList } from './PlaceButtonsUI'
import PlaceSearch from './PlaceSearch'
import QuickBookmarks from './QuickBookmarks'
import QuickFeatureSearch from './QuickFeatureSearch'
import SetDestination from './SetDestination'
import ShareButton from './ShareButton'
import { DialogButton, ModalCloseButton } from './UI'
import { ZoneImages } from './ZoneImages'
import Explanations from './explanations.mdx'
import Itinerary from './itinerary/Itinerary'
import getUrl from './osm/getUrl'
import StyleChooser from './styles/StyleChooser'
import { defaultTransitFilter } from './transport/TransitFilter'
import TransportMap from './transport/TransportMap'
import useOgImageFetcher from './useOgImageFetcher'
import useWikidata from './useWikidata'

// TODO: dirty integration from OsmFeature.tsx

import languageIcon from '@/public/language.svg'
import Image from 'next/image'
import Address, { addressKeys } from '@/components/Address'
import Stop, { isNotTransportStop, transportKeys } from './transport/stop/Stop'
import Tags, {
	SoloTags,
	getFrenchAdminLevel,
	processTags,
} from '@/components/Tags'
import Heritage from './osm/Heritage'
import ContactAndSocial from '@/components/ContactAndSocial'
import { OpeningHours } from './osm/OpeningHours'
import { omit } from '@/components/utils/utils'
import getName, { getNameKeys, getNames } from './osm/getName'
import Emoji from '@/components/Emoji'

// end of dirty integration

const getMinimumQuickSearchZoom = (mobile) => (mobile ? 10.5 : 12) // On a small screen, 70 %  of the tiles are not visible, hence this rule

export default function Content({
	latLngClicked,
	setLatLngClicked,
	clickedGare,
	bikeRoute,
	setBikeRouteProfile,
	bikeRouteProfile,
	clickGare,
	zoneImages,
	bboxImages,
	bbox,
	panoramaxImages,
	resetZoneImages,
	state,
	setState,
	zoom,
	sideSheet, // This gives us the indication that we're on the desktop version, where the Content is on the left, always visible, as opposed to the mobile version where a pull-up modal is used
	searchParams,
	snap,
	setSnap = (snap) => null,
	openSheet = () => null,
	setStyleChooser,
	style,
	styleChooser,
	itinerary,
	transportStopData,
	geocodedClickedPoint,
	resetClickedPoint,
	transportsData,
	geolocation,
	focusImage,
	vers,
	osmFeature,
	quickSearchFeaturesLoaded,
	setDisableDrag,
}) {
	const tags = osmFeature?.tags
	const url = tags && getUrl(tags)

	const ogImages = useOgImageFetcher(url),
		ogImage = ogImages[url],
		tagImage = tags?.image,
		mainImage = tagImage || ogImage // makes a useless request for ogImage that won't be displayed to prefer mainImage : TODO also display OG

	const [tutorials, setTutorials] = useLocalStorage('tutorials', {})
	const introductionRead = tutorials.introduction,
		clickTipRead = true || tutorials.clickTip
	const lonLat = osmFeature && [osmFeature.lon, osmFeature.lat]
	const wikidata = useWikidata(osmFeature, state, lonLat)
	console.log('wikidata3', wikidata, osmFeature)

	const setSearchParams = useSetSearchParams()

	const wikidataPictureUrl = wikidata?.pictureUrl
	const wikiFeatureImage =
		!tagImage && // We can't easily detect if tagImage is the same as wiki* image
		// e.g.
		// https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Cathédrale Sainte-Croix d'Orléans 2008 PD 33.JPG&width=500
		// https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Cathédrale_Sainte-Croix_d'Orléans_2008_PD_33.JPG/300px-Cathédrale_Sainte-Croix_d'Orléans_2008_PD_33.JPG
		// are the same but with a different URL
		// hence prefer tag image, but this is questionable
		osmFeature &&
		(osmFeature.tags?.wikimedia_commons
			? getThumb(osmFeature.tags.wikimedia_commons, 500)
			: wikidataPictureUrl)

	const nullEntryInState = state.findIndex((el) => el == null || el.key == null)

	const content = [
		osmFeature,
		zoneImages,
		bboxImages,
		panoramaxImages,
		!clickTipRead,
		geocodedClickedPoint,
		searchParams.gare,
	]

	const hasContent = content.some(
		(el) => el && (!Array.isArray(el) || el.length > 0)
	)

	// TODO: dirty integration from OsmFeature.tsx

	const { leisure } = tags || {};

	const {
		description,
		'name:br': nameBrezhoneg,
		opening_hours,
		phone: phone1,
		'contact:phone': phone2,
		'contact:mobile': phone3,
		email,
		'contact:email': email2,
		website: website1,
		'website:menu': menu,
		'contact:website': website2,
		'contact:instagram': instagram,
		'contact:facebook': facebook,
		'contact:whatsapp': whatsapp,
		'contact:youtube': youtube,
		'contact:linkedin': linkedin,
		'ref:FR:SIRET': siret,
		brand: brand,
		'brand:wikidata': brandWikidata,
		'brand:wikipedia': brandWikipedia,
		'ref:FR:Allocine': allocine,
		'ref:mhs': mérimée,
		admin_level: adminLevel,
		wikipedia,
		image,
		...rest
	} = tags

	

	const frenchAdminLevel = getFrenchAdminLevel(tags, adminLevel)

	// could have multiple phone numbers, format: 
	// +33 1 23 45 67 88;+33 1 23 45 67 89 (semicolon separated)
	const phone = phone1 || phone2 || phone3;
	const website = website1 || website2

	const phones = phone ? phone.split(';') : [];

	const name = getName(tags)
	const nameKeys = getNameKeys(tags)

	const filteredRest = omit([addressKeys, transportKeys, nameKeys].flat(), rest)

	const [keyValueTags, soloTags] = processTags(filteredRest)

	const filteredSoloTags = frenchAdminLevel
		? [
				...soloTags.filter((tag) => {
					return !['Limite administrative', 'Frontière'].includes(tag[1][0])
				}),
				['hexagone-contour.svg', [frenchAdminLevel]],
		  ]
		: soloTags

	// end of dirty integration

	const elections = searchParams.style === 'elections'

	const showContent =
		hasContent &&
		// treat the case click on a OSM feature -> feature card -> click on "go
		// there" -> it's ok to keep the card -> click on origin -> state.length ===
		// 2 -> useless destination card
		// Note : what we wanted to do would need a filter(Boolean), but in practice
		// removing the card after the destination click is good too
		!(itinerary.isItineraryMode && state.length >= 2) &&
		!elections

	const bookmarkable = geocodedClickedPoint || osmFeature // later : choice

	const hasDestination = osmFeature || geocodedClickedPoint

	const hasNullEntryInState = nullEntryInState > -1

	const isItineraryModeNoSteps =
			itinerary.isItineraryMode &&
			(state.length === 0 || !state.find((step) => step?.choice || step?.key)),
		searchStepIndex = isItineraryModeNoSteps ? 1 : nullEntryInState

	const showSearch =
		!styleChooser &&
		// In itinerary mode, user is filling or editing one of the itinerary steps
		(hasNullEntryInState ||
			isItineraryModeNoSteps ||
			!(osmFeature || itinerary.isItineraryMode)) // at first, on desktop, we kept the search bar considering we have room. But this divergence brings dev complexity

	const minimumQuickSearchZoom = getMinimumQuickSearchZoom(!sideSheet)

	useEffect(() => {
		if (geocodedClickedPoint) {
			setSnap(1, 'Content')
		}
	}, [geocodedClickedPoint, setSnap])

	useEffect(() => {
		if (!showSearch) return
		if (snap === 3)
			if (zoom > minimumQuickSearchZoom) {
				setSnap(2, 'Content')
			}
	}, [showSearch, zoom, snap])

	const showIntroduction =
		!introductionRead &&
		// if a new user comes with a place URL, or the election map, or if a search
		// engine indexes a transport map, we don't want to hide the relevant content
		// and bother her with the introduction
		Object.keys(searchParams).length === 0
	useEffect(() => {
		if (showIntroduction) return

		setTimeout(() => setSnap(1), 1000)
	}, [showIntroduction, setSnap])

	if (showIntroduction)
		return (
			<ExplanationWrapper>
				<Explanations />
				<DialogButton
					onClick={() => {
						setTutorials({ ...tutorials, introduction: true })
						setSnap(2)
					}}
				>
					OK
				</DialogButton>
			</ExplanationWrapper>
		)

	return (
		<ContentWrapper>
			{showSearch && (
				<section>
					<PlaceSearch
						{...{
							state,
							setState,
							sideSheet,
							setSnap,
							zoom,
							setSearchParams,
							searchParams,
							autoFocus: nullEntryInState > 0,
							stepIndex: searchStepIndex,
							geolocation,
							placeholder: isItineraryModeNoSteps ? 'Votre destination' : null,
						}}
					/>
					{zoom > minimumQuickSearchZoom && (
						<QuickFeatureSearch
							{...{
								searchParams,
								searchInput: vers?.inputValue,
								setSnap,
								snap,
								loaded: quickSearchFeaturesLoaded,
							}}
						/>
					)}
					{searchParams.favoris !== 'oui' &&
						searchParams.transports !== 'oui' && (
							<QuickBookmarks oldAllez={searchParams.allez} />
						)}
				</section>
			)}

			{elections && (
				<ElectionsContent searchParams={searchParams} setSnap={setSnap} />
			)}
			{searchParams.favoris === 'oui' && <Bookmarks />}
			{searchParams.transports === 'oui' && !itinerary.isItineraryMode && (
				<TransportMap
					{...{
						bbox,
						day: searchParams.day,
						data: transportsData,
						selectedAgency: searchParams.agence,
						routesParam: searchParams.routes,
						stop: searchParams.arret,
						trainType: searchParams['type de train'],
						transitFilter: searchParams['filtre'] || defaultTransitFilter,
						setIsItineraryMode: itinerary.setIsItineraryMode,
					}}
				/>
			)}

			<Itinerary
				{...{
					itinerary,
					bikeRouteProfile,
					setBikeRouteProfile,
					searchParams,
					setSnap,
					close: () => {
						setSearchParams({ allez: undefined, mode: undefined })
						itinerary.setIsItineraryMode(false)
					},
					state,
					setDisableDrag,
				}}
			/>

			{styleChooser ? (
				<StyleChooser {...{ setStyleChooser, style, setSnap }} />
			) : (
				showContent && (
					<ContentSection>
						<div css={`
							background:var(--color99);
							border-radius:0.6rem;
							margin:-1rem;
							padding:1rem;
						`}>

						<header css={`
							display:flex;
							align-items:center;	
							flex-wrap:nowrap;
							margin-bottom:1rem;
							gap:16px;
						`}>

							<div css={`
								flex:1;
								overflow:hidden;
								position:relative;

								&:after {
									content: '';
									position: absolute;
									top: 0;
									right: 0;
									width: 1rem;
									height: 100%;
									background: linear-gradient(
										to right, 
										transparent,
										var(--color99)
									);
								}
							`}>
								<SoloTags tags={filteredSoloTags} />
							</div>

							<div css={`
								display:flex;
								align-items:center;
								gap:6px;
								flex:none;
							`}>

								{osmFeature && (
									<ModalCloseButton
										title="Fermer l'encart point d'intérêt"
										onClick={() => {
											console.log('will yo')
											setSearchParams({ allez: undefined })
											setLatLngClicked(null)
											resetZoneImages()
											console.log('will set default stat')
											openSheet(false)
										}}
									/>
								)}
							</div>
						</header>

						<div
							css={`
								position: relative;
								margin-bottom: 0.5rem;
								position:relative;

								h1 {
									margin: 0;
									font-weight:bold;
									font-size: 1.625rem;
									line-height: 100%;
									letter-spacing:-0.02em;
								}

								details {
									summary {
										display: block;
										text-align: right;
										position:absolute;
										top:0;
										right:0;
										margin-top:.2rem;
									}
									summary img {
										width: 1.2rem;
										height: auto;
									}
									ul {
										margin-left: 1.6rem;
									}
								}
								small {
									text-align: right;
								}
								h2 {
									font-size: 105%;
								}
							`}
						>
							<h1>{name}</h1>
							
							<details css={``}>
								<summary title="Nom du lieu dans d'autres langues">
									<Image src={languageIcon} alt="Icône polyglotte" />
								</summary>
								<h2>Noms dans les autres langues : </h2>
								<ul>
									{getNames(tags).map(([key, [value, altNames]]) => (
										<li key={key}>
											<span
												css={`
													color: var(--lighterTextColor);
												`}
											>
												{key.replace('name:', '')}
											</span>{' '}
											: {value} {altNames.length > 0 && `, ${altNames.join(', ')}`}
										</li>
									))}
								</ul>
							</details>
						</div>

						<div>
							{nameBrezhoneg && nameBrezhoneg !== name && (
								<small css={`
									color:var(--lighterTextColor);
									text-decoration:none;
									display:flex;
									align-items:center;
									gap:6px;
									width:fit-content;
								`}>
									<Emoji extra="1F3F4-E0066-E0072-E0062-E0072-E0065-E007F" />{' '}
									{nameBrezhoneg}
								</small>
							)}

							{opening_hours && <OpeningHours opening_hours={opening_hours} />}
			
							{description && <small>{description}</small>}

							{adminLevel && !frenchAdminLevel && (
								<div>
									<span>Niveau administratif : {adminLevel}</span>
								</div>
							)}

							<Address tags={tags} />

							{tags.uic_ref && (
								<GareInfo
									{...{
										nom: tags.name,
										uic8: tags.uic_ref + computeSncfUicControlDigit(tags.uic_ref),
									}}
								/>
							)}


							{mérimée && (
								<a
									href={`https://www.pop.culture.gouv.fr/notice/merimee/${mérimée}`}
									target="_blank"
									title="Lien vers la fiche sur la plateforme ouverte du patrimoine"
								>
									🏛️ Fiche patrimoine
								</a>
							)}
							{phones && phones.map((phone) => (
								<div>
									<a href={`tel:${phone}`} css={`
										color:var(--linkColor);
										text-decoration:none;
										display:flex;
										align-items:center;
										gap:6px;
										width:fit-content;
									`}>

									<Image
										src="/ui/phone.svg"
										width="20"
										height="20"
										alt="Icône Téléphone"
										css={`
											filter: invert(52%) sepia(31%) saturate(231%) hue-rotate(187deg) brightness(96%) contrast(85%);
										`}
									/>

									{phone}
									</a>
								</div>
							))}
							{website && (
								<div>
									<a href={website} target="_blank" title="Site Web" css={`
										color:var(--linkColor);
										text-decoration:none;
										display:flex;
										align-items:center;
										gap:6px;
										width:fit-content;
									`}>										

										<Image
											src="/ui/web.svg"
											width="20"
											height="20"
											alt="Icône Web"
											css={`
												filter: invert(52%) sepia(31%) saturate(231%) hue-rotate(187deg) brightness(96%) contrast(85%);
											`}
										/>
										
										<span>Site web</span>
									</a>
								</div>
							)}
							{menu && (
								<div>
									<a href={menu} target="_blank" title="Menu">
										<Emoji e="📋" /> <span>Menu</span>
									</a>
								</div>
							)}
							
							<ContactAndSocial
								{...{
									email: email || email2,
									instagram,
									facebook,
									whatsapp,
									youtube,
									linkedin,
									siret,
								}}
							/>
							{!isNotTransportStop(tags) && (
								<Stop tags={tags} data={transportStopData} />
							)}
							<Heritage tags={tags} />
							{allocine && (
								<a
									href={`https://www.allocine.fr/seance/salle_gen_csalle=${allocine}.html`}
									target="_blank"
									title="Lien vers la fiche cinéma sur Allocine"
								>
									Fiche Allociné
								</a>
							)}
							{leisure && leisure == 'playground' && (
								<a
									href={`https://playguide.eu/app/osm/${featureType}/${id}`}
									target="_blank"
									title="Lien vers la fiche de l'aire sur PlayGuide"
									css={`
										display: flex;
										align-items: center;
										img {
											margin-right: 0.6rem;
											width: 1.2rem;
											height: auto;
										}
									`}
								>
									<Image
										src="https://playguide.eu/assets/logo-pentagon.svg"
										alt="Logo du site PlayGuide"
										width="10"
										height="10"
									/>
									Fiche PlayGuide
								</a>
							)}
						</div>


						{(hasDestination || bookmarkable) && (
							<PlaceButtonList>
								{hasDestination && (
									<SetDestination
										geocodedClickedPoint={geocodedClickedPoint}
										geolocation={geolocation}
										searchParams={searchParams}
										osmFeature={osmFeature}
									/>
								)}
								{bookmarkable && (
									<BookmarkButton
										geocodedClickedPoint={geocodedClickedPoint}
										osmFeature={osmFeature}
									/>
								)}
								{bookmarkable && (
									<ShareButton {...{ geocodedClickedPoint, osmFeature }} />
								)}
							</PlaceButtonList>
						)}




						{mainImage && (
							<FeatureImage
								src={mainImage}
								css={`
									width: 100%;
									height: 6rem;
									@media (min-height: 800px) {
										height: 9rem;
									}
									object-fit: cover;
								`}
							/>
						)}
						{wikiFeatureImage && (
							<FeatureImage
								src={wikiFeatureImage}
								css={`
									width: 100%;
									height: 6rem;
									@media (min-height: 800px) {
										height: 9rem;
									}
									object-fit: cover;
								`}
							/>
						)}
						<ZoneImages
							zoneImages={
								searchParams.photos === 'oui' && bboxImages?.length > 0
									? bboxImages
									: zoneImages
							} // bbox includes zone, usually
							panoramaxImages={panoramaxImages}
							focusImage={focusImage}
						/>

						</div>			
			

						{osmFeature ? (
							<OsmFeature
								data={osmFeature}
								transportStopData={transportStopData}
							/>
						) : geocodedClickedPoint ? (
							<>
								<ModalCloseButton
									title="Fermer l'encart point d'intéret"
									onClick={() => {
										resetClickedPoint()
									}}
								/>
								<ClickedPoint
									geocodedClickedPoint={geocodedClickedPoint}
									geolocation={geolocation}
								/>
							</>
						) : (
							!clickTipRead && (
								<div>
									<p
										css={`
											max-width: 20rem;
										`}
									>
										Cliquez sur un point d'intérêt ou saisissez une destination
										puis explorez les gares autour.
									</p>
									<DialogButton
										onClick={() =>
											setTutorials({ ...tutorials, clickTip: true })
										}
									>
										OK
									</DialogButton>
								</div>
							)
						)}
					</ContentSection>
				)
			)}
		</ContentWrapper>
	)
}
