# Echo — ZX个人主页

张行（tangmyy）的个人主页，基于 [EroCat / Bento-Homepage](https://github.com/Ero-Cat/Bento-Homepage) 二次开发。保留原项目的 Bento Grid 与共享 WebGL2 Liquid Glass 渲染，在此基础上调整个人内容、社交入口、足迹地图和自动部署。

- 在线地址：[home.tmyyy.top](http://home.tmyyy.top)（已确认 HTTP 可访问；HTTPS 需完成证书配置）。
- 当前仓库：[tangmyy/echo_cv](https://github.com/tangmyy/echo_cv)。
- 原始许可证完整保留于 [LICENSE](LICENSE)，代码与素材的许可说明见文末。

## 技术与运行方式

| 项目 | 当前方案 |
|---|---|
| 框架 | Next.js 16 App Router、React 19、TypeScript |
| 样式与交互 | Tailwind CSS 4、Framer Motion 12、Lucide 图标 |
| 玻璃效果 | 继承上游共享 WebGL2 画布和 GLSL shader，支持 CSS fallback |
| 内容配置 | `src/config/site.ts` |
| 包管理器 | pnpm 10.27.0，由 package.json 的 packageManager 指定 |
| CI 构建 | GitHub Actions，Ubuntu 24.04、Node.js 22 |
| 发布 | 静态导出 out/，SSH 上传到腾讯云服务器，由 Nginx 提供页面 |

项目不需要运行 Next.js 服务端进程。GitHub Actions 在云端构建，服务器只接收 HTML、CSS、JavaScript 和图片；天气、贡献图等数据由浏览器请求外部接口。

## 二次开发内容

### 个人资料与板块布局

- 页面标题调整为 `Echo — ZX个人主页`，资料、轮播昵称与展示内容从 `site.ts` 配置。
- `src/app/page.tsx` 决定卡片尺寸与排列；`src/components/bento-grid.tsx` 决定全局列数、行高和间距。
- 友链 `FriendsCard` 与 VRChat 状态 `VRChatStatusCard` 的导入和渲染代码保留为注释，不占位、不执行状态轮询。恢复时同时取消对应导入与 JSX 注释，并按需要调整资料卡宽度。
- 移动端单列，中等屏幕起四列；当前启用 dense 自动填补空位，桌面视觉顺序可能不同于代码顺序。

### 九个个人社交入口

### 头像与标签页图标

默认头像与 SEO 分享配图使用 `public/sheep.png`。首页优先扫描 `public/avatar/` 中的图片进行轮播（多图时每 5 秒切换），当前该目录只保留 `sheep.png`；目录为空时才使用 `profile.avatar`。浏览器标签页图标独立使用 `src/app/favicon.ico`，已由羊图生成 16、32、48、256 像素版本。更新这些资源后需重新构建部署，浏览器可能仍需刷新 favicon 缓存。

### Hardware 个人设备

设备清单由 `src/config/site.ts` 的 `hardware` 配置，当前保留 Apple、Desktop、Peripherals、Motorcycles 四类。Desktop 根据个人设备截图填写 ROG Strix G614JI、i9-13980HX、32GB RAM、RTX 4070 Laptop 8GB、Intel UHD Graphics，并展示腾讯云服务器（2 vCPU、2GB RAM）；Peripherals 展示个人键鼠与影像设备；Motorcycles 使用 Motorbike 图标，按顺序展示 Suzuki GSX250R、Aprilia GPR250R、Zontes 703F、VOGE CU525、VOGE CU625。

### Projects 个人项目

`siteConfig.projects` 已替换为 ShayuVideo API、ShayuVideo Admin、ShayuVideo APP 三个仓库，分别展示 Java 后端、Web 管理后台和用户客户端。名称、简介、技术栈及 GitHub 链接根据各仓库 README 配置；组件继续获取对应仓库的 Stars/Forks，并按 Stars 降序展示。修改入口为 `src/config/site.ts` 的 `projects` 数组。

### Interests 个人兴趣

Interests 按顺序展示 12 项英文标签：Vibe Coding、Developer、Photography、Video Editing、Travel、Cycling、Mechanics、Fitness、Reading、Podcasts、Thinking、Rubik’s Cube。数据位于 `src/config/site.ts` 的 `interests`，使用 Lucide 语义图标与系统色 accent；Mechanics 使用 Cog 齿轮图标。Software/Applications 的 20 项软件由独立的 `software` 数组维护。

在 [Lucide 图标库](https://lucide.dev/icons/) 用英文关键词查找图标，例如 `camera`（摄影）、`bike`（骑行）、`book-open`（阅读）。在 `src/components/skills-card.tsx` 从 `lucide-react` 导入对应的 React 名称（例如 `BookOpen`）并加入 `ICON_MAP`，再将 `site.ts` 中条目的 `icon` 写为相同名称。图标由代码渲染，无需下载图片到 `public`。`accent` 可选 `blue`、`green`、`orange`、`purple`、`red`、`mint`。

### 九个个人社交入口

按配置顺序展示 GitHub、抖音橱窗、微信、抖音、微信公众号、Bilibili、Steam、Resume、Email。原作者的社交入口已替换为个人地址。

`socialLinks` 使用两种动作：

- `action: "link"`：点击打开配置的 URL，Email 使用 mailto。
- `action: "qrcode"`：点击显示二维码弹窗，支持关闭按钮、Esc 和点击遮罩关闭；图片加载失败显示提示。

名称、系统色 accent、链接、图片路径和说明均放在 `site.ts`。组件实现位于 `src/components/social-card.tsx`，使用 Lucide 语义图标与已有 Steam SVG，不宣称所有图标均为官方品牌标志。

二维码文件：

```text
public/qrcodes/wechat.png       微信二维码
public/qrcodes/douyin-shop.png  抖音橱窗二维码
```

替换图片即可更新；改文件名或格式时同步修改配置中的 image。二维码不纳入背景/照片优化脚本，应保留扫码所需的四周留白。

### 手动内容列表

Blog 卡片已改为“我的内容”，移除了原作者 Halo 文章接口、加载骨架与阅读量。当前配置为个人简历：

```ts
blog: {
    posts: [
        {
            title: "我的个人简历",
            url: "https://tmyyy.top/resume_zx/",
            tags: ["简历", "关于我"],
            updatedAt: "", // 确认真实更新日期后填写 YYYY-MM-DD
        },
    ],
},
```

按数组顺序展示，日期为空时隐藏时间。单条内容提供右上角快捷入口；增加内容时同步调整网格高度，保持紧凑。清空 posts 会隐藏卡片内容，若需完整移除占位，还要处理 page.tsx 外层网格项。

### GitHub 近三年热力图

`github.username` 当前为 `tangmyy`，`github.years` 为 3。展示包含当前年的最近三个自然年：2026 年访问时为 2024—2026，当前年仅展示接口已有的数据，不等于滚动 36 个月。

通过第三方公开接口一次请求多个年份，按日期排序绘制、跨年显示年份、汇总贡献数量。支持横向滚动，默认滚到最新，并保留逐日提示与受可见性/减少动态效果控制的贪吃蛇动画。

实现：`src/components/github-heatmap-card.tsx`。接口说明：[github-contributions-api](https://github.com/grubersjoe/github-contributions-api#time-selection)。

### 足迹地图与天气

- 足迹替换为 2022—2026 年的 57 个个人地点，名称与 visitedAt 日期在 `map.markers` 配置，点击标记查看。
- 坐标采用近似城市/县城中心，自治州采用州府位置，不代表实际旅行路径或精确到访点。
- 距离起点独立配置为上海市：`map.origin.coordinates = [121.4737, 31.2304]`。
- 地图连接起点与访客位置，展示近似直线距离；零公里也可显示。距离标签位于弧线中点，不会自动调整视野包含所有端点。
- 天气使用 Open-Meteo。位置优先取已授权的浏览器定位，其次 IP 定位；均失败时回退三亚市，由 defaultWeatherLocation / weather 集中配置，不在首屏主动请求定位权限。
- 地图与天气共用定位 hook；定位失败时，地图访客点也可能是三亚默认位置，此时距离不代表真实访客距离。

## 本地开发

先安装 Node.js 22 和 package.json 指定的 pnpm，然后在项目根目录执行：

```powershell
pnpm install --frozen-lockfile
# 首次创建；已有 .env.local 时不要覆盖
Copy-Item .env.example .env.local
pnpm dev
```

在 `.env.local` 配置自己的 Mapbox **公开** Token：

```dotenv
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=你的pk公开Token
```

注意：

- `.env.local` 被 Git 忽略，`.env.example` 为空值模板，可提交。
- `NEXT_PUBLIC_*` 会在构建时嵌入浏览器 JavaScript，环境变量并不能让公开 Token 保密。
- 使用自己的 `pk.` Token，配置允许访问的网站 URL 和必要权限，不能使用 `sk.` 私密 Token；next.config.ts 会拒绝非 pk. 的非空值。
- 没有配置时显示“地图暂未配置”，不加载地图运行时。
- 修改环境变量后重新启动开发服务；线上需要重新构建发布，只修改 Nginx 服务器环境变量不会更新静态网页。

## 图片目录与自动转换

| 原图目录 | 优化目录 | 网页位置 |
|---|---|---|
| public/bg/ | public/optimized/bg/ | 整页背景轮播及玻璃折射背景 |
| public/photos/ | public/optimized/photos/ | 照片堆叠卡片 |
| public/avatar/ | 无 | 头像轮播 |
| public/qrcodes/ | 无 | 社交二维码弹窗 |

网页在构建时扫描原图文件名，运行时加载对应同名 WebP。转换命令：

```powershell
pnpm images:sync
# 等价的独立脚本
node scripts/sync-images.mjs
# 强制重新生成全部优化图
pnpm images:sync --force
```

脚本支持顶层 JPG/JPEG、PNG、WebP、AVIF，自动校正方向、最长边限制 2560px、不放大小图，WebP 质量 85。按文件修改时间增量跳过，保留原图与旧优化图；同名不同扩展名输出冲突会报错。复用 Next.js 依赖中的 sharp。

`pnpm dev` 和 `pnpm build` 启动前会同步一次，不持续监听。运行期间新增或替换图片后重新同步并重启开发服务。脚本按自身位置定位项目，其他工作目录运行时需提供脚本完整路径。

## 常用命令

| 命令 | 用途 |
|---|---|
| pnpm dev | 同步图片并启动开发服务器 |
| pnpm images:sync | 增量生成背景和照片 WebP |
| pnpm images:sync --force | 全量重新转换 |
| pnpm build | 同步图片并静态导出到 out/ |
| pnpm lint | ESLint 检查 |
| pnpm test:unit | 项目已有单元测试 |

不要用 `pnpm start` 提供静态导出的网站，发布 out/ 给 Nginx 即可。上述检查命令不代表已全部通过，修改后以实际日志为准。

## GitHub Actions 自动部署

工作流：[.github/workflows/deploy.yml](.github/workflows/deploy.yml)，包含逐行中文说明。

```text
推送 main / 手动触发
    → GitHub Ubuntu 24.04 Runner
    → Node.js 22 + pnpm 安装依赖
    → 注入 Mapbox 公开 Token，pnpm build
    → 打包静态文件，打印压缩包大小
    → SSH 检查账号和目录权限
    → SCP 上传 .tar.gz.part
    → 远端 SHA-256 校验
    → 解压版本目录并切换 current
```

Action 使用 checkout v6、setup-node v6、pnpm/action-setup v5。Action 自身的 Node 24 运行时与项目构建使用的 Node 22 是两回事。整个任务限时 20 分钟。

仓库 Settings → Secrets and variables → Actions 配置：

| Secret | 内容 |
|---|---|
| DEPLOY_HOST | 服务器公网 IP 或主机名 |
| DEPLOY_PORT | SSH 端口 |
| DEPLOY_USER | 服务器部署账号，例如 webdeploy，不是 GitHub 用户名 |
| DEPLOY_KEY | 该账号对应的专用 SSH 私钥全文 |
| DEPLOY_KNOWN_HOSTS | 预先核实的服务器 SSH 身份记录 |
| NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN | 构建时使用的 pk. 公开 Token |

私钥、证书私钥、账号 Cookie 等不得提交到仓库。公开 Token 同样不直接写进源码；若私密凭证进入提交，撤销并清理包含它的历史，不能只新增一个删除凭证的提交。

服务器目录：

```text
/usr/share/nginx/html/
├── index.html                   # 原有首页，不覆盖
└── echo/
    ├── releases/
    │   ├── 提交编号.tar.gz       # 通过完整性校验的构建包
    │   └── 提交编号/             # 解压后的静态网页
    └── current -> releases/提交编号/
```

Nginx 目标站点的 root 应为 `/usr/share/nginx/html/echo/current`。当前以子域名 home.tmyyy.top 访问；HTTPS 需独立配置证书和 443。部署不会修改主域名旧首页、配置 DNS/Nginx 或自动续签证书，也不自动清理旧版本。

项目按网站根路径构建，不直接以 `/echo/current/index.html` 作为正式入口：CSS、JS、图片使用根路径，在子目录访问会缺资源。换域名时还需同步 `site.ts` 的 `seo.siteUrl`，并检查 Mapbox 允许 URL；public/CNAME 是上游 GitHub Pages 遗留文件，不决定当前 Nginx 的域名。

### 已遇到的问题与确认方式

- **DEPLOY_USER 为空**：首次 SSH 上传尝试以 runner 登录而失败；工作流现在先检查必需 Secrets。
- **上传残缺**：此前原图也进入构建包，上传近 20 分钟后被取消，服务器留下 20MB 截断包。现在部署包排除 out/bg、out/photos，保留 optimized 图片和本地/仓库源素材，并在发布前校验摘要。
- **文件存在不等于发布成功**：`.part` 可能尚未传完；解压、切换链接完成后，日志才输出 `Published: /usr/share/nginx/html/echo/current/index.html`。
- **发布状态**：2026-10-28 已收到 Actions Success 的运行结果，HTTP 子域名可访问；不把这当成 HTTPS、所有第三方 API 或全部设备兼容性都已验证。

## 后续服务部署备忘

下面是预留文档，不表示对应服务已部署：

- [Halo 部署说明](docs/HALO_DEPLOYMENT.md)：当前内容列表是手动模式，未来接回 Halo 需改数据源，不是只填一个域名。
- [VRCX-Cloud 部署说明](docs/VRCX_CLOUD_DEPLOYMENT.md)：卡片当前隐藏，需先确认服务版本和公开只读接口兼容性。

当前服务器为 CentOS 7；部署备忘包含旧系统兼容性边界，执行前核对受支持环境及最新上游说明。

## 原项目与许可证

本项目基于 **EroCat** 的 [Bento-Homepage](https://github.com/Ero-Cat/Bento-Homepage) 进行二次开发。共享液态玻璃渲染、原始卡片架构及上游代码归原作者和相应贡献者所有，本文列出的个人化修改不代表这些基础能力由本项目从零实现。

### 源代码

源代码遵循 **MIT 许可证**：

- 原始代码版权：**Copyright (c) 2025 EroCat**。
- 本项目中由张行新增或修改且享有权利的代码部分：**Copyright (c) 2026 张行（tangmyy）**，同样按 MIT 许可证提供，全文见 [LICENSE-MYPROJECT](LICENSE-MYPROJECT)；该文件仅适用于上述二次开发代码，不改变上游代码版权，也不授权个人素材或第三方素材。
- 原始 [LICENSE](LICENSE) 的全文和版权行完整保留，未覆盖、修改或删除。分发软件副本或实质性部分时保留相关版权与许可声明。
- 第三方依赖仍适用各自许可证。当前根目录未发现 NOTICE 文件；后续引入的上游 NOTICE 或第三方归属声明也应保留。

### 项目素材

依据[上游 README 的素材声明](https://github.com/Ero-Cat/Bento-Homepage#-许可证)，上游 `public/cat.png`、`assets/` 中的 Logo 与演示素材归 **EroCat** 所有，采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；分发这些素材及其改编版本时保留归属、注明修改，并按该许可证的要求分享改编素材。该素材许可不等于将全部源代码改为 CC BY-SA。

本项目自行添加或替换的个人照片、头像、二维码、壁纸及其他第三方素材，不因与 MIT 代码一同存放而自动获得 MIT 或 CC BY-SA 授权；其权利归相应权利人，转载或再分发需核实各自授权。本 README 不将这些素材统一声明为原作者所有或可自由再分发。

感谢原作者开源。原项目：[https://github.com/Ero-Cat/Bento-Homepage](https://github.com/Ero-Cat/Bento-Homepage)。

## 个人 Software 列表

`siteConfig.software` 按用户顺序配置 VS Code、IntelliJ IDEA、IntelliJ PyCharm、codeblocks、HBuilder X、微信开发者工具、GitKraken、Apifox、Obsidian、滴答清单、Cursor、Codex、Adobe Bridge、DaVinci Resolve、剪映专业版、Insta360 Studio、夸克网盘、WPS Office、abcVPN、网易云，共 20 项。固定高度卡片内可纵向滚动，名称保留完整 title 提示。

图标统一保存在 `public/icons/software/`。原有 vscode、intellij、ChatGPT（Codex 当前沿用 OpenAI 图标）、netEase-cloud-music SVG 保留；其余 16 项使用从本机已安装程序中提取的 256×256 PNG，abcVPN 对应本机的「ABC加速器」。来源说明见 [软件图标记录](public/icons/software/SOURCES.md)。所有图标随网站静态部署，不依赖外部图标 CDN。

替换图标时把文件放入上述目录，然后修改 `src/config/site.ts`：

```ts
{ name: "Obsidian", icon: "obsidian.png" }
```

`icon` 支持 PNG、WebP、ICO、SVG 文件名；省略扩展名时默认 `.svg`，也支持以 `/` 开头的站内资源路径及远程 URL。空值或图片加载失败会显示名称首字。此目录不参与 `images:sync` 的背景/照片转换。
