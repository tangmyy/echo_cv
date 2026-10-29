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
        icon: string;   // 本地文件名（省略扩展名时为 SVG）、/public路径对应的URL、远程URL；空值显示首字
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
    geolocation: {
        ipProviders: { name: string; url: string }[];
        timeoutMs: number;
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
            zh: "请永远带着批判性思维去做热爱并且能持续满足自我的事情。拆掉常识的外壳，直达真理的底层逻辑，再从那里重新构建世界。",
            en: "Always think critically as you pursue what you love and what brings you lasting fulfillment. Strip away the shell of conventional wisdom, reach the fundamental logic underlying truth, and rebuild the world from there.",
            ja: "いつも批判的思考を忘れずに、心から好きで、自分を満たし続けてくれることに取り組もう。常識の殻を取り払い、真理を支える根本の論理に迫り、そこから世界を組み立て直そう。",
        },
        avatar: "/sheep.png",
        aliases: ["张行", "Tmyyy", "脆脆鲨同学", "Echo"],
        location: "China Sanya | Cycling",
    },

    cardTitles: {
        interests: "Interests",
        hardware: "Hardware",
        projects: "Projects",
        blog: "Blog",
        blogLink: "Blog Home",
    },

    interests: [
        { label: "Vibe Coding", icon: "Code2", accent: "blue" },
        { label: "Developer", icon: "Braces", accent: "green" },
        { label: "Photography", icon: "Camera", accent: "purple" },
        { label: "Video Editing", icon: "Clapperboard", accent: "orange" },
        { label: "Travel", icon: "Plane", accent: "blue" },
        { label: "Cycling", icon: "Bike", accent: "mint" },
        { label: "Mechanics", icon: "Cog", accent: "orange" },
        { label: "Fitness", icon: "Dumbbell", accent: "red" },
        { label: "Reading", icon: "BookOpen", accent: "green" },
        { label: "Podcasts", icon: "Podcast", accent: "purple" },
        { label: "Thinking", icon: "Brain", accent: "mint" },
        { label: "Rubik’s Cube", icon: "Cuboid", accent: "orange" },
    ],

    hardware: [
        { category: "Apple", icon: "Apple", accent: "blue", 
            items: ["MacBook Pro", 
                    "iPad Pro 2020", 
                    "iPhone 13 ProMax (America)", 
                    "Air Pods 3 Pro",
                ] 
        },
        {
            category: "Desktop", icon: "Monitor", accent: "green",
            items: [
                "ROG Strix G614JI",
                "Intel Core i9-13980HX",
                "32GB DDR5",
                "RTX 4070 8GB",
                "Tencent Cloud Server | 2 vCPU | 2GB RAM",
            ],
        },
        {
            category: "Peripherals", icon: "Keyboard", accent: "orange",
            items: [
                "Bat Rider BK75Plus",
                "Logitech G502X",
                "DJI Action 5 Pro",
                "DJI Pocket 3",
                "Insta 360 X5",
            ],
        },
        {
            category: "Motorcycles", icon: "Motorbike", accent: "purple",
            items: [
                "Suzuki GSX250R",
                "Aprilia GPR250R",
                "VOGE CU525",
                "VOGE CU625",
                "Zontes 703F",
            ],
        },
    ],


    software: [
        { name: "VS Code", icon: "vscode" },
        { name: "IntelliJ IDEA", icon: "intellij" },
        { name: "IntelliJ PyCharm", icon: "pycharm.png" },
        { name: "codeblocks", icon: "codeblocks.png" },
        { name: "HBuilder X", icon: "hbuilderx.png" },
        { name: "微信开发者工具", icon: "wechat-devtools.png" },
        { name: "GitKraken", icon: "gitkraken.png" },
        { name: "Apifox", icon: "apifox.png" },
        { name: "Obsidian", icon: "obsidian.png" },
        { name: "滴答清单", icon: "ticktick.png" },
        { name: "Cursor", icon: "cursor.png" },
        { name: "Codex", icon: "ChatGPT" },
        { name: "Adobe Bridge", icon: "adobe-bridge.png" },
        { name: "DaVinci Resolve", icon: "davinci-resolve.png" },
        { name: "剪映专业版", icon: "jianying.png" },
        { name: "Insta360 Studio", icon: "insta360-studio.png" },
        { name: "夸克网盘", icon: "quark.png" },
        { name: "WPS Office", icon: "wps.png" },
        { name: "abcVPN", icon: "abcvpn.png" },
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


    projects: [
        {
            name: "ShayuVideo API",
            description: "鲨鱼视频 Java 后端，提供视频发布、评论点赞、关注关系、异步消息通知及举报申诉接口，为用户端和管理后台提供服务。",
            url: "https://github.com/tangmyy/ShayuVideo_api",
            tags: ["Spring Boot", "MyBatis", "Redis", "RabbitMQ"],
        },
        {
            name: "ShayuVideo Admin",
            description: "鲨鱼视频 Web 管理后台，支持用户、视频和评论管理，提供内容审核、举报申诉处理及运营数据统计。",
            url: "https://github.com/tangmyy/ShayuVideo_admin",
            tags: ["Vue 3", "Vite", "Element Plus", "Pinia"],
        },
        {
            name: "ShayuVideo APP",
            description: "鲨鱼视频用户客户端，支持短视频浏览与发布、评论点赞、关注和消息通知，视频通过 uniCloud 上传。",
            url: "https://github.com/tangmyy/ShayuVideo_APP",
            tags: ["uni-app", "Vue 2", "nvue", "uniCloud"],
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
                title: "个人简历-软件开发工程师",
                url: "https://tmyyy.top/resume_zx/",
                tags: ["简历", "软件开发"],
                updatedAt: "2026-10-01", // Fill in the actual update date, e.g. YYYY-MM-DD.
            },
        ],
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
    
    geolocation: {
        ipProviders: [
            { name: "GeoJS", url: "https://get.geojs.io/v1/ip/geo.json" },
            { name: "IPWHOIS", url: "https://ipwho.is/" },
        ],
        timeoutMs: 4000,
    },

    weather: { ...defaultWeatherLocation },

    vrchat: {
        apiBase: "https://vrcx-cloud.iacg.moe",
        bioLines: 5,
    },
    friends: [
        {
            name: "郭老师",
            avatar: "https://chaosgoo.com/images/Logo_Sketch.webp",
            url: "https://chaosgoo.com/",
            description: "郭老师带带我",
        },
    ],


    seo: {
        title: "Echo — ZX个人主页",
        description:
            "Echo（ZX）的个人主页 — Full-Stack Developer & Vibe Coder。热衷Vibe Coding、骑行、视频拍摄与剪辑、以及各种折腾服务器，欢迎交流产品创意与技术探讨。",
        keywords: [
            "Echo", "Tmyyy", "脆脆鲨同学",
            "全栈开发", "个人主页", "CV",
        ],
        ogImage: "/sheep.png",
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
