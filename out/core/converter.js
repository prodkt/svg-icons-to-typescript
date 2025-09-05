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
const name_converter_1 = require("./name-converter");
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
            if (entry.isDirectory()) {
                const outputPath = path.join(outputFolderPath, entry.name);
                await processFolder(inputPath, outputPath);
            }
            else if (entry.isFile() && entry.name.endsWith(SVG_EXTENSION)) {
                // Convert Figma filename to clean output filename
                const cleanFilename = (0, name_converter_1.convertFigmaFilenameToOutputFilename)(entry.name);
                const outputPath = path.join(outputFolderPath, cleanFilename);
                await convertSvgToReact(inputPath, outputPath);
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
        // Extract original filename for proper title generation
        const originalFilename = path.basename(oldPath);
        const reactComponent = createReactComponent(svgContent, newPath, originalFilename);
        await (0, promises_1.writeFile)(newPath, reactComponent);
        console.log(`Converted ${oldPath} to ${newPath}`);
    }
    catch (error) {
        console.error("SVG conversion failed:", error);
        throw error;
    }
}
/**
 * Generates the component name based on the file path
 * Uses the new Figma filename conversion logic
 */
function getComponentName(filePath) {
    const fileName = filePath.split(/[\/\\]/).pop() || "SvgComponent";
    const componentName = (0, name_converter_1.convertFigmaFilenameToComponentName)(fileName);
    // Validate the component name
    if (!(0, name_converter_1.isValidComponentName)(componentName)) {
        console.warn(`Invalid component name generated: ${componentName}, using fallback`);
        return "SvgComponent";
    }
    return componentName;
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
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
function prepareSvgTag(svg) {
    return svg.replace(">", " {...props}>");
}
function processSvgTag(svg, componentName, originalFilename) {
    const cleanedSvg = removeUnnecessaryAttributes(svg);
    const [svgTag, ...rest] = cleanedSvg.split('>');
    const content = rest.join('>');
    // Use the original filename to create a proper title
    const title = (0, name_converter_1.convertFigmaFilenameToTitle)(originalFilename);
    return `${svgTag} {...props}>\n      <title>${title}</title>${content}`;
}
function convertSvgToJsx(svg, componentName, originalFilename) {
    let jsxSvg = processSvgTag(svg, componentName, originalFilename);
    jsxSvg = convertAttributes(jsxSvg);
    return indentJsx(jsxSvg);
}
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
function toCamelCase(str) {
    return str.replace(KEBAB_CASE_REGEX, (_, letter) => letter.toUpperCase());
}
function indentJsx(jsx) {
    return jsx
        .split('\n')
        .map((line) => `    ${line.trim()}`)
        .join('\n');
}
function validateSvgContent(svgContent) {
    const svgRegex = /<svg[^>]*>[\s\S]*<\/svg>/;
    return svgRegex.test(svgContent);
}
function createReactComponent(svgContent, filePath, originalFilename) {
    // Use the original filename to generate the component name, not the output file path
    const componentName = (0, name_converter_1.convertFigmaFilenameToComponentName)(originalFilename);
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
//# sourceMappingURL=converter.js.map