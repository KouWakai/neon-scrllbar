// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const path = require('path');
const fs = require('fs');
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	this.extensionName = 'KouWakai.neon-scorllbar';
	this.cntx = context;

	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('neon-scrollbar.enableNeon', function () {
		const isWin = /^win/.test(process.platform);
		const appDir = path.dirname(require.main.filename);
		const base = appDir + (isWin ? "\\vs\\code" : "/vs/code");

		const neonbar = fs.readFileSync(__dirname +'/src/css/editor_chrome.css', 'utf-8');

		const htmlFile =
		base +
		(isWin
			? "\\electron-browser\\workbench\\workbench.html"
			: "/electron-browser/workbench/workbench.html");

		const html = fs.readFileSync(htmlFile, "utf-8");

		let output =  html;
		output += neonbar;
		console.log(output);
		fs.writeFileSync(htmlFile, output, "utf-8");
		console.log(output);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
