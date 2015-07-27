var _                 = require('lodash');
var Promise           = require('bluebird');
var co                = require('bluebird').coroutine;
var GoogleSpreadsheet = require('google-spreadsheet');

module.exports = exports = {
  uniqueId: 'projects',
  options: {
    spreadsheetKey: ''
  },
  httpRoute: '/projects/all',
  refetchInterval: 1000 * 60 * 60 * 24,
  fetchData: co(fetchData)
};

var projectsSheet;
function loadSpreadsheet(spreadsheetKey) {
  if(!projectsSheet) {
    projectsSheet = new GoogleSpreadsheet(spreadsheetKey);
    projectsSheet.getRowsAsync = Promise.promisify(projectsSheet.getRows)
  }
  return projectsSheet;
}

function* fetchData() {
  var sheet = loadSpreadsheet(this.options.spreadsheetKey);
  var rowData = yield sheet.getRowsAsync(1);

  var projectsList = rowData.map(function(rowObj) {
    var projectData = _.pick(rowObj, [
      'projectname',
      'projectshortname',
      'teamspirit',
      'clientmood',
      'scrumdaily',
      'scrumplanning',
      'scrumretro'
    ]);
    return projectData;
  });

  return {
    projectsList: projectsList
  }
}
