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

	const config = vscode.workspace.getConfiguration("NeonScrollbar");

	let red = config.RGBred;
	let green = config.RGBgreen;
	let blue = config.RGBblue;
	let rgb = "rgb(" + red + ", " + green + ", " + blue;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('neon-scrollbar.enableNeon', function () {
		const isWin = /^win/.test(process.platform);
		const appDir = path.dirname(require.main.filename);
		const base = appDir + (isWin ? "\\vs\\code" : "/vs/code");

		const htmlFile =
		base +
		(isWin
			? "\\electron-browser\\workbench\\workbench.html"
			: "/electron-browser/workbench/workbench.html");

		const appendcss =
		base +
				(isWin
					? "\\electron-browser\\workbench\\neonscrollbar.js"
					: "/electron-browser/workbench/neonscrollbar.js");

		const csstemplate = fs.readFileSync(__dirname +'/src/css/appends.css', 'utf-8');
		const neonbar = csstemplate.replace(/rgb\(255, 0, 225/g, rgb);
		const cssloader = fs.readFileSync(__dirname +'/src/js/cssloader.js', 'utf-8');
		const themewithneon = cssloader.replace(/\[APPENDS\]/g, neonbar);
		fs.writeFileSync(appendcss, themewithneon, "utf-8");

		const html = fs.readFileSync(htmlFile, "utf-8");

		let output =  html;

		// check if the tag is already there
		const isEnabled = html.includes("neonscrollbar.js");

		if (!isEnabled) {
		// delete synthwave script tag if there
		let output = html.replace(/^.*(<!-- neon scrollbar --><script src="neonscrollbar.js"><\/script><!-- neon scrollbar -->).*\n?/mg, '');
		// add script tag
		output = html.replace(/\<\/html\>/g, `	<!-- neon scrollbar --><script src="neonscrollbar.js"></script><!-- neon scrollbar -->\n`);
		output += '</html>';
		fs.writeFileSync(htmlFile, output, "utf-8");
		vscode.window
					.showInformationMessage("Neon scrollbar enabled. VS code must reload for this change to take effect.", { title: "Restart editor to complete" })
					.then(function(msg) {
						vscode.commands.executeCommand("workbench.action.reloadWindow");
					});
		}
	});

	let disable = vscode.commands.registerCommand('neon-scrollbar.disableNeon', uninstall);
	
	context.subscriptions.push(disposable);
	context.subscriptions.push(disable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
	// ...
}

function uninstall() {
	var isWin = /^win/.test(process.platform);
	var appDir = path.dirname(require.main.filename);
	var base = appDir + (isWin ? "\\vs\\code" : "/vs/code");
	var htmlFile =
		base +
		(isWin
			? "\\electron-browser\\workbench\\workbench.html"
			: "/electron-browser/workbench/workbench.html");

	// modify workbench html
	const html = fs.readFileSync(htmlFile, "utf-8");

	// check if the tag is already there
	const isEnabled = html.includes("neonscrollbar.js");

	if (isEnabled) {
		// delete synthwave script tag if there
		let output = html.replace(/^.*(<!-- neon scrollbar --><script src="neonscrollbar.js"><\/script><!-- neon scrollbar -->).*\n?/mg, '');
		fs.writeFileSync(htmlFile, output, "utf-8");

		vscode.window
			.showInformationMessage("Neon scrollbar disabled. VS code must reload for this change to take effect", { title: "Restart editor to complete" })
			.then(function(msg) {
				vscode.commands.executeCommand("workbench.action.reloadWindow");
			});
	} else {
		vscode.window.showInformationMessage('Neon scrollbar isn\'t running.');
	}
}

module.exports = {
	activate,
	deactivate
}
