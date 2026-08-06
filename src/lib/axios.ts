import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds request timeout
});

// Response Interceptor for Centralized Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "নেটওয়ার্ক বা সার্ভারে সমন্যা হয়েছে। আবার চেষ্টা করুন।",
      details: error.response?.data?.details || null,
    };

    console.error("[API Error Interceptor]", customError);
    return Promise.reject(customError);
  }
);

export default apiClient;
