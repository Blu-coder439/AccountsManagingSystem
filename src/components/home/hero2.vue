<script setup>
// No imports required - this uses raw SVG paths for maximum reliability
const services = [
  {
    title: 'Design & UX',
    description: 'Beautiful and intuitive user interfaces that engage and delight your customers.',
    // Icon: Palette
    path: 'M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z'
  },
  {
    title: 'Web Development',
    description: 'Scalable and responsive web applications built with modern technologies.',
    // Icon: Code
    path: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5'
  },
  {
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile solutions for iOS and Android.',
    // Icon: Device
    path: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3'
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