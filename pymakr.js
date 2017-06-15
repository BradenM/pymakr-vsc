var vscode = require('vscode');
var view = require('./lib/pymakr-view').default;
var pyboard = require('./lib/board/pyboard').default;
var SettingsWrapper = require('./lib/settings-wrapper').default;

function activate(context) {
    
    var sw = new SettingsWrapper()
    var pb,v
    var terminalActive = true
    var terminal = null
    
    console.log(__dirname)

    function createTerminal(){
        terminal = vscode.window.createTerminal({name: "Pycom Console", shellPath: "/Users/Ralph/github/test/test/terminalExec.js"} )
        if(sw.open_on_start){
            terminal.show()
        }
    }
    createTerminal()

    vscode.window.onDidCloseTerminal(function(){
        console.log("Closed")
        v.disconnect()
        createTerminal()
    })
    
    pb = new pyboard(sw)
    v = new view("",pb,sw)
    v.addPanel()


    var disposable = vscode.commands.registerCommand('pymakr.help', function () {
        terminal.show()
        v.writeHelpText()
    })
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.connect', function () {
        terminal.show()
        v.connect()
    })
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.run', function () {
        console.log("Running")
        terminal.show()
        v.run()
    })
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.sync', function () {
        console.log("Syncing")
        terminal.show()
        v.sync()
    })
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.globalSettings', function () {
        console.log("Global settings")
        v.openGlobalSettings()
    })
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.projectSettings', function () {
        console.log("Settings")
        v.openProjectSettings()
    })
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.disconnect', function () {
        v.disconnect()
    });
    context.subscriptions.push(disposable);

    // not used. open/close terminal command is already available. 
    // Terminal opens automatically when doing a connect, run or sync action.
    var disposable = vscode.commands.registerCommand('pymakr.toggleREPL', function () {
        if (terminalActive){
            console.log("Closed")
            terminalActive = false
            terminal.hide()
            v.disconnect()
        }else{
            console.log("Opened")
            terminalActive = true;
            terminal.show()
            v.connect()
        }
    });
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.extra.getVersion', function () {
        v.getVersion()
    });
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.extra.getWifiMac', function () {
        v.getWifiMac()
    });
    context.subscriptions.push(disposable);

    var disposable = vscode.commands.registerCommand('pymakr.extra.getSerial', function () {
        v.getSerial()
    });
    context.subscriptions.push(disposable);
}


exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate