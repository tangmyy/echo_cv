# 二次开发记录

## GitHub Actions 服务器部署

`.github/workflows/deploy.yml` 当前为服务器部署，推送 main 或手动触发，在 GitHub Ubuntu Runner 上使用 Node 22、packageManager 指定的 pnpm 安装并构建，打包 out/，通过 SSH 上传到 `/usr/share/nginx/html/echo/releases/提交编号.tar.gz`，解压到对应目录并切换 current 软链接。Nginx root 指向 `/usr/share/nginx/html/echo/current`。服务器只提供静态文件。

需要六个仓库 Secrets：`DEPLOY_HOST`、`DEPLOY_PORT`、`DEPLOY_USER`、`DEPLOY_KEY`、`DEPLOY_KNOWN_HOSTS`、`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`。后者仅注入 Build static website 步骤；本地 .env.local 不上传 GitHub。SSH 使用预先核实的 known_hosts，不关闭主机身份校验；部署账号需有 echo 目录写权限。不自动申请证书、不自动配置 Nginx、不清理历史版本。此工作流尚未在个人服务器实际部署验证。

## Mapbox 环境变量与开源提交

源码不再内嵌 Mapbox Token：`siteConfig.map.accessToken` 读取 `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`。

本地首次配置：`Copy-Item .env.example .env.local`，在 `.env.local` 填写自己创建的 `pk.` 公开 Token（已有文件时不要覆盖）。当前原配置里的公开 Token 已移入被忽略的 `.env.local`，建议更换为自己的受限公开 Token。`.env.example` 只有空值，可提交；`.env.local`、其他 `.env*` 仍被忽略。

GitHub 仓库 Settings → Secrets and variables → Actions 添加 `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`。工作流的 Build 步骤通过同名环境变量注入。如果之后替换成服务器部署工作流，也要保留该 Build env。静态网站在构建时嵌入变量，改值后需重新构建部署；仅在 Nginx 服务器设置环境变量无效。

公开 Token 必然可从网页和网络请求读取，环境变量用于避免源码内嵌，不是浏览器保密机制。Mapbox 控制台应限制允许的网站 URL 和权限；不能把 `sk.` 私密 Token 用于此项目。`next.config.ts` 在启动/构建时拒绝非 `pk.` 非空值；未配置时地图显示“地图暂未配置”，不发起 Mapbox 请求。地图仍无需后端。

若 GitHub 拦截历史提交中的私密 Token，先撤销并重新生成，再清理所有含该值的待推送提交；追加一个删除 Token 的提交不能清除历史。仅最后提交包含时，可暂存修复后 `git commit --amend --no-edit`；更早提交需交互式 rebase / 专项历史清理。当前工作目录没有 `.git`，本次没有改写提交、推送或绕过保护。GitHub 提示的 `2d8371e` 需要在实际仓库核实。

