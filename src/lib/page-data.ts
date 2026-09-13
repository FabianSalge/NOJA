import { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { localizedPath } from "./locale";

export type PageSnapshot = { pathname: string; data: unknown };
export const PageDataContext = createContext<PageSnapshot | undefined>(
  undefined,
);

// Only seed the matching route. Client-side navigation continues to fetch normally.
export function usePageData<T>(): T | undefined {
  const snapshot = useContext(PageDataContext);
  const { pathname } = useLocation();
  const { language } = useTranslation();
  return snapshot?.pathname === localizedPath(pathname, language)
    ? (snapshot.data as T)
    : undefined;
}
