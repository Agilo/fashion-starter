// TODO: Review this component.

"use client"

import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import { Icon } from "@/components/Icon"
import { IconCircle } from "@/components/IconCircle"

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
    <div className={twMerge("overflow-hidden relative", className)}>
      <div className="relative flex items-center p-0 lg:mb-6">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          className="transition-opacity absolute left-4 z-10 max-lg:hidden"
          aria-label="Previous"
        >
          <IconCircle
            className={twJoin(
              "bg-black text-white transition-colors",
              prevBtnDisabled && "bg-transparent text-black"
            )}
          >
            <Icon name="arrow-left" className="w-6 h-6" />
          </IconCircle>
        </button>
        <div ref={emblaRef} className="w-full">
          <div className="flex touch-pan-y gap-4">
            {React.Children.map(children, (child) => {
              return (
                <div className="w-full md:max-w-[80%] flex-shrink-0">
                  {child}
                </div>
              )
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          className="transition-opacity absolute right-4 z-10 max-lg:hidden"
          aria-label="Next"
        >
          <IconCircle
            className={twJoin(
              "bg-black text-white transition-colors",
              nextBtnDisabled && "bg-transparent text-black"
            )}
          >
            <Icon name="arrow-right" className="w-6 h-6" />
          </IconCircle>
        </button>
      </div>
      <div className="flex justify-center max-lg:w-full max-lg:absolute max-lg:bottom-4">
        {scrollSnaps.map((_, index) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={() => onDotButtonClick(index)}
            className="px-1.5"
          >
            <span
              className={twMerge(
                "border-b border-transparent transition-colors px-0.5",
                index === selectedIndex && "border-black"
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
