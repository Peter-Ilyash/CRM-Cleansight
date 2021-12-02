function testEditContacts() {
  const cell = contacts.getRange(2, 3);

  const val = "";
  const oldVal = cell.getValue();

  const contact = new Contact(cell, contacts);
  const field = new Field(cell, contact);

  if (field.title)
    if (field.name !== contacts.primaryKeyName) {
      field.baseCell.setValue(val);
    }
}

function testEditValidation() {
  const cell = contacts.clientSheet.getRange(2, 3);

  const val = "";
  const oldVal = cell.getValue();

  cell.setValue(val);

  if (cell.getSheet().getSheetName() !== "Контакти") return;

  const field = new Field(cell, contacts);
  validation(field, val, oldVal);
}

function testGetFirstEmptyRow() {
  const { getFirstEmptyRow, getRowAsRange } = Extensions;
  const sheet = spreadSheet.getSheetByName("Контакти");
  const row = getFirstEmptyRow(sheet);

  Logger.log(row.getRow());
}

function testCopyContactTo() {
  const contacts = new Contacts({
    clientSheet: spreadSheet.getSheetByName("Контакти"),
    fieldsTypesSheet: spreadSheet.getSheetByName("FieldTypes"),
    primaryKeyName: "Компанія",
  });

  const contact = new Contact("Ільяш Петро Петрович", contacts);
  const sheet = spreadSheet.getSheetByName("Контакти");
  contact.copyTo(sheet);
}

function test() {
  const sheet = spreadSheet.getSheetByName("Просрочка");
  const { cleanSheet } = Extensions;

  cleanSheet(sheet);
}

function testService() {
  const service = new Service();
  const sheet = service.clientSheets["Контакти"];

  const cell = sheet.getRange(3, 3);
  const contactTitle = sheet.getRange(cell.getRow(), 2).getValue();
  const fieldName = sheet.getRange(1, cell.getColumn()).getValue();

  const contact = new Contact(contactTitle, service);
  const field = new Field(fieldName, contact, service);

  field.setValue("0777777772");
}

function testEdit() {
  const service = new Service();

  const sheetName = "Контакти";
  const sheet = service.clientSheets[sheetName];

  const range = sheet.getRange(2, 11);
  const value = "888888888";
  const oldValue = range.getValue();

  if (!service.clientSheetsNames.includes(sheetName)) return;
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) return;

  const fieldProjection = new FieldProjection(range, service);
  const { contactTitle, name } = fieldProjection;
  if (!contactTitle) return;

  const contact = new Contact(contactTitle, service);
  const field = new Field(name, contact, service);

  const validationResult = fieldProjection.validation(value, oldValue);

  if (!validationResult) return;
  // field.setValue(validationResult);
}

function testDate() {
  const { patchDateFormatError } = Extensions;
  const days = 44203;
  Logger.log(patchDateFormatError(days));
}

function testProject() {
  const service = new Service();
  const contact = new Contact("Компанія один", service);
  const overdue = service.clientSheets["Просрочка"];

  contact.project(overdue);
}

function testFieldIsEmpty() {
  const service = new Service();
  const contact = new Contact("Компанія один", service);
  const field = new Field("Час для дзвінка", contact, service);
  Logger.log(field.isEmpty());
}
