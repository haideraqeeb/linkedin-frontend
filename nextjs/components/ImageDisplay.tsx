import React from "react";
import Image from "next/image";

interface ImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, alt, className }) => {
  return (
    <div className={`image-container ${className}`}>
      <div>
        <Image src={src} alt={alt} height={1024} width={1024} />
      </div>
    </div>
  );
};

export default ImageDisplay;
