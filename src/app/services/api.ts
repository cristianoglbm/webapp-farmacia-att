import axios from "axios";

// Instância do axios com URL base da API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Lê o token salvo nos cookies do navegador de forma mais robusta
    let token = null;
    if (typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      if (match) {
        token = match[2];
      }
    }

    // Se existir token, adiciona no cabeçalho
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros da API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl: string | undefined = error?.config?.url;
    const skipRedirect =
      error?.config?.headers?.["x-skip-auth-redirect"] === "true";

    // Se resposta for 401 (não autorizado), redireciona para login
    if (
      error?.response?.status === 401 &&
      !skipRedirect &&
      requestUrl &&
      !requestUrl.includes("/auth/login")
    ) {
      // Remove o token do cookie
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redireciona para login
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
