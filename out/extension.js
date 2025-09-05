"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("node:path"));
const converter_1 = require("./core/converter");
const name_converter_1 = require("./core/name-converter");
function activate(context) {
    console.log('SVG to React Converter is now active');
    // Batch convert all SVGs in workspace
    const batchConvertCommand = vscode.commands.registerCommand('svgr.batchConvert', async () => {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                throw new Error("No workspace folder open");
            }
            const rootPath = path.join(workspaceFolders[0].uri.fsPath, 'src', 'icons');
            const iconFolders = [
                "Solid icons",
                "Line icons",
                "Duotone icons",
                "Duocolor icons"
            ];
            let totalConverted = 0;
            for (const folder of iconFolders) {
                const inputPath = path.join(rootPath, folder);
                const outputPath = path.join(workspaceFolders[0].uri.fsPath, 'out', 'icons', folder);
                try {
                    await (0, converter_1.processFolder)(inputPath, outputPath);
                    totalConverted++;
                }
                catch (error) {
                    console.warn(`Skipped folder ${folder}: ${error}`);
                }
            }
            vscode.window.showInformationMessage(`SVG conversion completed! Processed ${totalConverted} folders.`, 'Open Output Folder').then(selection => {
                if (selection === 'Open Output Folder') {
                    vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(path.join(workspaceFolders[0].uri.fsPath, 'out')));
                }
            });
        }
        catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error converting SVGs: ${error.message}`);
            }
            else {
                vscode.window.showErrorMessage("Unknown error occurred during conversion");
            }
        }
    });
    // Convert single SVG file
    const convertFileCommand = vscode.commands.registerCommand('svgr.convertFile', async (uri) => {
        try {
            if (!uri || !uri.fsPath.endsWith('.svg')) {
                vscode.window.showErrorMessage('Please select an SVG file to convert.');
                return;
            }
            const inputPath = uri.fsPath;
            const outputDir = path.dirname(inputPath);
            const fileName = path.basename(inputPath);
            const cleanFileName = (0, name_converter_1.convertFigmaFilenameToOutputFilename)(fileName);
            const outputPath = path.join(outputDir, cleanFileName);
            await (0, converter_1.convertSvgToReact)(inputPath, outputPath);
            vscode.window.showInformationMessage(`Converted ${fileName} to ${cleanFileName}`, 'Open File').then(selection => {
                if (selection === 'Open File') {
                    vscode.window.showTextDocument(vscode.Uri.file(outputPath));
                }
            });
        }
        catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error converting SVG: ${error.message}`);
            }
            else {
                vscode.window.showErrorMessage("Unknown error occurred during conversion");
            }
        }
    });
    // Convert folder of SVGs
    const convertFolderCommand = vscode.commands.registerCommand('svgr.convertFolder', async (uri) => {
        try {
            if (!uri) {
                vscode.window.showErrorMessage('Please select a folder to convert.');
                return;
            }
            const inputPath = uri.fsPath;
            const outputPath = path.join(path.dirname(inputPath), 'out', path.basename(inputPath));
            await (0, converter_1.processFolder)(inputPath, outputPath);
            vscode.window.showInformationMessage(`Converted all SVGs in ${path.basename(inputPath)}`, 'Open Output Folder').then(selection => {
                if (selection === 'Open Output Folder') {
                    vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath));
                }
            });
        }
        catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error converting folder: ${error.message}`);
            }
            else {
                vscode.window.showErrorMessage("Unknown error occurred during conversion");
            }
        }
    });
    // Register all commands
    context.subscriptions.push(batchConvertCommand, convertFileCommand, convertFolderCommand);
    // Show welcome message on first activation
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage('SVG to React Converter is ready! Right-click on SVG files or use the Command Palette.', 'Open Documentation').then(selection => {
            if (selection === 'Open Documentation') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/prodkt/svg-to-react-typescript'));
            }
        });
        context.globalState.update('hasShownWelcome', true);
    }
}
function deactivate() {
    // Cleanup if needed
}
//# sourceMappingURL=extension.js.map