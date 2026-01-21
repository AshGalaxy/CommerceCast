'use server';
/**
 * @fileoverview A Genkit flow for fetching data from Google Sheets.
 *
 * This file defines flows for:
 * 1. Authorizing the application to access Google Sheets using OAuth2.
 * 2. Fetching data from a specified Google Sheet and converting it to CSV format.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';

const AuthorizeInputSchema = z.object({
  token: z.string().describe('The OAuth2 access token.'),
});

export const authorize = ai.defineFlow(
  {
    name: 'authorizeGoogle',
    inputSchema: AuthorizeInputSchema,
    outputSchema: z.string().describe('The access token.'),
  },
  async ({ token }) => {
    // Validate the token by making a simple API call
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    try {
      // Try to get the user's profile info as a validation step
      // or just list spreadsheets (empty query) to check permissions
      const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
      // We don't need to actually get data, just checking if the client works.
      // A lightweight call would be better, but let's just return the token if no error thrown immediately.
      // Actually, let's try to get token info if possible, or just assume it's valid if we can create the client.
      // But creating the client doesn't validate the token.

      // Let's use oauth2.tokeninfo
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      await oauth2.tokeninfo({ access_token: token });

      return token;
    } catch (error) {
      console.error("Token validation failed:", error);
      throw new Error("Invalid or expired Google access token.");
    }
  }
);

const GetSheetInputSchema = z.object({
  sheetId: z.string().describe('The ID of the Google Sheet to fetch.'),
  sheetName: z.string().describe('The name of the sheet within the spreadsheet (e.g., "Sheet1").'),
  accessToken: z.string().describe('The OAuth2 access token for authentication.'),
});

export const getGoogleSheet = ai.defineFlow(
  {
    name: 'getGoogleSheet',
    inputSchema: GetSheetInputSchema,
    outputSchema: z.string().describe('The sheet content in CSV format.'),
  },
  async ({ sheetId, sheetName, accessToken }) => {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: sheetName,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return '';
      }

      const csvContent = rows.map(row => {
        return row.map(cell => {
          if (cell === null || cell === undefined) return '';
          const stringCell = String(cell);
          if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
            return `"${stringCell.replace(/"/g, '""')}"`;
          }
          return stringCell;
        }).join(',');
      }).join('\n');
      return csvContent;

    } catch (error: any) {
      console.error("Google Sheets API error:", error.message);
      // Check for specific authentication errors
      if (error.code === 401 || error.code === 403) {
        throw new Error('Authentication failed. Please reconnect your Google account.');
      }
      throw new Error('Failed to fetch data from Google Sheet. Please check the Sheet ID, name, and sharing permissions.');
    }
  }
);
