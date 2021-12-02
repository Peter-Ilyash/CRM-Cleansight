Extensions = {
  getCellByValue(container, val) {
    if (Extensions.isRangeOrSheet(container) === 'sheet') {
      const {getMaxRows, getMaxColumns} = container;
      container = container.getRange(1, 1, getMaxRows(), getMaxColumns());
    }

    const values = container.getValues();
    let cords;

    const searchInRow = (rowNum) => {
      let isConcidence = false;

      for (let j = 0; j < container.getNumColumns(); j++) {
        if (values[rowNum][j] != val) continue;
        cords = [rowNum, j];
        isConcidence = true;
        break;
      }

      return isConcidence;
    }

    for (let i = 0; i < container.getNumRows(); i++) {
      let searchResult = searchInRow(i);
      if (searchResult) break;
    }

    return (cords)? container.getCell(++cords[0], ++cords[1]): null;
  },

  getFirstSheetRow(sheet) {
    return sheet.getRange(1, 1, 1, sheet.getMaxColumns());
  },

  getFirstSheetColumn(sheet) {
    return sheet.getRange(1, 1, sheet.getMaxRows(), 1);
  },

  getRowAsRange(sheet, range) {
    return sheet.getRange(range.getRow(), 1, 1, sheet.getMaxColumns());
  },

  getFirstEmptyRow(sheet) {
    const numOfRows = sheet.getMaxRows();
    const numOfCols = sheet.getMaxColumns();
    
    let emptyRow;

    for (let i = 1; i <= numOfRows; i++) {
      const row = sheet.getRange(i, 1, 1, numOfCols);
      if (!isEmptyRow(row)) continue;

      emptyRow = row;
      break;
    }

    if (emptyRow) return emptyRow;

    Logger.log('Error! Add new rows in sheet'); 
    return null;

    function isEmptyRow(row) {
      let isEmpty = true;

      for (let j = 2; j <= numOfCols; j++) {
        const val = row.getCell(1, j).getValue();
        if (!val) continue;

        isEmpty = false;
        break;
      }

      return isEmpty;
    }
  },

  isRangeOrSheet(obj) {
    let type = 'range';

    try {
      /*Only range has 'getColumn' method
      Its calling on sheet throws error*/

      obj.getColumn();
    } 
    catch (err) {
      type = 'sheet';
    }

    return type;
  },

  cleanSheet(sheet) {
    const {getFirstEmptyRow} = Extensions;

    const rowsNum = getFirstEmptyRow(sheet).getRow();
    const columnsNum = sheet.getMaxColumns();

    const range = sheet.getRange(2, 2, rowsNum, columnsNum - 1);
    range.setValue(null);
  },

  patchDateFormatError(days) {
    const daysTime = (days-2)*24*60*60*1000;
    const zeroYear = new Date('1900-01-01T00:00:00');;
    const currentTime = zeroYear.getTime() + daysTime;
    const currentDate = new Date(currentTime);

    let currentDays = String(currentDate.getDate());
    if (+currentDays < 10) currentDays = '0' + currentDays;

    let currentMonth = String(currentDate.getMonth() + 1);
    if (+currentMonth < 10) currentMonth = '0' + currentMonth;

    let currentYear = String(currentDate.getFullYear());

    return `${currentDays}.${currentMonth}.${currentYear}`;
  } 
}