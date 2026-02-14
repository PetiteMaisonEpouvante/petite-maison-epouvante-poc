import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export const setAuthInterceptor = (
  getToken: (options?: any) => Promise<string>
) => {
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });

    // ✅ compatible AxiosHeaders
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  });
};

export default apiClient;
