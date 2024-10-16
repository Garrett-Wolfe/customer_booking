"use client";

import { useState } from 'react';
import { format, startOfWeek, addDays, isBefore, isToday, parseISO } from "date-fns";
import { Schedule } from "src/types/company";
import ScheduleJobPopup from './ScheduleJobPopup';

export interface WeeklyCalendarProps {
  schedules: Schedule[];
  currentDate: Date;
  onScheduleJob: (jobName: string, startTime: Date, endTime: Date) => void;
}

export default function WeeklyCalendar({ schedules, currentDate, onScheduleJob }: WeeklyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const startDate = startOfWeek(currentDate);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSchedule = (jobName: string, startTime: Date, endTime: Date) => {
    onScheduleJob(jobName, startTime, endTime);
    setSelectedDate(null);
  };

  const handleCancel = () => {
    setSelectedDate(null);
  };

  const formatJobTime = (timeString: string) => {
    try {
      const date = parseISO(timeString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, 'h:mm a');
    } catch (error) {
      console.error('Error formatting job time:', error);
      return 'Invalid time';
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-100">{format(currentDate, "MMMM yyyy")}</h2>
      <div className="grid grid-cols-7 gap-2">
        {schedules.map((day, index) => {
          const date = addDays(startDate, index);
          const isPastDate = isBefore(date, new Date()) && !isToday(date);
          
          return (
            <div
              key={index}
              className={`border border-gray-600 rounded-lg p-2 ${
                isPastDate ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 text-gray-100'
              } ${!isPastDate ? 'cursor-pointer hover:bg-gray-700' : ''}`}
              onClick={() => !isPastDate && handleDayClick(date)}
            >
              <h3 className="font-semibold text-center">{day.day}</h3>
              <p className="text-center text-sm text-gray-400">{format(date, "d")}</p>
              <div className="space-y-1 mt-2">
                {day.jobs.map((job, jobIndex) => (
                  <div key={jobIndex} className="bg-gray-700 p-1 rounded text-xs">
                    <p className="font-semibold">{job.title}</p>
                    <p>
                      {formatJobTime(job.start)} - {formatJobTime(job.end)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <ScheduleJobPopup
          date={selectedDate}
          existingJobs={schedules.find(s => s.day === format(selectedDate, 'EEE'))?.jobs || []}
          onSchedule={handleSchedule}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
