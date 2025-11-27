"use client"

import { useRef } from "react"
import type { JSX } from "react/jsx-runtime"

interface DeepReadingCardProps {
  content: string
  index: number
  total: number
}

export function DeepReadingCard({ content, index, total }: DeepReadingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isFirst = index === 0

  // Helper to parse inline markdown (specifically bold)
  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={index} className="font-bold text-[#5D4037]">
            {part.slice(2, -2)}
          </span>
        )
      }
      return part
    })
  }

  const renderContent = () => {
    const lines = content.split("\n").filter((line) => line.trim())
    const elements: JSX.Element[] = []

    lines.forEach((line, lineIndex) => {
      line = line.trim()

      // H1 Heading (Main Title) - only expected on first card
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={lineIndex}
            className="text-[42px] leading-[1.1] font-extrabold text-[#8B3A1F] mb-6 tracking-tight text-left"
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
            className="text-[20px] font-bold text-[#8B3A1F] mb-2 mt-6 tracking-tight"
          >
            {line.slice(3)}
          </h2>,
        )
      }
      // Quote
      else if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={lineIndex}
            className={`${
              isFirst ? "text-[14px]" : "text-[14px]"
            } leading-relaxed text-[#5D4037] italic mb-4 pl-6 border-l-[4px] border-[#D7CCC8] py-1`}
          >
            {parseInline(line.slice(2))}
          </blockquote>,
        )
      }
      // Regular paragraph
      else {
        elements.push(
          <p
            key={lineIndex}
            className={`${
              isFirst ? "text-[14px]" : "text-[14px]"
            } leading-[1.8] text-[#3D2E29] mb-2 text-justify tracking-wide font-normal`}
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
      className="relative overflow-hidden flex flex-col"
      style={{
        width: "375px",
        height: "500px", // 3:4 aspect ratio
        backgroundColor: "#FFFCF5", // 极浅暖米色，精确复刻对标图背景
      }}
    >
      {/* Top Decorative Line */}
      {/* Reduced margins for more compact look */}
      <div className={`w-16 h-1.5 bg-[#D7CCC8] ml-8 mb-2 ${isFirst ? "mt-14" : "mt-10"}`} />

      {/* Content */}
      <div className="flex-1 px-8 flex flex-col pb-1">
        {renderContent()}
      </div>
    </div>
  )
}
