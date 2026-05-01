import apiClient from "../api/axios";
import { API_PREFIX } from "./config";

const BASE = `${API_PREFIX}/auth`;

export const authService = {
  register(payload) {
    return apiClient.post(`${BASE}/register`, payload);
  },

  verifyEmail(token) {
    return apiClient.get(`${BASE}/verify-email`, { params: { token } });
  },

  login(credentials) {
    return apiClient.post(`${BASE}/login`, credentials);
  },

  refresh(refreshToken) {
    return apiClient.post(`${BASE}/refresh`, { refreshToken });
  },

  logout(refreshToken) {
    const body = refreshToken ? { refreshToken } : undefined;
    return apiClient.post(`${BASE}/logout`, body);
  },

  forgotPassword(correo) {
    return apiClient.post(`${BASE}/forgot-password`, { correo });
  },

  resetPassword(payload) {
    return apiClient.post(`${BASE}/reset-password`, payload);
  },

  me() {
    return apiClient.get(`${BASE}/me`);
  },
};

export default authService;
