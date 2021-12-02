const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

function onEdit(e) {
  const service = new Service();
  const {range, value, oldValue} = e;

  const sheet = range.getSheet();
  const sheetName = sheet.getSheetName();

  if (!service.clientSheetsNames.includes(sheetName)) return;
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) return;

  const fieldProjection = new FieldProjection(range, service);
  const {contactTitle, name} = fieldProjection;

  if (!contactTitle) return;

  const validationResult = fieldProjection.validation(value, oldValue);

  const contact = new Contact(contactTitle, service);
  const field = new Field(name, contact, service);

  if (!validationResult) return;

  if (name === 'Компанія') {
    const insertDateField = new Field('Дата внесення', contact, service);
    Logger.log(value);

    if (insertDateField.isEmpty()) {
      const now = new Date();
      insertDateField.setValue(now);
    }
  }

  if (name === 'Дата початку тендера') {
    contact.project(service.clientSheets['Тендери']);
  }

  if (name === 'Підписання договору' &&
      range.getValue() === 'Підписаний') {
    const projection = contact.project(service.clientSheets['Продаж додаткових послуг']);
    let date = new Date();
    date.setMonth(date.getMonth() + 3);
    projection['Продаж дод. послуг'].setValue(date);
  }
  
  field.setValue(validationResult);
}
