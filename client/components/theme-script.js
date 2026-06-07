export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem('ai-study-planner-theme');
        var isDark = stored ? stored === 'dark' : true;
        document.documentElement.classList.toggle('dark', isDark);
      } catch (error) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
