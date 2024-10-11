import apiClient from "../services/apiClient";

export const fetchCustomersByEmail = async (email: string) => {
  try {
    const response = await apiClient.get("/customers", {
      params: { q: email },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};
