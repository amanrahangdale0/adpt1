// src/lib/utils/scheduleLogic.ts
export function generateScheduleFromSubjects(subjects) {
  const now = new Date();
  const plan = [];

  subjects.forEach((subj) => {
    if (!subj.deadline) return;

    const daysLeft = Math.ceil((new Date(subj.deadline) - now) / (1000 * 60 * 60 * 24));
    const sessions = Math.max(1, Math.floor(daysLeft / 2)); // study every 2 days roughly
    const difficultyMultiplier = subj.difficulty === "Hard" ? 1.5 : subj.difficulty === "Medium" ? 1.2 : 1;

    for (let i = 0; i < sessions; i++) {
      const studyDate = new Date();
      studyDate.setDate(now.getDate() + i * 2);
      plan.push({
        subject: subj.name,
        time: subj.preferredTime,
        focus: subj.studyType,
        date: studyDate.toDateString(),
        duration: Math.round(60 * difficultyMultiplier),
      });
    }
  });

  return plan.sort((a, b) => new Date(a.date) - new Date(b.date));
}
