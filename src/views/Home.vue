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
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";
export default {
  name: "App",
  data() {
    return {
      // courseFree: false,
    };
  },
  created() {
    const param = ref("");
    const course = ref("");
    const price = ref("");
    const queryParams = this.$route.query;
    console.log("queryParams", queryParams);

    // ดึงค่า liff.state จาก queryParams
    const liffState = queryParams["liff.state"];

    if (liffState) {
      // ใช้ URLSearchParams แปลง liff.state และดึงค่า param กับ price
      const queryParamsState = new URLSearchParams(liffState);
      param.value = queryParamsState.get("param") || "";
      course.value = queryParamsState.get("course") || "";
      price.value = queryParamsState.get("price") || "";
      console.log("param.value", param.value);
      console.log("course.value", course.value);
      console.log("price.value", price.value);

      Cookies.set("param", param.value, { expires: 30 });
      Cookies.set("course", course.value, { expires: 30 });
      Cookies.set("price", price.value, { expires: 30 });
    }

    // const param_test = ref("");
    // const price_test = ref("");
    // สมมติว่า liff.state คือข้อมูล query string ที่ได้รับมา
    // const liffState = queryParams;

    // ใช้ URLSearchParams ในการแยก query string
    // const queryParamsTest = new URLSearchParams(liffState);
    // console.log("queryParamsTest", queryParamsTest);

    // ดึงค่าจาก query string
    // param_test.value = queryParamsTest.get("param");
    // price_test.value = queryParamsTest.get("price");
    // console.log("price_test.value ", price_test.value);
    // console.log(" param_test.value ", param_test.value);

    //https://fde9-49-49-142-138.ngrok-free.app/?param=free&price=0
    // console.log("VITE_CALLBACK_URL HOME", import.meta.env.VITE_CALLBACK_URL);
    // const queryParams = this.$route.query;

    // const param = queryParams.param;

    // Cookies.set("param", param_test.value, { expires: 30 });

    // const price = queryParams.price;

    // Cookies.set("price", price_test.value, { expires: 30 });
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
