"use client";
import { ReactNode, useEffect, useState } from "react";
import { ImageProps } from "next/image";

export type WithFallbackImageProps = {
  fallbacksrc?: string;
} & ImageProps;

export const withFallbackImage = (
  ChildComponent: (props: WithFallbackImageProps) => ReactNode,
  fallbacksrc: string
) => {
  const WithFallbackImageWrapper = ({ ...props }: ImageProps) => {
    const { src } = props;
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
      setImgSrc(src);
    }, [src]);

    if (!imgSrc) {
      return null;
    }

    return (
      <ChildComponent
        {...props}
        fallbacksrc={fallbacksrc}
        src={imgSrc}
        onError={() => {
          setImgSrc(fallbacksrc);
        }}
      />
    );
  };

  return WithFallbackImageWrapper;
};
