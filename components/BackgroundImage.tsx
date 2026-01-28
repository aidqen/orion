'use client';

import { useBackgroundStore } from "@/store/useBackgroundStore";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";


export function BackgroundImage({ }) {
  const backgroundImage = useBackgroundStore(state => state.backgroundImage)
  const blurEnabled = useBackgroundStore(state => state.blurEnabled)
  const backgroundEnabled = useBackgroundStore(state => state.backgroundEnabled)
  const [isLoaded, setIsLoaded] = useState(false);

  // Only show background if both image exists AND background is enabled
  if (!backgroundImage || !backgroundEnabled) return null;

  return (
    <div className="fixed -inset-5 -z-10">
      <Image
        alt="Background Image"
        src={backgroundImage}
        fill
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "object-cover brightness-100 transition-all duration-300",
          blurEnabled ? "blur-md" : "blur-0"
        )}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.7s cubic-bezier(0.3, 0.2, 0.2, 0.8)"
        }}
      />
    </div>
  )
}