import { assets } from '../assets/assets';
import { footerLinks } from '../assets/dummy-data';
import { motion } from 'framer-motion';

export default function Footer() {

    return (
        <motion.footer className="border-t border-gray-900/10 bg-white/80 pt-10 text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5 }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col items-start justify-between gap-10 border-b border-gray-900/10 py-10 md:flex-row">
                    <div>
                        <img src={assets.logo} alt="logo" className="h-8" />
                        <p className="mt-6 max-w-[410px] text-sm leading-relaxed text-gray-600">
                           Create stunning visuals for your brand in seconds with our AI-powered image and video generation platform. Transform your content creation process and captivate your audience like never before.
                        </p>
                    </div>

                    <div className="flex w-full flex-wrap justify-between gap-5 md:w-[45%]">
                        {footerLinks.map((section, index) => (
                            <div key={index}>
                                <h3 className="mb-2 text-base font-semibold text-gray-900 md:mb-5">
                                    {section.title}
                                </h3>
                                <ul className="text-sm space-y-1">
                                    {section.links.map(
                                        (link: { name: string; url: string }, i) => (
                                            <li key={i}>
                                                <a
                                                    href={link.url}
                                                    className="transition hover:text-sky-700"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="py-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} {' '}
                  
                       Aumbit.ai . All rights reserved.
                </p>
            </div>
        </motion.footer>
    );
};
