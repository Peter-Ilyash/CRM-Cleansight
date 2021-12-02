class CustomValidator {
  constructor(regExp) {
    this.regExp = regExp;
  }

  validate(cell, val, oldVal) {
    if (this.checkValue(val)) {
      Logger.log('Validated');
      return val;
    }

    cell.setValue(oldVal);
    this.alert(cell);
    Logger.log('No validated');
    return false;
  }

  checkValue(val) {
    if (val == null) return true;
    
    val = String(val);
    val = val.replace(/\s/g, '');

    const template = this.regExp;
    return template.test(val);
  }

  alert(cell) {
    Browser.msgBox(
      'Виникла помилка',
      `Дані, введені в клітинку ${cell.getA1Notation()}, не відповідають установленим для неї правилам перевірки даних`,
      Browser.Buttons.OK);
  }
}

class PhoneValidator extends CustomValidator {
  constructor(regExp = /^0[1-9]\d{8}$/) {
    super(regExp);
  }

  validate(cell, val, oldVal) {
    super.validate(cell, val, oldVal);
    if (!super.checkValue(val)) return false;

    val = this.correctPhone(val);
    cell.setValue(val);
    return val;
  }


  correctPhone(val) {
    const spacePositions = [2, 5];
    let newVal = '';

    val = val.replace(/\s/g, '');

    for (let i = 0; i < val.length; i++) {
      newVal += val[i];
      if (spacePositions.includes(i)) newVal += ' ';
    }

    return newVal;
  }
}
