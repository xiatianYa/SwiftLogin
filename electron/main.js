const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')
let tray = null;
const path = require('node:path')
const createWindow = () => {
    // 创建一个浏览器窗口对象
    const win = new BrowserWindow({
        icon: path.join(__dirname, 'icons', 'logo.ico'),
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // 窗口对象对应的html文件
    win.loadURL('https://www.bluearchive.top')

    win.setMenu(null);

    // 当点击关闭按钮
    win.on('close', (e) => {
        e.preventDefault();  // 阻止退出程序
        win.setSkipTaskbar(true)   // 取消任务栏显示
        win.hide();    // 隐藏主程序窗口
    });

    // 创建任务栏图标
    tray = new Tray(path.join(__dirname, 'icons', 'logo.ico'))

    // 自定义托盘图标的内容菜单
    const contextMenu = Menu.buildFromTemplate([
        {
            // 点击退出菜单退出程序
            label: '退出', click: function () {
                win.destroy()
                app.quit()
            }
        }
    ])
    tray.setContextMenu(contextMenu)  // 设置图标的内容菜单
}

// app模块准备完成，创建窗口
app.whenReady().then(() => {
    ipcMain.handle('__dirname', () => __dirname)
    createWindow()
})
