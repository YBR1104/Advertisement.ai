export default function SoftBackdrop() {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(56,189,248,0.12)_0,transparent_44%)]" />
            <div className="absolute -right-px top-0 h-full w-10 border-x border-x-[var(--pattern-fg)] bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px]" />
            <div className="absolute -left-px top-0 h-full w-10 border-x border-x-[var(--pattern-fg)] bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px]" />
            <div className="absolute left-0 right-0 top-24 h-px bg-[var(--pattern-fg)]" />
            <div className="absolute bottom-20 left-0 right-0 h-px bg-[var(--pattern-fg)]" />
        </div>
    )
}
