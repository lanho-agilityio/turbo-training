"use client";
import Image from "next/image";

// HOCs
import { withFallbackImage } from "@repo/ui/hocs/withFallbackImage";

const ImageWithFallback = withFallbackImage(Image, "/not-found.svg");

export default ImageWithFallback;
