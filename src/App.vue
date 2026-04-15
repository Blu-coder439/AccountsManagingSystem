<script setup>
import { onMounted, ref } from 'vue';
import { supabase } from './utils/supabase';

const todos = ref([]);
const todosError = ref('');

async function getTodos() {
  todosError.value = '';

  const { data, error } = await supabase.from('todos').select();

  if (error) {
    todosError.value = error.message;
    return;
  }

  todos.value = data || [];
}

onMounted(() => {
  getTodos();
});
</script>

<template>
  <router-view />

  <section class="mx-auto max-w-4xl px-4 py-8">
    <h2 class="mb-4 text-xl font-bold text-slate-900">Supabase Todos</h2>

    <p v-if="todosError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {{ todosError }}
    </p>

    <ul v-else class="space-y-2">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm"
      >
        {{ todo.name }}
      </li>
      <li v-if="todos.length === 0" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
        No todos found.
      </li>
    </ul>
  </section>
</template>

