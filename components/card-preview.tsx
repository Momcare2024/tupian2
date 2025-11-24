"use client"

import { useRef, useState, useEffect } from "react"
import type { JSX } from "react/jsx-runtime"

// Static imports for robust image loading
// Note: Next.js requires images to be in public/ or imported. 
// Since these are in public/, we use string paths but ensure they are correct relative to root.
const CoverImages = [
  "/daniel-kordan-starry-night-fireflies.jpg",
  "/james-webb-space-telescope-deep-field-nebula-stars.jpg"
]

interface CardPreviewProps {
  content: string
  index: number
  total: number
}

export function CardPreview({ content, index, total }: CardPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isFirst = index === 0
  const isLast = index === total - 1
  const [imgSrc, setImgSrc] = useState(CoverImages[0])

  useEffect(() => {
    if (isFirst) {
      const randomImage = CoverImages[Math.floor(Math.random() * CoverImages.length)]
      setImgSrc(randomImage)
    }
  }, [isFirst])

  // Helper to parse inline markdown (specifically bold)
  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={index} className="font-bold text-[#111827]">
            {part.slice(2, -2)}
          </span>
        )
      }
      return part
    })
  }

  // Parse markdown-like content to JSX
  const renderContent = () => {
    const lines = content.split("\n").filter((line) => line.trim())
    const elements: JSX.Element[] = []

    lines.forEach((line, lineIndex) => {
      line = line.trim()

      // H1 Heading (Main Title)
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={lineIndex}
            className={`text-[24px] leading-snug font-bold text-[#111827] mb-3 tracking-tight ${
              isFirst ? "text-center px-2" : "text-left"
            }`}
          >
            {line.slice(2)}
          </h1>,
        )
      }
      // H2 Heading (Sub Title)
      else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={lineIndex}
            className="text-[20px] font-bold text-[#111827] mb-2 tracking-tight border-l-4 border-[#111827] pl-3"
          >
            {line.slice(3)}
          </h2>,
        )
      }
      // Quote
      else if (line.startsWith("> ")) {
        elements.push(
          <div
            key={lineIndex}
            className={`mb-4 flex gap-4 ${
              isFirst
                ? "justify-center border-y border-gray-100 py-3 mx-2"
                : "justify-center py-1"
            }`}
          >
            <blockquote
              className={`${
                isFirst
                  ? "text-[14px] text-[#4b5563] leading-6 italic text-center px-2"
                  : "text-[13px] text-gray-600 font-medium bg-gray-50 rounded-lg w-full mx-0 px-4 py-2 text-left border border-gray-100"
              }`}
            >
              {parseInline(line.slice(2))}
            </blockquote>
          </div>,
        )
      }
      // Numbered list
      else if (/^\d+\./.test(line)) {
        const match = line.match(/^(\d+)\.\s*(.+)$/)
        if (match) {
          elements.push(
            <div key={lineIndex} className="flex gap-2.5 mb-2.5 items-start text-justify group">
              <span className="font-mono text-[14px] font-bold text-white shrink-0 leading-5 mt-0.5 bg-[#111827] w-5 h-5 flex items-center justify-center rounded-full text-[11px] shadow-sm">
                {match[1]}
              </span>
              <p className="text-[13px] leading-snug text-[#374151] font-normal tracking-wide pt-0">
                {parseInline(match[2])}
              </p>
            </div>,
          )
        }
      }
      // Regular paragraph
      else {
        const isLastLine = lineIndex === lines.length - 1
        // Only treat as hook if it's short (likely a guide phrase)
        // Since we removed the guide phrase requirement, this prevents the main content from being styled as a hook
        const isHook = !isFirst && !isLast && isLastLine && line.length < 30

        elements.push(
          <p
            key={lineIndex}
            className={`${
              isFirst
                ? "text-[13px] leading-relaxed text-[#4b5563] mb-0 text-justify"
                : isHook
                  ? "text-[12px] font-bold text-[#4b5563] text-right mt-4 italic opacity-80" // Hook styling (restored to right)
                  : "text-[13px] leading-snug mb-2.5 text-[#374151] text-justify" // Normal body styling
            } font-normal tracking-wide`}
          >
            {parseInline(line)}
          </p>,
        )
      }
    })

    return elements
  }

  return (
    <div
      ref={cardRef}
      className="relative bg-white overflow-hidden flex flex-col"
      style={{
        width: "375px",
        height: "500px",
      }}
    >
      {/* Decorative header for first card */}
      {isFirst && (
        <div className="shrink-0 h-[180px] w-full relative bg-slate-900">
          {/* Use standard img for SSR compatibility, with crossOrigin for html2canvas */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt="Header"
            className="w-full h-full object-cover opacity-90"
            // crossOrigin removed as Base64 doesn't need it
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30" />
        </div>
      )}

      {/* Content */}
      <div
        className={`flex-1 overflow-hidden flex flex-col ${
          isFirst ? "px-6 pt-4 pb-6" : "px-6 py-8"
        }`}
      >
        <div className="h-full flex flex-col relative">
          {renderContent()}
        </div>
      </div>
      
      {/* Bottom spacing/border for visual balance */}
      <div className="h-1.5 w-full bg-[#111827] shrink-0 opacity-5" />
    </div>
  )
}
