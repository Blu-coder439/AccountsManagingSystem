<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white hidden md:flex flex-col">
      <div class="p-6 text-2xl font-bold border-b border-gray-700">
        AI Accounting
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <a href="#" class="block px-4 py-2 rounded-lg bg-gray-800">
          Dashboard
        </a>
        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
          Transactions
        </a>
        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
          Reports
        </a>
        <a href="#" class="block px-4 py-2 rounded-lg hover:bg-gray-800">
          AI Insights
        </a>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">

      <!-- Top Navbar -->
      <header class="bg-white dark:bg-gray-800 shadow px-6 py-4 flex justify-between items-center transition-colors duration-300">
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white">
          Dashboard
        </h1>

        <div class="flex items-center gap-4">
          <button
            @click="toggleDark"
            class="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            🌙 Toggle
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors duration-300">
          <h2 class="text-gray-500 dark:text-gray-400">Total Revenue</h2>
          <p class="text-3xl font-bold mt-2 text-gray-800 dark:text-white">
            ₵ 120,000
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors duration-300">
          <h2 class="text-gray-500 dark:text-gray-400">Expenses</h2>
          <p class="text-3xl font-bold mt-2 text-gray-800 dark:text-white">
            ₵ 45,000
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors duration-300">
          <h2 class="text-gray-500 dark:text-gray-400">Net Profit</h2>
          <p class="text-3xl font-bold mt-2 text-green-600">
            ₵ 75,000
          </p>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"

const toggleDark = () => {
  document.documentElement.classList.toggle("dark")

  // Save preference
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  )
}

onMounted(() => {
  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark")
  }
})
</script>