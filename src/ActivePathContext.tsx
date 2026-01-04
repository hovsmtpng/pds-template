import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Context,
} from "react";

interface ActivePathContextValue {
  activePath: string;
  navigate: (path: string, data?: any, persist?: boolean) => void;
  data: any;
}

const ActivePathContext: Context<ActivePathContextValue | null> =
  createContext<ActivePathContextValue | null>(null);

interface ActivePathProviderProps {
  children: ReactNode;
}

export const ActivePathProvider = ({ children }: ActivePathProviderProps) => {
  const [activePath, setActivePath] = useState<string>(window.location.pathname);
  const [data, setData] = useState<any>(null);

  const isReverseProxy = import.meta.env.VITE_REVERSE_PROXY === "true";
  const basePath = isReverseProxy ? "/26" : "";

  const navigate = (path: string, data: any, persist: boolean = false): void => {
    path = isReverseProxy ? basePath + path : path;
    window.history.pushState(data, "", path);
    setActivePath(path);
    setData(data);
  };

  return (
    <ActivePathContext.Provider value={{ activePath, navigate, data }}>
      {children}
    </ActivePathContext.Provider>
  );
};

export const useActivePath = (): ActivePathContextValue => {
  const context = useContext(ActivePathContext);
  if (!context) {
    throw new Error("useActivePath must be used within an ActivePathProvider");
  }
  return context;
};

export default ActivePathContext;