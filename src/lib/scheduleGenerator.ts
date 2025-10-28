// src/lib/scheduleGenerator.ts
import { format, addDays, differenceInDays, startOfDay } from "date-fns";

export type Subject = {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  examDate: string;
};

export type StudyPrefs = {
  studyType: "continuous" | "breaks";
  studyTime: "morning" | "evening" | "night";
  hoursPerDay: number;
};

export type ScheduleSession = {
  id: string;
  title: string;
  subject: string;
  start: Date;
  end: Date;
  description: string;
  difficulty: string;
  priority: number;
};

/**
 * Generate intelligent study schedule based on subjects and preferences
 */
export function generateSchedule(
  subjects: Subject[],
  preferences: StudyPrefs
): ScheduleSession[] {
  if (!subjects || subjects.length === 0) {
    return [];
  }

  const sessions: ScheduleSession[] = [];
  const today = startOfDay(new Date());
  const studyHoursPerDay = preferences.hoursPerDay || 4;
  const studyType = preferences.studyType || "breaks";
  const studyTime = preferences.studyTime || "evening";

  // Filter out subjects with past exam dates
  const activeSubjects = subjects.filter((subject) => {
    if (!subject.examDate) return true; // Include subjects without exam dates
    const examDate = startOfDay(new Date(subject.examDate));
    return examDate >= today; // Only include if exam is today or in the future
  });

  // Check if there are any active subjects to schedule
  if (activeSubjects.length === 0) {
    return [];
  }

  // Calculate priority for each subject based on difficulty and exam date
  const subjectsWithPriority = activeSubjects.map((subject) => {
    let priority = 0;

    // Difficulty weight (harder = more priority)
    if (subject.difficulty === "hard") priority += 3;
    else if (subject.difficulty === "medium") priority += 2;
    else priority += 1;

    // Exam date urgency (closer = more priority)
    if (subject.examDate) {
      const daysUntilExam = differenceInDays(new Date(subject.examDate), today);
      if (daysUntilExam <= 7) priority += 5;
      else if (daysUntilExam <= 14) priority += 3;
      else if (daysUntilExam <= 30) priority += 2;
      else priority += 1;
    } else {
      priority += 1; // No exam date = low priority
    }

    return { ...subject, priority };
  });

  // Sort by priority (highest first)
  const sortedSubjects = [...subjectsWithPriority].sort(
    (a, b) => b.priority - a.priority
  );

  // Determine study time slots based on preference
  const getTimeSlot = (timePreference: string) => {
    switch (timePreference) {
      case "morning":
        return { startHour: 7, endHour: 11 };
      case "evening":
        return { startHour: 16, endHour: 20 };
      case "night":
        return { startHour: 20, endHour: 23 };
      default:
        return { startHour: 16, endHour: 20 };
    }
  };

  const timeSlot = getTimeSlot(studyTime);

  // Generate sessions for the next 7 days
  const daysToSchedule = 7;
  let currentDay = 0;
  let subjectIndex = 0;

  while (currentDay < daysToSchedule) {
    const currentDate = addDays(today, currentDay);
    let hoursScheduledToday = 0;

    // Schedule subjects for this day
    while (hoursScheduledToday < studyHoursPerDay) {
      const subject = sortedSubjects[subjectIndex % sortedSubjects.length];
      
      // Determine session duration based on difficulty and study type
      let sessionDuration = 1; // hours
      if (subject.difficulty === "hard") {
        sessionDuration = studyType === "breaks" ? 1.5 : 2;
      } else if (subject.difficulty === "medium") {
        sessionDuration = studyType === "breaks" ? 1 : 1.5;
      } else {
        sessionDuration = studyType === "breaks" ? 0.5 : 1;
      }

      // Don't exceed daily hours
      if (hoursScheduledToday + sessionDuration > studyHoursPerDay) {
        sessionDuration = studyHoursPerDay - hoursScheduledToday;
      }

      // Calculate start and end times
      const sessionStartHour = timeSlot.startHour + hoursScheduledToday;
      const sessionStartMinutes = (sessionDuration % 1) * 60;
      
      const startTime = new Date(currentDate);
      startTime.setHours(sessionStartHour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(
        startTime.getHours() + Math.floor(sessionDuration),
        sessionStartMinutes,
        0,
        0
      );

      // Create session
      const session: ScheduleSession = {
        id: `session-${currentDay}-${subjectIndex}-${Date.now()}`,
        title: `Study: ${subject.name}`,
        subject: subject.name,
        start: startTime,
        end: endTime,
        description: `${subject.difficulty.charAt(0).toUpperCase() + subject.difficulty.slice(1)} difficulty${
          subject.examDate
            ? ` • Exam on ${format(new Date(subject.examDate), "MMM dd")}`
            : ""
        }`,
        difficulty: subject.difficulty,
        priority: subject.priority,
      };

      sessions.push(session);

      // Add break time if using break-based study
      if (studyType === "breaks") {
        hoursScheduledToday += sessionDuration + 0.25; // 15-min break
      } else {
        hoursScheduledToday += sessionDuration;
      }

      subjectIndex++;

      if (hoursScheduledToday >= studyHoursPerDay) break;
    }

    currentDay++;
  }

  return sessions;
}

/**
 * Get schedule summary statistics
 */
export function getScheduleStats(sessions: ScheduleSession[]) {
  const totalSessions = sessions.length;
  const totalHours = sessions.reduce((sum, session) => {
    const hours = (session.end.getTime() - session.start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);

  const subjectDistribution = sessions.reduce((acc, session) => {
    acc[session.subject] = (acc[session.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const difficultyDistribution = sessions.reduce((acc, session) => {
    acc[session.difficulty] = (acc[session.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalSessions,
    totalHours: Math.round(totalHours * 10) / 10,
    averageSessionLength: Math.round((totalHours / totalSessions) * 10) / 10,
    subjectDistribution,
    difficultyDistribution,
  };
}
