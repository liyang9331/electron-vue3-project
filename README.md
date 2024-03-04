# 综合收费系统----一体化终端

技术栈： `Electron【桌面开发框架】` + `TypeScript` + `Vue3` + `Vite【vue3开发构建工具】` + `Element-Plus【element-ui 适配vue3版本】--集成开发环境`

## 初始化

```sh
yarn or npm install
```

## 目录结构

```diff
+ ├─┬ electron
+ │ ├─┬ main
+ │ │ └── index.ts    entry of Electron-Main
+ │ └─┬ preload
+ │   └── index.ts    entry of Preload-Scripts
  ├─┬ src
  │ └── main.ts       entry of Electron-Renderer
  │     ...
  ├── index.html
  ├── package.json
  └── vite.config.ts
```

## 逻辑流程图
```
在docs目录下
```

## 日志文件
```
Windows下：C:\Users\user_name\AppData\Roaming\its-platform-client\logs
```

## 生产环境开启调试模型
```
Control+Shift+O ：打开开发者工具
Control+Shift+C ：关闭开发者工具
Control+Shift+B ：关闭应用程序
```