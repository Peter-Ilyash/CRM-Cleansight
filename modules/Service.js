class Service {
  constructor() {
    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    
    this.clientSheetsNames = ['Контакти','Просрочка', 'Тендери', 'Продаж додаткових послуг'];
    this.serviceSheetsNames = ['FieldTypes'];

    this.clientSheets = {};
    this.serviceSheets = {};
    
    this.clientSheetsNames.forEach((sheetName) => {
      this.clientSheets[sheetName] = spreadSheet.getSheetByName(sheetName);
    });

    this.serviceSheetsNames.forEach((sheetName) => {
      this.serviceSheets[sheetName] = spreadSheet.getSheetByName(sheetName);
    });
  }

  getClientSheetTitleRow(sheet) {
    return sheet.getRange(1, 1, 1, sheet.getMaxColumns());
  }

  getClientSheetTitleColumn(sheet) {
    const titleRow = this.getClientSheetTitleRow(sheet);
    const {getCellByValue} = Extensions;
    const primaryKeyNameCell = getCellByValue(titleRow, 'Компанія');
    return sheet.getRange(1, primaryKeyNameCell.getColumn(), sheet.getMaxRows(), 1);
  }
}

class Contact {
  constructor(title, service) {
    this.title = title;
    this.service = service;
  }

  getProjection(sheet) {
    const titleColumn = this.service.getClientSheetTitleColumn(sheet);

    const titleCell = Extensions.getCellByValue(titleColumn, this.title);
    if(!titleCell) return null;

    const contactRow = sheet.getRange(titleCell.getRow(), 1, 1, sheet.getMaxColumns());

    let projection = {};

    for (let i = 1; i <= sheet.getMaxColumns(); i++) {
      const fieldName = sheet.getRange(1, i).getValue();
      const fieldProjection = contactRow.getCell(1, i);
      projection[fieldName] = fieldProjection;
    }

    return projection;
  }

  get projections() {
    const sheets = this.service.clientSheets;
    let projections = {};

    for (let sheetName of Object.keys(sheets)) {
      let projection = this.getProjection(sheets[sheetName]);
      if (!projection) continue;
      projections[sheetName] = projection;
    }

    return projections;
  }

  project(sheet) {
    const {getFirstSheetRow, getCellByValue, getFirstEmptyRow} = Extensions;
    const {service, title} = this;
    
    const titleRow = getFirstSheetRow(sheet);
    const primaryKeyColumnNum = getCellByValue(titleRow, 'Компанія').getColumn();

    const primariesKeysColumn = sheet.getRange(1, primaryKeyColumnNum, sheet.getMaxColumns(), 1);
    if(getCellByValue(primariesKeysColumn, title)) return;

    const emptyRow = getFirstEmptyRow(sheet);
    const contactTitleCell = emptyRow.getCell(1, primaryKeyColumnNum);
    contactTitleCell.setValue(title);

    const generalProjection = this.getProjection(service.clientSheets['Контакти']);
    const sheetProjection = this.getProjection(sheet);

    for (let fieldName of Object.keys(generalProjection)) {
      const value = generalProjection[fieldName].getValue();
      if (!value) continue;

      const cell = sheetProjection[fieldName];
      if (!cell) continue;
      cell.setValue(value);
    }

    return sheetProjection;
  }
}

class Field {
  constructor(fieldName, contact, service) {
    this.name = fieldName;
    this.service = service;
    this.contact = contact;
  }

  getProjection(sheet) {
    const contactProjection = this.contact.getProjection(sheet);
    return (contactProjection)? contactProjection[this.name] : false;
  }

  get projections() {
    const sheets = this.service.clientSheets;
    let projections = {};

    for (let sheetName of Object.keys(sheets)) {
      let projection = this.getProjection(sheets[sheetName]);
      if (!projection) continue;
      projections[sheetName] = projection;
    }

    return projections;
  }

  setValue(value) {
    for (let projection of Object.values(this.projections)) {
      if (!projection) continue;
      if (projection.getValue() === value) continue;
      projection.setValue(value);
    }
  }

  isEmpty() {
    let isEmpty = true;

    const projectionValues = Object.values(this.projections)
      .map((projection) => projection.getValue());
    
    for (let projectionValue of projectionValues) {
      if (!projectionValue) continue;
      isEmpty = false;
      break;
    }

    return isEmpty;
  }
}

class FieldProjection {
  constructor(cell, service) {
    const {getFirstSheetRow, getCellByValue} = Extensions;
    const sheet = cell.getSheet();

    const titleRow = getFirstSheetRow(sheet);
    const titleCell = getCellByValue(titleRow, 'Компанія');

    this.cell = cell;
    this.name = sheet.getRange(1, cell.getColumn()).getValue();
    this.sheet = sheet;

    this.service = service;
    this.contactTitle = sheet.getRange(cell.getRow(), titleCell.getColumn()).getValue();
  }

  validation(value, oldValue) {
    const validationType = this.getTypePropByKey('ValidationType');
    const {patchDateFormatError} = Extensions;

    let validator;

    if (validationType === 'cyrillic') {
      validator = new CustomValidator(/^[а-яА-ЯіІїЇґҐ\s]+$/);
    } else if (validationType === 'phone') {
      validator = new PhoneValidator();
    } else if (validationType === 'date' && value > 40000) {
      Logger.log(patchDateFormatError(value));
      return patchDateFormatError(value);
    } else {
      return value;
    }

    let validationResult = validator.validate(this.cell, value, oldValue);
    return validationResult;
  }

  getTypePropByKey(key) {
    const {getCellByValue} = Extensions;

    const typesSheet = this.service.serviceSheets['FieldTypes'];

    const typesProps = typesSheet.getRange(1, 1, 1, typesSheet.getMaxColumns());
    const names = typesSheet.getRange(1, 1, typesSheet.getMaxRows(), 1);

    const row = getCellByValue(names, this.name).getRow();
    const column = getCellByValue(typesProps, key).getColumn();

    return typesSheet.getRange(row, column).getValue();
  }
}
