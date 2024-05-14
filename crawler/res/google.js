import { google } from 'googleapis';
const sheets = google.sheets('v4');
import fs from 'fs';

// Load client secrets
const credentials = JSON.parse(fs.readFileSync('./proompt-engine-cecd6d51e759.json'));

const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

// Specify the spreadsheet ID and range
const spreadsheetId = '1HmXJkBRX74KnkseXZmsRjjEJmR64wQh4qMxJ_yU8bMA';
const range = 'lighthouse_data!A1';

export const writeToSheet = async (data) => {
    await client.authorize();

    const request = {
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [data]
        },
        auth: client,
    };

    let attempts = 0, maxAttempts = 3;
    while (attempts < maxAttempts) {
        try {
            const response = await sheets.spreadsheets.values.append(request);
            console.log('-> Updated cells in google sheets:', response.data.updates.updatedCells);
            return; // If it succeeds, exit the function.
        } catch (error) {
            console.log(`Attempt ${attempts + 1} failed: ${error.message}`);
            attempts++;
            if (attempts === maxAttempts) {
                throw new Error("Max retry attempts reached, failing...");
            }
        }
    }
}

// Example data to write
// writeToSheet(['Hello', 'World']);