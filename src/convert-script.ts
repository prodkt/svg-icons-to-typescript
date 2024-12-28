import * as path from "node:path";
import { processFolder } from "./core/converter";

async function main() {
    const rootPath = path.join(process.cwd(), 'src', 'icons'); // Updated path
    const iconFolders = [
        "Solid icons",
        "Line icons",
        "Duotone icons",
        "Duocolor icons"
    ];

    try {
        for (const folder of iconFolders) {
            const folderPath = path.join(rootPath, folder);
            const outputPath = path.join(process.cwd(), 'out', 'icons', folder);
            await processFolder(folderPath, outputPath);
        }
        console.log("Batch conversion completed successfully!");
    } catch (error) {
        console.error("Conversion failed:", error);
        process.exit(1);
    }
}

main(); 