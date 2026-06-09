<script setup>
// No imports required - this uses raw SVG paths for maximum reliability
const services = [
  {
    title: 'Financal Reports',
    description: 'Summarized insights into your business finances, including income, expenses, and overall performance.',
    // Icon: Palette
    path: 'M6 2.25A2.25 2.25 0 003.75 4.5v15A2.25 2.25 0 006 21.75h12A2.25 2.25 0 0020.25 19.5V8.25L14.25 2.25H6zm3.75 12h1.5v3h-1.5v-3zm3-4.5h1.5v7.5h-1.5V9.75zm3-3h1.5v10.5h-1.5V6.75z'
  },
  {
    title: 'Double-entry Accounting',
    description: 'A system where every transaction is recorded in two accounts debit and credit to keep finances balanced.',
    // Icon: Code
    path:  'M4.5 3.75h9A2.25 2.25 0 0115.75 6v12A2.25 2.25 0 0113.5 20.25h-9A2.25 2.25 0 012.25 18V6A2.25 2.25 0 014.5 3.75zm0 0V20.25'
  },
  {
    title: 'Transactions & Payments',
    description: '  Track and manage all money coming in and going out of your business.',
    // Icon: Device
    path: 'M2.25 6.75A2.25 2.25 0 014.5 4.5h15A2.25 2.25 0 0121.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75zm0 3h19.5'

  },
  {
    title: 'Analytics & Data',
    description: 'Data-driven insights to inform strategic business decisions.',
    // Icon: Chart
    path: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'
  }
];
</script>

<template>
  <section class="py-24 px-6 bg-[#FDFDFE] font-sans antialiased">
    <div class="max-w-7xl mx-auto">
      
      <div class="text-center mb-20 max-w-3xl mx-auto">
        <h2 class="text-4xl font-extrabold text-slate-950 mb-6 tracking-tight italic">
          Everything you need to grow
        </h2>
        <p class="text-lg text-slate-600 leading-relaxed">
          Accentra simplifies your back-office tasks so you can focus on what you love. 
          Our platform is built to handle the heavy lifting of finance management.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="service in services" 
          :key="service.title" 
          class="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-950/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2"
        >
          <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="service.path" />
            </svg>
          </div>

          <h3 class="text-xl font-bold text-slate-900 mb-4 tracking-tight">
            {{ service.title }}
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed mb-6">
            {{ service.description }}
          </p>
          
          <a href="#" class="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group/link">
            Learn More 
            <svg class="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

    </div>
  </section>
</template>