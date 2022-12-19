import axios from "axios";
import { API_URL } from "../constants/URLS";

const axiosClient = axios.create({
  baseURL: API_URL,
  // timeout: 10000,
  //axiosClient sẽ lấy token trong localstrorage để bỏ vào phần header -bearerToken
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// REQUEST: Tất cả những cái API mà lấy data từ cơ sở dữ liệu, nếu lúc call API mà bị gác cổng bởi passport thì trc khi trả về data, sẽ qua đây lấy đc token rồi mới đi tiếp được, data cũng sẽ lấy ra đc. Dùng với tất cả REQUEST đc gửi lên.VD như page employees, chỗ phương thức getData bị gác cổng bởi passport.
//Interceptors là middleware ở phía client, tất cả những response trả về phía Client đều phải qua interceptor.

//Trước khi gửi request lên, thì sẽ qua interceptors, lấy đc token , nên sẽ qua đc jwt và data sẽ đc lấy ra.
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = window.localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] =
//         "Bearer " + window.localStorage.getItem("token");
//     }

//     return config;
//   },
//   (error) => {
//     Promise.reject(error);
//   }
// );

// RESPONSE
//Phần login:dùng để lưu token và refresh token vào localStorage:
// axiosClient.interceptors.response.use(
//   async (response) => {
//     const { token, refreshToken } = response.data;
//     // LOGIN
//     if (token) {
//       window.localStorage.setItem("token", token);
//     }
//     if (refreshToken) {
//       window.localStorage.setItem("refreshToken", refreshToken);
//     }

//     return response;
//   },
//   async (error) => {
//     if (error.response.status !== 401) {
//       return Promise.reject(error);
//     }

//     const originalConfig = error.config;

//     if (error.response.status === 401 && !originalConfig.sent) {
//       console.log("Error 🚀", error);
//       originalConfig.sent = true;
//       try {
//         // Trường hợp không có token thì chuyển sang trang LOGIN
//         const token = window.localStorage.getItem("token");
//         if (!token) {
//           window.location.href = "/login";
//           return Promise.reject(error);
//         }

//         const refreshToken = window.localStorage.getItem("refreshToken");
//         if (refreshToken) {
//           const response = await axiosClient.post("/auth/refresh-token", {
//             refreshToken: refreshToken,
//           });

//           const { token } = response.data;
//           window.localStorage.setItem("token", token);

//           originalConfig.headers = {
//             ...originalConfig.headers,
//             authorization: `Bearer ${token}`,
//           };

//           return axiosClient(originalConfig);
//         } else {
//           return Promise.reject(error);
//         }
//       } catch (err) {
//         return Promise.reject(err);
//       }
//     }
//   }
// );

export { axiosClient };
