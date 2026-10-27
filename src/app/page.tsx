import fs from "node:fs";
import path from "node:path";
import { BentoGrid, BentoGridItem } from "@/components/bento-grid";
import { ProfileCard } from "@/components/profile-card";
import { SkillsCard } from "@/components/skills-card";
import { SocialCard } from "@/components/social-card";
import { ProjectsCard } from "@/components/projects-card";
import { HardwareCard } from "@/components/hardware-card";
import { SoftwareCard } from "@/components/software-card";
// import { FriendsCard } from "@/components/friends-card";
import { PhotoStackCard } from "@/components/photo-stack-card";
import { NowPlayingCard } from "@/components/now-playing-card";
import { GitHubHeatmapCard } from "@/components/github-heatmap-card";
// import { VRChatStatusCard } from "@/components/vrchat-status-card";
import { MapCard } from "@/components/map-card";
import { BlogCard } from "@/components/blog-card";
import { WeatherCard } from "@/components/weather-card";


const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

/** Scan a public/ subdirectory at build time for image files */
function scanImages(subdir: string): string[] {
  const dir = path.join(process.cwd(), "public", subdir);
  try {
    return fs.readdirSync(dir).filter((f) => IMAGE_RE.test(f));
  } catch {
    return [];
  }
}

export default function Home() {
  const avatarImages = scanImages("avatar");
  const photoImages = scanImages("photos");

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-start py-8 sm:py-10 md:py-14">
      <BentoGrid>
        {/*
         *  Grid: 4 cols × 100px rows. Each row-span-N = N×100px.
         *  Perfect masonry densing logic groups items to sum exact areas.
         */}

        <BentoGridItem className="md:col-span-4 md:row-span-3">
          <ProfileCard avatarImages={avatarImages} />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-1 md:row-span-2">
          <NowPlayingCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-2 md:row-span-2">
          <SkillsCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-1 md:row-span-2">
          <WeatherCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-1 md:row-span-2">
          <GitHubHeatmapCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-1 md:row-span-2">
          <SocialCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-2 md:row-span-3">
          <SoftwareCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-2 md:row-span-3">
          <MapCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-4 md:row-span-6">
          <PhotoStackCard photos={photoImages} />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-2 md:row-span-6">
          <HardwareCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-2 md:row-span-6">
          <ProjectsCard />
        </BentoGridItem>

        <BentoGridItem className="md:col-span-2 md:row-span-2">
          <BlogCard />
        </BentoGridItem>

        {/* VRChat 已隐藏；恢复时同时取消导入注释，并将 ProfileCard 改回 md:col-span-3。 */}
        {/* <BentoGridItem className="md:col-span-1 md:row-span-3">
          <VRChatStatusCard />
        </BentoGridItem> */}

        {/* 友链已隐藏；恢复时同时取消导入注释。 */}
        {/* <BentoGridItem className="md:col-span-1 md:row-span-2">
          <FriendsCard />
        </BentoGridItem> */}

      </BentoGrid>
    </main>
  );
}
