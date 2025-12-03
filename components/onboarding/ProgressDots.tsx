export function ProgressDots({ currentStep, totalSteps = 3 }: { currentStep: number; totalSteps?: number }) {
    return (
        <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all ${index < currentStep
                            ? 'bg-brand-primary'
                            : 'bg-slate-200'
                        }`}
                />
            ))}
        </div>
    )
}
