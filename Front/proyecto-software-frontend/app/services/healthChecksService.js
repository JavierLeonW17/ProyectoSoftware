import apiClient from "../api/axios";

const BASE = "/healthChecksController";

export const healthChecksService = {
  healthDatabase() {
    return apiClient.post(`${BASE}/health-database`);
  },
};

export default healthChecksService;
