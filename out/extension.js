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
function activate(context) {
    console.log('SVG to React Converter is now active');
    const disposable = vscode.commands.registerCommand('svgr.batchConvert', async () => {
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
            for (const folder of iconFolders) {
                const inputPath = path.join(rootPath, folder);
                const outputPath = path.join(workspaceFolders[0].uri.fsPath, 'out', 'icons', folder);
                await (0, converter_1.processFolder)(inputPath, outputPath);
            }
            vscode.window.showInformationMessage("SVG conversion completed successfully!");
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
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map