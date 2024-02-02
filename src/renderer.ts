/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import { ipcRenderer } from "electron";

import "./index.css";

// import { ipcRenderer } from "electron";
const rData = document.getElementById("r-data");
const sData = document.getElementById("s-data");

// ipcRenderer.on("receive-data", (event, arg) => {
//   console.log("data received from main process", arg);
// });
// ipcRenderer.on("send-data", (event, arg) => {
//   console.log("data send from main process", arg);
// });
// window.electronAPI.onReceiveData((value: string) => {
//   rData.innerText = value;
// });
// window.electronAPI.onSendData((value: string) => {
//   sData.innerText = value;
// });

window.electronAPI.onReceiveData((value: string) => {
  rData.innerText = value;
});
window.electronAPI.onSendData((value: string) => {
  sData.innerText = value;
});
