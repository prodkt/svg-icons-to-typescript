import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import * as path from "node:path";
import {
  convertFigmaFilenameToComponentName,
  convertFigmaFilenameToOutputFilename,
  convertFigmaFilenameToTitle,
  isValidComponentName
} from "./name-converter";

// Constants
const SVG_EXTENSION = ".svg";
const TSX_EXTENSION = ".tsx";

// Regular expressions
const KEBAB_CASE_REGEX = /-([a-z])/g;
const ATTRIBUTE_REGEX = /([a-zA-Z0-9-_:]+)[:=]["']([^"']*)["']/g;
const ARIA_REGEX = /^aria-/;

export async function processFolder(inputFolderPath: string, outputFolderPath: string): Promise<void> {
  try {
    // Ensure output directory exists
    await mkdir(outputFolderPath, { recursive: true });
    
    const entries = await readdir(inputFolderPath, { withFileTypes: true });

    for (const entry of entries) {
      const inputPath = path.join(inputFolderPath, entry.name);
      
      if (entry.isDirectory()) {
        const outputPath = path.join(outputFolderPath, entry.name);
        await processFolder(inputPath, outputPath);
      } else if (entry.isFile() && entry.name.endsWith(SVG_EXTENSION)) {
        // Convert Figma filename to clean output filename
        const cleanFilename = convertFigmaFilenameToOutputFilename(entry.name);
        const outputPath = path.join(outputFolderPath, cleanFilename);
        await convertSvgToReact(inputPath, outputPath);
      }
    }
  } catch (error) {
    console.error(`Error processing folder ${inputFolderPath}:`, error);
    throw error;
  }
}

export async function convertSvgToReact(oldPath: string, newPath: string): Promise<void> {
  try {
    const svgContent = await readFile(oldPath, "utf-8");
    if (!validateSvgContent(svgContent)) {
      throw new Error("Invalid SVG format");
    }
    if (!svgContent.trim()) {
      throw new Error("SVG file is empty");
    }

    // Extract original filename for proper title generation
    const originalFilename = path.basename(oldPath);
    const reactComponent = createReactComponent(svgContent, newPath, originalFilename);
    await writeFile(newPath, reactComponent);
    console.log(`Converted ${oldPath} to ${newPath}`);
  } catch (error) {
    console.error("SVG conversion failed:", error);
    throw error;
  }
}

/**
 * Generates the component name based on the file path
 * Uses the new Figma filename conversion logic
 */
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


function processSvgTag(svg: string, componentName: string, originalFilename: string): string {
  const cleanedSvg = removeUnnecessaryAttributes(svg);
  const [svgTag, ...rest] = cleanedSvg.split('>');
  const content = rest.join('>');
  
  // Use the original filename to create a proper title
  const title = convertFigmaFilenameToTitle(originalFilename);

  return `${svgTag} {...props}>\n      <title>${title}</title>${content}`;
}


function convertSvgToJsx(svg: string, componentName: string, originalFilename: string): string {
  let jsxSvg = processSvgTag(svg, componentName, originalFilename);
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
  return jsx
    .split('\n')
    .map((line: string) => `    ${line.trim()}`)
    .join('\n');
}

function validateSvgContent(svgContent: string): boolean {
  const svgRegex = /<svg[^>]*>[\s\S]*<\/svg>/;
  return svgRegex.test(svgContent);
}

function createReactComponent(svgContent: string, filePath: string, originalFilename: string): string {
  // Use the original filename to generate the component name, not the output file path
  const componentName = convertFigmaFilenameToComponentName(originalFilename);
  const jsxElement = convertSvgToJsx(svgContent, componentName, originalFilename);
  const isTypeScript = filePath.endsWith(TSX_EXTENSION);
  const propsType = isTypeScript ? ": SVGProps<SVGSVGElement>" : "";
  const importStatement = 'import React from "react";\nimport type { SVGProps } from "react";\n\n';

  return `${importStatement}const ${componentName} = (props${propsType}) => {
  return (
${jsxElement}
  );
};

export default ${componentName};
`;
}