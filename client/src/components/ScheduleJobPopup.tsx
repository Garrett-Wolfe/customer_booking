import React, { useState } from 'react';
import { format, setHours, setMinutes} from 'date-fns';
import { Job } from '../types/company';

interface ScheduleJobPopupProps {
  date: Date;
  existingJobs: Job[];
  onSchedule: (jobName: string, startTime: Date, endTime: Date) => void;
  onCancel: () => void;
}

const ScheduleJobPopup: React.FC<ScheduleJobPopupProps> = ({ date, existingJobs, onSchedule, onCancel }) => {
  const [jobName, setJobName] = useState('');
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);

  // Generate business hours from 8am to 6pm
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);

  const isHourDisabled = (hour: number, isStart: boolean) => {
    const timeToCheck = setHours(date, hour);
    
    // Ensure end time is later than start time
    if (!isStart && startHour !== null && hour <= startHour) {
      return true;
    }

    return existingJobs.some(job => {
      const jobStart = new Date(job.start);
      const jobEnd = new Date(job.end);
      
      if (isStart) {
        // For start time, check if it's within any existing job
        if (hour >= jobStart.getHours() && hour < jobEnd.getHours()) {
          return true;
        }
        // If end hour is set, check if it would create an overlap
        if (endHour !== null && hour < jobStart.getHours() && endHour > jobStart.getHours()) {
          return true;
        }
      } else {
        // For end time, check if it's within any existing job
        if (hour > jobStart.getHours() && hour <= jobEnd.getHours()) {
          return true;
        }
        // If start hour is set, check if it would create an overlap
        if (startHour !== null && hour > jobEnd.getHours() && startHour < jobEnd.getHours()) {
          return true;
        }
      }
      return false;
    });
  };

  const isFormValid = jobName && startHour !== null && endHour !== null && startHour < endHour;

  const handleSchedule = () => {
    if (isFormValid) {
      const startDate = setMinutes(setHours(date, startHour!), 0);
      const endDate = setMinutes(setHours(date, endHour!), 0);
      onSchedule(jobName, startDate, endDate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Schedule Job for {format(date, 'MMMM d, yyyy')}</h2>
        <input
          type="text"
          value={jobName}
          onChange={(e) => setJobName(e.target.value)}
          placeholder="Job Name"
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex mb-4">
          <select
            value={startHour ?? ''}
            onChange={(e) => {
              setStartHour(Number(e.target.value));
              if (endHour !== null && Number(e.target.value) >= endHour) {
                setEndHour(null);
              }
            }}
            className="w-1/2 p-2 border rounded mr-2"
          >
            <option value="">Start Time</option>
            {hours.map((hour) => (
              <option key={hour} value={hour} disabled={isHourDisabled(hour, true)}>
                {format(setHours(date, hour), 'h:mm a')}
              </option>
            ))}
          </select>
          <select
            value={endHour ?? ''}
            onChange={(e) => setEndHour(Number(e.target.value))}
            className="w-1/2 p-2 border rounded"
          >
            <option value="">End Time</option>
            {hours.map((hour) => (
              <option key={hour} value={hour} disabled={isHourDisabled(hour, false)}>
                {format(setHours(date, hour), 'h:mm a')}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center space-x-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button
            onClick={handleSchedule}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded ${isFormValid ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleJobPopup;
