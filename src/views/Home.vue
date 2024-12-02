<template>
  <div id="app">
    <div class="card">
      <!-- <img
        class="card-image"
        src="https://via.placeholder.com/400x200"
        alt="LINE Login"
      /> -->
      <h1 class="card-title">ขั้นตอนการลงทะเบียน</h1>
      <img
        class="card-image"
        src="https://vbacvetthailand.com/wp-content/uploads/2024/11/6751922.jpg"
        alt="LINE Login"
      />
      <!-- <h1 class="card-title">ขั้นตอนการลงทะเบียน</h1> -->
      <button class="login-button" @click="loginWithLine">ลงทะเบียน</button>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  name: "App",
  created() {
    console.log("VITE_CALLBACK_URL HOME", import.meta.env.VITE_CALLBACK_URL);
    const queryParams = this.$route.query;
    const param = queryParams.param;
    Cookies.set("param", param, { expires: 7 });

    const price = queryParams.price;
    Cookies.set("price", price, { expires: 7 });
  },
  methods: {
    loginWithLine() {
      const channelId = import.meta.env.VITE_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_CALLBACK_URL + "/callback";
      const state = import.meta.env.VITE_CLIENT_STATE;

      const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${redirectUri}&state=${state}&scope=profile`;
      window.location.href = lineLoginUrl;
    },
  },
};
</script>

<style scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.card {
  width: 80%;
  max-width: 800px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
}

.card-image {
  width: 100%;
  border-radius: 8px 8px 0 0;
}

.card-title {
  font-size: 1.5em;
  color: #333;
  margin: 20px 0;
}

.login-button {
  background-color: #00c300; /* LINE สีเขียว */
  color: white;
  font-size: 1em;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #00a600; /* สีเขียวเข้มขึ้นเมื่อ hover */
}

.login-button:active {
  background-color: #008a00; /* สีเข้มขึ้นเมื่อกด */
}
</style>
