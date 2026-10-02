import * as React from "react"
import { twMerge } from "tailwind-merge"
import { Icon, IconNames } from "@/components/Icon"

type UiTagOwnProps = {
  isActive?: boolean
  iconName?: IconNames
  iconPosition?: "start" | "end"
}

export const UiTag: React.FC<
  React.ComponentPropsWithRef<"div"> & UiTagOwnProps
> = ({
  isActive = false,
  iconName,
  iconPosition,
  className,
  children,
  ...rest
}) => (
  <div
    {...rest}
    className={twMerge(
      "inline-flex justify-center items-center gap-2 rounded-md px-4 py-1.5 max-h-6 text-xs bg-grayscale-50 text-black",
      isActive && "bg-black text-white",
      iconPosition === "end" && "flex-row-reverse",
      className
    )}
  >
    {iconName && <Icon name={iconName} className="w-3 h-3" />}
    <span>{children}</span>
  </div>
)
