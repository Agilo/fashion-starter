import { twMerge } from "tailwind-merge"

type SkeletonProps = {
  colorScheme?: "white" | "grayscale"
} & React.ComponentPropsWithoutRef<"div">

export const Skeleton: React.FC<SkeletonProps> = ({
  colorScheme = "grayscale",
  className,
  ...rest
}) => (
  <div
    {...rest}
    className={twMerge(
      "relative overflow-hidden shrink-0 rounded-2xs before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:to-transparent",
      colorScheme === "grayscale" && "bg-grayscale-50 before:via-white",
      colorScheme === "white" && "bg-white before:via-grayscale-50",
      className
    )}
  />
)
