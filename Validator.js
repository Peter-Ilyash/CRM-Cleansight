class Validator {
  constructor(props) {
    this.regExp = props.regExp;
  }

  validateRange(range, oldVal) {
    const val = range.getValue();

    if (!this.checkValue(val)) {
      range.setValue(oldVal);
      this.alert();
    }
  }

  checkValue(val) {
    val = String(val);
    val = val.replace(/\s/g, '');
    const template = this.regExp;
    return (template.test(val)) ? true : false;
  }

  alert(range) {
    Browser.msgBox(
      'Виникла проблема',
      `Дані, введені в клітинку ${range.getA1Notation()}, не відповідають установленим для неї правилам перевірки даних`,
      Browser.Buttons.OK);
  }
}