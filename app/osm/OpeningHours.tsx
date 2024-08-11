import parseOpeningHours from 'opening_hours'
import Image from 'next/image'

const getStartOfToday = (date) => {
	const startOfToday = date || new Date()
	startOfToday.setHours(0, 0, 0, 0)
	return startOfToday
}
export const getOh = (opening_hours) => {
	try {
		const oh = new parseOpeningHours(opening_hours, {
				address: { country_code: 'fr' },
			}),
			isOpen = oh.getState(),
			nextChange = oh.getNextChange()

		const intervals = oh.getOpenIntervals(
			getStartOfToday(),
			getStartOfToday(new Date(new Date().setDate(new Date().getDate() + 7)))
		)
		return { isOpen, nextChange, intervals }
	} catch (e) {
		console.log('Error parsing opening hours', e)
		return { isOpen: 'error', nextChange: 'error' }
	}
}

export const OpeningHours = ({ opening_hours }) => {
	const now = new Date()

	const { isOpen, nextChange, intervals } = getOh(opening_hours)

	const formatDate = (date) => {
		const sameDay = date.getDay() === now.getDay()
		const weekday = sameDay ? undefined : 'long'

		const result = new Intl.DateTimeFormat('fr-FR', {
			hour: 'numeric',
			minute: 'numeric',
			weekday,
		}).format(date)
		return result
	}

	const hourFormatter = new Intl.DateTimeFormat('fr-FR', {
		hour: 'numeric',
		minute: 'numeric',
	})

	const dayFormatter = new Intl.DateTimeFormat('fr-FR', {
		weekday: 'long',
	})

	console.log('intervals', intervals)
	const ohPerDay = intervals
		? intervals.reduce(
				(memo, next) => {
					const [from, to] = next
					const fromDay = dayFormatter.format(from)
					const toDay = dayFormatter.format(to)

					const simple = (h) => hourFormatter.format(h).replace(':00', 'h')
					const error = toDay !== fromDay
					const fromHour = simple(from),
						toHour = simple(to)
					const range = fromHour + ' - ' + toHour

					return {
						...memo,
						[fromDay]: [...(memo[fromDay] || []), range],
						error: memo.error || error,
					}
				},
				{
					error: false,
					lundi: [],
					mardi: [],
					mercredi: [],
					jeudi: [],
					vendredi: [],
					samedi: [],
					dimanche: [],
				}
		  )
		: {}

	console.log(ohPerDay)
	return (
		<div
			css={`
				margin: 0;
				display: flex;
				align-items: center;
				list-style-type: none;

				summary {
					list-style: none;
					display: flex;
					align-items: center;
				}
				summary::marker {
					display:none;
				}

				[open] {
				}
			`}
		>
			<details open={false}>
				<summary title="Voir tous les horaires">

					{isOpen === 'error' && <span>Problème dans les horaires</span>}
					
					{nextChange === 'error' ? null : !nextChange ? (
						<>
						<OpenIndicator isOpen={true} /> 
						<span css={`color:#07643C;`}>Ouvert 24/24 7j/7</span>
						</>
					) : (
						<>
						<OpenIndicator isOpen={isOpen === 'error' ? false : isOpen} /> 
						<span css={`color:${isOpen ? '#07643C' : '#D6162D'};`}>
							{isOpen ? 'Ouvert' : 'Fermé'} jusqu'à {formatDate(nextChange)}
						</span>
						</>
					)}

					<Image src="ui/chevron-down.svg" width="16" height="16" css={`
						margin-left:4px;
						
						[open] & {
							transform:rotateZ(-180deg);
						}
					`}/>
				</summary>

				{intervals != null && !ohPerDay.error ? (
					<ul
						css={`
							padding-left: 1.5rem;
							width: 100%;
							position:relative;

							> li {
								display: flex;
								justify-content: space-between;
								> span {
									margin-right: 2rem;
								}
							}
							> li > ul {
								display: flex;
								list-style-type: none;
								li {
									margin: 0 0.4rem;
								}
							}

							&:after {
								content:'';
								display:block;
								position:absolute;
								left:8px;
								top:4px;
								bottom:4px;
								width:4px;
								border-radius:8px;
								background:rgba(0,0,0,.2);
							}
						`}
					>
						{Object.entries(ohPerDay).map(
							([day, ranges]) =>
								day !== 'error' && (
									<li key={day} css={!ranges.length && `color: gray`}>
										<span css={`
											text-transform:capitalize;
											color:var(--lighterTextColor);	
											font-weight:500;	
										`}>{day}</span>
										<ul css={`
											font-weight:700;	
										`}>
											{ranges.length > 0 ? (
												ranges.map((hour) => <li key={hour}>{hour}</li>)
											) : (
												<span
													css={`
														margin-right: 0.4rem;
													`}
												>
													Fermé
												</span>
											)}
										</ul>
									</li>
								)
						)}
					</ul>
				) : (
					opening_hours
				)}
			</details>
		</div>
	)
}

export const OpenIndicator = ({ isOpen }) => (
	<span
		css={`
			display: inline-block;
			margin: 0 0.4rem 0 1px;
			width: 1rem;
			height: 1rem;
			border-radius: 2rem;
			background: ${isOpen ? '#07643C' : '#D6162D'};
		`}
		title={isOpen ? 'Ouvert actuellement' : 'Fermé actuellement'}
	></span>
)

export const OpenIndicatorInListItem = ({ isOpen }) => (
	<span css={`
		display:flex;
		flex-direction:row;
		align-items:center;
		color: ${isOpen ? '#07643C' : '#D6162D'};
		margin-right:4px;
	`}>
		<span
			css={`
				display: inline-block;
				margin-right:6px;
				width: 9px;
				height: 9px;
				border-radius: 2rem;
				opacity:.7;
				background: ${isOpen ? '#07643C' : '#D6162D'};
			`}
			title={isOpen ? 'Ouvert' : 'Fermé'}
		></span>
		{isOpen ? 'Ouvert' : 'Fermé'}
	</span>
)
