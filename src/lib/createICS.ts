// src/lib/createICS.ts

export const createICS = (events: Array<{ title: string; start: Date; end: Date; description?: string }>) => {
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:-//ADPT//Study Schedule//EN\n";

  events.forEach((event) => {
    const start = formatDate(event.start);
    const end = formatDate(event.end);
    const description = event.description || "Study session";
    
    ics += `BEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${start}\nDTEND:${end}\nDESCRIPTION:${description}\nEND:VEVENT\n`;
  });

  ics += "END:VCALENDAR";

  // Create blob and download
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "study-schedule.ics";
  link.click();
  URL.revokeObjectURL(link.href);
};

const formatDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};