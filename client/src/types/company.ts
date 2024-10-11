export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Job {
  start: string;
  end: string;
  title: string;
}

export interface Schedule {
  day: DayOfWeek;
  jobs: Job[];
}
