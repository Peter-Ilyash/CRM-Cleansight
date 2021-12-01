class Extensions {
  static getCellByValue(container, val) {
    if (Extensions.isRangeOrSheet(container) === 'sheet') {
      const { getMaxRows, getMaxColumns } = container;
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

    return (cords) ? container.getCell(++cords[0], ++cords[1]) : null;
  }

  static getFirstSheetRow(sheet) {
    return sheet.getRange(1, 1, 1, sheet.getMaxColumns());
  }

  static getFirstSheetColumn(sheet) {
    return sheet.getRange(1, 1, sheet.getMaxRows(), 1);
  }

  static getRowAsRange(sheet, range) {
    return sheet.getRange(range.getRow(), 1, 1, sheet.getMaxColumns());
  }

  static isRangeOrSheet(obj) {
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
  }
}