// TODO: Review this component.

"use client"

// External packages
import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"

// Components
import { Icon, IconCircle, Layout, LayoutColumn } from "./index"

export const ProductPageGallery: React.FC<
  React.ComponentPropsWithRef<"div">
> = ({ children, className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: "trimSnaps",
    skipSnaps: true,
  })
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true)

  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )
  const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])
  const onInit = React.useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  React.useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect)
  }, [emblaApi, onInit, onSelect])

  return (
    <div className={twMerge("overflow-hidden", className)}>
      <div className="relative flex items-center p-0 mb-6">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          className={twJoin(
            "transition-opacity absolute left-4 z-10",
            prevBtnDisabled && "opacity-50"
          )}
        >
          <IconCircle>
            <Icon name="arrow-left" className="w-6" />
          </IconCircle>
        </button>
        <div ref={emblaRef}>
          <div className="flex touch-pan-y gap-4">
            {React.Children.map(children, (child) => {
              return (
                <div className="w-full max-w-[80%] flex-shrink-0">{child}</div>
              )
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          className={twJoin(
            "transition-opacity absolute right-4 z-10",
            nextBtnDisabled && "opacity-50"
          )}
        >
          <IconCircle>
            <Icon name="arrow-right" className="w-6" />
          </IconCircle>
        </button>
      </div>
      <div className="flex justify-center">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotButtonClick(index)}
            className="px-2"
          >
            <span
              className={twJoin(
                "bg-gradient-to-r from-current to-current text-current bg-[0%_100%] bg-no-repeat bg-[length:0%0.0625rem] transition-[background-size]",
                index === selectedIndex && "bg-[length:100%0.0625rem]"
              )}
            >
              {index + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}