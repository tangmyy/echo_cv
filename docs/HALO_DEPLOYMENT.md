# Halo 部署备忘：CentOS 7、无面板服务器

编写日期：2026-10-26。本文只保存后续实施方案，未连接服务器、未安装服务、未修改 DNS。示例域名 `blog.tmyyy.top` 尚未确认启用。执行前重新检查官方版本和服务器实际环境。

## 1. 先确认 CentOS 7 的环境边界

CentOS Linux 7 于 2024-06-30 停止维护。当前 Docker 官方 CentOS 安装文档列出的是 Stream 9/10，不包含 CentOS 7：

- https://www.centos.org/centos-linux/
- https://docs.docker.com/engine/install/centos/

因此不要直接在现有生产机运行最新版 Docker 一键安装脚本，也不要直接套用下文的 dnf 命令。Docker 容器共用宿主机内核，不会自动解决旧内核兼容性。

先通过 SSH 登录，执行只读检查：

```bash
cat /etc/centos-release
uname -r
uname -m
free -h
df -h
docker version
docker compose version
docker info
nginx -v
sudo ss -lntp
getenforce
```

个别命令不存在是正常的，记录结果。重点确认：系统版本/架构、剩余内存和磁盘、已有 Docker 与 Compose、80/443/8090 端口是否占用。本文建议给应用与数据库预留至少 2GB 内存，实际还需考虑现有服务占用。

两条实施路径：

1. **已有可工作的 Docker + Compose**：先创建服务器快照、备份现有网站，在测试环境验证下文镜像能够启动，再考虑继续；这不代表 CentOS 7 获得官方支持。遇到内核、glibc、运行时或镜像兼容错误，停止并迁移，不通过关闭安全机制强行启动。
2. **没有 Docker，或现有运行时不能启动镜像**：优先新增一台受支持系统的服务器（例如 CentOS Stream 9），部署好再切换子域名。不要为部署博客直接重装承载现有网站的服务器。本文不提供未经验证的 CentOS 7 历史 Docker 包安装组合。

后面的 Compose/Nginx 步骤适用于已验证兼容的运行环境；第 2 节安装命令仅适用于新建的 Stream 9 主机。

## 2. 新主机安装 Docker（仅 CentOS Stream 9）

已有可用 Docker 时跳过。安装前确认不是 CentOS 7，并核对 Docker 官方安装文档。存在旧容器时先制定迁移方案，不盲目卸载容器运行时。

```bash
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo docker run --rm hello-world
sudo docker compose version
```

下文 Docker 命令使用 sudo，避免假设普通用户已有 Docker socket 权限。

## 3. 域名与网络

在 `tmyyy.top` 的 DNS 管理控制台增加 `blog` 的 A 记录，值为部署 Halo 的服务器公网 IPv4。只有服务器确实配置可用 IPv6 时才增加 AAAA 记录。

验证：

```bash
getent ahosts blog.tmyyy.top
```

公网开放 HTTP 80、HTTPS 443。Halo 8090 只绑定本机，数据库不映射公网端口。云安全组和服务器防火墙都要检查，保留现有 SSH 放行规则；不要清空整个防火墙。

如果 firewalld 已在运行，可按实际网络区域增加 HTTP/HTTPS（先用 `firewall-cmd --get-active-zones` 确认区域；下列命令作用于默认区域）：

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

如果已有其他防火墙管理方式，沿用原有方式。域名使用独立子域名，不配置为 `tmyyy.top/blog/`：Halo 官方不支持子目录代理。

## 4. 创建部署目录与密码

以下命令在部署主机执行，使用独立目录，不写入现有网站目录：

```bash
mkdir -p ~/halo
cd ~/halo
umask 077
printf 'HALO_DB_PASSWORD=%s\n' "$(openssl rand -hex 32)" > .env
chmod 600 .env
```

仅首次执行密码生成命令。数据库初始化后不要随意重建 `.env`：修改环境变量并不会自动修改数据库内已有用户密码。`.env` 和备份都不要提交到 Git。

