import { AppSettings } from './types';

export const DEFAULT_CATEGORIES = [
  "General Knowledge",
  "Sports",
  "Entertainment",
  "Science",
  "History",
  "Technology",
  "Literature",
  "Geography"
];

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "QuizWoiz",
  primaryColor: "#4F46E5",
  secondaryColor: "#1E293B",
  accentColor: "#8B5CF6",
  fontFamily: "Inter",
  categories: DEFAULT_CATEGORIES,
  darkMode: false,
};

export const MOCK_TESTIMONIALS = [
  { name: "Sarah J.", role: "Teacher", text: "QuizWoiz saved me hours of lesson planning!" },
  { name: "Mike T.", role: "Student", text: "The best way to revise for my exams. Simply amazing." },
  { name: "Emily R.", role: "HR Manager", text: "We use it for employee training assessments. Highly recommended." }
];

export const FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat"
];