function testEditContacts() {
  const cell = contacts.getRange(2, 3);

  const val = '';
  const oldVal = cell.getValue();



  const contact = new Contact(cell, contacts)
  const field = new Field(cell, contact);

  if (field.title)

    if (field.name !== contacts.primaryKeyName) {
      field.baseCell.setValue(val);
    }
}


function testEditValidation() {
  const contacts = new Contacts({
    clientSheet: spreadSheet.getSheetByName('Контакти'),
    baseSheet: spreadSheet.getSheetByName('ContactsDB'),
    fieldsTypesSheet: spreadSheet.getSheetByName('FieldTypes'),
    primaryKeyName: 'Компанія'
  });

  const cell = contacts.clientSheet.getRange(2, 3);

  const val = '';
  const oldVal = cell.getValue();

  cell.setValue(val);

  if (cell.getSheet().getSheetName() !== 'Контакти') return;

  const field = new Field(cell, contacts);
  validation(field, val, oldVal);
}
