<template>
 <div class="min-h-screen relative overflow-hidden">

        <video autoplay muted loop class="absolute top-0 left-0 w-full h-full object-cover z-0">

            <source src="@/assets/homevid.mp4" type="video/mp4">

        </video>

        <div class="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

    <Navbar />

    <div class="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div class="flex flex-col items-start">
          <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600">New: AI Bookkeeping</span>
          </div>

          <h1 class="text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Accounting that <br />
            actually <span class="text-blue-600">makes sense</span>
          </h1>

          <p class="text-lg text-white mb-10 max-w-lg leading-relaxed">
            Automate your bookkeeping, manage invoices, and get real-time financial insights in one simple platform designed for modern businesses.
          </p>

          <div class="flex flex-wrap gap-4 mb-12">
            <button class="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
              Start Free Trial
            </button>
            <button class="px-8 py-4 bg-white text-white-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
              Book a Demo
            </button>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex -space-x-3">
              <img v-for="i in 3" :key="i" class="w-10 h-10 rounded-full border-2 border-white bg-slate-200" src="https://i.pravatar.cc/100" alt="User">
            </div>
            <p class="text-sm text-white">
              Join <span class="font-bold text-white">12,000+</span> businesses growing with FinFlow
            </p>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-4 bg-linear-to-tr from-blue-100 to-indigo-100 rounded-3xl blur-2xl opacity-30"></div>
          
          <div class="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div class="bg-slate-50 border-b border-slate-200 px-4 py-3 flex gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            </div>
            
            <div class="p-6 space-y-6 bg-white">
              <div class="flex gap-4">
                <div class="h-32 w-1/3 bg-slate-100 rounded-xl"></div>
                <div class="h-32 w-2/3 bg-blue-50 rounded-xl border border-blue-100"></div>
              </div>
              <div class="h-48 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
              <div class="flex gap-4">
                <div class="h-24 w-1/2 bg-slate-100 rounded-xl"></div>
                <div class="h-24 w-1/2 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './navbar.vue'
export default {
  components: {
    Navbar
  }
}

</script>