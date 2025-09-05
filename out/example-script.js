#!/usr/bin/env node
"use strict";
/**
 * Example script demonstrating SVG to React TypeScript conversion
 *
 * This script shows how to use the converter with various naming patterns
 * and demonstrates the Figma naming support.
 */
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
exports.demonstrateNaming = demonstrateNaming;
exports.demonstrateConversion = demonstrateConversion;
const path = __importStar(require("node:path"));
const converter_1 = require("./core/converter");
const name_converter_1 = require("./core/name-converter");
async function demonstrateNaming() {
    console.log("🎨 SVG to React TypeScript Converter - Naming Examples\n");
    const examples = [
        "icon.svg",
        "my-icon.svg",
        "user-profile.svg",
        "area=permissions_calendar_appIcon, style=gradient.svg",
        "area=tagsField_calendar_appIcon, style=solid.svg",
        "button=primary, variant=large, state=hover.svg",
        "icon=arrow-right, size=24px, color=blue.svg"
    ];
    console.log("📋 Naming Conversion Examples:");
    console.log("=".repeat(80));
    console.log("Input Filename".padEnd(50) + "Component Name".padEnd(30) + "Output Filename");
    console.log("-".repeat(80));
    examples.forEach(filename => {
        const componentName = (0, name_converter_1.convertFigmaFilenameToComponentName)(filename);
        const outputFilename = (0, name_converter_1.convertFigmaFilenameToOutputFilename)(filename);
        const title = (0, name_converter_1.convertFigmaFilenameToTitle)(filename);
        console.log(filename.padEnd(50) +
            componentName.padEnd(30) +
            outputFilename);
    });
    console.log("\n📝 Generated Component Example:");
    console.log("=".repeat(80));
    const exampleSvg = "area=permissions_calendar_appIcon, style=gradient.svg";
    const componentName = (0, name_converter_1.convertFigmaFilenameToComponentName)(exampleSvg);
    const title = (0, name_converter_1.convertFigmaFilenameToTitle)(exampleSvg);
    console.log(`// Input: ${exampleSvg}`);
    console.log(`// Component: ${componentName}`);
    console.log(`// Title: ${title}\n`);
    console.log(`import React from "react";`);
    console.log(`import type { SVGProps } from "react";`);
    console.log(``);
    console.log(`const ${componentName} = (props: SVGProps<SVGSVGElement>) => {`);
    console.log(`  return (`);
    console.log(`    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>`);
    console.log(`      <title>${title}</title>`);
    console.log(`      {/* SVG content */}`);
    console.log(`    </svg>`);
    console.log(`  );`);
    console.log(`};`);
    console.log(``);
    console.log(`export default ${componentName};`);
}
async function demonstrateConversion() {
    console.log("\n🚀 Conversion Demonstration\n");
    try {
        // Check if widgli folder exists
        const widgliPath = path.join(process.cwd(), 'src', 'widgli', 'calendar');
        const outputPath = path.join(process.cwd(), 'out', 'example');
        console.log(`📁 Input directory: ${widgliPath}`);
        console.log(`📁 Output directory: ${outputPath}`);
        console.log(`🔄 Starting conversion...\n`);
        await (0, converter_1.processFolder)(widgliPath, outputPath);
        console.log("✅ Conversion completed successfully!");
        console.log(`📂 Check the output in: ${outputPath}`);
    }
    catch (error) {
        console.error("❌ Conversion failed:", error);
        console.log("\n💡 Make sure you have SVG files in src/widgli/calendar/");
    }
}
async function main() {
    console.log("🎯 SVG to React TypeScript Converter - Example Script\n");
    // Demonstrate naming conversion
    await demonstrateNaming();
    // Demonstrate actual conversion
    await demonstrateConversion();
    console.log("\n🎉 Example script completed!");
    console.log("\n📚 For more information, see:");
    console.log("   - README.md for full documentation");
    console.log("   - USAGE.md for detailed usage guide");
    console.log("   - src/core/name-converter.ts for naming utilities");
}
// Run the example
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=example-script.js.map