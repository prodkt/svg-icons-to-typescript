/**
 * Name conversion utilities for handling Figma export filenames
 * Converts special characters and creates valid TypeScript component names
 */
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
export declare function convertFigmaFilenameToComponentName(filename: string): string;
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
export declare function convertFigmaFilenameToOutputFilename(filename: string): string;
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
export declare function convertFigmaFilenameToTitle(filename: string): string;
/**
 * Validates if a component name is valid for TypeScript
 * @param name - The component name to validate
 * @returns True if valid, false otherwise
 */
export declare function isValidComponentName(name: string): boolean;
/**
 * Sanitizes a string to be safe for use in file paths
 * @param str - The string to sanitize
 * @returns A sanitized string safe for file paths
 */
export declare function sanitizeForFilePath(str: string): string;
