// Tệp tin này chứa mã nguồn Google Apps Script để kết nối App với Google Sheets
// Hãy copy toàn bộ nội dung trong này và dán vào Apps Script của bạn

const CONFIG = {
  transactionsSheet: 'Transactions', // Tên sheet Giao dịch
  walletsSheet: 'Wallets',           // Tên sheet Ví tài khoản
  debtsSheet: 'Debts',               // Tên sheet Ghi nợ
  settingsSheet: 'Settings'          // Tên sheet Cài đặt
};

/**
 * Hàm GET để lấy dữ liệu từ Sheets
 * Endpoint: URL_WEB_APP?action=getData
 */
function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getData') {
    try {
      var transactions = getSheetData(CONFIG.transactionsSheet);
      var wallets = getSheetData(CONFIG.walletsSheet);
      var debts = getSheetData(CONFIG.debtsSheet);
      var settingsData = getSheetData(CONFIG.settingsSheet);
      
      var pinObj = settingsData.find(function(s) { return s.key === 'pin'; });
      var appPin = pinObj ? String(pinObj.value) : '';

      var userObj = settingsData.find(function(s) { return s.key === 'userName'; });
      var userName = userObj ? String(userObj.value) : '';

      var avatarObj = settingsData.find(function(s) { return s.key === 'avatar'; });
      var avatar = avatarObj ? String(avatarObj.value) : '';
      
      return responseJSON({
        success: true,
        data: {
          pin: appPin,
          userName: userName,
          avatar: avatar,
          transactions: transactions,
          wallets: wallets,
          debts: debts
        }
      });
    } catch (error) {
      return responseJSON({ success: false, error: error.message });
    }
  }
  
  return responseJSON({ success: false, error: 'Invalid action or missing action parameter. Use ?action=getData' });
}

/**
 * Hàm POST để thêm, sửa dữ liệu
 * Body (JSON): { "action": "addTransaction", "data": { ... } }
 */
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error("No data received");
    }

    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var data = body.data;
    
    if (action === 'addTransaction') {
      // Dữ liệu: id, date, amount, category, note, type, walletId
      appendRow(CONFIG.transactionsSheet, [
        data.id, data.date, data.amount, data.category, data.note, data.type, data.walletId
      ]);
      return responseJSON({ success: true, message: 'Transaction added' });
      
    } else if (action === 'addWallet') {
      // Dữ liệu: id, name, balance, isDefault
      appendRow(CONFIG.walletsSheet, [
        data.id, data.name, data.balance, data.isDefault
      ]);
      return responseJSON({ success: true, message: 'Wallet added' });
      
    } else if (action === 'addDebt') {
      // Dữ liệu: id, person, amount, type, date, note
      appendRow(CONFIG.debtsSheet, [
        data.id, data.person, data.amount, data.type, data.date, data.note
      ]);
      return responseJSON({ success: true, message: 'Debt added' });
      
    } else if (action === 'updateWalletBalance') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.walletsSheet);
      if (!sheet) throw new Error("Sheet không tồn tại!");
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] == data.id) {
          // Cột balance là cột thứ 3 (index 2)
          sheet.getRange(i + 1, 3).setValue(data.balance);
          return responseJSON({ success: true, message: 'Wallet balance updated' });
        }
      }
      throw new Error('Wallet not found');
      
    } else if (action === 'updateSetting') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.settingsSheet);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(CONFIG.settingsSheet);
        sheet.appendRow(['key', 'value']);
      }
      var values = sheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] == data.key) {
          sheet.getRange(i + 1, 2).setValue("'" + data.value); // Prefix with ' to force string
          found = true;
          break;
        }
      }
      if (!found) {
        sheet.appendRow([data.key, "'" + data.value]);
      }
      return responseJSON({ success: true, message: 'Setting updated' });
    }
    
    throw new Error('Invalid action for POST request');
    
  } catch (error) {
    return responseJSON({ success: false, error: String(error) });
  }
}

/**
 * Lấy toàn bộ dữ liệu của một sheet dưới dạng JSON Array Map
 */
function getSheetData(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Sheet trống hoặc chỉ có header
  
  var headers = data[0];
  var result = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var headerName = headers[j];
      if (headerName) {
        obj[headerName] = row[j];
      }
    }
    result.push(obj);
  }
  return result;
}

/**
 * Thêm một dòng mới vào sheet
 */
function appendRow(sheetName, rowData) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet '" + sheetName + "' không tồn tại!");
  sheet.appendRow(rowData);
}

/**
 * Hàm hỗ trợ trả về JSON
 */
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Xử lý gửi CORS Options yêu cầu từ trình duyệt (nếu có gọi từ client fetch API)
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("")
    .setHeaders(headers)
    .setMimeType(ContentService.MimeType.JSON);
}
