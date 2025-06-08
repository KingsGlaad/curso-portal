"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface UserSettings {
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  timezone: string;
  language: string;
  currency: string;
  dateFormat: string;
  fontSize: number;
  theme: "light" | "dark" | "system";
  layout: "default" | "compact" | "expanded";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    accountActivity: boolean;
    newFeatures: boolean;
    marketing: boolean;
    frequency: "real-time" | "daily" | "weekly";
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  privacy: {
    analyticsSharing: boolean;
    personalizedAds: boolean;
    visibility: "public" | "private";
    dataRetention: "6-months" | "1-year" | "2-years" | "indefinite";
  };
}

const defaultSettings: UserSettings = {
  avatar: "./images/default-profile.jpeg",
  fullName: "Dollar Singh",
  email: "dollar.singh@example.com",
  phone: "+1 (555) 123-4567",
  timezone: "utc-8",
  language: "en",
  currency: "usd",
  dateFormat: "mm-dd-yyyy",
  fontSize: 16,
  theme: "system",
  layout: "default",
  notifications: {
    email: true,
    push: true,
    sms: false,
    accountActivity: true,
    newFeatures: true,
    marketing: false,
    frequency: "real-time",
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  },
  privacy: {
    analyticsSharing: true,
    personalizedAds: false,
    visibility: "public",
    dataRetention: "1-year",
  },
};

interface SettingsContextType {
  settings: UserSettings | null; // Pode ser null enquanto carrega
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateNotificationSettings: (
    settings: Partial<UserSettings["notifications"]>
  ) => void;
  updatePrivacySettings: (settings: Partial<UserSettings["privacy"]>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/auth/user/settings");
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error(error);
        // fallback para default se der erro
        setSettings(defaultSettings);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      localStorage.setItem("userSettings", JSON.stringify(settings));
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...newSettings } : prev));
  };

  const updateNotificationSettings = (
    notificationSettings: Partial<UserSettings["notifications"]>
  ) => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            notifications: { ...prev.notifications, ...notificationSettings },
          }
        : prev
    );
  };

  const updatePrivacySettings = (
    privacySettings: Partial<UserSettings["privacy"]>
  ) => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            privacy: { ...prev.privacy, ...privacySettings },
          }
        : prev
    );
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateNotificationSettings,
        updatePrivacySettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
