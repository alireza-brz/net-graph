import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onReceiveData: (callback: (value: string) => void) =>
    ipcRenderer.on("receive-data", (_event, value) => callback(value)),
  onSendData: (callback: (value: string) => void) =>
    ipcRenderer.on("send-data", (_event, value) => callback(value)),
});
