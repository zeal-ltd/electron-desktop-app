import { useState, useEffect, createContext, useContext } from "react";

let electron: any;
let ipcRenderer: any;
try {
    electron = window.require("electron");
    ipcRenderer = electron.ipcRenderer;
} catch (e) {}

type ContextProps = {};

const ElectronContext = createContext<ContextProps>({});

const ElectronProvider = (props: { children: React.ReactNode }) => {
    const [electronUpdaterMessage, setElectronUpdaterMessage] = useState<string | null>(null);
    const [isOnline, setNetwork] = useState<boolean>(window.navigator.onLine);

    const updateNetwork = () => {
        console.log("network:", window.navigator.onLine);
        setNetwork(window.navigator.onLine);
    };

    useEffect(() => {
        ipcRenderer &&
            ipcRenderer.on("ELECTRON_UPDATER", (event: any, arg: string) => {
                console.log("ELECTRON_UPDATER:", arg);
                setElectronUpdaterMessage(arg);
            });
    }, []);

    useEffect(() => {
        window.addEventListener("offline", updateNetwork);
        window.addEventListener("online", updateNetwork);

        return () => {
            window.removeEventListener("offline", updateNetwork);
            window.removeEventListener("online", updateNetwork);
        };
    }, []);

    const NoInternetConnection = () => {
        return (
            <div style={{ padding: "64px 48px", textAlign: "center" }}>
                <div className="h1">Lost connection with the internet. Please check for any issues...</div>
            </div>
        );
    };

    const UpdaterMessage = () => {
        return (
            <div style={{ padding: "64px 48px", textAlign: "center" }}>
                <div className="h1">{electronUpdaterMessage}</div>
            </div>
        );
    };

    const children = <>{!isOnline ? <NoInternetConnection /> : electronUpdaterMessage ? <UpdaterMessage /> : props.children}</>;

    return <ElectronContext.Provider value={{}} children={children} />;
};

const useElectron = () => {
    const context = useContext(ElectronContext);
    if (context === undefined) {
        throw new Error(`useElectron must be used within a ElectronProvider`);
    }
    return context;
};

export { ElectronProvider, useElectron };
