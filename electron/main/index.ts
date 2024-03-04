/**
 * electron 主进程
 * 主进程在 Node.js 环境中运行，这意味着它具有 require 模块和使用所有 Node.js API 的能力。
 */

import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Notification,
  dialog,
  session,
  nativeImage,
  crashReporter,
  globalShortcut,
} from "electron";
import { release } from "node:os";
import { join } from "node:path";
import log from "electron-log";
// const nodemailer = require('nodemailer');
const path = require("path");

// // 创建一个可重用的传输器对象
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: '389688501@qq.com',
//     pass: 'liyang19970814'
//   }
// });

// // 邮件选项
// const mailOptions = {
//   from: 'your-email@gmail.com',
//   to: 'recipient-email@example.com',
//   subject: 'Hello from Electron',
//   text: 'This is a test email sent from Electron.'
// };

// ------------- electron-log 配置 start ----------------
// 日志文件等级，默认值：false
log.transports.file.level = "info";
// 日志控制台等级，默认值：false
log.transports.console.level = "debug";
// 日志文件名，默认：main.log
log.transports.file.fileName = "main.log";
// 日志格式，默认：[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}
log.transports.file.format =
  "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";
// 日志大小，默认：1048576（1M），达到最大上限后，备份文件并重命名为：main.old.log，有且仅有一个备份文件
log.transports.file.maxSize = 1048576 * 50;
// 日志文件位置：C:\Users\%USERPROFILE%\AppData\Roaming\【app——name】\logs
// 完整的日志路径：log.transports.file.file，优先级高于 appName、fileName
// Optional, initialize the logger for any renderer processses
log.initialize({ preload: true });
// ------------- electron-log 配置 end ----------------

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: any = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
  });
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
}

// 捕获未处理的异常和崩溃
// process.on('uncaughtException', (error) => {
//   log.warn('应用程序发生崩溃:' + error);
//   // 在此处执行你的处理逻辑
// });

// 延迟30s 生成崩溃
// setTimeout(() => {
//   process.crash()
// }, 30000)

app.setLoginItemSettings({
  openAtLogin: true, // Boolean 在登录时启动应用
  openAsHidden: true, // Boolean (可选) mac 表示以隐藏的方式启动应用。~~~~
  // path: '', String (可选) Windows - 在登录时启动的可执行文件。默认为 process.execPath.
  // args: [] String Windows - 要传递给可执行文件的命令行参数。默认为空数组。注意用引号将路径换行。
});

// ------- 监听渲染进程和 GPU 进程奔溃事件 start ----------
app.on("render-process-gone", (event, webContents, details) => {
  log.warn("渲染进程崩溃：" + details.reason);
  // 重启
  app.relaunch();
  app.quit();
});
// ------- 监听渲染进程和 GPU 进程奔溃事件 end ----------

