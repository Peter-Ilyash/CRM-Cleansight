function overdueParse() {
  const DATE_FIELDS_NAMES = ['Час для дзвінка', 'Зустріч'];
  const service = new Service();
  const {getCellByValue, cleanSheet, getFirstEmptyRow} = Extensions;

  const contactsSheet = service.clientSheets['Контакти'];
  const overdueSheet = service.clientSheets['Просрочка'];  
  
  cleanSheet(overdueSheet);
  
  const cells = getCells(DATE_FIELDS_NAMES);
  const overdueContacts = getContacts(cells);
  overdueContacts.forEach((contact) => contact.project(overdueSheet));
  
  function getCells(fieldNames) { 
    const now = new Date();
    const firstEmptyRow = getFirstEmptyRow(contactsSheet).getRow();
    const titleRow = service.getClientSheetTitleRow(contactsSheet);

    const getOverdue = (column) => {
      let overdue = [];
      
      for (let i = 2; i < firstEmptyRow; i++) {
        const cell = column.getCell(i, 1);
        const date = cell.getValue();
        
        if (date < now && date) overdue.push(cell);
      }

      return overdue;
    };

    let cells = [];

    for (fieldName of fieldNames) {
      const columnTitleCell = getCellByValue(titleRow, fieldName);
      const column = contactsSheet.getRange(1, columnTitleCell.getColumn(), firstEmptyRow, 1);
      cells = cells.concat(getOverdue(column));
    }

    return cells;
  }
  
  function getContacts(cells) {
    const fieldsProjections = cells.map((cell) => new FieldProjection(cell, service));
    const contactsTitles = fieldsProjections.map((fieldsProjections) => fieldsProjections.contactTitle);

    let uniqueTitles = [];

    for (title of contactsTitles) {
      if (uniqueTitles.includes(title)) continue;
      uniqueTitles.push(title);
    }

    return uniqueTitles.map((title) => new Contact(title, service));
  }
}
