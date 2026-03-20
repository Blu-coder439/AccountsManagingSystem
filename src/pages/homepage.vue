<template>
<onboarding-hero />
<hero2 />
</template>

<script setup>
import { onMounted } from "vue"
import OnboardingHero from "@/components/onboardingHero.vue"
import hero2 from "@/components/hero2.vue"
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