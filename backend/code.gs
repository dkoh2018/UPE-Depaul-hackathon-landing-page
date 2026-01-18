// Define sheet name and the Google Drive folder ID for resumes
var SHEET_NAME = 'Form Responses 1';
// this is the folder where resumes land
var RESUME_FOLDER_ID = '1c8GnxTHKupSBHa9-VuTByN-renr5Ihr1';

function doPost(e) {
  // Lock the script so if two people submit at same time, it doesn't break
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);

    // Get headers from first row to map data correctly
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var postData = JSON.parse(e.postData.contents);
    var newRow = [];
    var resumeLink = "";

    // If there's resume data, save it to Drive and get the link
    if (postData.resumeData && postData.resumeName) {
      resumeLink = saveResumeToDrive(postData.resumeData, postData.resumeName, postData.fullName || "Unknown");
    }

    // Match each header column with incoming data
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

    // Write the row to the sheet
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    // Return success message
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow, "resumeLink": resumeLink }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // If something explodes, return the error
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
    
    // Check file type to set correct mime type
    var mimeType = "application/pdf";
    if (fileName.toLowerCase().endsWith(".doc")) {
      mimeType = "application/msword";
    } else if (fileName.toLowerCase().endsWith(".docx")) {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }
    
    // Decode the base64 string back to a file blob
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType);
    
    // Create a unique filename with timestamp so we don't overwrite stuff
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
    var safeName = applicantName.replace(/[^a-zA-Z0-9]/g, "_");
    var newFileName = safeName + "_" + timestamp + "_" + fileName;
    blob.setName(newFileName);
    
    // Create file in Drive and make it viewable with link
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (err) {
    Logger.log("Error saving resume: " + err.toString());
    return "Error: " + err.toString();
  }
}

function setupHeaders() {
  // Use this one time to set up the column headers
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
  Logger.log("Headers setup complete.");
}
