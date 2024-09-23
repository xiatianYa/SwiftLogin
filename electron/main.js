const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')
let mainWindow;
let tray;
const path = require('node:path')
const createWindow = () => {
    // 创建一个浏览器窗口对象
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, 'icons', 'logo.ico'),
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //调式模式
    // mainWindow.webContents.openDevTools({ mode: 'detach' })
    // 窗口对象对应的html文件
    mainWindow.loadURL('https://www.bluearchive.top')

    // 当点击关闭按钮
    mainWindow.on('close', (e) => {
        e.preventDefault();  // 阻止退出程序
        mainWindow.setSkipTaskbar(true)   // 取消任务栏显示
        mainWindow.hide();    // 隐藏主程序窗口
    });

    mainWindow.on('click', (e) => {
        mainWindow.show();    // 打开主程序窗口
    });

    // 创建任务栏图标
    tray = new Tray(path.join(__dirname, 'icons', 'logo.ico'))

    // 自定义托盘图标的内容菜单
    const contextMenu = Menu.buildFromTemplate([
        {
            // 点击退出菜单退出程序
            label: '退出', click: function () {
                mainWindow.destroy()
                app.quit()
            }
        }
    ])
    tray.setContextMenu(contextMenu)  // 设置图标的内容菜单
    // 点击托盘图标，显示主窗口
    tray.on("click", () => {
        mainWindow.show();
    })
    mainWindow.setMenu(null);
}
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on(
        "second-instance",
        (event, commandLine, workingDirectory, additionalData) => {
            //输入从第二个实例中接收到的数据
            console.log(additionalData);
            //有人试图运行第二个实例，我们应该关注我们的窗口
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                /* 展示屏幕 */
                mainWindow.show();
            }
        }
    );
    //创建win，加载应用的其余部分，etc...
    app.whenReady().then(() => {
        createWindow();
    });
}
