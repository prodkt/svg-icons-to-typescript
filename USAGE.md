# SVG to React TypeScript Converter - Usage Guide

## 🚀 Quick Start

### 1. VSCode Extension Usage

#### Right-Click Context Menu
1. **Single File**: Right-click on any `.svg` file in the file explorer
2. Select **"Convert SVG to React Component"**
3. The component will be generated in the same directory

#### Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type **"SVGR"** to see all available commands:
   - `SVGR: Batch Convert SVGs to React Components`
   - `Convert SVG to React Component`
   - `Convert Folder SVGs to React Components`

#### Batch Processing
1. Use **"SVGR: Batch Convert"** to process all icon folders
2. Or right-click on a folder and select **"Convert Folder SVGs to React Components"**

### 2. CLI Usage

```bash
# Convert all icon folders
npm run convert

# Convert Widgli-specific folders
npm run convert:widgli

# Watch mode for development
npm run dev

# Clean output directory
npm run clean
```

## 📁 File Organization

### Recommended Structure
```
your-project/
├── src/
│   ├── icons/
│   │   ├── Solid icons/
│   │   ├── Line icons/
│   │   ├── Duotone icons/
│   │   └── Duocolor icons/
│   └── widgli/
│       └── calendar/
├── out/                    # Generated components
│   ├── icons/
│   └── widgli/
└── package.json
```

### Figma Export Structure
```
src/widgli/calendar/
├── area=permissions_calendar_appIcon, style=gradient.svg
├── area=permissions_calendar_appIcon, style=outline.svg
├── area=permissions_calendar_appIcon, style=solid.svg
└── ...
```

## 🎯 Naming Conventions

### Input → Output Examples

| Input Filename | Component Name | Output Filename |
|----------------|----------------|-----------------|
| `icon.svg` | `Icon` | `icon.tsx` |
| `my-icon.svg` | `MyIcon` | `myIcon.tsx` |
| `area=permissions_calendar_appIcon, style=gradient.svg` | `AreaPermissionsCalendarAppiconStyleGradient` | `areaPermissionsCalendarAppiconStyleGradient.tsx` |

### Special Character Handling
- `=` → `_` (underscore)
- `,` → `_` (underscore)
- Spaces → `_` (underscore)
- Other special characters → `_` (underscore)
- Multiple underscores → Single underscore
- Leading/trailing underscores → Removed

## 🔧 Configuration Options

### VSCode Settings
You can configure the extension behavior in VSCode settings:

```json
{
  "svgConverter.outputDirectory": "out",
  "svgConverter.includeTitle": true,
  "svgConverter.openAfterConvert": true
}
```

### Custom Scripts
Add custom conversion scripts to `package.json`:

```json
{
  "scripts": {
    "convert:custom": "npx ts-node src/custom-script.ts",
    "convert:project": "npx ts-node src/project-script.ts"
  }
}
```

## 📝 Generated Component Structure

### Basic Component
```typescript
import React from "react";
import type { SVGProps } from "react";

const ComponentName = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Component Title</title>
      {/* SVG content */}
    </svg>
  );
};

export default ComponentName;
```

### Features
- ✅ TypeScript support with proper prop types
- ✅ Accessibility with title elements
- ✅ Props spreading for customization
- ✅ Clean, readable code structure
- ✅ Figma naming support

## 🚀 Advanced Usage

### Custom Conversion Scripts

Create custom scripts for specific projects:

```typescript
// src/custom-script.ts
import { processFolder } from './core/converter';

async function customConvert() {
  const inputPath = './src/custom-icons';
  const outputPath = './src/components/icons';
  
  await processFolder(inputPath, outputPath);
  console.log('Custom conversion completed!');
}

customConvert();
```

### Batch Processing with Filters

```typescript
// Process only specific file patterns
const patterns = ['solid', 'outline', 'gradient'];
for (const pattern of patterns) {
  const inputPath = `./src/icons/${pattern}`;
  const outputPath = `./out/icons/${pattern}`;
  await processFolder(inputPath, outputPath);
}
```

### Integration with Build Tools

#### Webpack
```javascript
// webpack.config.js
module.exports = {
  // ... other config
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  }
};
```

#### Vite
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr()],
});
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Invalid Component Names
**Problem**: Generated component names are invalid
**Solution**: Check filename for special characters and ensure they're properly converted

#### 2. Missing Dependencies
**Problem**: TypeScript compilation errors
**Solution**: Install required dependencies:
```bash
npm install @types/react @types/vscode
```

#### 3. VSCode Extension Not Working
**Problem**: Commands not appearing in context menu
**Solution**: 
1. Reload VSCode window (`Ctrl+Shift+P` → "Developer: Reload Window")
2. Check if extension is enabled
3. Verify file is `.svg` extension

#### 4. Permission Errors
**Problem**: Cannot write to output directory
**Solution**: Check file permissions and ensure output directory exists

### Debug Mode

Enable debug logging:
```bash
# Set environment variable
export DEBUG=svg-converter:*

# Run conversion
npm run convert
```

## 📚 API Reference

### Core Functions

#### `convertFigmaFilenameToComponentName(filename: string): string`
Converts Figma filename to valid TypeScript component name.

#### `convertFigmaFilenameToOutputFilename(filename: string): string`
Converts Figma filename to clean output filename.

#### `convertFigmaFilenameToTitle(filename: string): string`
Converts Figma filename to human-readable title.

#### `processFolder(inputPath: string, outputPath: string): Promise<void>`
Processes a folder of SVG files and converts them to React components.

#### `convertSvgToReact(inputPath: string, outputPath: string): Promise<void>`
Converts a single SVG file to React component.

## 🤝 Contributing

### Development Setup
```bash
# Clone repository
git clone https://github.com/prodkt/svg-to-react-typescript.git
cd svg-to-react-typescript

# Install dependencies
npm install

# Start development
npm run dev

# Test conversion
npm run test
```

### Testing
```bash
# Run tests
npm test

# Test specific conversion
npm run convert:widgli

# Check generated files
ls -la out/
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/prodkt/svg-to-react-typescript/issues)
- **Documentation**: [README.md](./README.md)
- **Examples**: Check `src/widgli/calendar/` for sample files

---

**Happy Converting! 🎨✨**
