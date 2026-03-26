<template>
  <section class="flex flex-col items-center justify-center px-6 py-16">
    <div class="relative w-full max-w-2xl overflow-hidden rounded-4xl border border-slate-100 bg-slate-50 shadow-xl shadow-slate-950/5">
      <div
        class="flex transition-transform duration-700 ease-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(review, index) in reviews"
          :key="index"
          class="w-full shrink-0 px-6 py-12 text-center md:px-12"
        >
          <p class="mb-6 text-lg font-semibold leading-relaxed text-slate-800 md:text-xl">
            {{ review.text }}
          </p>
          <img
            :src="review.profilePic"
            :alt="review.name"
            class="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-4 ring-white"
          >
          <p class="m-0 text-sm font-medium tracking-wide text-slate-500">
            {{ review.name }}
          </p>
        </div>
      </div>

      <button
        class="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/70 text-lg text-white transition hover:bg-slate-900 md:left-4"
        @click="previousReview"
        aria-label="Previous review"
      >
        &#10094;
      </button>

      <button
        class="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/70 text-lg text-white transition hover:bg-slate-900 md:right-4"
        @click="nextReview"
        aria-label="Next review"
      >
        &#10095;
      </button>
    </div>

    <div class="mt-6 flex items-center justify-center gap-3">
      <button
        v-for="(review, index) in reviews"
        :key="index"
        :class="currentIndex === index ? 'bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'"
        class="h-2.5 w-2.5 rounded-full transition"
        @click="goToReview(index)"
        :aria-label="`Go to review ${index + 1}`"
      ></button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ReviewHero',
  data() {
    return {
      currentIndex: 0,
      autoSlideInterval: null,
      reviews: [
        {
          text: 'FinFlow helped us cut our monthly bookkeeping time in half and finally gave our team clean reports we can trust.',
          profilePic: 'https://i.pravatar.cc/160?img=12',
          name: 'Maya Thompson'
        },
        {
          text: 'The invoicing and expense tracking tools are incredibly easy to use. Our operations feel much more organized now.',
          profilePic: 'https://i.pravatar.cc/160?img=32',
          name: 'Daniel Kim'
        },
        {
          text: 'What used to take days now takes a few clicks. The dashboard gives us a clear picture of our business at any time.',
          profilePic: 'https://i.pravatar.cc/160?img=48',
          name: 'Sofia Martinez'
        }
      ]
    }
  },
  mounted() {
    this.startAutoSlide()
  },
  beforeUnmount() {
    this.stopAutoSlide()
  },
  methods: {
    startAutoSlide() {
      this.stopAutoSlide()
      this.autoSlideInterval = setInterval(() => {
        this.advanceReview(1)
      }, 4000)
    },
    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval)
        this.autoSlideInterval = null
      }
    },
    advanceReview(step) {
      this.currentIndex = (this.currentIndex + step + this.reviews.length) % this.reviews.length
    },
    nextReview() {
      this.advanceReview(1)
      this.startAutoSlide()
    },
    previousReview() {
      this.advanceReview(-1)
      this.startAutoSlide()
    },
    goToReview(index) {
      this.currentIndex = index
      this.startAutoSlide()
    }
  }
}
</script>
