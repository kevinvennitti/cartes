'use client'

export function PlaceButtonList({ children }) {
	return (
		<ul className="sidesheet-main-actions">
			{children}
		</ul>
	)
}

export function PlaceButton({ children }) {
	return (
		<li className="sidesheet-main-action">	{children}
		</li>
	)
}