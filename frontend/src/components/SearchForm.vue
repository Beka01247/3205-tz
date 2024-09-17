<template>
  <div class="container">
    <form @submit.prevent="submitForm" class="form">
      <label for="email" class="label">Email:</label>
      <input
        id="email"
        type="email"
        v-model="email"
        placeholder="Enter email"
        class="input"
        required
      />

      <label for="number" class="label">Number (optional):</label>
      <input
        id="number"
        type="text"
        v-model="maskedNumber"
        placeholder="XX-XX-XX"
        class="input"
        @input="maskNumber"
      />

      <button type="submit" :disabled="isLoading" class="submit-button">
        {{ isLoading ? "Loading..." : "Submit" }}
      </button>
    </form>

    <div
      v-if="isSubmitted && !isLoading && users.length === 0 && !errorMessage"
      class="no-users-message"
    >
      No users found.
    </div>

    <div v-if="users.length > 0" class="user-container">
      <h3 class="user-title">Results:</h3>
      <ul class="user-list">
        <li v-for="user in users" :key="user.email" class="user-item">
          <strong>Email:</strong> {{ user.email }} <br />
          <strong>Number:</strong> {{ formatMaskedNumber(user.number) }}
        </li>
      </ul>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

interface User {
  email: string;
  number?: string;
}

const email = ref<string>("");
const maskedNumber = ref<string>("");
const users = ref<User[]>([]);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");
const isSubmitted = ref<boolean>(false);
let abortController: AbortController | null = null;

const maskNumber = () => {
  maskedNumber.value = maskedNumber.value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
};

const formatMaskedNumber = (number?: string) => {
  if (!number) {
    return "N/A";
  }
  return number.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
};

const submitForm = async () => {
  isSubmitted.value = true;

  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorMessage.value = "Please enter a valid email.";
    return;
  }
  errorMessage.value = "";

  const number = maskedNumber.value
    ? maskedNumber.value.replace(/-/g, "")
    : undefined;

  const params = { email: email.value, number };

  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  isLoading.value = true;

  try {
    const response = await axios.get("http://localhost:3000/api/users", {
      params,
      signal: abortController.signal,
    });
    users.value = response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Previous request canceled");
    } else {
      errorMessage.value = "Failed to fetch data. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  background-color: #f9fafb;
  font-family: "Roboto", sans-serif;
}

.form {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.label {
  font-weight: bold;
  color: #333;
}

.input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.input:focus {
  outline: none;
  border-color: #007bff;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.submit-button:disabled {
  background-color: #6c757d;
}

.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.user-container {
  margin-top: 20px;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.user-title {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.user-list {
  list-style-type: none;
  padding: 0;
}

.user-item {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.no-users-message {
  color: #ff6b6b;
  font-weight: bold;
  margin-top: 20px;
}
</style>
