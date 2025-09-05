import * as vscode from "vscode";
import { readFile, writeFile, readdir } from "node:fs/promises";
import * as path from "path";
import {
  convertFigmaFilenameToComponentName,
  convertFigmaFilenameToOutputFilename,
  convertFigmaFilenameToTitle,
  isValidComponentName
} from "./src/core/name-converter";

const SVG_EXTENSION = ".svg";
const JSX_EXTENSION = ".jsx";
const TSX_EXTENSION = ".tsx";

const KEBAB_CASE_REGEX = /-([a-z])/g;
const ATTRIBUTE_REGEX = /([a-zA-Z0-9-_:]+)[:=]["']([^"']*)["']/g;
const ARIA_REGEX = /^aria-/;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'svgr.batchConvert',
    batchConvertSvgs
  );
  
  context.subscriptions.push(disposable);
  context.subscriptions.push(vscode.workspace.onWillRenameFiles(handleFileRename));
}


async function handleFileRename(event: vscode.FileWillRenameEvent): Promise<void> {
  const renamePromises = event.files.map(async ({ oldUri, newUri }) => {
    if (isSvgToReactConversion(oldUri, newUri)) {
      await convertSvgToReact(oldUri, newUri);
    }
  });

  await Promise.all(renamePromises);
}


function isSvgToReactConversion(oldUri: vscode.Uri, newUri: vscode.Uri): boolean {
   const isSvgConversionValid = oldUri.fsPath.endsWith(SVG_EXTENSION) 
   && (newUri.fsPath.endsWith(JSX_EXTENSION) || newUri.fsPath.endsWith(TSX_EXTENSION));
   return isSvgConversionValid;
}


function validateSvgContent(svgContent: string): boolean {
  const svgRegex = /<svg[^>]*>[\s\S]*<\/svg>/;
  return svgRegex.test(svgContent);
}


async function convertSvgToReact(oldUri: vscode.Uri, newUri: vscode.Uri): Promise<void> {
  try {
    const svgContent = await readFile(oldUri.fsPath, "utf-8");
    if (!validateSvgContent(svgContent)) {
      throw new Error("Invalid SVG format");
    }
    if (!svgContent.trim()) {
      throw new Error("SVG file is empty");
    }
    const reactComponent = createReactComponent(svgContent, newUri.fsPath);
    // Write to the new file instead of overwriting the original
    await writeFile(newUri.fsPath, reactComponent);
    console.log(`Converted ${oldUri.fsPath} to ${newUri.fsPath}`);
  } catch (error) {
    handleConversionError(error);
    console.error("SVG conversion failed:", error);
  }
}


function handleConversionError(error: unknown): void {
  if (error instanceof Error) {
    vscode.window.showErrorMessage(
      `Error converting SVG to React: ${error.message}`
    );
  } else {
    vscode.window.showErrorMessage(
      "Unknown error when converting SVG to React"
    );
  }
}


function createReactComponent(svgContent: string, filePath: string): string {
  const originalFilename = path.basename(filePath);
  // Use the original filename to generate the component name, not the output file path
  const componentName = convertFigmaFilenameToComponentName(originalFilename);
  const jsxElement = convertSvgToJsx(svgContent, originalFilename);
  const isTypeScript = filePath.endsWith(TSX_EXTENSION);
  const propsType = isTypeScript ? ": React.SVGProps<SVGSVGElement>" : "";
  const importStatement = isTypeScript
    ? 'import * as React from "react";\n\n'
    : 'import * as React from "react";\n\n';

  return `${importStatement}const ${componentName} = (props${propsType}) => {
  return (
${jsxElement}
  );
};

export default ${componentName};
`;
}


function getComponentName(filePath: string): string {
  const fileName = filePath.split(/[\/\\]/).pop() || "SvgComponent";
  const componentName = convertFigmaFilenameToComponentName(fileName);

  // Validate the component name
  if (!isValidComponentName(componentName)) {
    console.warn(`Invalid component name generated: ${componentName}, using fallback`);
    return "SvgComponent";
  }

  return componentName;
}


function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


function removeUnnecessaryAttributes(svg: string): string {
  return svg
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s*xmlns:xlink=["'][^"']*["']/g, "")
    .replace(/\s*version=["'][^"']*["']/g, "")
    .replace(/\s*id=["'][^"']*["']/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .trim();
}

function prepareSvgTag(svg: string): string {
  return svg.replace(">", " {...props}>");
}


function processSvgTag(svg: string, originalFilename: string): string {
  const cleanedSvg = removeUnnecessaryAttributes(svg);
  const [svgTag, ...rest] = cleanedSvg.split('>');
  const content = rest.join('>');

  // Use the original filename to create a proper title
  const title = convertFigmaFilenameToTitle(originalFilename);

  return `${svgTag} {...props}>\n      <title>${title}</title>${content}`;
}


function convertSvgToJsx(svg: string, originalFilename: string): string {
  let jsxSvg = processSvgTag(svg, originalFilename);
  jsxSvg = convertAttributes(jsxSvg);
  return indentJsx(jsxSvg);
}

function convertAttributes(svg: string): string {
  return svg.replace(ATTRIBUTE_REGEX, (_, attr: string, value: string) => {
     if (ARIA_REGEX.test(attr)) {
      return `${attr}="${value}"`;
    }

    let camelAttr = toCamelCase(attr);

    if (attr === "xlink:href") {
      return `xlinkHref="${value}"`;
    }

    if (attr === "xml:space") {
      return `xmlSpace="${value}"`;
    }

    if (camelAttr === "class") {
      return `className="${value}"`;
    }

    if (camelAttr === "style") {
      return convertStyleAttribute(value);
    }

    if (!isNaN(Number(value))) {
      return `${camelAttr}={${value}}`;
    }

    return `${camelAttr}="${value}"`;
  });
}


function convertStyleAttribute(styleValue: string): string {
  const styleObject = styleValue.split(";")
    .filter((s: string) => s.trim())
    .map((s: string) => {
      const [key, value] = s.split(":");
      return `${toCamelCase(key.trim())}: "${value.trim()}"`;
    })
    .join(", ");
  return `style={{${styleObject}}}`;
}


function toCamelCase(str: string): string {
  return str.replace(KEBAB_CASE_REGEX, (_, letter: string) =>
    letter.toUpperCase()
  );
}

function indentJsx(jsx: string): string {
  return jsx.split("\n").map((line: string) => `    ${line.trim()}`).join("\n");
}


async function batchConvertSvgs() {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      throw new Error("No workspace folder open");
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const iconFolders = [
      "Solid icons",
      "Line icons",
      "Duotone icons",
      "Duocolor icons",
      "calendar"
    ];

    for (const folder of iconFolders) {
      const folderPath = path.join(rootPath, folder);
      await processFolder(folderPath);
    }

    vscode.window.showInformationMessage("Batch conversion completed successfully!");
  } catch (error) {
    handleConversionError(error);
  }
}


async function processFolder(folderPath: string): Promise<void> {
  try {
    const entries = await readdir(folderPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(folderPath, entry.name);
      
      if (entry.isDirectory()) {
        await processFolder(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(SVG_EXTENSION)) {
        // Convert Figma filename to clean output filename
        const cleanFilename = convertFigmaFilenameToOutputFilename(entry.name);
        const newPath = path.join(path.dirname(fullPath), cleanFilename);
        await convertSvgToReact(
          vscode.Uri.file(fullPath),
          vscode.Uri.file(newPath)
        );
      }
    }
  } catch (error) {
    console.error(`Error processing folder ${folderPath}:`, error);
    throw error;
  }
}


export function deactivate() {}