# My Theme

一套跨平台的个人 Markdown / 内容展示主题体系。起源于一个 Typora 主题（由 `pie` 和 `ursine-polar` 修改而来），正在逐步演化为：

> **One design language, multiple platform adapters.**

```text
        shared/  (design tokens)
              ↓
   ┌──────────┼──────────┐
 Typora    Obsidian     Web
```

共享层只表达设计语言（色板、语义色、字体、字号、间距、圆角、标题层级），
各平台 adapter 再把 token 映射到自己的 DOM / CSS 变量上，不共享 selector。

## 当前支持的平台

| 平台 | 状态 | 位置 |
| --- | --- | --- |
| Typora | ✅ 可用（`zj` 主主题；`g2` 为历史变体） | `typora/` |
| Obsidian | ✅ 可用（本次新增，light only） | `obsidian/` |
| Web / Blog | 🚧 仅占位，未实现 | `web/` |

## 目录结构

```text
/
├── shared/
│   └── tokens.css        # 设计语言的唯一权威定义（--zj-* tokens）
├── typora/               # Typora adapter
│   ├── zj.css            #   主主题（内嵌 token 块 + Typora 变量别名）
│   ├── g2.css            #   历史变体（GitHub 风格 + 标题自动编号），保持原样
│   └── zj/               #   字体文件（Roboto Mono / Source Sans Pro / 思源宋体）
├── obsidian/             # Obsidian adapter
│   ├── theme.css
│   └── manifest.json
├── web/
│   └── README.md         # 未来 Web adapter 的接入说明
├── scripts/
│   └── check-tokens.mjs  # 校验各 adapter 的 token 块与 shared/tokens.css 一致
└── figure/               # 截图
```

## 安装

### Typora

与原版体验相同：把 `typora/zj.css` 和 `typora/zj/` 文件夹一起拷贝到
Typora 的主题目录（设置 → 外观 → 打开主题文件夹），重启后选择 `zj` 主题。
`g2.css` 同理（同样依赖 `zj/` 字体文件夹）。

### Obsidian

1. 把 `obsidian/` 目录拷贝到 `<你的库>/.obsidian/themes/`，并重命名为
   `ZJ`（目录内需直接包含 `theme.css` 和 `manifest.json`）；
2. 在 Obsidian 中：设置 → 外观 → 主题 → 选择 **ZJ**。

主题是 light-only 的（原 Typora 主题只有一套浅色配色），在 Obsidian 的
深色模式下也会保持同一套浅色视觉，直到未来真正设计 dark palette。

## Shared Design Tokens

`shared/tokens.css` 是整个设计语言的唯一权威定义，内容包括：

- **色板**：红色 accent 色阶 `--zj-red-1..10`、中性灰阶 `--zj-gray-1..13`
- **语义色**：`--zj-bg`、`--zj-text`、`--zj-accent`、`--zj-link`、
  `--zj-quote-*`、`--zj-table-*`、`--zj-code-*` 等
- **排版**：`--zj-font-body`（衬线）、`--zj-font-mono`、17px 正文、
  1.8 行高、H1–H6 字号梯度
- **布局**：内容宽度 860px、段落间距、圆角

每个平台 adapter 内嵌一份**逐字相同**的 token 块（平台要求单文件可直接
安装，因此不做运行时 `@import`），再映射到平台自己的变量与 selector：

- Typora：`--zj-*` → 旧的 `--main-*` / `--mid-*` / `--side-bar-bg-color` 等
- Obsidian：`--zj-*` → `--background-primary` / `--text-normal` /
  `--link-color` / `--code-background` 等官方变量

修改 token 后请运行校验，保证三处不漂移：

```bash
node scripts/check-tokens.mjs
```

## 视觉设计语言（速览）

- 红色 accent（`#f22f27`）贯穿标题、列表 marker、表格、勾选框、当前文件
- H1 居中 + 红色短下划线；H2 红色底线 + `# ` 前缀；H3 左侧红条；H4 红框
- 链接蓝色 + 下划线，hover 变红（Obsidian 中内部链接用 accent 红）
- 引用块红色左边框 + 淡红底；行内代码红字米黄底；代码块灰边框
- 加粗红色；斜体按中文排版习惯渲染为红色正体；行内公式蓝色

## 未来 Web adapter

见 `web/README.md`：新增 `web/zj-web.css`，内嵌同一份 token 块并映射到
`body` / `article` / `pre` 等 Web selector 即可，不需要改动现有平台，
也不引入构建工具。

---

## 原 README 备忘（Typora 主题的历史说明）

> 如果GitHub图片加载不出来，可以去知乎看 https://zhuanlan.zhihu.com/p/133863913.

以下是实际笔记效果：

![img](https://pic1.zhimg.com/v2-173163ac793fbcda62af0f6f3d895a08_r.jpg)

![img](https://pic2.zhimg.com/v2-99f8f27984d0e1d1f1662a27cadbda41_r.jpg)

![img](https://pic2.zhimg.com/v2-7459caa13776f9a83f138ead20031361_r.jpg)

设计动机摘录：

- 正文 17 号衬线字体（Mac 用户可直接用苹方/系统衬线）
- 一级标题对应 Chapter，居中；二级标题对应 Section，带长横线；
  三级标题是常用小标题，克制为主
- 行内公式调成蓝色便于查找修改（导出 PDF 仍是黑色）
- 导出 PDF 优化：`@media print` 中切换为 宋体 + Times New Roman

### 更新记录

- **2020-10-27** 微调列表/表格；修改二级标题样式；行内公式变蓝；超链接蓝色样式；PDF 导出优化
- **2020-10-28** 调小 2、3 级标题；默认导出 PDF 为宋体 + Times New
- **2021-07-24** 新增 `g2` 主题（GitHub 风格 + 标题自动编号）
- **重构** 仓库演进为多平台主题体系：抽离 `shared/tokens.css`，新增 Obsidian adapter