创建 `~/halo/compose.yaml`，写入：

```yaml
services:
  db:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_DB: halo
      POSTGRES_USER: halo
      POSTGRES_PASSWORD: ${HALO_DB_PASSWORD:?Set HALO_DB_PASSWORD in .env}
    volumes:
      - ./postgres:/var/lib/postgresql/data:Z
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U halo -d halo"]
      interval: 10s
      timeout: 5s
      retries: 10

  halo:
    image: registry.fit2cloud.com/halo/halo:2.27
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "127.0.0.1:8090:8090"
    volumes:
      - ./halo2:/root/.halo2:Z
    environment:
      JVM_OPTS: -Xms256m -Xmx512m
      SPRING_R2DBC_URL: r2dbc:pool:postgresql://db:5432/halo
      SPRING_R2DBC_USERNAME: halo
      SPRING_R2DBC_PASSWORD: ${HALO_DB_PASSWORD:?Set HALO_DB_PASSWORD in .env}
      SPRING_SQL_INIT_PLATFORM: postgresql
      HALO_EXTERNAL_URL: https://blog.tmyyy.top
```

镜像使用 Halo 社区版 `halo`，不是 `halo-pro`。`2.27` 是查阅官方文档时的示例系列，实施时核对发布说明并固定合适版本；不要未经备份直接跨大版本升级 PostgreSQL。`:Z` 用于独占数据目录的 SELinux 标签，不能用于共享的系统目录。

配置以 Halo 官方 Compose 模板为依据，采用独立密码文件和回环端口绑定，尚未在你的机器验证：
https://docs.halo.run/guide/install/docker-compose

## 5. 启动与本机验证

```bash
cd ~/halo
sudo docker compose config --quiet
sudo docker compose pull
sudo docker compose up -d
sudo docker compose ps
sudo docker compose logs --tail=100 halo
curl -I http://127.0.0.1:8090/console/
```

首次启动可能需要初始化数据库。先确认数据库 healthy、Halo 日志没有持续异常，再配置公网访问。HTTP 返回跳转也可能正常，重点是不应连接拒绝或持续 5xx。

镜像下载失败先检查网络、DNS、镜像库访问；不要以删除数据目录作为排错方式。

## 6. Nginx 反向代理和 HTTPS

已经运行 Nginx 时复用现有实例，先备份它的配置并检查 `nginx -T`，不覆盖现有主站配置。新建 Stream 9 主机可执行：

