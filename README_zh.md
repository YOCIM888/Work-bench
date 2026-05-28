[English](./README.md) | [中文](./README_zh.md)

# YOCIM BENCH

基于 Vue 3 的桌面风格在线开发者工具箱。20+ 工具集于一身——无需安装、无需登录，打开即用。

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883.svg)
![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)

## ✨ 特性

- 🖥️ **桌面风格 UI** — 可拖拽窗口、任务栏、图标网格
- 🌙 **夜间模式** — 一键切换，本地持久化
- 🌍 **国际化** — English / 中文 / 日本語
- 🔀 **拖拽排序** — 自由排列图标，布局本地保存
- 📦 **零后端** — 全部在浏览器中运行

## 🛠️ 工具（20 个）

| 分类 | 工具 |
|------|------|
| ✏️ 文本编辑 | 记事本、Markdown 编辑器 |
| 💻 代码工具 | 代码格式化、正则测试器、JSON 转 TS、差异对比 |
| 📊 数据格式 | JSON 可视化、数据格式转换（JSON/YAML/XML）、进制转换 |
| 🔐 编码转换 | Base64 编解码、URL 编解码、图片转 Base64、二维码 |
| 🌐 网络工具 | 域名查询、CRON 生成器 |
| 🎨 设计工具 | 调色板、画板 |
| 🔒 安全工具 | 密码 & 哈希生成器 |
| ⏱️ 效率工具 | 时间戳转换、番茄钟 |

### 工具详情

**记事本** — 创建、编辑、删除笔记，自动保存，下载为 .txt

**Markdown 编辑器** — 左右分栏实时预览，代码高亮，导出 .md/.html

**代码格式化** — 支持 15 种语言（JS、TS、HTML、CSS、JSON、XML、SQL、Python、Java、C/C++、Go、Rust、PHP、Markdown、YAML）

**正则测试器** — 实时匹配高亮，捕获组显示，6 个预设，4 个修饰符（g/i/m/s）

**JSON 转 TS** — 递归 JSON → TypeScript 接口，嵌套对象拆分，联合类型

**差异对比** — 并排视图 & 统一视图，行号，新增/删除统计

**JSON 可视化** — 树形展示，折叠/展开，搜索高亮，路径复制

**数据格式转换** — JSON ↔ YAML ↔ XML 双向转换，自动检测格式

**进制转换** — 二进制/八进制/十进制/十六进制实时互转，位宽选择，ASCII/Unicode 编码表

**Base64 编解码** — 文本和文件编解码，URL 安全模式

**URL 编解码** — 编码/解码，URL 解析器 + Query 参数表

**图片转 Base64** — 拖拽/粘贴/上传，调整尺寸，格式转换（PNG/JPEG/WebP），4 种输出格式

**二维码** — 生成（文本/网址/联系方式/WiFi）+ 样式选项，解析图片二维码 + 类型自动识别

**域名查询** — IP 归属地、DNS 记录（7 种类型）、HTTP 响应头

**CRON 生成器** — 可视化构建器，8 个预设，人类可读描述，下次 5 次执行时间

**调色板** — HSV 色板，HEX/RGB/HSL 同步，收藏色板，随机颜色

**画板** — 画笔/橡皮/直线/矩形/圆形，12 色，撤销/重做，下载 PNG

**密码 & 哈希** — 可配置密码生成，强度评估，10 种哈希算法 + HMAC + 文件哈希

**时间戳转换** — Unix ↔ 日期时间，6 种格式，相对时间，实时时钟

**番茄钟** — 25/5/15/20 定时器，音频提醒，回合计数

## 🚀 快速开始

```bash
# 克隆
git clone https://github.com/YOCIM888/Work-bench.git
cd Work-bench

# 安装
npm install

# 开发
npm run dev

# 构建
npm run build
```

## 🏗️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3（Composition API） |
| 构建 | Vite 5 |
| 国际化 | 自定义（provide/inject） |
| 主题 | CSS 自定义属性 |
| Markdown | marked + highlight.js |
| 代码格式化 | js-beautify |
| 差异对比 | diff（Myers 算法） |
| YAML | js-yaml |
| XML | fast-xml-parser |
| CRON | cron-parser |
| 二维码生成 | qrcode |
| 二维码解析 | jsqr |

## 📁 项目结构

```
src/
├── apps/                    # 每个工具是独立的应用
│   ├── notepad/
│   ├── code-formatter/
│   ├── color-picker/
│   ├── regex-tester/
│   ├── markdown-editor/
│   ├── json-viewer/
│   ├── diff-checker/
│   ├── timestamp-converter/
│   ├── password-generator/
│   ├── base64/
│   ├── pomodoro/
│   ├── drawing-board/
│   ├── url-codec/
│   ├── cron-generator/
│   ├── image-base64/
│   ├── json-to-ts/
│   ├── domain-lookup/
│   ├── data-converter/
│   ├── radix-converter/
│   └── qrcode/
├── components/              # 外壳组件
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── AppWindow.vue
│   ├── Desktop.vue
│   └── DesktopIcon.vue
├── composables/
│   └── useTheme.js
├── i18n/
│   ├── index.js
│   └── locales/
│       ├── en.js
│       ├── zh.js
│       └── ja.js
├── App.vue
├── main.js
└── style.css
```

## 📄 许可证

[ISC](./LICENSE) © YOCIM888
