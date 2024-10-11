import { fetchCustomersByEmail } from "../services/housecallProService";
import { Customer } from "../types/customer";

function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

export const getCustomerAddressString = (customer: Customer): string => {
  const { street, street_line_2, city, state, zip, country } = customer.address;
  return `${street}${street_line_2 ? ", " + street_line_2 : ""}, ${city}, ${state} ${zip}, ${country}`;
};

export const customerExists = async (customer: Customer): Promise<boolean> => {
  try {
    const { email, name, phone } = customer;
    console.log(`customer data ${email}, ${name}, ${phone}`);
    const response = await fetchCustomersByEmail(email);

    console.log(response);

    if (response.customers && response.customers.length > 0) {
      const [firstName, lastName] = name.split(" ");

      // Iterate through customers to check if we have a match
      for (const apiCustomer of response.customers) {
        const isNameMatch =
          apiCustomer.first_name === name ||
          (apiCustomer.first_name === firstName && apiCustomer.last_name === lastName);

        const normalNumber = normalizePhoneNumber(phone);
        const isPhoneMatch =
          apiCustomer.mobile_number === normalNumber ||
          apiCustomer.home_number === normalNumber ||
          apiCustomer.work_number === normalNumber;

        if (isNameMatch && isPhoneMatch) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking if customer exists:", error);
    return false;
  }
};
