class Field {
  constructor(cell, contacts) {
    const { clientSheet, baseSheet, primaryKeyName } = contacts;
    const { getRowAsRange } = Extensions;
    const { getCellByFieldName } = Contact;

    this.name = clientSheet.titleRow.getCell(1, cell.getColumn());
    this.contacts = contacts;

    // const contactTitleCell = cell.getSheet().getRange(cell.getRow(), 
    //   Contact.getCellByFieldName(primaryKeyName, cell.getSheet(), getRowAsRange(cell)));

    // const contactTitle = contactTitleCell.getValue();

    // if (contactTitle == null) return;

    // this.contact = new Contact (contactTitle)

    // this.clientCell = contact.getCellByFieldName(this.name, clientSheet, clientRow);
    // this.baseCell = contact.getCellByFieldName(this.name, baseSheet, baseRow);

    // this.value = cell.getValue();
    // this.oldValue = oldValue;
  }

  getTypePropByKey(key) {
    const { name, contacts } = this;
    const { getCellByValue, getFirstSheetRow, getFirstSheetColumn } = Extensions;

    const typesSheet = contacts.fieldsTypesSheet;

    const typesProps = typesSheet.getRange(1, 1, 1, typesSheet.getMaxColumns());
    const names = typesSheet.getRange(1, 1, typesSheet.getMaxRows(), 1);
    Logger.log(names);
    const row = getCellByValue(names, name).getRow();
    const column = getCellByValue(typesProps, key).getColumn();

    return fieldTypes.getRange(row, column).getValue();
  }
}

class Contact {
  constructor(primaryKey, contacts) {
    const { clientSheet, primaryKeyName } = contacts;
    const { getRowAsRange } = Extensions;

    this.contacts = contacts;

    this.clientRow = getRowAsRange(clientSheet, cell);
    this.title = this.getFieldByName(primaryKeyName, clientSheet, clientRow).getValue();
  }

  get baseRow() {
    const { getCellByValue, getFirstSheetColumn, getRowAsRange } = Extensions;
    const baseTitleCell = getCellByValue(getFirstSheetColumn(baseSheet), this.title);
    return getRowAsRange(baseSheet, baseTitleCell);
  }

  get status() {
    const { baseRow, getCellbyFieldName } = this;
    if (!baseRow) return 'NONE';

    return getCellbyFieldName('status', contacts.baseSheet, baseRow).getValue();
  }

  set status(str) {
    const { baseRow, getCellbyFieldName } = this;
    if (!baseRow) return 'NONE';

    return getCellbyFieldName('status', contacts.baseSheet, baseRow).setValue(str);
  }

  updateStatus() {
    const { getCellByValue } = Extensions;
    const isContactInBaseSheet = getCellByValue()
  }
}

class Contacts {
  constructor(props) {
    const { clientSheet, baseSheet, fieldsTypesSheet, primaryKeyName } = props;
    const { getFirstSheetRow } = Extensions;
    const { getCellByFieldName } = Contacts;

    this.clientSheet = clientSheet;
    this.baseSheet = baseSheet;
    this.fieldsTypesSheet = fieldsTypesSheet;

    this.clientSheet.titleRow = getFirstSheetRow(clientSheet);
    this.baseSheet.titleRow = getFirstSheetRow(baseSheet);

    this.clientSheet.titleColumn = clientSheet.getRange(2,
      getCellByFieldName(primaryKeyName, clientSheet, this.clientSheet.titleRow).getColumn(),
      clientSheet.getMaxRows(), clientSheet.getMaxColumns() - 1);

    this.baseSheet.titleColumn = baseSheet.getRange(2,
      getCellByFieldName(primaryKeyName, baseSheet, this.baseSheet.titleRow).getColumn(),
      baseSheet.getMaxRows(), baseSheet.getMaxColumns() - 1);

    this.primaryKeyName = primaryKeyName;
  }

  static getCellByFieldName(fieldName, sheet, row) {
    const { titleRow } = sheet;
    const { getCellByValue } = Extensions;
    const fieldColumn = getCellByValue(titleRow, fieldName).getColumn();
    return row.getCell(1, fieldColumn);
  }
}
