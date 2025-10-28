export const useCalendar = () => {
  const createICS = (events: { title: string; start: Date; end: Date; description?: string }[]) => {
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:-//ADPT//Study Schedule//EN\n";

    events.forEach((event) => {
      ics += `BEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${formatDate(event.start)}\nDTEND:${formatDate(event.end)}\nDESCRIPTION:${event.description || ""}\nEND:VEVENT\n`;
    });

    ics += "END:VCALENDAR";

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "study-schedule.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  return { createICS };
};
