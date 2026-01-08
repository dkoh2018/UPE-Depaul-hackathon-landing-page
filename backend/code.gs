/**
 * Backend script for Hackathon Registration.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code into Code.gs (delete existing code).
 * 4. Run the 'setupHeaders' function once to set up your sheet columns.
 * 5. Click 'Deploy' > 'New Deployment'.
 * 6. Select type 'Web App'.
 * 7. Description: 'Hackathon Backend'.
 * 8. Execute as: 'Me'.
 * 9. Who has access: 'Anyone' (IMPORTANT).
 * 10. Copy the 'Web App URL' and save it. You will need it for the frontend.
 */

// CHANGE THIS IF YOU RENAME YOUR SHEET
var SHEET_NAME = 'Sheet1';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    // Parse the POST data
    var postData = JSON.parse(e.postData.contents);
    var newRow = [];

    // Map data to headers
    for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if (header === 'timestamp') {
            newRow.push(new Date());
        } else {
            newRow.push(postData[header] || ""); // Default to empty string if missing
        }
    }

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Run this function once manually to set up the headers in the sheet.
 */
function setupHeaders() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName(SHEET_NAME);
  sheet.clear(); 
  // Customize these headers as needed
  var headers = [
    "timestamp", 
    "fullName", 
    "email", 
    "university", 
    "major", 
    "graduationYear", 
    "githubUrl", 
    "dietaryRestrictions", 
    "skills", 
    "teamName"
  ];
  sheet.appendRow(headers);
  Logger.log("Headers setup complete.");
}
