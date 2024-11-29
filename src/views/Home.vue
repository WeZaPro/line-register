<template>
  <div id="app">
    <h1>LINE Login WebApp</h1>
    <button @click="loginWithLine">Login with LINE</button>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  name: "App",
  // ในไฟล์ App.vue หรือคอมโพเนนต์หลัก
  created() {
    console.log("VITE_CALLBACK_URL HOME", import.meta.env.VITE_CALLBACK_URL);

    // https://4d01-49-48-56-175.ngrok-free.app/?param=1234
    const queryParams = this.$route.query;
    // console.log("queryParams ", queryParams);
    const param = queryParams.param;
    Cookies.set("param", param, { expires: 7 });
  },
  methods: {
    loginWithLine() {
      const channelId = import.meta.env.VITE_CLIENT_ID; // Channel ID จาก LINE Developers
      // const redirectUri = encodeURIComponent(
      //   "https://d130-49-48-56-175.ngrok-free.app/callback"
      // ); // URL ของ Callback
      const redirectUri = import.meta.env.VITE_CALLBACK_URL + "/callback"; // ไม่ต้องใช้ encodeURIComponent

      const state = import.meta.env.VITE_CLIENT_STATE; // ค่า state เพื่อเพิ่มความปลอดภัย

      // URL สำหรับทำการ Login กับ LINE
      const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${redirectUri}&state=${state}&scope=profile`;

      // เปิดหน้าต่างใหม่เพื่อให้ผู้ใช้เข้าสู่ระบบ
      window.location.href = lineLoginUrl;
    },
  },
};
</script>
