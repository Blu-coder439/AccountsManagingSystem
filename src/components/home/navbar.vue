<template>
  <nav class="fixed top-0 left-0 z-50 w-full bg-white/10 backdrop-blur-md border-b border-white/5 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        
        <div class="shrink-0 flex items-center cursor-pointer">
          <span class="text-2xl font-black tracking-tighter text-white uppercase italic">
            Fin<span class="text-blue-500">Flow</span>
          </span>
        </div>

        <div class="hidden md:flex items-center space-x-10">
          <router-link to="/features" class="relative group py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-300">
            Features
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </router-link>

          <router-link to="/pricing" class="relative group py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-300">
            Pricing
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </router-link>

          <router-link to="/login" class="relative group py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-300">
            Log in
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </router-link>
          
          <router-link
            to="/signup"
            class="px-7 py-2.5 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-all duration-200"
          >
            Sign up
          </router-link>
        </div>

        <div class="md:hidden flex items-center">
          <button @click="isOpen = !isOpen" class="p-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-show="isOpen" class="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-8 space-y-1">
      <router-link to="/features" class="block px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Features</router-link>
      <router-link to="/pricing" class="block px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">Pricing</router-link>
      <div class="grid grid-cols-1 gap-3 px-4 pt-4">
        <router-link
          to="/login"
          class="block rounded-xl border border-white/15 px-4 py-3 text-center text-lg font-semibold text-white transition-all hover:bg-white/5"
        >
          Log in
        </router-link>
        <router-link
          to="/signup"
          class="block rounded-xl bg-blue-600 px-4 py-3 text-center text-lg font-bold text-white transition-all hover:bg-blue-500"
        >
          Sign up
        </router-link>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>
