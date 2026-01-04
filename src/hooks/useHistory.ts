import { useContext } from "react";
import ActivePathContext from "../ActivePathContext";

type NavigateFn = (path: string, data?: any, persist?: boolean) => void;

const useHistory = () => {
    const context = useContext(ActivePathContext);

    if (!context) {
        throw new Error("useHistory must be used within an ActivePathProvider");
    }

    const { navigate } = context;

    const pushState = (path: string): void => {
        if (window.location.pathname !== path) {
            navigate(path);
        }
    };

    return { pushState };
};

export default useHistory;