import { useQuery } from "@tanstack/react-query";
import {
	Cloud,
	CloudFog,
	CloudLightning,
	CloudRain,
	CloudSnow,
	CloudSun,
	Loader2,
	MapPin,
	MousePointer2,
	Sun,
} from "lucide-react";
import { fetchUserWeather, getConditionText } from "@/utils/browser/weather";

export function WeatherWidget() {
	const {
		data: weather,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["weather"],
		queryFn: fetchUserWeather,
		staleTime: 1000 * 60 * 10,
		retry: false,
	});

	const handleEnableLocation = async () => {
		refetch();
	};

	if (isLoading) {
		return (
			<div className="bg-card rounded-3xl border border-border p-3 sm:p-4 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-sans min-h-[100px] sm:min-h-[120px]">
				<Loader2 size={24} className="text-muted-foreground animate-spin" />
			</div>
		);
	}

	if (isError || !weather) {
		return (
			<div className="bg-card rounded-3xl border border-border p-3 sm:p-4 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-sans min-h-[100px] sm:min-h-[120px]">
				<button
					onClick={handleEnableLocation}
					className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
				>
					<MapPin size={14} className="" />
					<span>Enable location access</span>
				</button>
			</div>
		);
	}

	return (
		<div className="bg-sidebar dark:bg-card rounded-3xl border border-border p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-sans gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px] md:min-h-[140px]">
			<div className="flex flex-col md:flex-row md:justify-between gap-2 items-start w-full">
				<button className="grid grid-cols-[4fr_1fr] items-center gap-1 text-muted-foreground text-[13px] sm:text-[15px] font-medium bg-transparent border-none cursor-pointer p-0">
					<span
						className="text-xs sm:text-sm font-semibold text-start truncate"
						title={weather.city}
					>
						{weather.city}
					</span>
					<MousePointer2
						size={12}
						className="fill-muted-foreground rotate-90 sm:w-[14px] sm:h-[14px]"
					/>
				</button>

				<WeatherIcon code={weather.conditionCode} />
			</div>

			<div className="flex justify-between items-end w-full gap-2">
				<span className="text-[32px] sm:text-[42px] md:text-[48px] lg:text-[52px] font-extralight text-foreground leading-none tracking-tighter">
					{weather.temperature}°C
				</span>

				<div className="flex flex-col text-muted-foreground items-end gap-0 shrink-0">
					<span className="text-[11px] sm:text-sm font-normal whitespace-nowrap">
						{getConditionText(weather.conditionCode)}
					</span>
					<span className="text-[11px] sm:text-sm font-normal whitespace-nowrap">
						{weather.high}° - {weather.low}°
					</span>
				</div>
			</div>
		</div>
	);
}

export function WeatherIcon({ code }: { code: number }) {
	const className = "fill-muted-foreground text-muted-foreground";

	// Responsive icon sizes based on screen size
	const sizeClasses = "size-[42px] h-fit mt-2 ms-auto";

	if (code === 0) return <Sun className={`${className} ${sizeClasses}`} />;
	if (code <= 2) return <CloudSun className={`${className} ${sizeClasses}`} />;
	if (code <= 3) return <Cloud className={`${className} ${sizeClasses}`} />;
	if (code <= 48) return <CloudFog className={`${className} ${sizeClasses}`} />;
	if (code <= 67)
		return <CloudRain className={`${className} ${sizeClasses}`} />;
	if (code <= 77)
		return <CloudSnow className={`${className} ${sizeClasses}`} />;
	if (code <= 82)
		return <CloudRain className={`${className} ${sizeClasses}`} />;
	if (code <= 99)
		return <CloudLightning className={`${className} ${sizeClasses}`} />;

	return <CloudSun className={`${className} ${sizeClasses}`} />;
}
