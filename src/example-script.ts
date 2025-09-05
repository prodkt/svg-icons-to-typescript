#!/usr/bin/env node

/**
 * Example script demonstrating SVG to React TypeScript conversion
 * 
 * This script shows how to use the converter with various naming patterns
 * and demonstrates the Figma naming support.
 */

import * as path from "node:path";
import { processFolder } from "./core/converter";
import { 
  convertFigmaFilenameToComponentName, 
  convertFigmaFilenameToOutputFilename,
  convertFigmaFilenameToTitle 
} from "./core/name-converter";

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
  console.log("=" .repeat(80));
  console.log("Input Filename".padEnd(50) + "Component Name".padEnd(30) + "Output Filename");
  console.log("-".repeat(80));

  examples.forEach(filename => {
    const componentName = convertFigmaFilenameToComponentName(filename);
    const outputFilename = convertFigmaFilenameToOutputFilename(filename);
    const title = convertFigmaFilenameToTitle(filename);
    
    console.log(
      filename.padEnd(50) + 
      componentName.padEnd(30) + 
      outputFilename
    );
  });

  console.log("\n📝 Generated Component Example:");
  console.log("=" .repeat(80));
  
  const exampleSvg = "area=permissions_calendar_appIcon, style=gradient.svg";
  const componentName = convertFigmaFilenameToComponentName(exampleSvg);
  const title = convertFigmaFilenameToTitle(exampleSvg);
  
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
    
    await processFolder(widgliPath, outputPath);
    
    console.log("✅ Conversion completed successfully!");
    console.log(`📂 Check the output in: ${outputPath}`);
    
  } catch (error) {
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

export { demonstrateNaming, demonstrateConversion };
