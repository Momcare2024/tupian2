"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CardPreview } from "@/components/card-preview"
import { Loader2, Download } from "lucide-react"
import { toPng } from "html-to-image"

export default function Home() {
  const [title, setTitle] = useState("")
  const [cards, setCards] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!title.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      })

      if (!response.ok) throw new Error("生成失败")

      const data = await response.json()
      setCards(data.cards)
    } catch (error) {
      console.error("Generate error:", error)
      alert("生成失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  const handleCardChange = (index: number, value: string) => {
    const newCards = [...cards]
    newCards[index] = value
    setCards(newCards)
  }

  const handleDownloadCard = async (index: number) => {
    setDownloadingIndex(index)
    try {
      const cardElement = document.getElementById(`card-${index}`)
      if (!cardElement) return

      // 稍微等待以确保渲染完成
      await new Promise((resolve) => setTimeout(resolve, 100))

      const dataUrl = await toPng(cardElement, {
        cacheBust: true,
        pixelRatio: 3, // 保持高清
        backgroundColor: "#ffffff",
      })

      const link = document.createElement("a")
      link.download = `card-${index + 1}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Download error:", error)
      alert("下载失败，请重试")
    } finally {
      setDownloadingIndex(null)
    }
  }

  const handleDownloadAll = async () => {
    if (cards.length === 0) return

    for (let i = 0; i < cards.length; i++) {
      await handleDownloadCard(i)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">图文卡片生成器</h1>
          <p className="text-gray-600">输入标题，AI 将为你生成多张精美卡片，可单独下载</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input & Edit */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">输入标题</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="例如：毫无保留的爱"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="flex-1"
                />
                <Button onClick={handleGenerate} disabled={loading || !title.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中
                    </>
                  ) : (
                    "生成"
                  )}
                </Button>
              </div>
            </div>

            {cards.length > 0 && (
              <>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">编辑卡片内容</h2>
                    <Button onClick={handleDownloadAll} disabled={downloadingIndex !== null} size="sm">
                      {downloadingIndex !== null ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          下载中
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          下载全部
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {cards.map((card, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium mb-2">
                          卡片 {index + 1}
                          {index === 0 && " (封面)"}
                          {index === cards.length - 1 && index !== 0 && " (结尾)"}
                        </label>
                        <Textarea
                          value={card}
                          onChange={(e) => handleCardChange(index, e.target.value)}
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Preview */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-8">
              <h2 className="text-xl font-semibold mb-4">预览 ({cards.length} 张卡片)</h2>
              {cards.length === 0 ? (
                <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed">
                  <p className="text-gray-400">输入标题并生成后，多张卡片预览将显示在这里</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 flex flex-col items-center">
                  {cards.map((card, index) => (
                    <div key={index} className="space-y-2 w-[375px]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          卡片 {index + 1}
                          {index === 0 && " - 封面"}
                          {index === cards.length - 1 && index !== 0 && " - 结尾"}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadCard(index)}
                          disabled={downloadingIndex !== null}
                        >
                          {downloadingIndex === index ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Download className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div id={`card-${index}`} className="shadow-lg rounded-lg overflow-hidden">
                        <CardPreview content={card} index={index} total={cards.length} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
