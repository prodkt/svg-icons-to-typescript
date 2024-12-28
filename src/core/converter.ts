import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import * as path from "node:path";

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
      const outputPath = path.join(outputFolderPath, entry.name);
      
      if (entry.isDirectory()) {
        await processFolder(inputPath, outputPath);
      } else if (entry.isFile() && entry.name.endsWith(SVG_EXTENSION)) {
        const newPath = outputPath.replace(SVG_EXTENSION, TSX_EXTENSION);
        await convertSvgToReact(inputPath, newPath);
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
    const reactComponent = createReactComponent(svgContent, newPath);
    await writeFile(newPath, reactComponent);
    console.log(`Converted ${oldPath} to ${newPath}`);
  } catch (error) {
    console.error("SVG conversion failed:", error);
    throw error;
  }
}

/**
 * Gera o nome do componente baseado no nome do arquivo
 */
function getComponentName(filePath: string): string {
  const fileName = filePath.split(/[\/\\]/).pop()?.split(".")[0] || "SvgComponent";
  return fileName.split(/[-_]/).map(capitalizeFirstLetter).join("");
}

/**
 * Capitaliza a primeira letra de uma string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Remove atributos desnecessários do SVG e normaliza o espaçamento
 */
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

/**
 * Prepara a tag SVG adicionando suporte a props
 */
function prepareSvgTag(svg: string): string {
  return svg.replace(">", " {...props}>");
}

/**
 * Processa a tag SVG removendo atributos desnecessários e adicionando suporte a props
 */
function processSvgTag(svg: string, componentName: string): string {
  const cleanedSvg = removeUnnecessaryAttributes(svg);
  // Extract the opening svg tag and the rest of the content
  const [svgTag, ...rest] = cleanedSvg.split('>');
  const content = rest.join('>');
  
  // Add props to the svg tag and insert the title as the first child
  return `${svgTag} {...props}>\n      <title>${componentName}</title>${content}`;
}

/**
 * Converte o conteúdo SVG para JSX
 */
function convertSvgToJsx(svg: string, componentName: string): string {
  let jsxSvg = processSvgTag(svg, componentName);
  jsxSvg = convertAttributes(jsxSvg);
  return indentJsx(jsxSvg);
}

/**
 * Converte os atributos SVG para JSX
 */
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

/**
 * Converte o atributo style para o formato JSX
 */
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

/**
 * Converte uma string de kebab-case para camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(KEBAB_CASE_REGEX, (_, letter: string) =>
    letter.toUpperCase()
  );
}

/**
 * Indenta o JSX gerado
 */
function indentJsx(jsx: string): string {
  return jsx
    .split('\n')
    .map((line: string) => `    ${line.trim()}`)
    .join('\n');
}

// ... rest of your existing utility functions ...
function validateSvgContent(svgContent: string): boolean {
  const svgRegex = /<svg[^>]*>[\s\S]*<\/svg>/;
  return svgRegex.test(svgContent);
}

function createReactComponent(svgContent: string, filePath: string): string {
  const componentName = getComponentName(filePath);
  const jsxElement = convertSvgToJsx(svgContent, componentName);
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

// ... rest of your existing utility functions ... 