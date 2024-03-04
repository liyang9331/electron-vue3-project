//在上下文隔离启用的情况下使用预加载

/**
 * 预加载脚本与浏览器共享同一个全局 Window 接口，并且可以访问 Node.js API，所以它通过在全局 window 中暴露任意 API 来增强渲染器，以便你的网页内容使用。
 */


/**
 * contextBridge 模块可以用来安全地从独立运行、上下文隔离的预加载脚本中暴露 API 给正在运行的渲染进程
 */
interface data {
  type: string;
  message: string;
}
const { contextBridge, ipcRenderer } = require('electron')
// import log from 'electron-log/renderer';
// log.info('Log from the renderer process');
// const {app} = require('electron')
// window.app = app
contextBridge.exposeInMainWorld('electronAPI', {
  // IPC：渲染器进程到主进程（单向）
  openWeb: (url: string) => ipcRenderer.send('open-web', url),
  exit: () => ipcRenderer.send('exit'),
  log:(data:data)=>ipcRenderer.send('log',data),
  // IPC：渲染器进程到主进程（双向）
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
})