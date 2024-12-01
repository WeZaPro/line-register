<template>
  <div v-if="show" class="alert" :class="`alert-${type}`">
    <p>{{ message }}</p>
    <button class="close-btn" @click="closeAlert">×</button>
  </div>
</template>

<script>
export default {
  name: "AlertComponent",
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success", // success, error, warning
    },
  },
  data() {
    return {
      show: true,
    };
  },
  methods: {
    closeAlert() {
      this.show = false;
    },
  },
};
</script>

<style scoped>
.alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.alert-success {
  background-color: #28a745;
}
.alert-error {
  background-color: #dc3545;
}
.alert-warning {
  background-color: #ffc107;
  color: #212529;
}
.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: white;
  cursor: pointer;
  margin-left: 10px;
}
</style>
