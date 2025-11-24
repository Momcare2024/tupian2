# AI 图文卡片生成器 (AI Card Generator)

这是一个基于 Next.js 的 AI 图文卡片生成工具，可以根据输入的标题自动生成精美的封面、内容列表和结语卡片，并支持导出为图片。

## 功能特点

- ✨ **AI 智能生成**：基于 OpenRouter API 生成高质量的卡片内容。
- 🎨 **精美排版**：采用 Notion 风格设计，支持两端对齐、黄金分割排版。
- 🌌 **动态封面**：根据内容主题自动匹配（或使用默认）高品质星空封面图。
- 🖼️ **实时预览**：所见即所得的卡片预览模式。
- 📥 **一键下载**：支持将生成的卡片单独下载为高清图片。

## 快速开始

### 1. 环境准备

确保你的电脑上安装了 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)。

### 2. 安装依赖

在项目根目录下打开终端，运行以下命令安装依赖：

\`\`\`bash
npm install
# 或者使用 yarn
yarn
# 或者使用 pnpm
pnpm install
\`\`\`

### 3. 配置环境变量

复制项目根目录下的 `.env.example` 文件并重命名为 `.env.local`：

\`\`\`bash
cp .env.example .env.local
\`\`\`

打开 `.env.local` 文件，填入你的 OpenRouter API Key：

\`\`\`env
OPENROUTER_API_KEY=你的_api_key_这里
\`\`\`

> 提示：你需要从 OpenRouter 或其他兼容 OpenAI SDK 的服务商获取 API Key。

### 4. 启动项目

运行开发服务器：

\`\`\`bash
npm run dev
\`\`\`

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可使用。

## 部署

如果你想让朋友通过互联网访问，推荐使用 [Vercel](https://vercel.com) 进行部署：

1. 将代码上传到 GitHub。
2. 在 Vercel 中导入该项目。
3. 在 Vercel 项目设置中添加环境变量 `OPENROUTER_API_KEY`。
4. 点击 Deploy 即可获得公开访问链接。
