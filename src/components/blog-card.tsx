"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { siteConfig } from "@/config/site";

const feedbackSpring = {
    type: "spring" as const,
    stiffness: 260,
    damping: 28,
};

const headerLinkMotion = {
    rest: { color: "var(--text-tertiary)", transition: feedbackSpring },
    hover: { color: "var(--tint-color)", transition: feedbackSpring },
};

const headerIconMotion = {
    rest: { opacity: 0.52, transition: feedbackSpring },
    hover: { opacity: 1, transition: feedbackSpring },
};

const rowMaterialMotion = {
    rest: { opacity: 0, transition: feedbackSpring },
    hover: { opacity: 1, transition: feedbackSpring },
};

export function BlogCard() {
    const posts = siteConfig.blog?.posts ?? [];
    const { cardTitles } = siteConfig;
    if (!posts.length) return null;

    return (
        <GlassCard variant="panel" className="flex h-full flex-col gap-3 p-5 md:p-6">
            <header className="flex items-center justify-between gap-4">
                <h2 className="text-[22px] font-[650] leading-none text-text-primary">{cardTitles.blog}</h2>
                {posts.length === 1 && (
                    <motion.a href={posts[0].url} target="_blank" rel="noopener noreferrer"
                        variants={headerLinkMotion} initial="rest" animate="rest" whileHover="hover" whileFocus="hover"
                        className="flex min-h-11 min-w-11 items-center justify-end gap-1 rounded-[12px] px-2 text-[12px] font-semibold text-text-tertiary focus-visible:outline-2 focus-visible:outline-offset-2">
                        {cardTitles.blogLink}
                        <motion.span variants={headerIconMotion} className="flex"><ArrowUpRight size={12} aria-hidden="true" /></motion.span>
                    </motion.a>
                )}
            </header>
            <div className="-mx-1 flex min-h-0 flex-col">
                {posts.map((post, i) => (
                    <Fragment key={post.url}>
                        {i > 0 && <div className="mx-3 h-px shrink-0" style={{ background: "var(--glass-divider)" }} />}
                        <motion.a href={post.url} target="_blank" rel="noopener noreferrer"
                            initial="rest" animate="rest" whileHover="hover" whileFocus="hover"
                            className="relative -mx-2 flex min-h-11 items-center gap-3 overflow-hidden rounded-[12px] px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2">
                            <motion.span aria-hidden="true" variants={rowMaterialMotion}
                                className="pointer-events-none absolute inset-0" style={{ background: "var(--glass-inner-bg)" }} />
                            <div className="relative z-[1] min-w-0 flex-1">
                                <h3 className="break-words text-[15px] font-[640] leading-[1.3] text-text-primary">{post.title}</h3>
                                {(post.updatedAt || post.tags.length > 0) && (
                                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium leading-[1.25]">
                                        {post.updatedAt && <time dateTime={post.updatedAt} className="text-text-tertiary">更新于 {post.updatedAt}</time>}
                                        {post.tags.map(tag => <span key={tag} style={{ color: "var(--tint-color)" }}>{tag}</span>)}
                                    </div>
                                )}
                            </div>
                            <motion.span variants={headerIconMotion} className="relative shrink-0 text-text-tertiary"><ArrowUpRight size={14} aria-hidden="true" /></motion.span>
                        </motion.a>
                    </Fragment>
                ))}
            </div>
        </GlassCard>
    );
}
