import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const lowerUrl = url.trim().toLowerCase();
  return lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://');
}
