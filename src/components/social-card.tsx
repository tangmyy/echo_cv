"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Github, ShoppingBag, MessageCircle, Music2, Newspaper, Tv, FileUser, Mail, X } from "lucide-react";
import { siteConfig, type SiteConfig } from "@/config/site";
import { GlassCard } from "@/components/glass-card";
import { SteamIcon } from "@/components/icons/steam-icon";
import { SPRING_INTERACTIVE } from "@/lib/motion";

type SocialLink = SiteConfig["socialLinks"][number];
type QrLink = Extract<SocialLink, { action: "qrcode" }>;
const iconMap = { github: Github, "douyin-shop": ShoppingBag, wechat: MessageCircle,
    douyin: Music2, "wechat-public": Newspaper, bilibili: Tv, steam: SteamIcon, resume: FileUser, email: Mail };

function QrDialog({ link, onClose }: { link: QrLink; onClose: () => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const descriptionId = useId();
    const [imageFailed, setImageFailed] = useState(false);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.showModal();
        return () => {
            dialog.close();
            document.body.style.overflow = overflow;
        };
    }, []);

    return createPortal(
        <dialog ref={dialogRef} className="social-qr-dialog m-auto w-[calc(100%-2rem)] max-w-sm overflow-visible border-0 bg-transparent p-0 text-text-primary"
            aria-labelledby={titleId} aria-describedby={descriptionId}
            onCancel={event => { event.preventDefault(); onClose(); }}
            onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
            <motion.div initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={SPRING_INTERACTIVE} className="glass-floating-ui max-h-[85dvh] overflow-y-auto rounded-3xl p-5">
                <header className="mb-3 flex items-center justify-between gap-3">
                    <h2 id={titleId} className="text-lg font-semibold">{link.label}</h2>
                    <button type="button" onClick={onClose} aria-label={siteConfig.socialUi.close}
                        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--glass-inner-bg)] focus-visible:outline-2 focus-visible:outline-offset-2">
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>
                {imageFailed ? (
                    <p role="status" className="flex min-h-48 items-center justify-center rounded-xl bg-[var(--glass-inner-bg)] px-4 text-sm text-text-secondary">{siteConfig.socialUi.imageUnavailable}</p>
                ) : (
                    <Image src={link.image} alt={link.label} width={640} height={640} unoptimized
                        className="h-auto max-h-[60dvh] w-full rounded-xl object-contain" onError={() => setImageFailed(true)} />
                )}
                <p id={descriptionId} className="mt-3 text-center text-sm text-text-secondary">{link.description}</p>
            </motion.div>
        </dialog>, document.body,
    );
}

export function SocialCard() {
    const [selectedQr, setSelectedQr] = useState<QrLink | null>(null);
    const reducedMotion = useReducedMotion();
    const enabledLinks = siteConfig.socialLinks.filter(link => link.enabled);

    return (
        <>
            <GlassCard variant="dense" className="flex h-full items-center justify-center p-4 md:p-5">
                <div className="grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-3">
                    {enabledLinks.map(link => {
                        const Icon = iconMap[link.platform];
                        const content = <>
                            <motion.span className="flex size-11 items-center justify-center rounded-full bg-[var(--glass-inner-bg)]"
                                style={{ color: "var(--text-secondary)" }}
                                whileHover={{ scale: reducedMotion ? 1 : 1.04, color: `rgb(var(--system-${link.accent}-rgb))` }}
                                whileTap={{ scale: reducedMotion ? 1 : 0.96 }} transition={SPRING_INTERACTIVE}>
                                <Icon size={19} />
                            </motion.span>
                            <span className="whitespace-nowrap text-[11px] font-medium leading-none text-text-tertiary">{link.label}</span>
                        </>;
                        const className = "flex min-h-11 min-w-11 flex-col items-center gap-1.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2";
                        return link.action === "qrcode" ? (
                            <button key={link.platform} type="button" className={className} onClick={() => setSelectedQr(link)} aria-haspopup="dialog">{content}</button>
                        ) : (
                            <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
                        );
                    })}
                </div>
            </GlassCard>
            {selectedQr && <QrDialog key={selectedQr.platform} link={selectedQr} onClose={() => setSelectedQr(null)} />}
        </>
    );
}
