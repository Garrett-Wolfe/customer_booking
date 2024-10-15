import { Customer } from "src/types/customer";
import apiClient from "../services/apiClient";
import { Schedule } from "src/types/company";

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
    const formattedDate = date.toISOString().split("T")[0]; // Format Date object as 'YYYY-MM-DD'
    const response = await apiClient.get("/company/schedule_availability/booking_windows", {
      params: {
        start_date: formattedDate,
        show_for_days: 7,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking windows:", error);
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

    return response.data;
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

    console.log(`Start of week ${startOfWeek} end of week ${endOfWeek}`);

    const formattedStartDate = startOfWeek.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
    const formattedEndDate = endOfWeek.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'

    console.log(`Start of week ${formattedStartDate} end of week ${formattedEndDate}`);

    const response = await apiClient.get("/jobs", {
      params: {
        scheduled_start_min: formattedStartDate,
        scheduled_end_max: formattedEndDate,
        sort_direction: "asc",
      },
    });

    const jobs = response.data.jobs;

    console.log(jobs);

    const schedules: Schedule[] = [
      { day: "Sun", jobs: [] },
      { day: "Mon", jobs: [] },
      { day: "Tue", jobs: [] },
      { day: "Wed", jobs: [] },
      { day: "Thu", jobs: [] },
      { day: "Fri", jobs: [] },
      { day: "Sat", jobs: [] },
    ];

    // Map jobs to the appropriate day in the schedule
    jobs.forEach((job: { schedule: { scheduled_start: string; scheduled_end: string }; name: string }) => {
      const scheduledStart = new Date(job.schedule.scheduled_start);
      const dayIndex = scheduledStart.getDay() === 0 ? 6 : scheduledStart.getDay() - 1; // Map Sunday (0) to index 6
      const startTime = scheduledStart.toTimeString().split(" ")[0].substring(0, 5); // Get 'HH:MM'
      const endTime = new Date(job.schedule.scheduled_end).toTimeString().split(" ")[0].substring(0, 5); // Get 'HH:MM'

      schedules[dayIndex].jobs.push({
        start: startTime,
        end: endTime,
        title: job.name,
      });

      schedules[dayIndex].jobs.sort((a, b) => a.start.localeCompare(b.start));
    });

    console.log("Shedules: ");
    console.log(schedules);

    return schedules;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
