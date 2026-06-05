"use client";

export function ExportPlanButton({ schedule = [] }) {
  function exportPlan() {
    const lines = schedule.flatMap((day) => [
      `${day.date}`,
      ...day.tasks.map((task) => `- ${task.title} | ${task.subject?.name || task.subjectName} | ${task.durationMinutes} minutes`),
      ""
    ]);

    const printableWindow = window.open("", "_blank", "width=900,height=700");

    if (!printableWindow) {
      return;
    }

    printableWindow.document.write(`<pre style="font-family: Arial; white-space: pre-wrap; padding: 24px;">${lines.join("\n")}</pre>`);
    printableWindow.document.close();
    printableWindow.focus();
    printableWindow.print();
  }

  return (
    <button type="button" onClick={exportPlan} className="btn-secondary">
      Export plan as PDF
    </button>
  );
}
