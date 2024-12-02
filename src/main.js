import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createGtm } from "@gtm-support/vue-gtm";

// สร้างแอปพลิเคชันและใช้ router
createApp(App)
  .use(
    createGtm({
      id: "GTM-MLR855KP", // GTM ID // form-register-vbac
    })
  )
  .use(router)
  .mount("#app");
