import { writeFileSync, existsSync, appendFileSync } from 'fs';
import { writeToSheet } from './google.js';
import { techStack } from './config.js';

global.csvFileExists = false; // Initialize global variable

export const writeCSV = async (detectedTechs, csvFilePath) => {
    try {
        if (!csvFilePath) {
            const sheetsLine = convertToSheetsLine(detectedTechs);
            await writeToSheet(sheetsLine);
        } else {

            // Optimize file existence check by doing it once and caching the result if this function
            // is called multiple times for the same file path in a short duration
            if (!global.csvFileExists) {
                global.csvFileExists = existsSync(csvFilePath);
            }

            if (!global.csvFileExists) {
                writeFileSync(csvFilePath, createFirstLine(), { flag: 'wx' });
                global.csvFileExists = true; // Update the cache after creating the file
            }
            // Append the data
            appendFileSync(csvFilePath, convertToCSVLine(detectedTechs));
        }
    } catch (error) {
        // Handle or log the file operation errors specifically if needed
        console.error(`Error writing to CSV or Sheets: ${error.message}`);
        throw error; // Re-throw the error if you want the calling function to handle it further
    }
}

export const convertToCSVLine = (detectedTechs) => {
    return Object.values(detectedTechs).map(value => convertValue(value, ';')).join(',') + '\n';
};

export const convertToSheetsLine = (detectedTechs) => {
    return Object.values(detectedTechs).map(value => convertValue(value, ', '));
};

const convertValue = (value, separator) => {
    if (value instanceof Set) {
        return `${Array.from(value).join(separator)}`;
    } else if (Array.isArray(value)) {
        return `${value.join(separator)}`;
    } else if (typeof value === 'number') {
        return value;
    } else {
        return value;
    }
};

export const cloneTechStack = (original) => {
    const cloned = {};
    for (const [key, value] of Object.entries(original)) {
        cloned[key] = value instanceof Set ? new Set(value) : value;
    }
    return cloned;
};

const createFirstLine = () => {
    return Object.keys(techStack).join(',') + '\n';
};

export const writeDoneFile = () => {
    writeFileSync('complete.txt', 'done', { flag: 'wx' });
}