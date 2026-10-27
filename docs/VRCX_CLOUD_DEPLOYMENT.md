# VRCX-Cloud 部署备忘

编写日期：2026-10-26。未连接服务器，未实际部署。当前主页已隐藏 VRChat 卡片，恢复时再配置个人服务。

## 1. 确认项目与服务器条件

本主页对应的是 **Ero-Cat/VRCX-Cloud**，不是同名的其他 Node.js 项目：

- 项目：https://github.com/Ero-Cat/VRCX-Cloud
- Compose：https://github.com/Ero-Cat/VRCX-Cloud/blob/master/docker-compose.yml
- 环境变量：https://github.com/Ero-Cat/VRCX-Cloud/blob/master/.env.example

查阅时该版本以 Rust 服务提供网页，配合独立 PostgreSQL；客户端配套 Ero-Cat/vrcx-0。后续主分支可能变化，实际执行时检查 README、Compose 和 `.env.example`，记录 `git rev-parse HEAD`，不要混用不同分支教程。

当前服务器是 CentOS 7、无宝塔。先按 [Halo 部署备忘](HALO_DEPLOYMENT.md) 第 1 节检查 Docker、Compose、内核、端口、内存和架构；CentOS 7 已停止维护，不能假设最新容器或本机 Rust/Node 工具链兼容。建议在受支持的新系统部署并测试，保留现有网站。下文以已有可用 Docker Compose 为前提，不提供旧系统的未经验证安装组合。

## 2. 访问方式

这是持有完整 VRChat 登录会话的私人管理工具，不要把完整管理页面当成公开状态展示接口。建议先只监听回环地址，通过 SSH 隧道或 VPN 访问，完成验证后再设计 HTTPS 及身份保护。

公开主页只能读取经过核实的只读资料接口；不能将管理密码、Cookie、数据库密码放进 `site.ts` 或浏览器请求。

## 3. 获取代码

在服务器的独立工作目录执行：

```bash
git clone https://github.com/Ero-Cat/VRCX-Cloud.git
cd VRCX-Cloud
git rev-parse HEAD
cp .env.example .env
chmod 600 .env
```

只首次复制 `.env`，不要升级时覆盖已有密码。生成两个不同密码：

```bash
openssl rand -hex 32
openssl rand -hex 32
```

编辑 `.env`，使用实际生成值：

```dotenv
VRCX_CLOUD_SYNC_HOST=db
VRCX_CLOUD_SYNC_PORT=5432
VRCX_CLOUD_SYNC_USER=vrcx
VRCX_CLOUD_SYNC_DATABASE=vrcx
VRCX_CLOUD_SYNC_PASSWORD=替换为数据库密码
VRCX_CLOUD_ADMIN_PASSWORD=替换为另一个管理密码
VRCX_CLOUD_SYNC_ALLOW_PLAINTEXT=true
VRCX_CLOUD_REALTIME_MODE=auto
```

这里的 `db` 是下一节自定义 Compose 的服务名；如果使用已有远程 PostgreSQL，改为容器实际能访问的私网地址，并配置该库的独立用户、数据库、访问规则和 TLS。容器内的 `127.0.0.1` 不是宿主机。

## 4. 单独的部署编排（拟定方案）

上游 Compose 需要自备数据库，并映射所有网卡上的 8800。下面是针对首次测试拟定的独立编排，添加数据库并限制端口，不覆盖上游文件。**此自定义组合尚未在你的机器验证。**

在克隆目录中新建 `compose.private.yaml`：

```yaml
services:
  db:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_USER: vrcx
      POSTGRES_DB: vrcx
      POSTGRES_PASSWORD: ${VRCX_CLOUD_SYNC_PASSWORD:?Set database password}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vrcx -d vrcx"]
      interval: 10s
      timeout: 5s
      retries: 10

  app:
    build: .
    restart: unless-stopped
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "127.0.0.1:8800:8800"
    volumes:
      - app-data:/data

volumes:
  db-data:
  app-data:
```

