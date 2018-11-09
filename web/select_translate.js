class SelectTranslate {

  constructor() {

  }

  select() {
    let selectString = window.getSelection().toString();
    if (selectString !== '') {
      alert(selectString);
    }
  }

  bind() {
    console.log('binded');
    window.addEventListener('click', (e) => {
      e.preventDefault();
      this.select();
    }, false);
  }

}

export {
  SelectTranslate,
};
