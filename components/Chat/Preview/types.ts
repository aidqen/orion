import type { LucideIcon } from "lucide-react";

export interface ContainerProps {
	children: React.ReactNode;
	className?: string;
}
export interface GroupProps {
	children: React.ReactNode;
	className?: string;
}
export interface TitleProps {
	children: React.ReactNode;
	className?: string;
}
export interface DescriptionProps {
	children: React.ReactNode;
	className?: string;
}
export interface ButtonProps {
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
}
export interface IconProps {
	icon: LucideIcon;
	className?: string;
}
export interface TextGroupProps {
	children: React.ReactNode;
	className?: string;
}
