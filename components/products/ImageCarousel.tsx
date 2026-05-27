"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  productName: string;
}

export function ImageCarousel({ images, productName }: ImageCarouselProps) {
  if (!images.length) return null;

  return (
    <Carousel
      opts={{ loop: images.length > 1, align: "start" }}
      className="w-full"
    >
      <div className="relative">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={`${src}-${index}`}>
              <div className="relative aspect-square overflow-hidden rounded-lg border border-white/8 bg-[#111e1a] sm:aspect-4/3">
                <Image
                  src={src}
                  alt={`${productName} ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious
              disabled={false}
              className={cn(
                "left-3 top-1/2 z-10 size-8 -translate-y-1/2",
                "border-white/10 bg-[#111e1a]/90 text-white shadow-md backdrop-blur-sm",
                "hover:bg-[#1a2e28] hover:text-white",
              )}
            />
            <CarouselNext
              disabled={false}
              className={cn(
                "right-3 top-1/2 z-10 size-8 -translate-y-1/2",
                "border-white/10 bg-[#111e1a]/90 text-white shadow-md backdrop-blur-sm",
                "hover:bg-[#1a2e28] hover:text-white",
              )}
            />
          </>
        )}
      </div>
    </Carousel>
  );
}
