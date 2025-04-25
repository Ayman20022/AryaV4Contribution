import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formDataFrom(data: any) {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((item: any) => {
        formData.append(key, item);
      });
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
}

export function getCustomAvatar(firstName: string, lastName: string) {
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
}