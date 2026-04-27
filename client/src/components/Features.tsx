import { useRef } from 'react';
import { featuresData } from '../assets/dummy-data';
import Title from './Title';
import { motion } from 'framer-motion';

export default function Features() {
    const refs = useRef<(HTMLDivElement | null)[]>([]);
    return (
        <section id="features" className="py-20 2xl:py-32">
            <div className="max-w-6xl mx-auto px-4">

                <Title
                    title="Features"
                    heading="Empowering Your Digital Journey"
                    description="Our AI instantly transforms your text into stunning visuals, making it easier than ever to create captivating content for your brand. Say goodbye to creative blocks and hello to endless possibilities with our AI-powered image,video generation tool."
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {featuresData.map((feature, i) => (
                        <motion.div
                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            key={i}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-300", "hover:border-sky-300/45", "hover:-translate-y-1.5");
                                }
                            }}
                            className="rounded-2xl border border-gray-900/10 bg-white p-6 shadow-[0_16px_38px_rgba(2,6,23,0.08)]"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-700">
                                {feature.icon}
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
