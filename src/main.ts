import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import child_process from "child_process";

// This function will output the lines from the script
// and will return the full combined output
// as well as exit code when it's done (using the callback).
function run_script(
  command: string,
  args?: readonly string[],
  callback?: (data: any) => void
) {
  const child = child_process.spawn(command, args, {
    shell: true,
  });

  // You can also use a variable to save the output for when the script closes later
  child.on("error", (error) => {
    dialog.showMessageBox({
      title: "Title",
      type: "warning",
      message: "Error occured.\r\n" + error,
    });
  });

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (data) => {
    //Here is the output
    data = data.toString();
    // console.log(data);
    callback(data);
  });

  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (data) => {
    // Return some data to the renderer process with the mainprocess-response ID
    // mainWindow.webContents.send("mainprocess-response", data);
    //Here is the output from the command
    // console.log(data);
  });

  child.on("close", (code) => {
    //Here you can get the exit code of the script
    switch (code) {
      case 0:
        dialog.showMessageBox({
          title: "Title",
          type: "info",
          message: "End process.\r\n",
        });
        break;
    }
  });
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.

const createWindow = () => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const receiveCommand = 'typeperf "Network Interface(*)\\Bytes Received/sec"';
  const sendCommand = 'typeperf "Network Interface(*)\\Bytes Sent/sec"';

  run_script(receiveCommand, [], (data) => {
    const receiveData =
      parseFloat(data.replace(",", "").replace('"', "")) / 1024 / 1024;
    if (receiveData) {
      // console.log({
      //   receiveData,
      // });
      mainWindow.webContents.send("receive-data", receiveData.toString());
    }
  });
  run_script(sendCommand, [], (data) => {
    const sendData =
      parseFloat(data.replace(",", "").replace('"', "")) / 1024 / 1024;

    if (sendData) {
      // console.log({
      //   sendData,
      // });
      mainWindow.webContents.send("send-data", sendData.toString());
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  ipcMain.on("receive-data", (_event, value) => {
    console.log(value); // will print value to Node console
  });
  ipcMain.on("send-data", (_event, value) => {
    console.log(value); // will print value to Node console
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.setUserTasks([
  {
    program: process.execPath,
    arguments: "--new-window",
    iconPath: process.execPath,
    iconIndex: 0,
    title: "New Window",
    description: "Create a new window",
  },
]);
