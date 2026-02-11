interface OrionIconProps {
	width?: string;
	height?: string;
	className?: string;
}

export function OrionIcon({ width = "2em", height = "2em", className = "" }: OrionIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="7 7 18 18"
			className={className}
		>
			<path
				fill="currentColor"
				d="M13.375 12.5c3.358 0 6.125 2.765 6.125 6.125c-.006 3.364-2.782 6.129-6.147 6.124c-3.353-.004-6.109-2.771-6.109-6.124c0-3.36 2.766-6.125 6.131-6.125zm0 3.005c-4.166-.005-4.166 6.244-.005 6.244a3.12 3.12 0 0 0 3.125-3.119a3.117 3.117 0 0 0-3.12-3.125z"
			/>
			<path
				fill="currentColor"
				d="M7.5 7.5h17v17h-3.005V10.495H7.5V7.5z"
			/>
		</svg>
	);
}
