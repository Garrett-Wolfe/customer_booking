"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

import CustomerCard from "./CustomerCard";
import WeeklyCalendar from "./WeeklyCalendar";
import { customerExists } from "../utils/customerOperations";
import { Customer } from "../types/customer";
import { Schedule } from "../types/company";
import { fetchJobsInWeek } from "../services/housecallProService";

let dummySchedules: Schedule[] = [
  { day: "Sun", jobs: [] },
  { day: "Mon", jobs: [] },
  { day: "Tue", jobs: [] },
  { day: "Wed", jobs: [] },
  { day: "Thu", jobs: [] },
  { day: "Fri", jobs: [] },
  { day: "Sat", jobs: [] },
];

// Dummy data
let customer: Customer = {
  name: "Bobby Garcia",
  phone: "(123) 456-7890",
  address: {
    street: "123 Main St",
    street_line_2: "",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "USA",
  },
  email: "jane.garcia@gmail.com",
  isNew: true,
  isTalking: true,
};

customer.isNew = !(await customerExists(customer));

export default function CallCenterPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>(dummySchedules);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (date) {
        try {
          const result = await fetchJobsInWeek(date);
          setSchedules(result);
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
      }
    };

    fetchSchedules();
  }, [date]);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
          {/* Left Section - Customer Card and Weekly Calendar */}
          <div className="flex flex-col md:w-2/3 space-y-4">
            <div className="flex-shrink-0">
              <CustomerCard customer={customer} />
            </div>
            <div>
              <WeeklyCalendar schedules={schedules} currentDate={date || new Date()} />
            </div>
          </div>

          {/* Right Section - Calendar */}
          <div className="md:w-1/3 md:self-start">
            <Card className="bg-gray-800 text-gray-100">
              <CardContent className="p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-gray-700 p-4"
                  classNames={{
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-lg w-10 h-10 m-0.5 flex items-center justify-center",
                    day_today: "bg-accent text-accent-foreground rounded-lg w-10 h-10 m-0.5 flex items-center justify-center",
                    day: "text-gray-100 hover:bg-accent hover:text-accent-foreground rounded-lg w-10 h-10 m-0.5 flex items-center justify-center",
                    head_cell: "text-muted-foreground font-normal w-10 h-10 flex items-center justify-center",
                    cell: "text-center p-0",
                    row: "flex w-full mt-2",
                    head: "flex w-full",
                    nav_button: "hover:bg-accent rounded-full p-1",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    caption: "relative flex items-center justify-center px-8 py-2",
                    table: "w-full border-collapse space-y-1",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
