"use client";

import { format, startOfWeek, addDays } from "date-fns";
import React from "react";

export default function WeeklyCalendar({ schedules, currentDate }) {
  const startDate = startOfWeek(currentDate);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-100">{format(currentDate, "MMMM yyyy")}</h2>
      <div className="grid grid-cols-7 gap-2">
        {schedules.map((day, index) => {
          const date = addDays(startDate, index);
          return (
            <div key={index} className="border border-gray-600 rounded-lg p-2 bg-gray-800 text-gray-100">
              <h3 className="font-semibold text-center">{day.day}</h3>
              <p className="text-center text-sm text-gray-400">{format(date, "d")}</p>
              <div className="space-y-1 mt-2">
                {day.jobs.map((job, jobIndex) => (
                  <div key={jobIndex} className="bg-gray-700 p-1 rounded text-xs">
                    <p className="font-semibold">{job.title}</p>
                    <p>
                      {job.start} - {job.end}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
