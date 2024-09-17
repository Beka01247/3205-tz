<template>
  <div>
    <form @submit.prevent="submitForm">
      <label>Email: </label>
      <input type="email" v-model="email" required />

      <label>Number: </label>
      <input type="text" v-model="maskedNumber" placeholder="XX-XX-XX" />

      <button type="submit">Submit</button>
    </form>

    <div v-if="users.length > 0">
      <h3>Results:</h3>
      <ul>
        <li v-for="user in users" :key="user.email">
          {{ user.email }} - {{ user.number }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const maskedNumber = ref("");
const users = ref([]);
let abortController: AbortController | null = null;

function submitForm() {
  const number = maskedNumber.value.replace(/-/g, "");
  const query = `?email=${email.value}${number ? `&number=${number}` : ""}`;

  if (abortController) abortController.abort();

  abortController = new AbortController();
  fetch(`/api/users${query}`, { signal: abortController.signal })
    .then((res) => res.json())
    .then((data) => (users.value = data))
    .catch((err) => console.error(err));
}
</script>
