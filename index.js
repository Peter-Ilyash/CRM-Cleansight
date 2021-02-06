const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();

function onEdit(e) {
  const contacts = new Contacts({
    clientSheet: spreadSheet.getSheetByName('Контакти'),
    baseSheet: spreadSheet.getSheetByName('ContactsDB'),
    fieldsTypesSheet: spreadSheet.getSheetByName('FieldTypes')
  });

  const { range, value, oldValue } = e;

  if (range.getSheet().getSheetName() !== 'Контакти') return;

  if (range.getNumRows() !== 1
    || range.getNumColumns() !== 1) {

    range.setValue(oldValue);

    Browser.msgBox(
      'Виникла помилка',
      `У таблиці "Контакти" заборонене введення у більше ніж одну комірку`,
      Browser.Buttons.OK);

    return;
  }

  const field = new Field(range);
  validation(field, value, oldValue);
}