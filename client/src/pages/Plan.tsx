import { PricingTable } from "@clerk/react";
import Title from "../components/Title";

const Plan = () => {
    return (
        <div className="px-4 max-sm:py-10 sm:pt-24" >
            <section className="mx-auto max-w-6xl rounded-3xl border border-gray-900/10 bg-white p-5 shadow-[0_20px_45px_rgba(2,6,23,0.08)] md:p-8">
                <Title
                    title="Plans"
                    heading="Choose the right plan for your team"
                    description="All plans are shown side-by-side so you can compare pricing, features, and limits quickly."
                />

                <PricingTable appearance={{
                    variables: {
                        colorBackground: "transparent",
                        colorText: "#0f172a",
                        colorTextSecondary: "#475569",
                        colorPrimary: "#0284c7",
                        colorTextOnPrimaryBackground: "#ffffff"
                    },
                    elements: {
                        pricingTable: "grid gap-5 md:grid-cols-3",
                        pricingTableCard: "h-full rounded-2xl border-2 border-sky-200 bg-sky-50/60 shadow-none",
                        pricingTableCardHeader: "border-b border-sky-200 bg-transparent",
                        pricingTableCardBody: "bg-transparent text-gray-700",
                        pricingTableCardFooter: "border-t border-sky-200 bg-transparent",
                        pricingTableCardTitle: "text-gray-900",
                        pricingTableCardSubtitle: "text-gray-600",
                        pricingTableCardFeatures: "text-gray-700",
                        pricingTableCardPrice: "text-sky-700",
                        pricingTableCardPriceText: "text-sky-700",
                        pricingTableCardAmount: "text-gray-900",
                        pricingTableCardDescription: "text-gray-600",
                        pricingTableCardFeaturesListItem: "text-gray-700",
                        button: "text-white"
                    }
                }} />
            </section>

            <p className="mx-auto my-12 max-w-md text-center text-sm text-gray-600">Create stunning Images for just <span className="font-medium text-sky-700">5 credits </span>and generate videos for <span className="font-medium text-sky-700">10 credits</span></p>
        </div>
    );
}   
export default Plan
