// ============================================================
// Site Configuration — Single Source of Truth
// ============================================================
// Edit this file to update all personal information on the homepage.
// No component code changes are needed.
// ============================================================

export type SystemAccent = "blue" | "green" | "orange" | "purple" | "red" | "mint";

export const defaultWeatherLocation = { city: "三亚市", lat: 18.2528, lon: 109.5119 };

export interface SiteConfig {
    profile: {
        name: string;
        title: string;
        /** Keyed by language prefix: "zh", "en", "ja", etc. "en" is the fallback. */
        description: Record<string, string>;
        avatar: string;
        aliases?: string[];  // Typewriter cycling names
        location?: string;
    };
    cardTitles: {
        interests: string;
        hardware: string;
        projects: string;
        blog: string;
        blogLink: string;
    };
    interests: {
        label: string;
        icon: string;
        accent: SystemAccent;
    }[];
    hardware: {
        category: string;
        icon: string;   // Lucide icon name: "Apple", "Monitor", etc.
        accent: SystemAccent;
        items: string[];
    }[];
    software: {
        name: string;
        icon: string;   // filename = /icons/software/{name}.svg | URL = CDN | "" = letter fallback
    }[];
    socialLinks: ({
        platform: "github" | "douyin-shop" | "wechat" | "douyin" | "wechat-public" | "bilibili" | "steam" | "resume" | "email";
        label: string;
        accent: SystemAccent;
        enabled: boolean;
    } & (
        | { action: "link"; url: string }
        | { action: "qrcode"; image: string; description: string }
    ))[];
    socialUi: { close: string; imageUnavailable: string };
    friends: {
        name: string;
        avatar: string;
        url: string;
        description?: string;
    }[];
    projects: {
        name: string;
        description: string;
        url: string;
        tags?: string[];
    }[];
    netease?: {
        /** 网易云曲目列表，包含完整元数据（无需运行时 API 请求） */
        tracks: {
            songId: number;
            name: string;
            artist: string;
            album: string;
            albumCover: string;
            duration: number; // ms
        }[];
    };
    github?: {
        /** GitHub 用户名，用于贡献热力图 */
        username: string;
        /** Number of calendar years including the current year. */
        years?: number;
    };
    blog?: {
        posts: {
            title: string;
            url: string;
            tags: string[];
            /** Actual update date in YYYY-MM-DD format; empty hides the date. */
            updatedAt?: string;
        }[];
    };
    vrchat?: {
        /** VRCX-Cloud 服务地址（公开接口 GET /api/public/profile，免鉴权） */
        apiBase: string;
        /** Bio 展示行数，默认 3 */
        bioLines?: number;
    };
    map?: {
        /** Mapbox public access token (pk.xxx) */
        accessToken: string;
        unavailableMessage: string;
        /** Map center: [lng, lat] */
        center: [number, number];
        /** Initial zoom level (1-18) */
        zoom: number;
        /** Distance origin: [longitude, latitude] */
        origin: { name: string; coordinates: [number, number] };
        /** City markers */
        markers: {
            name: string;
            coordinates: [number, number]; // [lng, lat]
            emoji?: string;
            visitedAt?: string;
        }[];
    };
    weather?: {
        city: string;
        lat: number;
        lon: number;
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
        ogImage?: string;
        siteUrl: string;
    };
    theme: {
        tintColor: string;
        tintColorRGB: string;
        gradientFrom: string;
        gradientVia: string;
        gradientTo: string;
    };
}

