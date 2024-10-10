"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

// Dummy data
const customer = {
  name: "Jane Doe",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, USA 12345",
  email: "jane.doe@example.com",
  isNew: false,
  isTalking: true,
};

import CustomerCard from "./CustomerCard";
import WeeklyCalendar from "./WeeklyCalendar";
import React from "react";

const schedules = [
  { day: "Mon", jobs: [{ start: "10:00", end: "12:00", title: "Plumbing" }] },
  { day: "Tue", jobs: [{ start: "14:00", end: "16:00", title: "Electrical" }] },
  { day: "Wed", jobs: [] },
  { day: "Thu", jobs: [{ start: "09:00", end: "11:00", title: "HVAC" }] },
  { day: "Fri", jobs: [{ start: "13:00", end: "15:00", title: "Carpentry" }] },
  { day: "Sat", jobs: [] },
  { day: "Sun", jobs: [] },
];

export default function CallCenterPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <CustomerCard customer={customer} />
        <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
          <div className="flex-grow">
            <WeeklyCalendar schedules={schedules} currentDate={date || new Date()} />
          </div>
          <div className="mt-4 md:mt-0">
            <Card className="bg-gray-800 text-gray-100">
              <CardContent className="p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-gray-700"
                  classNames={{
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day: "text-gray-100 hover:bg-accent hover:text-accent-foreground",
                    head_cell: "text-muted-foreground",
                    cell: "text-muted-foreground",
                    nav_button: "hover:bg-accent",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    caption: "relative flex items-center justify-center px-8",
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
