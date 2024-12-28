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
exports.processFolder = processFolder;
exports.convertSvgToReact = convertSvgToReact;
const promises_1 = require("node:fs/promises");
const path = __importStar(require("node:path"));
// Constants
const SVG_EXTENSION = ".svg";
const TSX_EXTENSION = ".tsx";
// Regular expressions
const KEBAB_CASE_REGEX = /-([a-z])/g;
const ATTRIBUTE_REGEX = /([a-zA-Z0-9-_:]+)[:=]["']([^"']*)["']/g;
const ARIA_REGEX = /^aria-/;
async function processFolder(inputFolderPath, outputFolderPath) {
    try {
        // Ensure output directory exists
        await (0, promises_1.mkdir)(outputFolderPath, { recursive: true });
        const entries = await (0, promises_1.readdir)(inputFolderPath, { withFileTypes: true });
        for (const entry of entries) {
            const inputPath = path.join(inputFolderPath, entry.name);
            const outputPath = path.join(outputFolderPath, entry.name);
            if (entry.isDirectory()) {
                await processFolder(inputPath, outputPath);
            }
            else if (entry.isFile() && entry.name.endsWith(SVG_EXTENSION)) {
                const newPath = outputPath.replace(SVG_EXTENSION, TSX_EXTENSION);
                await convertSvgToReact(inputPath, newPath);
            }
        }
    }
    catch (error) {
        console.error(`Error processing folder ${inputFolderPath}:`, error);
        throw error;
    }
}
async function convertSvgToReact(oldPath, newPath) {
    try {
        const svgContent = await (0, promises_1.readFile)(oldPath, "utf-8");
        if (!validateSvgContent(svgContent)) {
            throw new Error("Invalid SVG format");
        }
        if (!svgContent.trim()) {
            throw new Error("SVG file is empty");
        }
        const reactComponent = createReactComponent(svgContent, newPath);
        await (0, promises_1.writeFile)(newPath, reactComponent);
        console.log(`Converted ${oldPath} to ${newPath}`);
    }
    catch (error) {
        console.error("SVG conversion failed:", error);
        throw error;
    }
}
/**
 * Gera o nome do componente baseado no nome do arquivo
 */
function getComponentName(filePath) {
    const fileName = filePath.split(/[\/\\]/).pop()?.split(".")[0] || "SvgComponent";
    return fileName.split(/[-_]/).map(capitalizeFirstLetter).join("");
}
/**
 * Capitaliza a primeira letra de uma string
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Remove atributos desnecessários do SVG e normaliza o espaçamento
 */
function removeUnnecessaryAttributes(svg) {
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
function prepareSvgTag(svg) {
    return svg.replace(">", " {...props}>");
}
/**
 * Processa a tag SVG removendo atributos desnecessários e adicionando suporte a props
 */
function processSvgTag(svg, componentName) {
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
function convertSvgToJsx(svg, componentName) {
    let jsxSvg = processSvgTag(svg, componentName);
    jsxSvg = convertAttributes(jsxSvg);
    return indentJsx(jsxSvg);
}
/**
 * Converte os atributos SVG para JSX
 */
function convertAttributes(svg) {
    return svg.replace(ATTRIBUTE_REGEX, (_, attr, value) => {
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
function convertStyleAttribute(styleValue) {
    const styleObject = styleValue.split(";")
        .filter((s) => s.trim())
        .map((s) => {
        const [key, value] = s.split(":");
        return `${toCamelCase(key.trim())}: "${value.trim()}"`;
    })
        .join(", ");
    return `style={{${styleObject}}}`;
}
/**
 * Converte uma string de kebab-case para camelCase
 */
function toCamelCase(str) {
    return str.replace(KEBAB_CASE_REGEX, (_, letter) => letter.toUpperCase());
}
/**
 * Indenta o JSX gerado
 */
function indentJsx(jsx) {
    return jsx
        .split('\n')
        .map((line) => `    ${line.trim()}`)
        .join('\n');
}
// ... rest of your existing utility functions ...
function validateSvgContent(svgContent) {
    const svgRegex = /<svg[^>]*>[\s\S]*<\/svg>/;
    return svgRegex.test(svgContent);
}
function createReactComponent(svgContent, filePath) {
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
//# sourceMappingURL=converter.js.map