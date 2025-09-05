# Changelog

All notable changes to the SVG to React TypeScript Converter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-01-XX

### Added
- 🎨 **Figma Support**: Intelligent handling of Figma's special naming conventions
  - Converts `=` and `,` characters to valid TypeScript identifiers
  - Handles spaces and special characters in filenames
  - Generates clean, readable component names

- 🚀 **VSCode Extension**: Full VSCode integration
  - Right-click context menu for SVG files
  - Command palette integration
  - Batch processing capabilities
  - Welcome message and user guidance

- 🔧 **Smart Naming System**: Advanced filename conversion
  - `convertFigmaFilenameToComponentName()` - PascalCase component names
  - `convertFigmaFilenameToOutputFilename()` - camelCase output filenames
  - `convertFigmaFilenameToTitle()` - Human-readable titles

- 📦 **CLI Tools**: Command-line interface
  - `npm run convert` - Convert all icon folders
  - `npm run convert:widgli` - Convert Widgli-specific folders
  - `npm run example` - Demonstration script
  - `npm run dev` - Watch mode for development

- 🎯 **TypeScript Support**: Full type safety
  - Proper SVGProps<SVGSVGElement> typing
  - TypeScript component generation
  - Import statement optimization

- ♿ **Accessibility**: Screen reader support
  - Automatic title generation for SVG elements
  - Semantic HTML structure
  - ARIA-friendly component output

### Features
- **Bulk Conversion**: Process hundreds or thousands of SVG files
- **Recursive Processing**: Handle nested folder structures
- **Error Handling**: Graceful error handling with user feedback
- **Progress Reporting**: Real-time conversion status updates
- **File Validation**: SVG content validation before conversion

### Examples
- **Input**: `area=permissions_calendar_appIcon, style=gradient.svg`
- **Component**: `AreaPermissionsCalendarAppiconStyleGradient`
- **Output**: `areaPermissionsCalendarAppiconStyleGradient.tsx`
- **Title**: `Area Permissions Calendar Appicon Style Gradient`

### Technical Details
- **Dependencies**: TypeScript 5.5+, React 19+, VSCode Extension API
- **Build System**: TypeScript compilation with watch mode
- **Package Management**: npm/pnpm support
- **Extension Packaging**: VSCode extension packaging with vsce

### Documentation
- **README.md**: Comprehensive project documentation
- **USAGE.md**: Detailed usage guide with examples
- **API Reference**: Complete function documentation
- **Troubleshooting**: Common issues and solutions

### Scripts
```bash
# Development
npm run dev          # Watch mode
npm run compile      # Build project
npm run clean        # Clean output

# Conversion
npm run convert      # Convert all icons
npm run convert:widgli # Convert Widgli icons
npm run example      # Run examples

# Extension
npm run package      # Package extension
npm run publish      # Publish to marketplace
```

### VSCode Commands
- `SVGR: Batch Convert SVGs to React Components`
- `Convert SVG to React Component`
- `Convert Folder SVGs to React Components`

### File Structure
```
src/
├── core/
│   ├── converter.ts          # Core conversion logic
│   └── name-converter.ts     # Figma naming utilities
├── extension.ts              # VSCode extension
├── convert-script.ts         # CLI conversion
├── widgli-script.ts          # Widgli-specific conversion
└── example-script.ts         # Demonstration script
```

### Breaking Changes
- None (initial release)

### Migration Guide
- N/A (initial release)

### Known Issues
- None reported

### Future Plans
- [ ] VSCode Marketplace publication
- [ ] Additional naming pattern support
- [ ] Custom template system
- [ ] Batch processing optimizations
- [ ] Integration with popular build tools

---

## [Unreleased]

### Planned
- Enhanced error reporting
- Custom output templates
- Integration with Figma API
- Advanced naming patterns
- Performance optimizations

---

**Legend:**
- 🎨 Features
- 🐛 Bug fixes
- 📚 Documentation
- 🔧 Configuration
- 🚀 Performance
- ♿ Accessibility
- 🔒 Security
