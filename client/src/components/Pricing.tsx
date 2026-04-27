
import Title from './Title';
import { PricingTable } from '@clerk/react';


export default function Pricing() {
   
    return (
        <section id="pricing" className="border-t border-gray-900/10 bg-transparent py-20">
            <div className="max-w-6xl mx-auto px-4">

                <Title
                    title="Pricing"
                    heading="Simple, transparent pricing"
                    description="Flexible agency packages designed to fit startups, growing teams and established brands."
                />

                <div className="mx-auto max-w-6xl rounded-3xl border border-gray-900/10 bg-white p-5 shadow-[0_20px_45px_rgba(2,6,23,0.08)] md:p-8">
                    <PricingTable appearance={{
                        variables : {
                            colorBackground: 'transparent',
                            colorText: '#0f172a',
                            colorTextSecondary: '#475569',
                            colorPrimary: '#0284c7',
                            colorTextOnPrimaryBackground: '#ffffff'
                        },
                        elements: {
                            pricingTable: 'grid gap-5 md:grid-cols-3',
                            pricingTableCard: 'h-full rounded-2xl border-2 border-sky-200 bg-sky-50/60 shadow-none text-gray-800',
                            pricingTableCardHeader: 'border-b border-sky-200 bg-transparent',
                            pricingTableCardBody: 'bg-transparent text-gray-700',
                            pricingTableCardFooter: 'border-t border-sky-200 bg-transparent',
                            pricingTableCardTitle: 'text-gray-900',
                            pricingTableCardSubtitle: 'text-gray-600',
                            pricingTableCardFeatures: 'text-gray-700',
                            pricingTableCardPrice: 'text-sky-700',
                            pricingTableCardPriceText: 'text-sky-700',
                            pricingTableCardAmount: 'text-gray-900',
                            pricingTableCardDescription: 'text-gray-600',
                            pricingTableCardFeaturesListItem: 'text-gray-700',
                            button: 'text-white'
                        }
                    }}/>
            </div>
            </div>
        </section>
    );
};
