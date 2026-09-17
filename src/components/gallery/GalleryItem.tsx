"use client";

import React from "react";
import Image from "next/image";
import type { GalleryPhoto } from "@/data/gallery.types";

interface GalleryItemProps {
  photo: GalleryPhoto;
  onClick: () => void;
}

export function GalleryItem({ photo, onClick }: GalleryItemProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative h-[60vh] sm:h-[68vh] md:h-[74vh] w-full cursor-pointer overflow-hidden rounded-none border border-border/50 bg-card shadow-2xl shadow-black focus:outline-none select-none"
    >
      <Image
        src={photo.src}
        alt={photo.title}
        fill
        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 55vw, 40vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
}
