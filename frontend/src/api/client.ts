import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) throw new Error("VITE_API_URL is missing (build-time)");

const apiClient = axios.create({ baseURL });

export const setAuthInterceptor = (getToken: (options?: any) => Promise<string>) => {
  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken({
      authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
    });

    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
    return config;
  });
};

export default apiClient;
