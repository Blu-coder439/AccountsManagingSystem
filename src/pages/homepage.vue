<template>
<onboarding-hero />
<hero2 />
<sponsor-hero />
<review-hero />
<trialbox />
<menu-hero />
<copyright-footer />
</template>

<script setup>
import { onMounted } from "vue"
import CopyrightFooter from "@/components/copyrightfooter.vue"
import MenuHero from "@/components/menuhero.vue"
import OnboardingHero from "@/components/onboardingHero.vue"
import hero2 from "@/components/hero2.vue"
import  SponsorHero from "@/components/sponsorhero.vue"
import ReviewHero from "@/components/reviewhero.vue"
import Trialbox from "@/components/trialbox.vue"
const toggleDark = () => {
  const html = document.documentElement

  html.classList.toggle("dark")

  const isDark = html.classList.contains("dark")
  localStorage.setItem("theme", isDark ? "dark" : "light")
}

onMounted(() => {
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark")
  }
})

onMounted(() => {
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark")
  }
})
</script>
