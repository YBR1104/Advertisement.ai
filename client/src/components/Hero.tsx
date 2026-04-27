import { ArrowRightIcon, PlayIcon, ZapIcon, CheckIcon } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import { motion } from 'framer-motion';

export default function Hero() {

    const trustedUserImages = [
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop'
    ];

    const mainImageUrl = 'https://media.istockphoto.com/id/2098359215/photo/digital-marketing-concept-businessman-using-laptop-with-ads-dashboard-digital-marketing.jpg?s=1024x1024&w=is&k=20&c=q6RTyRcP6Lli25bBXmKz3F3sIAVSu5PthcuOiAniHzE=';

    const galleryStripImages = [
        'https://images.unsplash.com/photo-1548364538-60b952c308b9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1566657817181-c69e4a8eeb1e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    ];

    const trustedLogosText = [
        'Adobe',
        'Figma',
        'Canva',
        'Shopify',
        'Webflow',
    ];

    return (
        <>
            <section id="home" className="relative z-10">
                <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 pt-32 max-md:w-screen max-md:overflow-hidden md:pt-26">
                    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                        <div className="text-left">
                            <motion.a href="https://prebuiltui.com/tailwind-templates?ref=pixel-forge" className="mb-6 inline-flex items-center justify-start gap-3 rounded-full border border-gray-900/12 bg-white py-1.5 pl-3 pr-4 shadow-[0_6px_16px_rgba(15,23,42,0.06)]"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                            >
                                <div className="flex -space-x-2">
                                    {trustedUserImages.map((src, i) => (
                                        <img
                                            key={i}
                                            src={src}
                                            alt={`Client ${i + 1}`}
                                            className="size-6 rounded-full border border-white"
                                            width={40}
                                            height={40}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-600">
                                    Trusted by creators worldwide
                                </span>
                            </motion.a>

                            <motion.h1 className="mb-6 max-w-xl text-4xl leading-tight font-bold text-gray-900 md:text-5xl"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                Create viral advertisement <br />
                                <span className="bg-linear-to-r from-sky-700 via-sky-600 to-cyan-600 bg-clip-text text-transparent">
                                    that grows your business
                                </span>
                            </motion.h1>

                            <motion.p className="mb-8 max-w-lg text-gray-600"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                            >
                                Upload product images and details, and let our AI generate engaging ad creatives that drive results. Fast, easy, and effective advertising at your fingertips.
                            </motion.p>

                            <motion.div className="mb-8 flex flex-col items-center gap-4 sm:flex-row"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                            >
                                <a href="/" className="w-full sm:w-auto">
                                    <PrimaryButton className="max-sm:w-full py-3 px-7">
                                        Start generating ads
                                        <ArrowRightIcon className="size-4" />
                                    </PrimaryButton>
                                </a>

                                <GhostButton className="max-sm:w-full max-sm:justify-center py-3 px-5">
                                    <PlayIcon className="size-4" />
                                    Watch demo
                                </GhostButton>
                            </motion.div>

                            <motion.div className="flex items-center overflow-hidden rounded-2xl border border-gray-900/10 bg-gray-50 text-sm text-gray-800 sm:inline-flex max-sm:justify-center"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                <div className="flex items-center gap-2 p-2 px-3 transition-colors hover:bg-white sm:px-6">
                                    <ZapIcon className="size-4 text-sky-700" />
                                    <div>
                                        <div>Seconds to create</div>
                                        <div className="text-xs text-gray-500">
                                            optimized for performance
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden h-6 w-px bg-gray-200 sm:block" />

                                <div className="flex items-center gap-2 p-2 px-3 transition-colors hover:bg-white sm:px-6">
                                    <CheckIcon className="size-4 text-sky-700" />
                                    <div>
                                        <div>Commercial rights</div>
                                        <div className="text-xs text-gray-500">
                                            Use anywhere, no attribution required
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: modern mockup card */}
                        <motion.div className="mx-auto w-full max-w-lg"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.5 }}
                        >
                            <motion.div className="overflow-hidden rounded-3xl border border-gray-900/12 bg-white shadow-[0_24px_60px_rgba(2,6,23,0.12)]">
                                <div className="relative aspect-16/10 bg-gray-100">
                                    <img
                                        src={mainImageUrl}
                                        alt="agency-work-preview"
                                        className="w-full h-full object-cover object-center"
                                    />

                                    <div className="absolute left-4 top-4 rounded-full border border-gray-900/10 bg-white/90 px-3 py-1 text-xs text-gray-700">
                                        Social-ready : 9:16 , 16:9 , 1:1
                                    </div>

                                    <div className="absolute right-4 bottom-4">
                                        <button className="inline-flex items-center gap-2 rounded-full border border-gray-900/10 bg-white px-4 py-2 text-gray-700 transition hover:text-sky-700 focus:outline-none">
                                            <PlayIcon className="size-4" />
                                            <span className="text-xs">Preview</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="mt-4 flex items-center justify-start gap-3">
                                {galleryStripImages.map((src, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                                        className="h-10 w-14 overflow-hidden rounded-lg border border-gray-900/12"
                                    >
                                        <img
                                            src={src}
                                            alt="project-thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                                <motion.div className="ml-2 flex items-center gap-2 text-sm text-gray-500"
                                    initial={{ y: 60, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                                >
                                    <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75 duration-300" />

                                        <span className="relative inline-flex size-2 rounded-full bg-sky-600" />
                                    </div>
                                    +20 more previews
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* LOGO MARQUEE */}
            <motion.section className="max-md:mt-10 border-y border-gray-900/10 bg-white/75"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="w-full overflow-hidden py-6">
                        <div className="flex gap-14 items-center justify-center animate-marquee whitespace-nowrap">
                            {trustedLogosText.concat(trustedLogosText).map((logo, i) => (
                                <span
                                    key={i}
                                    className="mx-6 text-sm font-semibold tracking-wide text-gray-500 transition-colors hover:text-sky-700 md:text-base"
                                >
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
        </>
    );
};
