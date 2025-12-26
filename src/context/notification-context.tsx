import { useAppSelector } from "@/lib/redux/hooks";
import { socketService } from "@/lib/socket";
import { Notification } from "@/types/notifications";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface NotificationContextType {
  latestNotif: Notification | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [latestNotif, setLatestNotif] = useState<Notification | null>(null);
  const user = useAppSelector((state) => state.auth);

  useEffect(() => {
    const stored = sessionStorage.getItem("latestNotif");
    if (stored) {
      try {
        setLatestNotif(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored notification:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!user?.data) return;

    socketService.connect(user.data);

    const handleNotification = (notif: Notification) => {
      console.log("New notification:", notif);
      setLatestNotif(notif);
      sessionStorage.setItem("latestNotif", JSON.stringify(notif));
    };

    socketService.on("notification", handleNotification);
    return () => socketService.off("notification", handleNotification);
  }, [user?.data]);

  return (
    <NotificationContext.Provider value={{ latestNotif }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
