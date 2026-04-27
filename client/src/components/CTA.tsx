import { ArrowRightIcon } from 'lucide-react';
import { GhostButton } from './Buttons';
import { motion } from 'framer-motion';

export default function CTA() {
    return (
        <section className="px-4 py-20 2xl:pb-32">
            <div className="container mx-auto max-w-3xl">
                <div className="relative overflow-hidden rounded-3xl border border-gray-900/12 bg-linear-to-br from-white via-sky-50/70 to-white p-12 text-center shadow-[0_25px_60px_rgba(2,6,23,0.1)] md:p-16">
                    <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.2)_0,transparent_38%),radial-gradient(circle_at_82%_76%,rgba(14,165,233,0.14)_0,transparent_34%)]" />
                    <div className="relative z-10">
                        <motion.h2 className="mb-6 text-2xl font-semibold text-gray-900 sm:text-4xl"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                        >
                            Ready to Transform Your Content?
                        </motion.h2>
                        <motion.p className="mx-auto mb-10 max-w-xl text-gray-600 max-sm:text-sm"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                        >
                            Join thousands of brands creating viral advertisements with AI generated images and videos. Sign up now and start captivating your audience with stunning visuals in seconds.
                        </motion.p>
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                        >
                            <GhostButton className="gap-2 border-sky-300/45 bg-white px-8 py-3 text-sky-900 hover:bg-sky-50">
                                Start Creating Now <ArrowRightIcon size={20} />
                            </GhostButton>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
