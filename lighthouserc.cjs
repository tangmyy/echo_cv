module.exports = {
  ci: {
    collect: {
      // 检测正式构建导出的静态网页。
      staticDistDir: "./out",

      // 只检测首页，避免自动检测 404 等其他页面。
      url: ["http://localhost/"],

      // 同一页面检测三次，便于观察波动。
      numberOfRuns: 3,

      settings: {
        // 使用移动端模拟设置。
        formFactor: "mobile",
      },
    },

    upload: {
      // 将报告保存为文件，不需要部署 Lighthouse CI 服务。
      target: "filesystem",

      // HTML 和 JSON 报告的输出目录。
      outputDir: "./lighthouse-reports",
    },
  },
};