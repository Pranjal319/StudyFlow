// LocalStorage-based data persistence layer
// All data is stored in browser without backend

const STORAGE_KEYS = {
  subjects: "ai-study-planner:subjects",
  tasks: "ai-study-planner:tasks",
  progress: "ai-study-planner:progress",
  user: "ai-study-planner:user",
  checkins: "ai-study-planner:checkins",
  reflections: "ai-study-planner:reflections",
  theme: "ai-study-planner-theme"
};

function ensureUser() {
  if (typeof window === "undefined") return null;
  let user = localStorage.getItem(STORAGE_KEYS.user);
  if (user) return JSON.parse(user);
  
  const newUser = {
    _id: "user-" + Date.now(),
    name: "Student",
    email: "student@local",
    studyHoursPerDay: 3,
    darkMode: true,
    streak: { current: 0, best: 0, lastActiveDate: null },
    xp: 0,
    level: 1,
    badges: [],
    todayCheckIn: null,
    preferences: {
      studyStyle: "balanced",
      energyPattern: "afternoon",
      goalMode: "consistency",
      focusEnvironment: "silent"
    }
  };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(newUser));
  return newUser;
}

export function getUser() {
  if (typeof window === "undefined") return null;
  return ensureUser();
}

export function updateUser(updates) {
  if (typeof window === "undefined") return null;
  const user = ensureUser();
  const updated = { ...user, ...updates };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updated));
  return updated;
}

export function getSubjects() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.subjects);
  return data ? JSON.parse(data) : [];
}

export function createSubject(payload) {
  if (typeof window === "undefined") return null;
  const subject = {
    _id: "subject-" + Date.now(),
    user: getUser()?._id,
    ...payload,
    createdAt: new Date().toISOString()
  };
  const subjects = getSubjects();
  subjects.push(subject);
  localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(subjects));
  return subject;
}

export function updateSubject(id, updates) {
  if (typeof window === "undefined") return null;
  const subjects = getSubjects();
  const idx = subjects.findIndex((s) => s._id === id);
  if (idx === -1) throw new Error("Subject not found");
  subjects[idx] = { ...subjects[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(subjects));
  return subjects[idx];
}

export function deleteSubject(id) {
  if (typeof window === "undefined") return null;
  let subjects = getSubjects();
  subjects = subjects.filter((s) => s._id !== id);
  localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(subjects));
}

export function getTasks() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.tasks);
  return data ? JSON.parse(data) : [];
}

export function createTasks(tasksArray) {
  if (typeof window === "undefined") return;
  const tasks = getTasks();
  const newTasks = tasksArray.map((t) => ({
    _id: "task-" + Date.now() + Math.random(),
    ...t,
    user: getUser()?._id,
    createdAt: new Date().toISOString()
  }));
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify([...tasks, ...newTasks]));
  return newTasks;
}

export function updateTask(id, updates) {
  if (typeof window === "undefined") return null;
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t._id === id);
  if (idx === -1) throw new Error("Task not found");
  tasks[idx] = { ...tasks[idx], ...updates };
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  return tasks[idx];
}

export function deleteTask(id) {
  if (typeof window === "undefined") return null;
  let tasks = getTasks();
  tasks = tasks.filter((t) => t._id !== id);
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

export function moveTask(id, newDate) {
  if (typeof window === "undefined") return null;
  return updateTask(id, { plannedDate: newDate });
}

export function clearAllTasks() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify([]));
}

export function getProgress() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.progress);
  return data ? JSON.parse(data) : [];
}

export function logProgress(payload) {
  if (typeof window === "undefined") return null;
  const progress = getProgress();
  const record = {
    _id: "progress-" + Date.now(),
    user: getUser()?._id,
    ...payload,
    createdAt: new Date().toISOString()
  };
  progress.push(record);
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
  return record;
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.subjects);
  localStorage.removeItem(STORAGE_KEYS.tasks);
  localStorage.removeItem(STORAGE_KEYS.progress);
}

// Check-in system
export function getTodayCheckIn() {
  if (typeof window === "undefined") return null;
  const user = getUser();
  return user?.todayCheckIn || null;
}

export function logCheckIn(feeling) {
  if (typeof window === "undefined") return null;
  const user = ensureUser();
  const today = new Date().toISOString().split("T")[0];
  user.todayCheckIn = { feeling, date: today };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user.todayCheckIn;
}

// Reflection system
export function getReflections() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.reflections);
  return data ? JSON.parse(data) : [];
}

export function logReflection(difficulty) {
  if (typeof window === "undefined") return null;
  const reflections = getReflections();
  const today = new Date().toISOString().split("T")[0];
  const record = {
    _id: "reflection-" + Date.now(),
    difficulty,
    date: today,
    timestamp: new Date().toISOString()
  };
  reflections.push(record);
  localStorage.setItem(STORAGE_KEYS.reflections, JSON.stringify(reflections));
  return record;
}

// Streak system
export function updateStreakIfNeeded() {
  if (typeof window === "undefined") return null;
  const user = ensureUser();
  const today = new Date().toISOString().split("T")[0];
  const lastActive = user.streak?.lastActiveDate;

  if (lastActive === today) {
    return user.streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastActive === yesterdayStr) {
    user.streak.current = (user.streak.current || 0) + 1;
  } else if (lastActive !== today) {
    user.streak.current = 1;
  }

  if (user.streak.current > user.streak.best) {
    user.streak.best = user.streak.current;
  }

  user.streak.lastActiveDate = today;
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user.streak;
}

