import * as path from "node:path";
import { processFolder } from "./core/converter";

async function main() {
    const rootPath = path.join(process.cwd(), 'src', 'widgli'); // Updated path
    const iconFolders = [
        "calendar"
    ];

    try {
        for (const folder of iconFolders) {
            const folderPath = path.join(rootPath, folder);
            const outputPath = path.join(process.cwd(), 'out', 'widgli', folder);
            await processFolder(folderPath, outputPath);
        }
        console.log("Batch conversion completed successfully!");
    } catch (error) {
        console.error("Conversion failed:", error);
        process.exit(1);
    }
}

main(); 