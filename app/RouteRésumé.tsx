import css from '@/components/css/convertToJs'
import LightsWarning from './LightsWarning'
import ProfileChooser from './ProfileChooser'
import { nowStamp } from './itinerary/transit/motisRequest'
import ValhallaRésumé from './itinerary/ValhallaRésumé'

export default function RouteRésumé({
	mode,
	data,
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
	if (data === 'loading')
		return <div>La roue tourne est en train de tourner</div>
	return (
		<div
			css={`
				position: relative;
				display: flex;
				align-items: center;
				background: var(--lightestColor);
				padding: 0.6rem;
				color: var(--darkestColor);
				line-height: 1.4rem;
				border: ${mode === 'cycling'
					? '4px solid var(--lightColor)'
					: '4px dotted #8f53c1'};
				margin-top: 1.4rem;
				border-radius: 0.5rem;
				@media (min-width: 1200px) {
				}
			`}
		>
			{mode === 'car' ? (
				<ValhallaRésumé data={data} />
			) : (
				<BrouterModeContent
					{...{
						bikeRouteProfile,
						setBikeRouteProfile,
						mode,
						data,
					}}
				/>
			)}
		</div>
	)
}

const formatter = (digits) => (number) =>
	new Intl.NumberFormat('fr-FR', { maximumSignificantDigits: digits }).format(
		number
	)
export const computeHumanDistance = (distance) => {
	if (distance >= 10000) return [Math.round(distance / 1000), 'km']
	if (distance >= 1000) return [formatter(2)(distance / 1000), 'km']
	if (distance >= 100) return [Math.round(distance / 100) * 100, 'm']
	if (distance >= 10) return [Math.round(distance / 10) * 10, 'm']

	return [Math.round(distance / 10) * 10, 'm']
}

export const daysHoursMinutesFromSeconds = (seconds) => {
	const secondsInDay = 24 * 60 * 60
	const days = Math.floor(seconds / secondsInDay)
	const rest = (seconds % secondsInDay) / (60 * 60)
	const hours = Math.floor(rest)
	const minutes = Math.round((rest - hours) * 60)
	return [days, hours, minutes]
}

const BrouterModeContent = ({
	mode,
	data,
	setBikeRouteProfile,
	bikeRouteProfile,
}) => {
	const features = data?.features
	if (!features?.length) return null

	const feature = features[0]
	if (!feature || !feature.properties) return

	const seconds = feature.properties['total-time'],
		distance = feature.properties['track-length'],
		[humanDistance, unit] = computeHumanDistance(distance),
		[days, hours, minutes] = daysHoursMinutesFromSeconds(seconds)

	const déniveléCumulé = feature.properties['filtered ascend']
	const dénivelé = feature.properties['plain-ascend']
	const arrivalTime = nowStamp() + +seconds,
		humanArrivalTime =
			!days &&
			new Date(arrivalTime * 1000).toLocaleString('fr-FR', {
				hour: 'numeric',
				minute: 'numeric',
			})

	return (
		<div>
			<p>
				À {mode === 'walking' ? 'pieds' : 'vélo'}, le trajet de{' '}
				<strong>
					{humanDistance}&nbsp;{unit}
				</strong>{' '}
				vous prendra{' '}
				<strong>
					{days ? days + ` jour${days > 1 ? 's' : ''}, ` : ''}
					{hours ? hours + ` h et ` : ''}
					{+minutes}&nbsp;min
				</strong>{' '}
				<small>(arrivée à {humanArrivalTime})</small> pour{' '}
				<strong
					title={`La pente sera de ${(
						(déniveléCumulé / distance) *
						100
					).toFixed(1)}%`}
					style={css(
						`background: ${deniveléColor(
							déniveléCumulé,
							distance
						)}; padding: 0 .2rem; border-radius: 0.3rem;`
					)}
				>
					{déniveléCumulé}&nbsp;m
				</strong>{' '}
				de dénivelé{' '}
				<small css="white-space: nowrap">({dénivelé}&nbsp;m en absolu)</small>.
			</p>
			{mode === 'cycling' && (
				<ProfileChooser
					{...{
						bikeRouteProfile,
						setBikeRouteProfile,
					}}
				/>
			)}
			{mode === 'cycling' && feature.geometry.coordinates[0] && (
				<LightsWarning
					longitude={feature.geometry.coordinates[0][0]}
					latitude={feature.geometry.coordinates[0][1]}
				/>
			)}
		</div>
	)
}

const deniveléColors = [
	'Crimson',
	'Salmon',
	'#f7b63f',
	'Moccasin',
	'LightGreen',
]
// TODO this function should be made more complex.
// E.g. tell the user if the ride is mostly flat but has a very hard drop at one
// point
// for sport, see https://fr.wikipedia.org/wiki/Coefficient_de_difficult%C3%A9
const deniveléColor = (height, distance) => {
	const percentage = (height / distance) * 100
	const index =
		percentage > 5
			? 0
			: percentage > 3
				? 1
				: percentage > 2
					? 2
					: percentage > 1
						? 3
						: 4

	const difficulty = Math.round(index)
	return deniveléColors[difficulty]
}
