<script setup>
import { ref, computed } from 'vue';

// --- STYLING CONSTANTS ---
const inputStyles = "w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all placeholder:text-slate-300";
const labelStyles = "block text-sm font-semibold text-slate-800 mb-1.5";

// --- NAVIGATION STATE ---
const currentStep = ref(1);
const accountType = ref('business'); 
const showPassword = ref(false);

// --- FORM DATA ---
const form = ref({
  businessName: '',
  businessType: '',
  businessRegNumber: '', 
  fullName: '',
  address: '',
  city: '',
  phone: '',
  idNumber: '', 
  email: '',
  password: ''
});

// --- VALIDATION ---
const isStep1Valid = computed(() => {
  const shared = form.value.email.includes('@') && form.value.password.length >= 8;
  if (accountType.value === 'business') return shared && form.value.businessName && form.value.businessType;
  return shared && form.value.fullName && form.value.city && form.value.phone;
});

const isStep2Valid = computed(() => {
  return accountType.value === 'business' ? form.value.businessRegNumber : form.value.idNumber;
});

const nextStep = () => { if (currentStep.value < 3) currentStep.value++; };
const prevStep = () => { if (currentStep.value > 1) currentStep.value--; };
const togglePassword = () => { showPassword.value = !showPassword.value; };
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans antialiased">
    
    <div class="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 flex overflow-hidden min-h-[750px]">
      
      <div class="hidden lg:block w-[45%] relative">
        <img 
          src="@/assets/business.jpg" 
          class="absolute inset-0 w-full h-full object-cover"
          alt="Business background"
        />
        <div class="absolute top-10 left-10">
          <div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
             <span class="text-white font-black text-2xl italic tracking-tighter">F</span>
          </div>
        </div>
        <div class="absolute bottom-12 left-10 right-10">
          <p class="text-white/70 text-sm font-medium mb-2">Step {{ currentStep }} of 3</p>
          <h2 class="text-white text-3xl font-bold leading-tight">
            {{ currentStep === 1 ? 'Start your financial journey with us.' : 'Almost there, let’s verify your identity.' }}
          </h2>
        </div>
      </div>

      <div class="w-full lg:w-[55%] p-8 lg:p-16 flex flex-col">
        
        <div class="flex justify-between items-center mb-12">
          <button @click="prevStep" v-if="currentStep > 1" class="text-slate-400 hover:text-blue-600 flex items-center gap-2 text-sm font-bold transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </button>
          <div v-else class="w-10"></div> <div class="flex items-center gap-3">
             <span class="text-[11px] font-black uppercase tracking-widest text-slate-400">Step {{ currentStep }} / 3</span>
             <div class="flex gap-1">
                <div v-for="i in 3" :key="i" class="h-1.5 rounded-full transition-all duration-500" :class="i <= currentStep ? 'w-6 bg-blue-600' : 'w-2 bg-slate-100'"></div>
             </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          
          <div v-if="currentStep === 1" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h1>
            <p class="text-slate-500 text-sm mb-8 font-medium">Choose how you'd like to use FinFlow.</p>

            <div class="flex p-1 bg-slate-50 border border-slate-100 rounded-xl mb-8">
              <button @click="accountType = 'business'" :class="accountType === 'business' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'" class="flex-1 py-2.5 font-bold rounded-lg transition-all text-xs uppercase tracking-wider">Business</button>
              <button @click="accountType = 'client'" :class="accountType === 'client' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'" class="flex-1 py-2.5 font-bold rounded-lg transition-all text-xs uppercase tracking-wider">Client</button>
            </div>

            <form @submit.prevent="nextStep" class="space-y-4">
              <div v-if="accountType === 'business'" class="space-y-4">
                <div><label :class="labelStyles">Business Name</label><input v-model="form.businessName" :class="inputStyles" placeholder="e.g. Acme Corp"></div>
                <div>
                  <label :class="labelStyles">Business Type</label>
                  <select v-model="form.businessType" :class="inputStyles" class="bg-white">
                    <option value="ltd">Limited Company</option>
                    <option value="sole">Sole Proprietorship</option>
                  </select>
                </div>
              </div>

              <div v-else class="space-y-4">
                <div><label :class="labelStyles">Full Name</label><input v-model="form.fullName" :class="inputStyles" placeholder="John Doe"></div>
                <div class="grid grid-cols-2 gap-3">
                  <div><label :class="labelStyles">City</label><input v-model="form.city" :class="inputStyles" placeholder="Accra"></div>
                  <div><label :class="labelStyles">Phone</label><input v-model="form.phone" :class="inputStyles" placeholder="+233..."></div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-50 space-y-4">
                <div><label :class="labelStyles">Email Address</label><input v-model="form.email" type="email" :class="inputStyles" placeholder="name@company.com"></div>
                <div>
                  <label :class="labelStyles">Password</label>
                  <div class="relative">
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'" :class="inputStyles" placeholder="••••••••">
                    <button @click="togglePassword" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <button :disabled="!isStep1Valid" class="w-full py-4 rounded-xl font-bold text-sm transition-all mt-4" :class="isStep1Valid ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700' : 'bg-slate-100 text-slate-300 cursor-not-allowed'">Continue</button>
            </form>
          </div>

          <div v-if="currentStep === 2" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Verification</h1>
             <p class="text-slate-500 text-sm mb-10 font-medium">Verify your {{ accountType }} details to unlock full features.</p>

             <form @submit.prevent="nextStep" class="space-y-6">
                <div v-if="accountType === 'business'">
                  <label :class="labelStyles">Registration Number</label>
                  <input v-model="form.businessRegNumber" :class="inputStyles" placeholder="BN-1234567">
                </div>
                <div v-else>
                  <label :class="labelStyles">ID / Passport Number</label>
                  <input v-model="form.idNumber" :class="inputStyles" placeholder="GHA-0000000-0">
                </div>

                <div class="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
                   <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                   </div>
                   <span class="block text-sm font-bold text-slate-800">Upload Documents</span>
                   <span class="text-xs text-slate-400">PDF, PNG or JPG (Max 10MB)</span>
                </div>

                <button :disabled="!isStep2Valid" class="w-full py-4 rounded-xl font-bold text-sm transition-all" :class="isStep2Valid ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700' : 'bg-slate-100 text-slate-300 cursor-not-allowed'">Verify Identity</button>
             </form>
          </div>

        </div>

        <div class="mt-auto text-center pt-8">
           <p class="text-xs text-slate-400">Already have an account? <router-link to="/login" class="text-blue-600 font-bold hover:underline">Log in</router-link></p>
        </div>

      </div>
    </div>
  </div>
</template>