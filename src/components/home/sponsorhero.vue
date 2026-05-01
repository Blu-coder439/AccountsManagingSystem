<script setup>
const sponsors = [
  { id: 1, name: 'Minnova', logo: 'https://via.placeholder.com/160x80?text=Company+A' },
  { id: 2, name: 'Cornerstone Consult', logo: 'https://via.placeholder.com/160x80?text=Company+B' },
  { id: 3, name: 'Hubtel', logo: 'https://via.placeholder.com/160x80?text=Company+C' },
  { id: 4, name: 'Company D', logo: 'https://via.placeholder.com/160x80?text=Company+D' }
]
</script>

<template>
  <section class="relative overflow-hidden bg-[#FDFDFE] px-6 py-24 font-sans antialiased">
    <div class="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-blue-50/80 to-transparent"></div>

    <div class="relative mx-auto max-w-7xl">
      <div class="mx-auto mb-16 max-w-3xl text-center">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
          <span class="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">
            Trusted Partners
          </span>
        </div>

        <h2 class="mb-6 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">
          Trusted by leading companies
        </h2>

        <p class="text-lg leading-relaxed text-slate-600">
          Teams choose Accentra for reliable automation, cleaner reporting, and a finance
          workflow that feels refreshingly simple.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="sponsor in sponsors"
          :key="sponsor.id"
          class="group rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-950/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
        >
          <div class="mb-8 flex h-24 items-center justify-center rounded-4xl border border-slate-100 bg-slate-50 px-6 transition-colors duration-300 group-hover:bg-blue-50">
            <img
              :src="sponsor.logo"
              :alt="sponsor.name"
              class="max-h-12 w-auto opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </div>

          <p class="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
            Sponsor
          </p>
          <h3 class="text-xl font-bold tracking-tight text-slate-900">
            {{ sponsor.name }}
          </h3>
        </article>
      </div>
    </div>
  </section>
</template>