参考：[Mapbox Token 类型](https://docs.mapbox.com/help/getting-started/access-tokens/)、[GitHub 推送保护](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/work-with-leak-prevention/push-protection-on-the-command-line)。

## 个人社交入口与二维码

`siteConfig.socialLinks` 按用户提供顺序显示九个入口：GitHub、抖音橱窗、微信、抖音、微信公众号、Bilibili、Steam、Resume、Email。链接已替换为个人地址。`action: "link"` 打开链接，`action: "qrcode"` 弹出图片；名称、accent、图片路径和描述均在配置中。

将真实二维码放入 `public/qrcodes/douyin-shop.png` 和 `public/qrcodes/wechat.png`。缺图显示未上传提示，不生成替代二维码。图片不进入背景/照片优化脚本。`social-card.tsx` 使用原生 dialog + portal，支持关闭按钮、Esc 和点击遮罩关闭、模态焦点约束及关闭后恢复焦点；仅打开时加载图片。图标为 Lucide 语义图标和已有 Steam SVG，抖音采用音符、微信采用对话气泡，非官方品牌 SVG。组件使用现有 glass/system accent token，三列紧凑排列。

## GitHub 三年热力图

`siteConfig.github.years` 设为 3，展示含当前年在内的最近三个自然年（2026 年访问时为 2024—2026，当前年截止接口已有数据），并非向前精确滚动 36 个月。使用重复 `y` 参数一次请求多个年份，日期排序后连续绘制，标题汇总实际每日贡献，月份轴在跨年处标注年份。横向滚动查看历史，加载后默认滚到最新，保留逐日提示和可见时贪吃蛇动效。

接口说明：https://github.com/grubersjoe/github-contributions-api#time-selection

本项目的个人化修改记录于此，保留原版 README.md。

## 隐藏友链

首页 `src/app/page.tsx` 保留并注释 FriendsCard 导入和对应 BentoGridItem，组件与 `siteConfig.friends` 保留；取消两处注释即可恢复，隐藏时不占网格位置。

## 隐藏 VRChat

首页保留并注释 VRChatStatusCard 导入和网格项，ProfileCard 为桌面四列，不再向原作者状态接口轮询。恢复时取消两处注释，并将 ProfileCard 改回 `md:col-span-3`。部署备忘：[docs/VRCX_CLOUD_DEPLOYMENT.md](docs/VRCX_CLOUD_DEPLOYMENT.md)，需核实当前上游公开资料接口兼容性后再恢复。

## 手动内容列表（替代 Halo 文章）

`src/config/site.ts` 的 `blog.posts` 配置 `title`、`url`、`tags`、`updatedAt`，当前为“我的个人简历”及 `https://tmyyy.top/resume_zx/`，标签“简历”“关于我”。`updatedAt` 留空时隐藏时间，确认真实日期后填写 `YYYY-MM-DD`。按数组顺序展示，不自动排序。

`blog-card.tsx` 不再请求 Halo API、不显示阅读量和加载骨架。板块改名“我的内容”，社交栏原作者博客入口也换为个人简历。仅一条内容时右上角显示“查看简历”，多条时隐藏该快捷入口。列表紧凑排列，桌面网格占两行；若后续大量增加条目应同步调整占用行数。没有内容时卡片隐藏，但页面网格外层仍需按布局需求调整。

Halo 待实施文档：[docs/HALO_DEPLOYMENT.md](docs/HALO_DEPLOYMENT.md)。当前手动模式不能仅通过填写 Halo 域名恢复文章请求，后续需调整数据源。

## 足迹地图与上海距离起点

- `src/config/site.ts` 的 `map.markers` 已替换为 2022—2026 年的 57 个个人足迹地点，按提供顺序保留名称和 `visitedAt` 日期，点击标记可查看。
- 坐标为近似 WGS84 城市/县城中心；自治州使用州府位置，非实际旅行轨迹或精确到访位置。
- `map.origin` 配置距离起点，当前为上海市 `[121.4737, 31.2304]`，地图组件不再硬编码合肥。
- 初始地图视野中心改为 `[111.5, 31.0]`，缩放为 3，兼顾海南至长春的足迹。
- 距离为上海到访客定位的近似球面直线距离，弧线仅用于展示。标签位于弧线中点，未自动调整视野；零公里也显示。定位失败回退默认城市时，距离并不代表真实访客位置。

## 页面标题与天气默认城市

- `seo.title` 为 `Echo — ZX个人主页`，同时用于浏览器标题、Open Graph 和 Twitter 标题。
- 天气优先使用已授权的浏览器定位，其次使用 ipapi.co IP 定位，失败后回退三亚市（18.2528, 109.5119），通过 Open-Meteo 获取天气。
- `defaultWeatherLocation` 集中定义三亚默认值，`weather` 可覆盖；天气组件和定位 hook 不再各自硬编码合肥。
- 地图与天气共用定位 hook，因此定位失败时访客点也回退三亚；地图距离起点仍为上海。

## 背景与照片自动生成 WebP

脚本：`scripts/sync-images.mjs`。

在项目根目录执行：

```powershell
pnpm images:sync
```

也可以单独运行文件：

```powershell
node scripts/sync-images.mjs
```

脚本按自身位置解析项目路径，不依赖进程工作目录；在其他目录运行时请提供脚本的完整路径。

处理目录：

```text
public/bg/     → public/optimized/bg/
public/photos/ → public/optimized/photos/
```

支持 JPG、JPEG、PNG、WebP、AVIF，输出同名 WebP。保留原图，自动校正方向，最长边限制为 2560px，不放大小图，质量为 85；默认根据修改时间跳过未更新图片。

强制重新生成全部图片：

```powershell
pnpm images:sync --force
```

`pnpm dev` 和 `pnpm build` 都会先自动同步一次。开发期间新增图片后，需要重新同步并重启开发服务器，当前没有持续监听。

旧优化图不会自动删除。同名不同扩展名映射到同一个 WebP 文件时会报错，需要先重命名。脚本复用 Next.js 依赖中的 sharp，无需额外安装工具。
