# SVG to React TypeScript Converter

> **A powerful VSCode extension and CLI tool for converting SVG files to React TypeScript components with intelligent naming and Figma support.**

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/prodkt/svg-to-react-typescript)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/prodkt/svg-to-react-typescript/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Features

- **Bulk SVG Conversion**: Convert hundreds or thousands of SVG files to React TypeScript components
- **Figma Support**: Intelligent handling of Figma's special naming conventions (`=`, `,`, spaces)
- **Smart Naming**: Automatic conversion to valid TypeScript component names
- **VSCode Integration**: Right-click context menu and command palette support
- **CLI Support**: Command-line interface for automated workflows
- **Type Safety**: Full TypeScript support with proper prop types
- **Accessibility**: Automatic title generation for screen readers

## 📦 Installation

### VSCode Extension (Coming Soon)
```bash
# Install from VSCode Marketplace (when published)
# Search for "SVG to React TypeScript Converter"
```

### Local Development
```bash
# Clone the repository
git clone https://github.com/prodkt/svg-to-react-typescript.git
cd svg-to-react-typescript

# Install dependencies
npm install
# or
pnpm install

# Build the project
npm run compile
```

## 🎯 Quick Start

### VSCode Extension Usage

1. **Right-click on SVG files** in the file explorer
2. Select **"Convert to React Component"** from the context menu
3. Or use **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
4. Type **"SVGR: Batch Convert"** to convert all SVGs in your workspace

### CLI Usage

```bash
# Convert specific folders
npm run script-widgli

# Convert all icon folders
npm run script-convert

# Watch mode for development
npm run watch
```

## 📁 Project Structure

```
svg-to-react-typescript/
├── src/
│   ├── core/
│   │   ├── converter.ts          # Core conversion logic
│   │   └── name-converter.ts     # Figma naming utilities
│   ├── extension.ts              # VSCode extension entry point
│   ├── convert-script.ts         # CLI conversion script
│   └── widgli-script.ts          # Widgli-specific conversion
├── out/                          # Generated TypeScript components
├── src/icons/                    # Source SVG files
└── package.json
```

## 🔧 Configuration

### Supported File Naming Patterns

The converter intelligently handles various naming conventions:

| Input Pattern | Output Component | Output Filename |
|---------------|------------------|-----------------|
| `icon.svg` | `Icon` | `icon.tsx` |
| `my-icon.svg` | `MyIcon` | `myIcon.tsx` |
| `area=permissions_calendar_appIcon, style=gradient.svg` | `AreaPermissionsCalendarAppiconStyleGradient` | `areaPermissionsCalendarAppiconStyleGradient.tsx` |

### Figma Export Support

Perfect for Figma exports with special characters:
- `=` → `_` (underscore)
- `,` → `_` (underscore)  
- Spaces → `_` (underscore)
- Converts to valid TypeScript identifiers

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile TypeScript to JavaScript |
| `npm run watch` | Watch mode for development |
| `npm run script-convert` | Convert all icon folders |
| `npm run script-widgli` | Convert Widgli-specific folders |
| `npm run vscode:prepublish` | Prepare for VSCode extension publishing |

## 🎨 Generated Component Example

**Input SVG:** `area=permissions_calendar_appIcon, style=gradient.svg`

**Generated TypeScript Component:**
```typescript
import React from "react";
import type { SVGProps } from "react";

const AreaPermissionsCalendarAppiconStyleGradient = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width={76} height={76} viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Area Permissions Calendar Appicon Style Gradient</title>
      {/* SVG content */}
    </svg>
  );
};

export default AreaPermissionsCalendarAppiconStyleGradient;
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- TypeScript 5.5+
- VSCode (for extension development)

### Setup
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch
```

### Testing
```bash
# Test conversion with sample files
npm run script-widgli

# Check generated components in out/ directory
```

## 🚀 VSCode Extension Features

### Context Menu Integration
- Right-click on any SVG file
- Select "Convert to React Component"
- Automatic conversion with proper naming

### Command Palette
- `Ctrl+Shift+P` / `Cmd+Shift+P`
- Type "SVGR: Batch Convert"
- Convert all SVGs in workspace

### Batch Processing
- Process entire folders recursively
- Maintain directory structure
- Generate clean output filenames

## 📝 Usage Examples

### Single File Conversion
```bash
# Place SVG in src/widgli/calendar/
# Run conversion
npm run script-widgli
# Output: out/widgli/calendar/componentName.tsx
```

### Batch Folder Conversion
```bash
# Organize SVGs in folders:
# - src/icons/Solid icons/
# - src/icons/Line icons/
# - src/icons/Duotone icons/
# - src/icons/Duocolor icons/

# Convert all
npm run script-convert
```

### VSCode Extension
1. Open workspace with SVG files
2. Right-click on SVG file(s)
3. Select "Convert to React Component"
4. Components generated in `out/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript and VSCode Extension API
- Inspired by the need for efficient SVG to React conversion
- Special thanks to the React and VSCode communities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/prodkt/svg-to-react-typescript/issues)
- **Discussions**: [GitHub Discussions](https://github.com/prodkt/svg-to-react-typescript/discussions)
- **Sponsor**: [GitHub Sponsors](https://github.com/sponsors/prodkt)

---

**Made with ❤️ by [Bryan Funk](https://github.com/prodkt)**