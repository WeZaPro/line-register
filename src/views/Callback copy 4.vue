<template>
  <div class="registration-container">
    <!-- ส่วนของ Alert -->
    <AlertComponent
      v-if="alert.show"
      :message="alert.message"
      :type="alert.type"
    />

    <div class="form-container">
      <h1 class="form-title">ลงทะเบียน</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="course" class="highlight-label">
            <strong>คอร์สที่เลือก:</strong> {{ param }}
          </label>
        </div>

        <div class="form-group">
          <label for="price" class="highlight-label">
            <strong>คอร์ส ราคา:</strong> {{ price }}
          </label>
        </div>

        <div class="form-group">
          <label for="displayName" class="highlight-label">
            <strong>line display name:</strong> {{ displayName }}
          </label>
        </div>

        <!-- loading -->
        <div v-if="loading" class="loader"></div>
        <!-- loading -->

        <div class="form-group">
          <label for="date">วันที่ลงคอร์ส:</label>
          <input type="date" id="date" v-model="form.date" required />
        </div>
        <div class="form-group">
          <label for="name">ชื่อ-นามสกุล:</label>
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

        <!-- Add file input here -->
        <div class="form-group">
          <label for="file">อัพโหลดไฟล์:</label>
          <input type="file" id="file" @change="handleFileUpload" />
        </div>

        <button type="submit">ยืนยัน</button>
      </form>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import AlertComponent from "../components/AlertComponent.vue";

export default {
  name: "callback",
  components: {
    AlertComponent,
  },
  data() {
    return {
      loading: false,
      alert: {
        show: false,
        message: "",
        type: "success", // หรือ "error", "warning"
      },
      price: "", //peice couse
      param: "", // Param to hold course data
      displayName: "", // Line display name
      lineUserId: "", // Line lineUserId
      form: {
        name: "",
        date: "", // Initialize date field
        phone: "",
        email: "",
      },
      file: null, // Store the selected file
    };
  },
  created() {
    // Get param from cookies
    this.param = Cookies.get("param") || "ไม่มีข้อมูลคอร์ส";
    this.price = Cookies.get("price") || "ไม่มีข้อมูลคอร์ส";
    console.log("Param from cookies:", this.param);

    // Get 'code' and 'state' from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      this.getLineUserId(code, this.param, this.price);
    }
  },
  methods: {
    // Handle file selection
    handleFileUpload(event) {
      this.file = event.target.files[0]; // Get the selected file
      console.log("Selected file:", this.file);
    },

    async getLineUserId(code, param, price) {
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
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        });

        const data = await response.json();
        if (data.access_token) {
          const userProfile = await this.getUserProfile(data.access_token);
          console.log("userProfil >> ", userProfile);
          this.lineUserId = userProfile.userId || "ไม่ทราบuserId";
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
        lineUserId: this.lineUserId,
        param: this.param,
        price: this.price,
        file: this.file, // Add the file to the data being sent
      });

      // ตรวจสอบวันที่
      const inputDate = new Date(this.form.date); // แปลงวันที่จาก input
      const currentDate = new Date(); // วันที่ปัจจุบัน
      currentDate.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 เพื่อเปรียบเทียบเฉพาะวันที่
      inputDate.setHours(0, 0, 0, 0); // ตั้งเวลาเป็น 00:00:00 เช่นกัน

      // if (inputDate <= currentDate) {
      //   alert("กรุณาเลือกวันที่มากกว่าวันที่ปัจจุบัน");
      //   return; // หยุดการทำงานของฟังก์ชัน
      // }

      if (inputDate <= currentDate) {
        alert("กรุณาเลือกวันที่มากกว่าวันที่ปัจจุบัน");
        return; // หยุดการทำงานของฟังก์ชัน
      }

      // ตรวจสอบไฟล์
      if (!this.file || this.file.size === 0) {
        alert("กรุณาอัพโหลดไฟล์ก่อนส่งฟอร์ม");
        return; // หยุดการทำงานของฟังก์ชัน
      }

      // if (
      //   this.form.date ||
      //   this.form.name ||
      //   this.form.phone ||
      //   this.form.email === ""
      // ) {
      //   alert("กรุณากรอกข้อมูลให้ครบ");
      //   return; // หยุดการทำงานของฟังก์ชัน
      // }

      try {
        const apiEndpoint = import.meta.env.VITE_API + "/submit"; // Replace with your API URL

        // Create a FormData object to send the file along with other data
        const formData = new FormData();
        formData.append("date", this.form.date);
        formData.append("name", this.form.name);
        formData.append("phone", this.form.phone);
        formData.append("email", this.form.email);
        formData.append("displayName", this.displayName);
        formData.append("lineUserId", this.lineUserId);
        formData.append("param", this.param);
        formData.append("price", this.price);
        if (this.file) {
          formData.append("file", this.file); // Append the file to FormData
        }
        //Loading start
        this.loading = true;
        console.log("this.loading start submit ", this.loading);

        const response = await fetch(apiEndpoint, {
          method: "POST",
          body: formData, // Send the FormData object instead of JSON
        });

        const result = await response.json();
        console.log("Form submitted successfully:", result);
        // alert("ลงทะเบียนสำเร็จ!");

        if (response.status === 200) {
          //Loading End
          this.loading = false;

          this.alert = {
            show: true,
            message: "ลงทะเบียนสำเร็จ!",
            type: "success",
          };
          // send to gtm
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "formSubmit_vue",
            formData: {
              course: this.param,
              price: this.price,
              displayName: this.displayName,
              date: this.form.date,
              name: this.form.name,
              phone: this.form.phone,
              email: this.form.email,
            },
          });

          this.resetForm(); // รีเซ็ตฟอร์ม

          setTimeout(() => {
            // window.location.href = "https://vbacvetthailand.com/thankyoupage";
            window.open(
              // `https://vbacvetthailand.com/thankyoupage/?lineID=${this.lineUserId}`
              `https://vbacvetthailand.com/thankyoupage/?lineID=${this.lineUserId}&phone=${result.dataCustomer.phone}&email=${result.dataCustomer.email}&course=${result.dataCustomer.param}&price=${result.dataCustomer.price}`
            );
          }, 0);
          console.log("result phone", result.dataCustomer.phone);
          console.log("result price", result.dataCustomer.price);

          window.close(); // Close the current page

          // open thankyou page
          //https://vbacvetthailand.com/thankyoupage/
        }
      } catch (error) {
        this.alert = {
          show: true,
          message: "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองอีกครั้ง",
          type: "error",
        };
        // console.error("Error submitting form:", error);
        // alert("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองอีกครั้ง");
      }
    },

    resetForm() {
      // Reset the form
      this.form.date = "";
      this.form.name = "";
      this.form.phone = "";
      this.form.email = "";
      this.displayName = "";
      // this.lineUserId = "";
      this.param = "";
      this.file = null; // Reset the file field

      // Reset input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = null;
      }
    },
  },
};
</script>

<style scoped>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7fa;
}

.form-container {
  width: 80%;
  max-width: 600px;
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  color: #3c4a60;
  font-size: 28px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 16px;
  color: #6c757d;
  margin-bottom: 8px;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="date"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-sizing: border-box;
}

input[type="file"] {
  padding: 5px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:focus {
  outline: none;
}

.highlight-label {
  color: #007bff;
}

form {
  display: flex;
  flex-direction: column;
}

input:focus,
button:focus {
  border-color: #007bff;
  outline: none;
}

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
