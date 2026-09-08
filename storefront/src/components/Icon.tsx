import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { ArrowLeft } from "@/components/icons/ArrowLeft"
import { ArrowRight } from "@/components/icons/ArrowRight"
import { ArrowUpRight } from "@/components/icons/ArrowUpRight"
import { Calendar } from "@/components/icons/Calendar"
import { Case } from "@/components/icons/Case"
import { Check } from "@/components/icons/Check"
import { ChevronDown } from "@/components/icons/ChevronDown"
import { ChevronLeft } from "@/components/icons/ChevronLeft"
import { ChevronRight } from "@/components/icons/ChevronRight"
import { ChevronUp } from "@/components/icons/ChevronUp"
import { Close } from "@/components/icons/Close"
import { CreditCard } from "@/components/icons/CreditCard"
import { Heart } from "@/components/icons/Heart"
import { Info } from "@/components/icons/Info"
import { Loader } from "@/components/icons/Loader"
import { MapPin } from "@/components/icons/MapPin"
import { Menu } from "@/components/icons/Menu"
import { Minus } from "@/components/icons/Minus"
import { Package } from "@/components/icons/Package"
import { Plus } from "@/components/icons/Plus"
import { Receipt } from "@/components/icons/Receipt"
import { Refresh } from "@/components/icons/Refresh"
import { Search } from "@/components/icons/Search"
import { Sliders } from "@/components/icons/Sliders"
import { Trash } from "@/components/icons/Trash"
import { Truck } from "@/components/icons/Truck"
import { Undo } from "@/components/icons/Undo"
import { User } from "@/components/icons/User"

export type IconNames =
  | "arrow-left"
  | "arrow-right"
  | "arrow-up-right"
  | "calendar"
  | "case"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "close"
  | "credit-card"
  | "heart"
  | "info"
  | "loader"
  | "map-pin"
  | "menu"
  | "minus"
  | "package"
  | "plus"
  | "receipt"
  | "refresh"
  | "search"
  | "sliders"
  | "trash"
  | "truck"
  | "undo"
  | "user"

const baseClasses = "w-4 h-auto shrink-0"

export type IconProps = React.ComponentPropsWithoutRef<"svg"> & {
  name: IconNames
  status?: number
  wrapperClassName?: string
}

export const Icon: React.FC<IconProps> = ({
  name,
  status = 0,
  wrapperClassName,
  className,
  ...rest
}) => (
  <div className={twMerge("relative shrink-0", wrapperClassName)}>
    {Boolean(status) && (
      <div
        className={twJoin(
          "absolute -right-1 -top-0.5 leading-none rounded-full flex items-center justify-center w-4 h-4 bg-black text-white text-[0.625rem]",
          status > 99 && "!text-[0.5rem]"
        )}
      >
        <span>{status > 99 ? "+99" : status}</span>
      </div>
    )}
    {name === "arrow-left" && (
      <ArrowLeft {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "arrow-right" && (
      <ArrowRight {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "arrow-up-right" && (
      <ArrowUpRight {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "calendar" && (
      <Calendar {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "case" && (
      <Case {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "check" && (
      <Check {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "chevron-down" && (
      <ChevronDown {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "chevron-left" && (
      <ChevronLeft {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "chevron-right" && (
      <ChevronRight {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "chevron-up" && (
      <ChevronUp {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "close" && (
      <Close {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "credit-card" && (
      <CreditCard {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "heart" && (
      <Heart {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "info" && (
      <Info {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "loader" && (
      <Loader {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "map-pin" && (
      <MapPin {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "menu" && (
      <Menu {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "minus" && (
      <Minus {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "package" && (
      <Package {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "plus" && (
      <Plus {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "receipt" && (
      <Receipt {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "refresh" && (
      <Refresh {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "search" && (
      <Search {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "sliders" && (
      <Sliders {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "trash" && (
      <Trash {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "truck" && (
      <Truck {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "undo" && (
      <Undo {...rest} className={twMerge(baseClasses, className)} />
    )}
    {name === "user" && (
      <User {...rest} className={twMerge(baseClasses, className)} />
    )}
  </div>
)