export const siteConfig: SiteConfig = {
    profile: {
        name: "张行",
        title: "Vibe Coding & Full-Stack Developer",
        description: {
            zh: "非常欢迎交流一些产品创意或用户角度上需求探讨。要永远对任何事物与逻辑抱有底层问题思考和吸收转化。带有批判性思维触及问题的核心。做爱做并且能持续满足自我的事情。",
            en: "Always open to discussing product ideas and exploring user-centric needs. Think critically, get to the core of every problem, and do what you love.",
            ja: "プロダクトのアイデアやユーザー視点のニーズについて、ぜひ交流しましょう。常に本質的な問い掛けを大切にしています。",
        },
        avatar: "/cat.png",
        aliases: ["张行", "Tmyyy", "脆脆鲨同学", "Echo"],
        location: "China Anhui | VRChat",
    },

    cardTitles: {
        interests: "Interests",
        hardware: "Hardware",
        projects: "Projects",
        blog: "我的内容",
        blogLink: "查看简历",
    },

    interests: [
        { label: "Vibe Coding", icon: "Code2", accent: "blue" },
        { label: "DIY", icon: "Wrench", accent: "orange" },
        { label: "Developer", icon: "Braces", accent: "green" },
        { label: "3D Print", icon: "Box", accent: "purple" },
        { label: "CS2", icon: "Crosshair", accent: "red" },
        { label: "VRChat", icon: "Headset", accent: "purple" },
        { label: "Unity", icon: "Boxes", accent: "blue" },
        { label: "Minecraft", icon: "Blocks", accent: "green" },
        { label: "OpenWrt", icon: "Router", accent: "mint" },
        { label: "Home Assistant", icon: "HousePlug", accent: "orange" },
        { label: "QQ Bot Dev", icon: "Bot", accent: "red" },
        { label: "ESXi Server", icon: "ServerCog", accent: "mint" },
    ],

    hardware: [
        { category: "Apple", icon: "Apple", accent: "blue", items: ["MacBook Pro M5", "Mac Mini M2", "Air Pods 3 Pro", "iPhone 15 Pro (Europe)"] },
        { category: "Desktop", icon: "Monitor", accent: "green", items: ["R7-9800X3D", "ROG RTX 5090 32G", "32GB DDR5", "ROG STRIX B650-A Gaming WIFI", "DELL R720XD Server | 100G | 22T"] },
        { category: "Peripherals", icon: "Keyboard", accent: "orange", items: ["Quest 3", "HHKB", "NIZ PLUM", "Razer DeathAdder V3", "Logitech G502", "Logitech M720"] },
        { category: "DIY & Maker", icon: "Printer", accent: "purple", items: ["Xtool M1 Ultra", "Bambu Lab A1 AMS", "Bambu Lab A1 mini AMS", "Snapmaker U1", "EPSON L8058"] },
        { category: "Wearable", icon: "Watch", accent: "red", items: ["Garmin Enduro 2"] },
        { category: "Network", icon: "Wifi", accent: "mint", items: ["GL·iNet AX1800", "GL·iNet MT3000", "N5105"] },
    ],


    software: [
        // IDE & Game Engine
        { name: "VS Code", icon: "vscode" },
        { name: "IntelliJ IDEA", icon: "intellij" },
        { name: "Unity", icon: "unity" },

        // AI & Productivity
        { name: "Antigravity", icon: "antigravity" },
        { name: "Codex", icon: "ChatGPT" },
        { name: "Notion", icon: "notion" },

        // DevOps & Terminal
        { name: "Docker", icon: "docker" },
        { name: "Homebrew", icon: "homebrew" },
        { name: "Tmux", icon: "tmux" },

        // Network & Proxy

        { name: "OpenVPN", icon: "OpenVPN" },
        { name: "Shadowsocks", icon: "Shadowsocks" },
        { name: "WireGuard", icon: "wireguard" },

        // Media
        { name: "网易云", icon: "netEase-cloud-music" },
    ],

    socialLinks: [
        { platform: "douyin", label: "抖音", accent: "red", action: "link", url: "https://www.douyin.com/user/MS4wLjABAAAAUVVECAqevlM2cyKAAM9LpPqY-BkY-Polw0ngN4I56Dc", enabled: true },
        { platform: "douyin-shop", label: "抖音橱窗", accent: "orange", action: "qrcode", image: "/qrcodes/douyin-shop.png", description: "使用抖音扫描二维码，查看我的橱窗", enabled: true },
        { platform: "wechat", label: "微信", accent: "green", action: "qrcode", image: "/qrcodes/wechat.png", description: "使用微信扫描二维码，添加我的微信", enabled: true },
        { platform: "bilibili", label: "Bilibili", accent: "blue", action: "link", url: "https://space.bilibili.com/455261981", enabled: true },
        { platform: "github", label: "GitHub", accent: "blue", action: "link", url: "https://github.com/tangmyy", enabled: true },
        { platform: "wechat-public", label: "微信公众号", accent: "green", action: "link", url: "https://mp.weixin.qq.com/s/UibNr_sOuPy--dgnmtg1hQ", enabled: true },
        { platform: "steam", label: "Steam", accent: "blue", action: "link", url: "https://steamcommunity.com/profiles/76561199202751480/", enabled: true },
        { platform: "resume", label: "Resume", accent: "purple", action: "link", url: "https://tmyyy.top/resume_zx/", enabled: true },
        { platform: "email", label: "Email", accent: "red", action: "link", url: "mailto:zx16689532246@163.com", enabled: true },
    ],
    socialUi: { close: "关闭二维码", imageUnavailable: "二维码图片暂未上传" },

    friends: [
        {
            name: "郭老师",
            avatar: "https://chaosgoo.com/images/Logo_Sketch.webp",
            url: "https://chaosgoo.com/",
            description: "郭老师带带我",
        },
        {
            name: "荟荟",
            avatar: "https://blog.nhui.top/content/uploadfile/202504/ad7b1745254714.jpg",
            url: "https://blog.nhui.top/",
            description: "男科大叫受荟荟",
        },
        {
            name: "李老板",
            avatar: "https://pbs.twimg.com/profile_images/2028353368008339456/o3OhBxWk_400x400.jpg",
            url: "https://leetfs.com/",
            description: "木桶饭糕手李老板",
        },
        {
            name: "光水",
            description: "光科长",
            avatar: "https://api.vrchat.cloud/api/1/file/file_c00911ce-3e53-4e98-a494-936811cc85a8/1/",
            url: "https://www.songzx.com/",
        },
        {
            name: "小路",
            avatar: "https://avatars.githubusercontent.com/u/8012410",
            url: "https://tun.cat",
        },
        {
            name: "Alumi",
            avatar: "https://lisek.cc/profile.png",
            url: "https://lisek.cc",
        },
    ],

    projects: [
        {
            name: "心率推送",
            description: "基于 Flutter 的跨平台 BLE 心率监控与推送工具，支持 HTTP/WS、OSC、MQTT 多协议实时推送，适用于 VRChat 模型联动。",
            url: "https://github.com/Ero-Cat/hr_push",
            tags: ["Flutter", "BLE", "OSC", "VRChat"],
        },
        {
            name: "Bento Homepage",
            description: "配置驱动的液态玻璃风格个人主页，集成网易云播放器、VRChat 实时状态、GitHub 热力图、3D Tilt 毛玻璃卡片、背景轮播、多头像轮播、多语言 i18n，支持 GitHub Pages 全静态部署。",
            url: "https://github.com/Ero-Cat/bento-Homepage",
            tags: ["Next.js", "React", "TypeScript", "Bento Grid"],
        },
        {
            name: "ESXi UPS Automation",
            description: "ESXi 服务器 UPS 断电自动化管理工具，支持 NUT 监控 UPS 状态并在断电时自动安全关闭虚拟机与宿主机，保障数据安全。",
            url: "https://github.com/Ero-Cat/ESXi-UPS-Automation",
            tags: ["ESXi", "UPS", "Automation", "Shell"],
        },
    ],

    netease: {
        tracks: [
            {
                songId: 1814460094,
                name: "Waves That Sound Like You",
                artist: "BigRicePiano",
                album: "Waves That Sound Like You",
                albumCover: "https://p1.music.126.net/N_1k-mBbHtEXz0z9Bvipzg==/109951165656563230.jpg",
                duration: 0,
            },
            {
                songId: 1408944670,
                name: "The Sound of Rain",
                artist: "BigRicePiano",
                album: "The Sound of Rain",
                albumCover: "https://p2.music.126.net/6Uk3QRGKLaCTvfOFXDKyLQ==/109951165017760372.jpg",
                duration: 0,
            },
            {
                songId: 1854700148,
                name: "晚",
                artist: "柠安",
                album: "晚",
                albumCover: "https://p1.music.126.net/o3m413wu0IE6MMDHaPBbUA==/109951166102809451.jpg",
                duration: 0,
            },
        ],
    },

    github: {
        years: 3,
        username: "tangmyy",
    },

    blog: {
        posts: [
            {
                title: "我的个人简历",
                url: "https://tmyyy.top/resume_zx/",
                tags: ["简历", "关于我"],
                updatedAt: "", // Fill in the actual update date, e.g. YYYY-MM-DD.
            },
        ],
    },

    vrchat: {
        apiBase: "https://vrcx-cloud.iacg.moe",
        bioLines: 5,
    },

    map: {
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "",
        unavailableMessage: "地图暂未配置",
        center: [111.5, 31.0],
        zoom: 3,
        origin: { name: "上海市", coordinates: [121.4737, 31.2304] },
        // Approximate WGS84 city/county centers; prefectures use their administrative seats.
        markers: [
            { name: "三亚市", coordinates: [109.5119, 18.2528], visitedAt: "2004.06.14" },
            { name: "海口市", coordinates: [110.1983, 20.0440], visitedAt: "2022.02.11" },
            { name: "儋州市", coordinates: [109.5807, 19.5209], visitedAt: "2022.07.15" },
            { name: "上海市", coordinates: [121.4737, 31.2304], visitedAt: "2022.10.04" },
            { name: "乐东黎族自治县", coordinates: [109.1731, 18.7503], visitedAt: "2023.01.24" },
            { name: "苏州市", coordinates: [120.5853, 31.2989], visitedAt: "2023.04.28" },
            { name: "南京市", coordinates: [118.7969, 32.0603], visitedAt: "2023.07.08" },
            { name: "郑州市", coordinates: [113.6254, 34.7466], visitedAt: "2024.07.17" },
            { name: "威海市", coordinates: [122.1204, 37.5131], visitedAt: "2024.07.22" },
            { name: "贵阳市", coordinates: [106.6302, 26.6470], visitedAt: "2024.08.26" },
            { name: "黔东南苗族侗族自治州", coordinates: [107.9829, 26.5834], visitedAt: "2024.08.26" },
            { name: "扬州市", coordinates: [119.4127, 32.3942], visitedAt: "2024.12.31" },
            { name: "宣城市", coordinates: [118.7591, 30.9393], visitedAt: "2025.01.17" },
            { name: "芜湖市", coordinates: [118.4331, 31.3525], visitedAt: "2025.01.18" },
            { name: "合肥市", coordinates: [117.2272, 31.8206], visitedAt: "2025.01.18" },
            { name: "马鞍山市", coordinates: [118.5068, 31.6705], visitedAt: "2025.01.18" },
            { name: "六安市", coordinates: [116.5219, 31.7337], visitedAt: "2025.01.18" },
            { name: "信阳市", coordinates: [114.0913, 32.1470], visitedAt: "2025.01.19" },
            { name: "南阳市", coordinates: [112.5283, 32.9908], visitedAt: "2025.01.19" },
            { name: "驻马店市", coordinates: [114.0223, 33.0115], visitedAt: "2025.01.19" },
            { name: "蚌埠市", coordinates: [117.3890, 32.9160], visitedAt: "2025.02.23" },
            { name: "嘉兴市", coordinates: [120.7555, 30.7461], visitedAt: "2025.03.06" },
            { name: "湖州市", coordinates: [120.0870, 30.8942], visitedAt: "2025.04.03" },
            { name: "无锡市", coordinates: [120.3119, 31.4912], visitedAt: "2025.04.04" },
            { name: "常州市", coordinates: [119.9741, 31.8112], visitedAt: "2025.04.04" },
            { name: "黄冈市", coordinates: [114.8724, 30.4537], visitedAt: "2025.07.11" },
            { name: "鄂州市", coordinates: [114.8948, 30.3919], visitedAt: "2025.07.11" },
            { name: "武汉市", coordinates: [114.3055, 30.5928], visitedAt: "2025.07.11" },
            { name: "铜陵市", coordinates: [117.8121, 30.9454], visitedAt: "2025.07.11" },
            { name: "池州市", coordinates: [117.4916, 30.6648], visitedAt: "2025.07.11" },
            { name: "安庆市", coordinates: [117.0638, 30.5435], visitedAt: "2025.07.11" },
            { name: "孝感市", coordinates: [113.9169, 30.9246], visitedAt: "2025.07.13" },
            { name: "仙桃市", coordinates: [113.4545, 30.3626], visitedAt: "2025.07.13" },
            { name: "潜江市", coordinates: [112.9001, 30.4019], visitedAt: "2025.07.13" },
            { name: "荆州市", coordinates: [112.2397, 30.3352], visitedAt: "2025.07.14" },
            { name: "宜昌市", coordinates: [111.2865, 30.6919], visitedAt: "2025.07.14" },
            { name: "恩施土家族苗族自治州", coordinates: [109.4882, 30.2722], visitedAt: "2025.07.14" },
            { name: "重庆市", coordinates: [106.5516, 29.5630], visitedAt: "2025.07.17" },
            { name: "铜仁市", coordinates: [109.1896, 27.7315], visitedAt: "2025.07.17" },
            { name: "遵义市", coordinates: [106.9274, 27.7257], visitedAt: "2025.07.17" },
            { name: "毕节市", coordinates: [105.2839, 27.3026], visitedAt: "2025.07.17" },
            { name: "六盘水市", coordinates: [104.8304, 26.5925], visitedAt: "2025.07.17" },
            { name: "曲靖市", coordinates: [103.7962, 25.4900], visitedAt: "2025.07.18" },
            { name: "昆明市", coordinates: [102.8329, 24.8801], visitedAt: "2025.07.18" },
            { name: "百色市", coordinates: [106.6182, 23.9023], visitedAt: "2025.07.21" },
            { name: "钦州市", coordinates: [108.6541, 21.9809], visitedAt: "2025.07.22" },
            { name: "北海市", coordinates: [109.1202, 21.4813], visitedAt: "2025.07.22" },
            { name: "南宁市", coordinates: [108.3669, 22.8170], visitedAt: "2025.07.22" },
            { name: "湛江市", coordinates: [110.3594, 21.2707], visitedAt: "2025.07.23" },
            { name: "定安县", coordinates: [110.3593, 19.6812], visitedAt: "2025.07.24" },
            { name: "琼海市", coordinates: [110.4746, 19.2591], visitedAt: "2025.07.24" },
            { name: "万宁市", coordinates: [110.3911, 18.7951], visitedAt: "2025.07.24" },
            { name: "陵水黎族自治县", coordinates: [110.0372, 18.5060], visitedAt: "2025.07.24" },
            { name: "成都市", coordinates: [104.0657, 30.5723], visitedAt: "2026.02.10" },
            { name: "阿坝藏族羌族自治州", coordinates: [102.2247, 31.8994], visitedAt: "2026.02.10" },
            { name: "济南市", coordinates: [117.1201, 36.6512], visitedAt: "2026.09.01" },
            { name: "长春市", coordinates: [125.3235, 43.8171], visitedAt: "2026.10.17" },
        ],
    },

    weather: { ...defaultWeatherLocation },

    seo: {
        title: "Echo — ZX个人主页",
        description:
            "EroCat（大黄猫）的个人主页 — Full-Stack Developer & Vibe Coder。热衷 Spring Boot、Unity、3D 打印、DIY、VRChat、Home Assistant 智能家居，以及各种折腾服务器与网络。欢迎交流产品创意与技术探讨。",
        keywords: [
            "EroCat", "大黄猫", "DoKiDoKi",
            "全栈开发", "Full-Stack Developer", "Vibe Coding",
            "Spring Boot", "Next.js", "React", "TypeScript",
            "Unity", "VRChat", "3D Print",
            "DIY", "Home Assistant", "OpenWrt", "ESXi",
            "个人主页", "portfolio",
        ],
        ogImage: "/cat.png",
        siteUrl: "https://iacg.moe",
    },

    theme: {
        tintColor: "#ff375f",
        tintColorRGB: "255, 55, 95",
        gradientFrom: "#000000",
        gradientVia: "#090909",
        gradientTo: "#111116",
    },
};
