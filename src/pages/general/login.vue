<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiUrl } from '@/utils/api-base';
import { supabase } from '@/utils/supabase';
import { syncCurrentUserProfile } from '@/utils/auth-session';

// --- STYLING CONSTANTS ---
const inputStyles = "w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all placeholder:text-slate-300";
const labelStyles = "block text-sm font-semibold text-slate-800 mb-1.5";
const socialBtnStyles = "w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-800";

// --- STATE ---
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();

// --- METHODS ---
const signInWithPassword = (loginEmail) => supabase.auth.signInWithPassword({
    email: loginEmail,
    password: password.value
});

const preparePasswordLogin = async (loginEmail) => {
    const response = await fetch(apiUrl('/api/auth/prepare-login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail }),
    });

    if (!response.ok && response.status !== 404) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.details?.message || data.error || 'Could not prepare this account for login.');
    }
};

const handleLogin = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    isSubmitting.value = true;

    try {
        const loginEmail = email.value.trim().toLowerCase();
        let { error } = await signInWithPassword(loginEmail);

        if (error) {
            if (error.status === 400) {
                await preparePasswordLogin(loginEmail);
                const retryResult = await signInWithPassword(loginEmail);
                error = retryResult.error;

                if (error?.status === 400) {
                    throw new Error('Invalid email or password.');
                }
            }

            if (error) {
                throw error;
            }
        }

        const currentUser = await syncCurrentUserProfile();
        const displayName = currentUser.full_name || currentUser.business_name || currentUser.email;
        successMessage.value = `Welcome back, ${displayName}.`;
        email.value = '';
        password.value = '';

        setTimeout(() => {
            router.push('/dashboard');
        }, 800);
    } catch (error) {
        errorMessage.value = error instanceof TypeError
          ? 'Could not reach the login service. Make sure the backend is running locally or the deployment is configured correctly.'
          : error.message;
    } finally {
        isSubmitting.value = false;
    }
};

const loginWithGoogle = () => console.log('Google login');
const loginWithMicrosoft = () => console.log('Microsoft login');
const togglePassword = () => { showPassword.value = !showPassword.value; };
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans antialiased animate-slideUp">
    
    <div class="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 flex overflow-hidden min-h-187.5">
      
      <div class="hidden lg:block w-[45%] relative">
        <img 
          src="@/assets/login.jpg" 
          class="absolute inset-0 w-full h-full object-cover"
          alt="Login background"
        />
        
        <div class="absolute bottom-12 left-10 right-10">
          <p class="text-white/70 text-sm font-medium mb-2">Accentra</p>
          <h2 class="text-white text-3xl font-bold leading-tight">
            Welcome back to the future of finance management.
          </h2>
        </div>
      </div>

      <div class="w-full lg:w-[55%] p-8 lg:p-16 flex flex-col">
        
        <div class="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          
          <div class="mb-10 text-center lg:text-left">
            <div class="mb-5 inline-flex rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
              <span class="text-xl font-black uppercase italic tracking-tighter text-slate-900">
                Fin<span class="text-blue-600">Flow</span>
              </span>
            </div>
            <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tight">Log In</h1>
            <p class="text-slate-500 text-sm font-medium">Please enter your details to access your account.</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" :class="labelStyles">Email Address</label>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                placeholder="name@company.com" 
                required 
                :class="inputStyles"
              >
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label for="password" :class="labelStyles" class="mb-0">Password</label>
                <router-link to="/forgot-password" class="text-xs font-bold text-blue-600 hover:underline">
                    Forgot password?
                </router-link>
              </div>
              <div class="relative">
                <input 
                  id="password" 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="••••••••" 
                  required 
                  :class="inputStyles + ' pr-12'"
                >
                <button @click="togglePassword" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" stroke-width="2"/></svg>
                </button>
              </div>
            </div>

            <div class="flex items-center">
              <label class="flex items-center text-slate-600 cursor-pointer text-sm font-medium">
                <input v-model="rememberMe" type="checkbox" class="w-4 h-4 mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
                Remember me
              </label>
            </div>

            <p v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {{ errorMessage }}
            </p>

            <p v-if="successMessage" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {{ successMessage }}
            </p>

            <button 
              type="submit"
              :disabled="isSubmitting"
              class="w-full py-4 rounded-xl font-bold text-sm bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {{ isSubmitting ? 'Logging in...' : 'Log In' }}
            </button>
          </form>

          <div class="w-full flex items-center gap-4 my-8 text-[11px] text-slate-400 font-medium uppercase tracking-widest">
            <div class="h-px w-full bg-slate-100"></div> Or <div class="h-px w-full bg-slate-100"></div>
          </div>

          <div class="space-y-3">
            <button @click="loginWithGoogle" :class="socialBtnStyles">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google"> 
                Continue with Google
            </button>
            <button @click="loginWithMicrosoft" :class="socialBtnStyles">
                <img src="https://www.svgrepo.com/show/332151/microsoft.svg" class="w-5 h-5" alt="Microsoft"> 
                Continue with Microsoft
            </button>
          </div>
        </div>

        <div class="mt-auto text-center pt-8">
           <p class="text-sm text-slate-600 font-medium">
             Don't have an account? 
             <router-link to="/signup" class="text-blue-600 font-bold hover:underline">Sign up</router-link>
           </p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slideUp {
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
