var Promise           = require('bluebird');
var co                = require('bluebird').coroutine;
var GoogleSpreadsheet = require('google-spreadsheet');

module.exports = exports = {
    uniqueId: 'messages',
    options: {
        spreadsheetKey: '',
    },
    httpRoute: '/messages/all',
    refetchInterval: 1000 * 60 * 5,
    fetchData: co(fetchData)
};

var spreadsheet;
function loadSpreadsheet(spreadsheetKey) {
    if(!spreadsheet) {
        spreadsheet = new GoogleSpreadsheet(spreadsheetKey);
        spreadsheet.getRowsAsync = Promise.promisify(spreadsheet.getRows);
    }
    return spreadsheet;
}

function* fetchData() {
    var sheet = loadSpreadsheet(this.options.spreadsheetKey);
    var rowData = yield sheet.getRowsAsync(1);

    var messages = rowData.map(function(rowObj) {
        var data = {
            duration: rowObj.visibilityinminutesperhour * 60 * 1000,
            message: rowObj.message,
        };
        return data;
    });

    return {
        messages: messages
    };
}
