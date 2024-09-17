import { ref, watch } from "vue";

const number = ref("");

watch(number, (newValue) => {
  number.value = newValue
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
});
