import { PricingTable } from "@clerk/react";
import Title from "../components/Title";

const Plan = () => {
    return (
        <div className="space-y-6" >
            <section className="editor-panel rounded-3xl p-6 sm:p-8">
                <Title
                    title="Plans"
                    heading="Choose the right plan for your team"
                    description="All plans are shown side-by-side so you can compare pricing, features, and limits quickly."
                />

                <PricingTable appearance={{
                    variables: {
                        colorBackground: "transparent",
                        colorText: "#f4f4f5",
                        colorTextSecondary: "#a1a1aa",
                        colorPrimary: "#8b5cf6",
                        colorTextOnPrimaryBackground: "#ffffff"
                    },
                    elements: {
                        pricingTable: "grid gap-5 md:grid-cols-3",
                        pricingTableCard: "h-full rounded-2xl border border-white/12 bg-[#171821] shadow-none",
                        pricingTableCardHeader: "border-b border-white/10 bg-transparent",
                        pricingTableCardBody: "bg-transparent text-zinc-200",
                        pricingTableCardFooter: "border-t border-white/10 bg-transparent",
                        pricingTableCardTitle: "text-zinc-100",
                        pricingTableCardSubtitle: "text-zinc-400",
                        pricingTableCardFeatures: "text-zinc-300",
                        pricingTableCardPrice: "text-violet-300",
                        pricingTableCardPriceText: "text-violet-300",
                        pricingTableCardAmount: "text-zinc-100",
                        pricingTableCardDescription: "text-zinc-400",
                        pricingTableCardFeaturesListItem: "text-zinc-300",
                        button: "text-white"
                    }
                }} />
            </section>

            <p className="mx-auto max-w-xl rounded-2xl border border-white/12 bg-[#171821] px-5 py-4 text-center text-sm text-zinc-400">Create stunning Images for just <span className="font-medium text-violet-200">5 credits </span>and generate videos for <span className="font-medium text-violet-200">10 credits</span></p>
        </div>
    );
}   
export default Plan
