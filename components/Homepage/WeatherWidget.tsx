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
			<div className="bg-[#FAFBF9] rounded-3xl border border-stone-300 p-3 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-sans min-h-[120px]">
				<Loader2 size={24} className="text-[#747573] animate-spin" />
			</div>
		);
	}

	if (isError || !weather) {
		return (
			<div className="bg-[#FAFBF9] rounded-3xl border border-stone-300 p-3 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-sans min-h-[120px]">
				<button
					onClick={handleEnableLocation}
					className="flex items-center gap-1.5 text-sm text-[#585958] hover:text-[#1A1A1A] transition-colors cursor-pointer bg-transparent border-none p-0"
				>
					<MapPin size={14} />
					<span>Enable location access</span>
				</button>
			</div>
		);
	}

	return (
		<div className="bg-[#FAFBF9] rounded-3xl border border-stone-300 p-3 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] font-sans gap-2">
			<div className="flex justify-between items-start w-full">
				<button className="grid grid-cols-[3fr_1fr] items-center gap-1 text-[#585958] text-[15px] font-medium bg-transparent border-none cursor-pointer p-0">
					<span
						className="text-sm font-semibold text-start truncate"
						title={weather.city}
					>
						{weather.city}
					</span>
					<MousePointer2 size={14} className="fill-[#585958] rotate-90" />
				</button>

				<WeatherIcon code={weather.conditionCode} />
			</div>

			<div className="flex justify-between items-end w-full">
				<span className="text-[42px] font-extralight text-[#1A1A1A] leading-none tracking-tighter">
					{weather.temperature}°C
				</span>

				<div className="flex flex-col text-stone-600 dark:text-stone-400 items-end gap-0">
					<span className="text-sm font-normal">
						{getConditionText(weather.conditionCode)}
					</span>
					<span className="text-sm font-normal">
						{weather.high}C° - {weather.low}C°
					</span>
				</div>
			</div>
		</div>
	);
}

export function WeatherIcon({ code }: { code: number }) {
	const className = "fill-[#747573] text-[#747573]";
	const size = 42;

	if (code === 0) return <Sun size={size} className={className} />;
	if (code <= 2) return <CloudSun size={size} className={className} />;
	if (code <= 3) return <Cloud size={size} className={className} />;
	if (code <= 48) return <CloudFog size={size} className={className} />;
	if (code <= 67) return <CloudRain size={size} className={className} />;
	if (code <= 77) return <CloudSnow size={size} className={className} />;
	if (code <= 82) return <CloudRain size={size} className={className} />;
	if (code <= 99) return <CloudLightning size={size} className={className} />;

	return <CloudSun size={size} className={className} />;
}
