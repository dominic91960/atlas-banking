import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const formatBalance = (value: number): string => {
  if (value < 100_000) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const tiers = [
    { threshold: 1_000_000_000_000, suffix: "T" },
    { threshold: 1_000_000_000, suffix: "B" },
    { threshold: 1_000_000, suffix: "M" },
    { threshold: 100_000, suffix: "K" },
  ];

  for (const { threshold, suffix } of tiers) {
    if (value >= threshold) {
      const scaled = value / (suffix === "K" ? 1_000 : threshold);
      return scaled.toFixed(2) + suffix;
    }
  }

  return value.toFixed(2);
};
