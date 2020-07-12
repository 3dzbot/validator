const Validator = function(options){
  
  const form = document.getElementById(options.id),
        //form.elements - HTML коллекция
        elementsForm = [...form.elements].filter(item => item.tagName !== 'BUTTON'),
        error = new Set(),       //коллекция set
        //правило проверки
        pattern = {
          email: /^\w+@\w+\.\w+$/,
          phone: /^\+?[78]([()-]*\d){10}$/
        },
        validatorMethod = {
          notEmpty(elem){
            if(elem.value.trim() === ''){
              return false;
            }
            return true;
          },
          //сама проверка
          pattern(elem, pattern){
            return pattern.test(elem.value);
          }
        }       

  const isValid = (elem) => {
    //отбираем все методы для нужного поля
    const method = options.method[elem.id];
    if(method !== undefined){
      //или проверка не пустой, если не пустой и совпадает с нужным полем то поле+метод
      //every возвращает булевое значение
      return method.every(item => validatorMethod[item[0]](elem, pattern[item[1]]));
    }
    return true;
  };

  const checkIt = (e) => {
    let target = e.target;
                console.log('target = ' + target);
                            console.log('target = ' + target.className);

    if(isValid(target)){
      showSuccess(target);
      //добавляем/удаляем в коллекцию ошибку (поможет уйти от дублей)
      error.delete(target);
    } else {
      showError(target);
      error.add(target);
    }
    // console.log(error);
  };
//следим за изменением input
  elementsForm.forEach(elem => { 
    elem.addEventListener('change', checkIt)
  });  
//отобразить ошибку и добавим блоки для сообщения ошибки 
  const showError = (elem) => {
    elem.classList.remove('validator_successs');
    elem.classList.add('validator_error');
    //проверка наличия класса у следующего после elem елемента
    //error if elem is a last 
    if (!elem.nextElementSibling.classList.contains('error-message')){
      const errorDiv = document.createElement('div');
      errorDiv.textContent = 'Ошибка в этом поле';
      errorDiv.classList.add('error-message');
      //метод вставляет errorDiv после elem
      elem.insertAdjacentElement('afterend', errorDiv);
    }
  }

  const showSuccess = (elem) => {
    elem.classList.remove('validator_error');
    elem.classList.add('validator_successs');
    if (elem.nextElementSibling.classList.contains('error-message')){
      elem.nextElementSibling.remove();
    }
  };
//добавляем правила пользователя с индекса к основным правилам на валидатор.js
  for (let key in options.pattern) {
    pattern[key] = options.pattern[key]
  }

  form.addEventListener('submit', (e) =>{
    elementsForm.forEach((elem)=>{
      checkIt({target: elem});
    })
    if(error.size){
      e.preventDefault();      
    }
  })  
};