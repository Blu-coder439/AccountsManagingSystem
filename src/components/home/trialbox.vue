<template>
    <section class="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_45%)]"></div>
        <div class="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-blue-500/10 to-transparent"></div>

        <div class="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
                <p class="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-blue-300">Free Trial</p>
                <h2 class="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Start using Accentra with a 14-day free trial.
                </h2>
                <p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                    Explore automated invoicing, clean reporting, and smarter expense tracking with no
                    setup stress and no commitment upfront.
                </p>
                <p class="mt-4 text-sm font-semibold text-slate-200">
                    After trial: <span class="text-white">{{ formatCurrency(29) }}</span> / month
                    <span class="text-slate-400">(converted when live exchange rates are enabled in Settings)</span>
                </p>

                <div class="mt-8 flex flex-col gap-4 sm:flex-row">
                    <button
                        class="rounded-full bg-blue-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                    >
                        Start Free Trial
                    </button>
                   
                </div>
            </div>

            <div class="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div class="mb-6 flex items-center justify-between">
                    <span class="text-sm font-semibold text-slate-200">What you get</span>
                    <span class="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                        No card required
                    </span>
                </div>

                <div class="space-y-4 text-slate-200">
                    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p class="text-base font-semibold text-white">Real-time dashboard</p>
                        <p class="mt-1 text-sm text-slate-300">See cash flow, invoices, and expenses in one place.</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p class="text-base font-semibold text-white">Fast setup</p>
                        <p class="mt-1 text-sm text-slate-300">Connect your workflow and start tracking in minutes.</p>
                    </div>
                    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p class="text-base font-semibold text-white">Built for growing teams</p>
                        <p class="mt-1 text-sm text-slate-300">Invite your team and stay aligned with shared reporting.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { useDisplayCurrency } from '@/composables/use-display-currency'

export default {
    name: 'TrialBox',
    setup() {
        const { formatCurrency } = useDisplayCurrency()
        return { formatCurrency }
    }
}
</script>
