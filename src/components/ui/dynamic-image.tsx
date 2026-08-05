"use client";

import { useState, useEffect } from "react";

interface DynamicImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  basePath: string; // The image path without extension, e.g., "/team/akshita-jain"
}

const EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp"];

export function DynamicImage({ basePath, alt, className, style, ...props }: DynamicImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const tryLoad = (index: number) => {
      if (index >= EXTENSIONS.length) {
        // Fallback to a default broken image if none match
        if (isMounted) setCurrentSrc(`${basePath}.jpg`);
        return;
      }
      
      const img = new Image();
      const testSrc = `${basePath}${EXTENSIONS[index]}`;
      
      img.onload = () => {
        if (isMounted) setCurrentSrc(testSrc);
      };
      
      img.onerror = () => {
        tryLoad(index + 1); // Try the next extension
      };
      
      img.src = testSrc;
    };
    
    tryLoad(0);
    
    return () => {
      isMounted = false;
    };
  }, [basePath]);

  // Before the image successfully finds the right extension, show a placeholder 
  // with the same classes so it doesn't break any circle/card layouts.
  if (!currentSrc) {
    return (
      <div 
        className={className} 
        style={{ ...style, backgroundColor: 'rgba(150, 150, 150, 0.2)' }} 
      />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || "Image"}
      className={className}
      style={{ ...style, transform: "translateZ(0)" }}
      {...props}
    />
  );
}
