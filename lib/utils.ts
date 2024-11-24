import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AnonymousIdentifier = `Anonymous#${string}`;

// take a wild guess who wrote this ?
// very poor security btw
export function generateAnonymousId(
  userId: string | undefined,
): AnonymousIdentifier {
  // If no userId is provided, return a generic anonymous identifier
  if (!userId) {
    return "Anonymous#0000";
  }

  // Convert the userId string to a number using a simple hash function
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Make the hash positive and get last 4 digits
  hash = Math.abs(hash);
  const fourDigits = String(hash % 10000).padStart(4, "0");

  return `Anonymous#${fourDigits}`;
}
//claude did ofc
