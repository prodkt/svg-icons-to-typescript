import * as vscode from 'vscode';
import * as path from 'node:path';
import { processFolder, convertSvgToReact } from './core/converter';
import { convertFigmaFilenameToOutputFilename } from './core/name-converter';

export function activate(context: vscode.ExtensionContext) {
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
                    await processFolder(inputPath, outputPath);
                    totalConverted++;
                } catch (error) {
                    console.warn(`Skipped folder ${folder}: ${error}`);
                }
            }

            vscode.window.showInformationMessage(
                `SVG conversion completed! Processed ${totalConverted} folders.`,
                'Open Output Folder'
            ).then(selection => {
                if (selection === 'Open Output Folder') {
                    vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(path.join(workspaceFolders[0].uri.fsPath, 'out')));
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error converting SVGs: ${error.message}`);
            } else {
                vscode.window.showErrorMessage("Unknown error occurred during conversion");
            }
        }
    });

    // Convert single SVG file
    const convertFileCommand = vscode.commands.registerCommand('svgr.convertFile', async (uri: vscode.Uri) => {
        try {
            if (!uri || !uri.fsPath.endsWith('.svg')) {
                vscode.window.showErrorMessage('Please select an SVG file to convert.');
                return;
            }

            const inputPath = uri.fsPath;
            const outputDir = path.dirname(inputPath);
            const fileName = path.basename(inputPath);
            const cleanFileName = convertFigmaFilenameToOutputFilename(fileName);
            const outputPath = path.join(outputDir, cleanFileName);

            await convertSvgToReact(inputPath, outputPath);

            vscode.window.showInformationMessage(
                `Converted ${fileName} to ${cleanFileName}`,
                'Open File'
            ).then(selection => {
                if (selection === 'Open File') {
                    vscode.window.showTextDocument(vscode.Uri.file(outputPath));
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error converting SVG: ${error.message}`);
            } else {
                vscode.window.showErrorMessage("Unknown error occurred during conversion");
            }
        }
    });

    // Convert folder of SVGs
    const convertFolderCommand = vscode.commands.registerCommand('svgr.convertFolder', async (uri: vscode.Uri) => {
        try {
            if (!uri) {
                vscode.window.showErrorMessage('Please select a folder to convert.');
                return;
            }

            const inputPath = uri.fsPath;
            const outputPath = path.join(path.dirname(inputPath), 'out', path.basename(inputPath));

            await processFolder(inputPath, outputPath);

            vscode.window.showInformationMessage(
                `Converted all SVGs in ${path.basename(inputPath)}`,
                'Open Output Folder'
            ).then(selection => {
                if (selection === 'Open Output Folder') {
                    vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(outputPath));
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error converting folder: ${error.message}`);
            } else {
                vscode.window.showErrorMessage("Unknown error occurred during conversion");
            }
        }
    });

    // Register all commands
    context.subscriptions.push(batchConvertCommand, convertFileCommand, convertFolderCommand);

    // Show welcome message on first activation
    const hasShownWelcome = context.globalState.get('hasShownWelcome', false);
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            'SVG to React Converter is ready! Right-click on SVG files or use the Command Palette.',
            'Open Documentation'
        ).then(selection => {
            if (selection === 'Open Documentation') {
                vscode.env.openExternal(vscode.Uri.parse('https://github.com/prodkt/svg-to-react-typescript'));
            }
        });
        context.globalState.update('hasShownWelcome', true);
    }
}

export function deactivate() {
    // Cleanup if needed
} 