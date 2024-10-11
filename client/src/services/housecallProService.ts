import { Customer } from "src/types/customer";
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

export const createCustomer = async (customer: Customer) => {
  try {
    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const lastName = lastNameParts.length > 0 ? lastNameParts.join(" ") : "";

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: customer.email,
      company: null,
      notifications_enabled: false,
      mobile_number: null,
      home_number: customer.phone, // Set the number to home number by default
      work_number: null,
      tags: null,
      lead_source: null,
      notes: null,
      addresses: [
        {
          street: customer.address.street,
          street_line_2: customer.address.street_line_2,
          city: customer.address.city,
          state: customer.address.state,
          zip: customer.address.zip,
          country: customer.address.country,
        },
      ],
    };

    console.log(payload);

    const response = await apiClient.post("/customers", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};
