/**
 * Backend script for Hackathon Registration with Resume Upload.
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
 * 
 * IMPORTANT: After updating this script, you must create a NEW deployment
 * (Deploy > New Deployment) for changes to take effect.
 */

var SHEET_NAME = 'Form Responses 1';
var RESUME_FOLDER_ID = '1c8GnxTHKupSBHa9-VuTByN-renr5Ihr1';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var postData = JSON.parse(e.postData.contents);
    var newRow = [];
    var resumeLink = "";

    if (postData.resumeData && postData.resumeName) {
      resumeLink = saveResumeToDrive(postData.resumeData, postData.resumeName, postData.fullName || "Unknown");
    }

    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      if (header === 'timestamp') {
        newRow.push(new Date());
      } else if (header === 'resumeLink') {
        newRow.push(resumeLink);
      } else {
        newRow.push(postData[header] || "");
      }
    }

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow, "resumeLink": resumeLink }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function saveResumeToDrive(base64Data, fileName, applicantName) {
  try {
    var folder = DriveApp.getFolderById(RESUME_FOLDER_ID);
    
    var mimeType = "application/pdf";
    if (fileName.toLowerCase().endsWith(".doc")) {
      mimeType = "application/msword";
    } else if (fileName.toLowerCase().endsWith(".docx")) {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }
    
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType);
    
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
    var safeName = applicantName.replace(/[^a-zA-Z0-9]/g, "_");
    var newFileName = safeName + "_" + timestamp + "_" + fileName;
    blob.setName(newFileName);
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (err) {
    Logger.log("Error saving resume: " + err.toString());
    return "Error: " + err.toString();
  }
}

function setupHeaders() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName(SHEET_NAME);
  sheet.clear(); 
  var headers = [
    "timestamp", 
    "fullName", 
    "email", 
    "gradYear", 
    "track", 
    "teamStatus",
    "teammateDetails",
    "dietaryRestrictions",
    "resumeLink"
  ];
  sheet.appendRow(headers);
  Logger.log("Headers setup complete with resumeLink column.");
}
