<template>
  <div class="registration-container">
    <div class="form-container">
      <h1>ลงทะเบียน</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="course" class="highlight-label">
            <strong>คอร์สที่เลือก:</strong> {{ param }}
          </label>
        </div>

        <div class="form-group">
          <label for="displayName" class="highlight-label">
            <strong>line display name:</strong> {{ displayName }}
          </label>
        </div>

        <div class="form-group">
          <label for="date">วันที่:</label>
          <input type="date" id="date" v-model="form.date" required />
        </div>
        <div class="form-group">
          <label for="name">ชือ-นามสกุล:</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            placeholder="ใส่ชื่อ-นามสกุล"
            required
          />
        </div>
        <div class="form-group">
          <label for="phone">เบอร์โทรศัพท์:</label>
          <input
            type="tel"
            id="phone"
            v-model="form.phone"
            placeholder="ใส่เบอร์โทรศัพท์"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">อีเมล:</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="ใส่อีเมล"
            required
          />
        </div>
        <button type="submit">ยืนยัน</button>
      </form>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "callback",
  data() {
    return {
      param: "",
      displayName: "",
      form: {
        name: "",
        date: "",
        phone: "",
        email: "",
      },
    };
  },
  created() {
    // Get param from cookies
    this.param = Cookies.get("param") || "ไม่มีข้อมูลคอร์ส";
    console.log("Param from cookies:", this.param);

    // Get 'code' and 'state' from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      this.getLineUserId(code, this.param);
    }
  },
  methods: {
    async getLineUserId(code, param) {
      try {
        const redirectUri = import.meta.env.VITE_CALLBACK_URL + "/callback";
        const clientId = import.meta.env.VITE_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", redirectUri);
        params.append("client_id", clientId);
        params.append("client_secret", clientSecret);

        const response = await fetch("https://api.line.me/oauth2/v2.1/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });

        const data = await response.json();
        if (data.access_token) {
          const userProfile = await this.getUserProfile(data.access_token);
          this.displayName = userProfile.displayName || "ไม่ทราบชื่อผู้ใช้";
        } else {
          console.error("Error getting access token:", data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async getUserProfile(accessToken) {
      try {
        const response = await fetch("https://api.line.me/v2/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },

    async submitForm() {
      console.log("Submitting form...");
      console.log("Data to be sent:", {
        date: this.form.date,
        name: this.form.name,
        phone: this.form.phone,
        email: this.form.email,
        displayName: this.displayName,
        param: this.param,
      });

      try {
        const apiEndpoint = import.meta.env.VITE_API + "/submit"; // Replace with your API URL
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: this.form.date,
            name: this.form.name,
            phone: this.form.phone,
            email: this.form.email,
            displayName: this.displayName,
            param: this.param,
          }),
        });

        const result = await response.json();
        console.log("Form submitted successfully:", result);
        alert("ลงทะเบียนสำเร็จ!");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองอีกครั้ง");
      }
    },
  },
};
</script>

<style scoped>
/* กำหนดให้คอนเทนเนอร์ของฟอร์มอยู่กลางหน้าจอ */
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  margin: 0;
}

/* กำหนดรูปแบบของฟอร์ม */
.form-container {
  width: 50%;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
}

/* รูปแบบของหัวข้อ */
h1 {
  margin-bottom: 20px;
  color: #333333;
}

/* รูปแบบของกลุ่มฟอร์ม */
.form-group {
  margin-bottom: 15px;
  text-align: left;
}

/* รูปแบบของป้ายชื่อ */
label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

/* รูปแบบของช่องกรอกข้อมูล */
input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* รูปแบบของปุ่ม */
button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
