# 二维码资源

放入自己的真实二维码图片：

- `douyin-shop.png`：抖音橱窗二维码。
- `wechat.png`：微信个人二维码。

路径为 `/qrcodes/douyin-shop.png` 和 `/qrcodes/wechat.png`，在 `src/config/site.ts` 的 `socialLinks` 中配置。替换为 JPG/WebP 时同步改 image 路径。保留图片四周留白，不裁掉二维码边缘。未放入图片时弹窗显示未上传提示。
