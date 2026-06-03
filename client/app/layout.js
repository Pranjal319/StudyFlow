import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeScript } from "@/components/theme-script";

export const metadata = {
  title: "StudyFlow",
  description: "Portfolio-ready AI study planner with planning, analytics, task tracking, and Pomodoro workflows."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0B0F1A] text-[#E5E7EB] dark:bg-[#0B0F1A] dark:text-[#E5E7EB] transition-colors duration-300">
        <ThemeScript />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
