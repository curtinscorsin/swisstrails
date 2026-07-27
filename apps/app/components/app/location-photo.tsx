"use client";

import { useState } from "react";
import Image from "next/image";
import { LocationImageFallback } from "@/components/app/location-image-fallback";
import { useLocationImages } from "@/lib/location-images";
import type { Location, LocationImage } from "@/types";

interface LocationPhotoProps {
  location: Location;
  image: LocationImage | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  compactFallback?: boolean;
}

export function LocationPhoto({
  location,
  image,
  className = "object-cover",
  sizes = "100vw",
  priority = false,
  compactFallback = false,
}: LocationPhotoProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const hasUsableImage = Boolean(image?.url && image.url !== failedUrl);

  if (!image || !hasUsableImage) {
    return <LocationImageFallback location={location} compact={compactFallback} />;
  }

  return (
    <Image
      src={image.url}
      alt={image.alt || location.name}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setFailedUrl(image.url)}
    />
  );
}

export function ResolvedLocationPhoto(
  props: Omit<LocationPhotoProps, "image">
) {
  const image = useLocationImages(props.location)[0] ?? null;
  return <LocationPhoto {...props} image={image} />;
}