```bash
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

CentOS 7 上不要照抄这两条安装命令；若没有 Nginx，优先完成受支持系统的准备。

通过受信任的证书服务申请 `blog.tmyyy.top` 证书；可以使用云厂商证书控制台的 DNS 验证方式。将完整证书链和私钥安全放到：

```text
/etc/nginx/ssl/blog.tmyyy.top/fullchain.pem
/etc/nginx/ssl/blog.tmyyy.top/privkey.pem
```

证书文件需包含中间证书，私钥限制为 root 可读。证书应在启用下面的 HTTPS 配置前准备好；记录到期日与续期流程。若使用 ACME 客户端自动签发，遵循所选客户端当前官方说明，并为续期成功后配置 Nginx reload。

创建独立配置 `/etc/nginx/conf.d/halo.conf`（确认没有同域名配置）：

```nginx
server {
    listen 80;
    server_name blog.tmyyy.top;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name blog.tmyyy.top;
    ssl_certificate /etc/nginx/ssl/blog.tmyyy.top/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/blog.tmyyy.top/privkey.pem;
    client_max_body_size 100m;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

检查后再加载：

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -I https://blog.tmyyy.top/console/
```

SELinux enforcing 下若 Nginx 连接本机上游被拒绝，先检查审计日志；确认是网络连接策略阻止后，可开启所需布尔项（不要全局关闭 SELinux）：

```bash
sudo setsebool -P httpd_can_network_connect 1
```

## 7. 初始化和发布

访问 `https://blog.tmyyy.top/console/`，创建管理员、设置站点信息、选择主题，发布一篇公开测试文章并设置分类。记录管理员密码。确认外部访问地址为 HTTPS 博客域名。

从浏览器及命令行检查公开列表接口：

```bash
curl -i 'https://blog.tmyyy.top/apis/api.content.halo.run/v1alpha1/posts?size=8&sort=spec.publishTime%2Cdesc'
```

应返回包含 `items` 的 JSON。分类、发布时间由 Halo 管理，不由个人主页推测。

## 8. 将来接回个人主页

**当前仓库已改为手动内容模式，仅修改 blog.url 不会恢复 Halo 接口。** 当前 `siteConfig.blog.posts` 保存简历入口，不请求 Halo。

届时需要明确决定保留简历列表还是增加 Halo 文章源，修改 `SiteConfig` 和 `blog-card.tsx`，增加响应状态处理、空态/错误态区分，并用 `new URL(permalink, blogUrl)` 兼容相对/绝对文章地址。不要直接粘回旧原作者域名。

主页与博客不同源时还需处理 CORS。先确认个人主页最终 origin（例如 `https://tmyyy.top`）及 Halo 当前版本跨域配置；浏览器开发者工具 Network 中验证。`curl` 成功并不能证明浏览器跨域成功。

如果使用 Nginx 为**公开 GET 列表接口**添加跨域响应头，需要限定到准确主页 origin、只配置在该公开接口 location，并避免与 Halo 自带 CORS 头重复。不要给 `/console` 或管理接口全局添加 `Access-Control-Allow-Origin: *`。具体配置等接回时结合真实 origin 和 Halo 响应头决定。

## 9. 备份、升级与回退

应同时备份数据库、`halo2`（附件/主题/插件）、Compose 文件和 `.env`。数据库运行时直接复制其数据目录不保证一致性，可使用逻辑备份：

```bash
cd ~/halo
umask 077
mkdir -p backups
sudo docker compose stop halo
sudo docker compose exec -T db pg_dump -U halo -d halo > backups/halo.sql
tar -czf backups/halo-files.tar.gz halo2 compose.yaml .env
sudo docker compose start halo
```

检查每条命令成功、备份非空，并保留带日期的多份副本；上述固定文件名再次执行会覆盖同名备份，实际计划任务应加入时间戳。文件权限导致 tar 失败时用有权限的账号操作。下载一份异地保存，备份含密码和私有内容，不放入 public 目录。

升级前查看 Halo 发布说明，制作备份并在测试环境验证；修改镜像版本，再运行 `sudo docker compose pull` 和 `sudo docker compose up -d`。升级可能修改数据库结构，因此回退不只是改回镜像标签，必要时要恢复升级前数据库与文件。不要执行 `down -v` 或删除数据库目录来解决启动问题。

## 10. 常见问题

| 现象 | 检查方向 |
|---|---|
| 容器启动就退出 | Docker/内核兼容性、内存、数据库密码、日志 |
| 公网打不开 | DNS、云安全组、防火墙、Nginx监听、证书 |
| Nginx 502 | 本机8090、Halo状态、SELinux审计日志 |
| 上传失败413 | Nginx上传大小及Halo附件策略 |
| API有JSON但主页失败 | CORS、请求地址、前端是否已恢复Halo数据源 |
| API文章列表为空 | 是否发布为公开文章、查询参数 |

## 官方参考

- Halo 环境说明：https://docs.halo.run/guide/prepare
- Halo Compose：https://docs.halo.run/guide/install/docker-compose
- Docker CentOS：https://docs.docker.com/engine/install/centos/
- CentOS 生命周期：https://www.centos.org/centos-linux/

本文是待实施方案，不是服务器部署成功记录。将来执行前需要重新核实镜像版本、Docker支持范围、DNS、HTTPS证书和CORS。
