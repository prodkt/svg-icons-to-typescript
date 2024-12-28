import * as vscode from 'vscode';
import * as path from 'node:path';
import { processFolder } from './core/converter';

export function activate(context: vscode.ExtensionContext) {
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
                await processFolder(inputPath, outputPath);
            }

            vscode.window.showInformationMessage("SVG conversion completed successfully!");
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error converting SVGs: ${error.message}`);
            } else {
                vscode.window.showErrorMessage("Unknown error occurred during conversion");
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {} 