function createWindow() {
  const emptyIcon = nativeImage.createEmpty();
  win = new BrowserWindow({
    title: "Main window",
    show: false,
    // 生产
    fullscreen: true, //窗口是否处于全屏模式。
    frame: false, //是否显示边框和标题栏
    width: 1280,
    height: 1024,
    // icon: join(process.env.PUBLIC, 'favicon.ico'),
    // icon: emptyIcon,// 设置为空字符串
    autoHideMenuBar: true, // 窗口菜单栏是否自动隐藏
    webPreferences: {
      //预加载脚本可以在 BrowserWindow 构造方法中的 webPreferences 选项里被附加到主进程。
      preload,
      webSecurity: false, //关闭web权限检查，允许跨域
      // Read more on https://www.electronjs.org/zh/blog/electron-4-0#webpreferences-default-values
      nodeIntegration: false, //是否允许在渲染进程（即 Web 页面中）访问 Node.js 模块和 API
      contextIsolation: true, //是否开启上下文隔离-开启后在渲染进程中无法直接访问 Node.js 模块和 API
    },
  });

  // 生产环境开启全屏模式
  if (import.meta.env.MODE === "production") {
    // win.setFullScreen(true)
  }

  // win.setMenuBarVisibility(false);//菜单栏是否可见

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // 解决窗口显示时有视觉闪烁
  win.once("ready-to-show", () => {
    win.show();
    // setTimeout(()=>{
    //   win.loadFile(indexHtml)
    // },10000)
  });

  // ----------- 系统崩溃堆栈文件 start --------------
  // 获取奔溃堆栈文件存放路径
  let crashFilePath = "";
  let crashDumpsDir = "";
  try {
    // electron 低版本
    crashFilePath = path.join(app.getPath("temp"), app.getName() + " Crashes");
    // console.log('crash path:', crashFilePath);

    // electron 高版本
    crashDumpsDir = app.getPath("crashDumps");
    // console.log('crashDumpsDir:', crashDumpsDir);
  } catch (e) {
    console.error("获取奔溃文件路径失败", e);
  }

  // ----------- 系统崩溃堆栈文件 end --------------
  //生产环境阻止窗口关闭
  win.on("close", (event: any) => {
    console.log(import.meta.env);
    if (import.meta.env.NODE_ENV == "production") {
      // 阻止窗口关闭
      event.preventDefault();
      // 重新加载页面
      log.warn("应用尝试关闭，已阻止");
    }
  });

  // 网页未响应
  win.on("unresponsive", (event: any) => {
    // 重新加载页面
    log.warn("网页无响应，重新加载：");
    const url = win.webContents.getURL();
    log.warn(`页面未响应：${url}`);
    // win.reload()
    win.loadFile(indexHtml);
  });

  win.on("closed", () => {
    win = null;
  });

  // 进入开发者模式-显示菜单栏
  // win.menuBarVisible

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler((data: any) => {
    if (data.url.startsWith("https:")) shell.openExternal(data.url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  /**
   * IPC：渲染器进程到主进程（单向）
   */
  ipcMain.on("open-web", (event: any, url: any) => {
    new Notification({ title: "网址", body: url }).show();
    const childWindow = new BrowserWindow({
      webPreferences: {
        preload,
        // nodeIntegration: true,
        // contextIsolation: false,
      },
    });

    childWindow.loadURL(`${url}`);
  });
  ipcMain.on("log", (event: any, data: any) => {
    log.warn(data.message);
  });
  /**
   * IPC：渲染器进程到主进程（双向）
   */
  ipcMain.handle("dialog:openFile", handleFileOpen);

  // 注册全局快捷键
  const ret = globalShortcut.register("Control+Shift+O", () => {
    // 打开开发者工具
    win.webContents.openDevTools();
    // 设置窗口菜单栏是否自动隐藏
    // win.setAutoHideMenuBar(false);
    // 设置菜单栏是否可见
    win.setMenuBarVisibility(true);
  });

  const ret1 = globalShortcut.register("Control+Shift+C", () => {
    // 显示调试模式
    win.webContents.closeDevTools();
    // 设置窗口菜单栏是否自动隐藏
    // win.setAutoHideMenuBar(true);
    // 设置菜单栏是否可见
    win.setMenuBarVisibility(false);
  });

  const ret2 = globalShortcut.register("Control+Shift+B", () => {
    // 关闭应用
    app.quit();
  });

  if (!ret && !ret1 && !ret2) {
    log.warn("注册全局快捷键失败");
  }

  // 检测是否注册成功
  // log.info('是否注册成功:', globalShortcut.isRegistered('CommandOrControl+Shift+A'));
}

app.whenReady().then(createWindow);

app.on("ready", () => {
  // const filter = {urls:['*://*/*']}
  // session.defaultSession.webRequest.onBeforeSendHeaders(filter,(details,callback)=>{
  //   details.requestHeaders['Origin']='*'
  //   callback({cancel:false,requestHeaders:details.requestHeaders})
  // })
  log.info("应用启动");
});

app.on("will-quit", () => {
  // 解除全局快捷键的注册
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
// ipcMain.handle('open-win', (event, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: false,
//       contextIsolation: true,
//     },
//   })

//   if (process.env.VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${url}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })

// ipcMain.handle('exit', (event, arg) => {
//   console.log("000000")
//   app.exit()
// })
