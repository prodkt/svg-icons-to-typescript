"use strict";
/**
 * Name conversion utilities for handling Figma export filenames
 * Converts special characters and creates valid TypeScript component names
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFigmaFilenameToComponentName = convertFigmaFilenameToComponentName;
exports.convertFigmaFilenameToOutputFilename = convertFigmaFilenameToOutputFilename;
exports.convertFigmaFilenameToTitle = convertFigmaFilenameToTitle;
exports.isValidComponentName = isValidComponentName;
exports.sanitizeForFilePath = sanitizeForFilePath;
/**
 * Converts a Figma filename to a valid TypeScript component name
 *
 * Examples:
 * - "area=permissions_calendar_appIcon, style=gradient.svg" -> "AreaPermissionsCalendarAppIconStyleGradient"
 * - "area=tagsField_calendar_appIcon, style=solid.svg" -> "AreaTagsFieldCalendarAppIconStyleSolid"
 *
 * @param filename - The original filename from Figma
 * @returns A valid TypeScript component name
 */
function convertFigmaFilenameToComponentName(filename) {
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.(svg|tsx|jsx)$/i, '');
    // Convert special characters to underscores
    let converted = nameWithoutExt
        .replace(/[=,]/g, '_') // Replace = and , with _
        .replace(/\s+/g, '_') // Replace spaces with _
        .replace(/[^a-zA-Z0-9_]/g, '_') // Replace other special chars with _
        .replace(/_+/g, '_') // Collapse multiple underscores
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    // Split by underscores and convert to PascalCase
    const parts = converted.split('_').filter(part => part.length > 0);
    const pascalCase = parts
        .map(part => capitalizeFirstLetter(part))
        .join('');
    return pascalCase;
}
/**
 * Converts a Figma filename to a clean output filename
 *
 * Examples:
 * - "area=permissions_calendar_appIcon, style=gradient.svg" -> "area_permissionsCalendarAppIcon_styleGradient.tsx"
 * - "area=tagsField_calendar_appIcon, style=solid.svg" -> "area_tagsFieldCalendarAppIcon_styleSolid.tsx"
 *
 * @param filename - The original filename from Figma
 * @returns A clean output filename
 */
function convertFigmaFilenameToOutputFilename(filename) {
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.(svg|tsx|jsx)$/i, '');
    // Convert special characters to underscores
    let converted = nameWithoutExt
        .replace(/[=,]/g, '_') // Replace = and , with _
        .replace(/\s+/g, '_') // Replace spaces with _
        .replace(/[^a-zA-Z0-9_]/g, '_') // Replace other special chars with _
        .replace(/_+/g, '_') // Collapse multiple underscores
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    // Split by underscores and convert to camelCase for output filename
    const parts = converted.split('_').filter(part => part.length > 0);
    const camelCase = parts
        .map((part, index) => index === 0 ? part.toLowerCase() : capitalizeFirstLetter(part))
        .join('');
    return `${camelCase}.tsx`;
}
/**
 * Converts a Figma filename to a clean title for the SVG title element
 *
 * Examples:
 * - "area=permissions_calendar_appIcon, style=gradient.svg" -> "Area Permissions Calendar App Icon, Style Gradient"
 * - "area=tagsField_calendar_appIcon, style=solid.svg" -> "Area Tags Field Calendar App Icon, Style Solid"
 *
 * @param filename - The original filename from Figma
 * @returns A human-readable title
 */
function convertFigmaFilenameToTitle(filename) {
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.(svg|tsx|jsx)$/i, '');
    // Convert special characters to spaces and clean up
    let converted = nameWithoutExt
        .replace(/[=,]/g, ' ') // Replace = and , with spaces
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim(); // Remove leading/trailing spaces
    // Capitalize each word
    return converted
        .split(' ')
        .map(word => capitalizeFirstLetter(word))
        .join(' ');
}
/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with first letter capitalized
 */
function capitalizeFirstLetter(str) {
    if (!str || str.length === 0)
        return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
/**
 * Validates if a component name is valid for TypeScript
 * @param name - The component name to validate
 * @returns True if valid, false otherwise
 */
function isValidComponentName(name) {
    // Check if it starts with a letter or underscore
    if (!/^[a-zA-Z_]/.test(name))
        return false;
    // Check if it contains only valid characters
    if (!/^[a-zA-Z0-9_]+$/.test(name))
        return false;
    return true;
}
/**
 * Sanitizes a string to be safe for use in file paths
 * @param str - The string to sanitize
 * @returns A sanitized string safe for file paths
 */
function sanitizeForFilePath(str) {
    return str
        .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid filename characters
        .replace(/_+/g, '_') // Collapse multiple underscores
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}
//# sourceMappingURL=name-converter.js.map