// Gamification
export function addXP(amount) {
  if (typeof window === "undefined") return null;
  const user = ensureUser();
  user.xp = (user.xp || 0) + amount;

  const newLevel = Math.floor(user.xp / 100) + 1;
  if (newLevel > user.level) {
    user.level = newLevel;
    addBadge(`Level ${newLevel}`);
  }

  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user;
}

export function addBadge(badge) {
  if (typeof window === "undefined") return null;
  const user = ensureUser();
  if (!user.badges.includes(badge)) {
    user.badges.push(badge);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  }
  return user.badges;
}

export function getGamificationStats() {
  if (typeof window === "undefined") return null;
  const user = ensureUser();
  return {
    xp: user.xp || 0,
    level: user.level || 1,
    badges: user.badges || [],
    streak: user.streak || { current: 0, best: 0 }
  };
}

export function calculateCompletionRate() {
  if (typeof window === "undefined") return 1.0;
  
  const tasksData = localStorage.getItem(STORAGE_KEYS.tasks);
  const tasks = tasksData ? JSON.parse(tasksData) : [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.plannedDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate >= sevenDaysAgo && taskDate < today;
  });
  
  if (weekTasks.length === 0) return 1.0;
  
  const completed = weekTasks.filter(t => t.status === "completed").length;
  return completed / weekTasks.length;
}

export function getAdaptiveStudyHours(baseHours) {
  if (typeof window === "undefined") return baseHours;
  
  const completionRate = calculateCompletionRate();
  let adjustedHours = baseHours;
  let adjustment = "neutral";
  
  if (completionRate > 0.8) {
    adjustedHours = baseHours * 1.15;
    adjustment = "increased";
  } else if (completionRate < 0.5) {
    adjustedHours = baseHours * 0.80;
    adjustment = "decreased";
  }
  
  return {
    hours: Math.round(adjustedHours * 10) / 10,
    adjustment,
    completionRate: Math.round(completionRate * 100)
  };
}

export function getWeeklyConsistency() {
  if (typeof window === "undefined") return 0;
  
  const tasksData = localStorage.getItem(STORAGE_KEYS.tasks);
  const tasks = tasksData ? JSON.parse(tasksData) : [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.plannedDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate >= sevenDaysAgo && taskDate < today;
  });
  
  if (weekTasks.length === 0) return 0;
  
  const completed = weekTasks.filter(t => t.status === "completed").length;
  return Math.round((completed / weekTasks.length) * 100);
}

export function generateAnalyticsInsights() {
  if (typeof window === "undefined") return [];
  
  const subjects = getSubjects();
  const progress = getProgress();
  const tasks = getTasks();
  
  const insights = [];
  
  // Insight 1: Best subjects
  if (subjects.length > 0) {
    const subjectPerformance = subjects.map(subject => {
      const subjectTasks = tasks.filter(t => t.subject === subject._id);
      const completedCount = subjectTasks.filter(t => t.status === "completed").length;
      const rate = subjectTasks.length > 0 ? (completedCount / subjectTasks.length) * 100 : 0;
      return { name: subject.name, rate, confidence: subject.currentConfidence, tasks: subjectTasks.length };
    });
    
    const bestSubject = subjectPerformance.sort((a, b) => b.confidence - a.confidence)[0];
    if (bestSubject && bestSubject.tasks > 0) {
      insights.push({
        title: "Your strength 💪",
        message: `${bestSubject.name} is your strongest area. Keep building on this!`,
        type: "positive"
      });
    }
    
    const weakSubject = subjectPerformance.sort((a, b) => a.confidence - b.confidence)[0];
    if (weakSubject && weakSubject.tasks > 0 && weakSubject.confidence < 3) {
      insights.push({
        title: "Needs attention 📚",
        message: `${weakSubject.name} (${weakSubject.confidence}/5 confidence). Try shorter, focused sessions.`,
        type: "action"
      });
    }
  }
  
  // Insight 2: Session patterns
  if (tasks.length > 0) {
    const completedTasks = tasks.filter(t => t.status === "completed");
    if (completedTasks.length > 0) {
      const avgDuration = Math.round(
        completedTasks.reduce((sum, t) => sum + (t.durationMinutes || 0), 0) / completedTasks.length
      );
      if (avgDuration > 60) {
        insights.push({
          title: "Extended focus 🎯",
          message: `You complete ${avgDuration}-minute sessions well. Your sustained focus is impressive!`,
          type: "positive"
        });
      } else if (avgDuration > 0) {
        insights.push({
          title: "Perfect pace ⏱️",
          message: `${avgDuration}-minute sessions work best for your learning style.`,
          type: "neutral"
        });
      }
    }
  }
  
  // Insight 3: Consistency
  const consistency = getWeeklyConsistency();
  if (consistency > 80) {
    insights.push({
      title: "On fire 🔥",
      message: `${consistency}% completion rate this week! Maintain this momentum.`,
      type: "positive"
    });
  } else if (consistency > 50) {
    insights.push({
      title: "Good progress 📈",
      message: `${consistency}% completion this week. You're on track!`,
      type: "positive"
    });
  } else if (consistency > 0 && consistency <= 50) {
    insights.push({
      title: "Build momentum 💫",
      message: `${consistency}% completion. Try smaller daily goals to build consistency.`,
      type: "action"
    });
  }
  
  // Insight 4: Subject variety
  const uniqueSubjects = new Set(tasks.filter(t => t.status === "completed").map(t => t.subject)).size;
  if (uniqueSubjects > 0 && subjects.length > 0) {
    insights.push({
      title: "Balanced learning 🌟",
      message: `You study ${uniqueSubjects} subject(s) regularly. Variety strengthens retention!`,
      type: "neutral"
    });
  }
  
  return insights.slice(0, 4);
}
