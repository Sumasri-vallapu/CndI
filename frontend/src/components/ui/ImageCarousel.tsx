import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

// ✅ Ensure paths match your actual file names
const images = [
  "/Images/gallery1.jpg",
  "/Images/gallery2.jpg",
  "/Images/gallery3.jpg",
  "/Images/gallery4.jpg",
  "/Images/gallery5.jpg",
];

interface ImageCarouselProps {
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

const ImageCarousel = ({ className = "", autoPlay = true, interval = 3000 }: ImageCarouselProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api || !autoPlay) return;
    
    const autoPlayInterval = setInterval(() => {
      if (currentIndex === images.length - 1) {
        api.scrollTo(0); // ✅ Restart from the first image
      } else {
        api.scrollNext();
      }
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(autoPlayInterval);
  }, [api, autoPlay, interval, currentIndex]);

  return (
    <div className={`relative w-full ${className}`}>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="flex aspect-video items-center justify-center p-0 rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={src}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