此方案的数据库仅在 Docker 内部网络开放，明文连接限同主机容器网络；不适合直接用于公网远程数据库。官方构建可能下载较多 Rust/前端依赖，请预留磁盘与编译内存。若构建失败，保留日志检查版本、网络和内存，不删除数据卷。

## 5. 启动和检查

后续命令始终带 `-f compose.private.yaml`，避免误启动上游的公网端口编排：

```bash
sudo docker compose -f compose.private.yaml config --quiet
sudo docker compose -f compose.private.yaml up -d --build
sudo docker compose -f compose.private.yaml ps
sudo docker compose -f compose.private.yaml logs --tail=100 app
curl -i http://127.0.0.1:8800/healthz
```

预期健康接口返回 JSON。若长期不能进入运行状态，检查日志、数据库认证及网络，再检查旧宿主机兼容性；不要将无响应直接当成账号离线。

## 6. 本机访问、VRChat 登录

在个人电脑另开终端建立 SSH 隧道，替换 SSH 用户名和地址：

```powershell
ssh -N -L 18800:127.0.0.1:8800 用户名@服务器地址
```

保持该终端运行，浏览器打开 `http://127.0.0.1:18800`。按实际版本页面提示先解锁管理员门禁，再登录自己的 VRChat 账号，处理邮件或 TOTP 二次验证。登录资料不要写进仓库。

可先测试网页功能，再决定是否让桌面客户端同步。桌面同步是可选后续工作；它需要安全访问同一个 PostgreSQL。本文内部数据库并未暴露到公网，因此不能直接把服务器公网 IP 填入桌面软件期待连通。应先设计 VPN/受限端口/TLS 方案，或使用已有的安全私网数据库。

## 7. 接回主页前必须核实公开接口

现有主页组件期望：

```text
GET /api/public/profile
```

返回结构大致为：

```json
{
  "ok": true,
  "profile": {
    "id": "个人账号ID",
    "displayName": "个人昵称",
    "status": "active"
  }
}
```

本次查阅的上游 README 未明确说明该路由，根目录 `PUBLIC-API.md` 也未能读取成功，因此**不能保证最新 master 部署后就能满足主页接口**，原作者线上服务可能使用不同提交。

部署前在克隆代码中搜索并读路由：

```bash
git grep -n 'public/profile'
git grep -n 'public_profile'
```

登录后本机测试：

```bash
curl -i http://127.0.0.1:8800/api/public/profile
```

若返回 404、登录页面 HTML、要求管理身份或字段不匹配，应定位兼容版本或实现专用只读适配接口，而不是把管理接口直接暴露给主页。`ok:false` 与 HTTP 错误都应检查，不伪造在线状态。

公开接入时需准备有效 HTTPS 域名、精确允许主页 origin 的 CORS；反向代理只开放已审查的公开 GET 资料路径，其余管理/API/WebSocket 路径继续通过 VPN 或隧道访问。具体配置等路由行为和真实域名确认后再写，避免错误白名单。

接入确认后，再把 `siteConfig.vrchat.apiBase` 改为个人服务并恢复首页卡片。当前卡片每 15 秒轮询，短暂失败保留旧数据，不能理解为严格实时在线保证。

## 8. 备份与升级

备份 `.env`、部署编排、Git 提交号、应用数据卷和 PostgreSQL。包含登录会话和密码，存放于私有备份目录。数据库使用 `pg_dump` 做一致性逻辑备份；不要只复制运行中的数据库目录。

升级前先备份并记录提交号，在测试环境验证服务、账号会话、同步与公开接口。手动更新使用 `git pull --ff-only` 后重新构建，但不要将它当成无审核自动更新命令。不要执行 `down -v`，该参数会删除持久数据卷。迁移主机时还需核实上游会话加密机制是否要求重新登录。

## 9. 与音乐卡片的区别

VRCX-Cloud 需要后台进程持有个人账号会话；当前音乐卡片不依赖这个服务，直接由浏览器播放配置中的网易云歌曲外链，互不关联。

参考来源：上方列出的上游仓库、Compose 和 `.env.example`。本文只记录待实施步骤；受限于 CentOS 7 环境与未验证的公开接口，不能视为部署成功或接口兼容证明。
