<template>
  <section class="bg-white py-20 px-6">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-14">
        <h1 class="text-xl font-bold tracking-widest uppercase text-blue-600 mb-3">How it works</h1>
        <h2 class="text-3xl font-bold text-gray-900 mb-3">Up and running in minutes</h2>
        <p class="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
          Three simple steps to get your finances fully automated — no accountant required.
        </p>
      </div>

      <!-- Steps -->
      <div class="relative grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">

        <!-- Dashed connector line (desktop only) -->
        <div class="hidden md:block absolute top-9 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px border-t border-dashed border-gray-300 z-0" />

        <div
          v-for="(step, i) in steps"
          :key="i"
          class="flex flex-col items-center text-center px-4 relative z-10"
        >
          <!-- Icon circle -->
          <div class="w-[72px] h-[72px] rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center mb-5">
            <component :is="step.icon" class="w-6 h-6 text-blue-600" />
          </div>

          <h3 class="text-base font-semibold text-gray-900 mb-2">{{ step.title }}</h3>
          <p class="text-sm text-gray-500 leading-relaxed mb-3">{{ step.description }}</p>

          <span class="inline-block text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            {{ step.badge }}
          </span>
        </div>
      </div>

      <!-- Demo card -->
      <div class="border border-gray-200 rounded-xl overflow-hidden bg-blue-50/40">

        <!-- Browser bar -->
        <div class="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-red-400" />
          <span class="w-3 h-3 rounded-full bg-yellow-400" />
          <span class="w-3 h-3 rounded-full bg-green-400" />
          <div class="flex-1 bg-white border border-gray-200 rounded-md text-xs text-gray-400 text-center py-1 mx-4">
            app.Accentra.io/dashboard
          </div>
        </div>

        <!-- Demo body -->
        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">

          <!-- Col 1: Transactions -->
          <div class="p-5">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Recent transactions</p>
            <div
              v-for="(tx, i) in transactions"
              :key="i"
              class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm"
            >
              <span class="text-gray-700">{{ tx.label }}</span>
              <span :class="tx.amount.startsWith('+') ? 'text-gray-900 font-semibold' : 'text-gray-900 font-semibold'">
                {{ tx.amount }}
              </span>
            </div>
          </div>

          <!-- Col 2: AI Categories -->
          <div class="p-5">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">AI categories</p>
            <div
              v-for="(cat, i) in categories"
              :key="i"
              class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm"
            >
              <span class="text-gray-700">{{ cat.label }}</span>
              <span
                class="text-xs font-medium px-2.5 py-0.5 rounded-full"
                :class="cat.tagClass"
              >
                {{ cat.tag }}
              </span>
            </div>
          </div>

          <!-- Col 3: AI Insights -->
          <div class="p-5">
            <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">AI insights</p>
            <div
              v-for="(insight, i) in insights"
              :key="i"
              class="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0 text-sm text-gray-700"
            >
              <span
                class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs"
                :class="insight.iconClass"
              >
                {{ insight.icon }}
              </span>
              <span>{{ insight.text }}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const BankIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '3' }),
  h('path', { d: 'M3 9h18M9 21V9' }),
])

const ClockIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('circle', { cx: '12', cy: '12', r: '10' }),
  h('path', { d: 'M12 8v4l3 3' }),
])

const ChartIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M3 3v18h18' }),
  h('path', { d: 'M7 16l4-4 4 4 4-6' }),
])

const steps = [
  {
    icon: BankIcon,
    title: 'Connect your accounts',
    description: 'Link your bank, credit cards, and payment tools in seconds with 10,000+ supported integrations.',
    badge: 'Takes 2 minutes',
  },
  {
    icon: ClockIcon,
    title: 'AI categorizes everything',
    description: "FinFlow's AI reads every transaction, applies the right categories, and flags anything that needs a second look.",
    badge: 'Runs automatically',
  },
  {
    icon: ChartIcon,
    title: 'Get real-time insights',
    description: 'See your P&L, cash flow, and tax position updated live — no manual entry, no end-of-month scramble.',
    badge: 'Always up to date',
  },
]

const transactions = [
  { label: 'Stripe payout', amount: '+$4,200' },
  { label: 'AWS invoice', amount: '-$312' },
  { label: 'Figma annual', amount: '-$144' },
  { label: 'Payroll — May', amount: '-$8,500' },
]

const categories = [
  { label: 'Revenue', tag: 'Auto-tagged', tagClass: 'bg-emerald-50 text-emerald-600' },
  { label: 'Infrastructure', tag: 'Auto-tagged', tagClass: 'bg-blue-50 text-blue-600' },
  { label: 'Software', tag: 'Auto-tagged', tagClass: 'bg-blue-50 text-blue-600' },
  { label: 'Payroll', tag: 'Review', tagClass: 'bg-amber-50 text-amber-600' },
]

const insights = [
  {
    icon: '✓',
    iconClass: 'bg-emerald-100 text-emerald-600',
    text: 'Revenue up 18% vs last month',
  },
  {
    icon: 'i',
    iconClass: 'bg-blue-100 text-blue-600',
    text: 'AWS costs trending +23% — review usage',
  },
  {
    icon: '!',
    iconClass: 'bg-amber-100 text-amber-700',
    text: 'Tax estimate ready — Q2 due in 14 days',
  },
]
</script>