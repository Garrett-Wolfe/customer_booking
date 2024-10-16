import { Customer } from "src/types/customer";
import apiClient from "../services/apiClient";
import { Schedule } from "src/types/company";
import { NewJob } from '../types/company';

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

export const fetchBookingWindows = async (date: Date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0];
    const response = await apiClient.get("/company/schedule_availability/booking_windows", {
      params: {
        start_date: formattedDate,
        show_for_days: 7,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching booking windows:", error);
    throw error;
  }
};

export const createCustomer = async (customer: Customer): Promise<Customer> => {
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
      home_number: customer.phone, // Home is default. Safer to assume SMS is not available
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

    const response = await apiClient.post("/customers", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const createdCustomer = response.data;

    return {
      ...customer,
      id: createdCustomer.id,
      addressId: createdCustomer.addresses[0]?.id || null,
      isNew: false,
    };
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const fetchJobsInWeek = async (date: Date) => {
  try {
    // Get the Monday and Sunday dates for the given week
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Set to Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Sunday

    const formattedStartDate = startOfWeek.toISOString().split("T")[0];
    const formattedEndDate = endOfWeek.toISOString().split("T")[0];

    const response = await apiClient.get("/jobs", {
      params: {
        scheduled_start_min: formattedStartDate,
        scheduled_end_max: formattedEndDate,
        sort_direction: "asc",
      },
    });

    const jobs = response.data.jobs;

    const schedules: Schedule[] = [
      { day: "Sun", jobs: [] },
      { day: "Mon", jobs: [] },
      { day: "Tue", jobs: [] },
      { day: "Wed", jobs: [] },
      { day: "Thu", jobs: [] },
      { day: "Fri", jobs: [] },
      { day: "Sat", jobs: [] },
    ];

    jobs.forEach((job: { schedule: { scheduled_start: string; scheduled_end: string }; name: string }) => {
      const scheduledStart = new Date(job.schedule.scheduled_start);
      const dayIndex = scheduledStart.getDay();

      schedules[dayIndex].jobs.push({
        start: job.schedule.scheduled_start,
        end: job.schedule.scheduled_end,
        title: job.name,
      });

      schedules[dayIndex].jobs.sort((a, b) => a.start.localeCompare(b.start));
    });

    return schedules;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const createJob = async ({ customerId, addressId, jobName, scheduledStart, scheduledEnd }: NewJob) => {
  try {
    const payload = {
      invoice_number: 0,
      customer_id: customerId,
      address_id: addressId,
      schedule: {
        scheduled_start: scheduledStart.toISOString(),
        scheduled_end: scheduledEnd.toISOString(),
        arrival_window: 0
      },
      assigned_employee_ids: [],
      line_items: [
        {
          name: jobName,
          description: null,
          unit_price: 0,
          quantity: 1,
          unit_cost: 0
        }
      ],
      tags: [],
      lead_source: null,
      notes: null,
      job_fields: {
        job_type_id: null,
        business_unit_id: null
      }
    };

    const response = await apiClient.post("/jobs", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};
