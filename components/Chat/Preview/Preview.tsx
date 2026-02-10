import type React from "react";
import { Button as UIButton } from "@/components/ui/button";
import type {
	ButtonProps,
	ContainerProps,
	DescriptionProps,
	GroupProps,
	IconProps,
	TextGroupProps,
	TitleProps,
} from "./types";

const Container: React.FC<ContainerProps> = ({ children, className }) => (
	<div
		className={`flex flex-row justify-between px-4 py-3 gap-2 items-center border-b last:border-0 transition-all bg-muted/40 ${className || ""}`}
	>
		{children}
	</div>
);

const Group: React.FC<GroupProps> = ({ children, className }) => (
	<div className={`flex items-center gap-4 ${className || ""}`}>{children}</div>
);

const Title: React.FC<TitleProps> = ({ children, className }) => (
	<h3
		className={`dark:text-white text-black font-medium leading-none text-sm sm:text-base tracking-tight truncate ${className || ""}`}
	>
		{children}
	</h3>
);

const Description: React.FC<DescriptionProps> = ({ children, className }) => (
	<p
		className={`text-xs sm:text-[13px] text-muted-foreground truncate ${className || ""}`}
	>
		{children}
	</p>
);

const PreviewButton: React.FC<ButtonProps> = ({
	onClick,
	children,
	className,
}) => (
	<UIButton
		variant="outline"
		size="sm"
		className={`shrink-0 dark:bg-muted font-medium text-sm dark:text-white ${className || ""}`}
		onClick={onClick}
	>
		{children}
	</UIButton>
);

const Icon: React.FC<IconProps> = ({ icon: LucideIcon, className }) => (
	<div
		className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ${className || ""}`}
	>
		<LucideIcon className="h-5 w-5" />
	</div>
);

const TextGroup: React.FC<TextGroupProps> = ({ children, className }) => (
	<div className={`grid gap-0.5 overflow-hidden ${className || ""}`}>
		{children}
	</div>
);

export const Preview = {
	Container,
	Group,
	TextGroup,
	Icon,
	Title,
	Description,
	Button: PreviewButton,
};
