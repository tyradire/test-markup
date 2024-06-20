//region Range + Percentage Sliders
const rangeSliderInit = () => {
  const range = document.getElementById('price-range');
  const inputMin = document.getElementById('price-range-min');
  const inputMax = document.getElementById('price-range-max');

  const priceThc = document.getElementById('price-thc');
  const priceThcInput = document.getElementById('price-thc-value');

  const priceCbd = document.getElementById('price-cbd');
  const priceCbdInput = document.getElementById('price-cbd-value');

  if (!range || !inputMin || !inputMax || !priceThcInput || !priceCbd || !priceCbdInput) return

  const inputs = [inputMin, inputMax];
  
  noUiSlider.create(range, {
    start: [234, 6666],
    connect: true,
    tooltips: [false, true],
    format: {
      from: Number,
      to: function(value) {
          return (parseInt(value)+" $");
      }
    },
    range: {
      'min': 0,
      'max': 9999
    },
    step: 1,
  })

  noUiSlider.create(priceThc, {
    start: 65,
    connect: 'lower',
    tooltips: true,
    format: {
      from: Number,
      to: function(value) {
          return (parseInt(value)+" %");
      }
    },
    range: {
      'min': 0,
      'max': 100
    },
    step: 1,
  })

  noUiSlider.create(priceCbd, {
    start: 65,
    connect: 'lower',
    tooltips: true,
    format: {
      from: Number,
      to: function(value) {
          return (parseInt(value)+" %");
      }
    },
    range: {
      'min': 0,
      'max': 100
    },
    step: 1,
  })
  
  range.noUiSlider.on('update', function (values, handle) {
    inputs[handle].value = `${parseInt(values[handle])} $`;
  });
  
  inputMin.addEventListener('change', function () {
    range.noUiSlider.set([this.value, null]);
  });
  
  inputMax.addEventListener('change', function () {
    range.noUiSlider.set([null, this.value]);
  });

  priceThc.noUiSlider.on('update', function (values, handle) {
    priceThcInput.value = `${parseInt(values[handle])} %`;
  });
  
  priceCbd.noUiSlider.on('update', function (values, handle) {
    priceCbdInput.value = `${parseInt(values[handle])} %`;
  });
}

const init = () => {
  rangeSliderInit()
}

document.addEventListener('DOMContentLoaded', init)


document.addEventListener("DOMContentLoaded", () => {
  //region Nose radio
  const radioInputs = document.querySelectorAll('.radio__input');
  const radioButtons = document.querySelectorAll('.radio__button');
  const handleRadioButton = (e) => {
    radioButtons.forEach(button => button.classList.remove('radio__button_filled'))
    let picked = Number(e.currentTarget.id.split('radio-')[1])
    for (let i = 0; i < picked; i++) {
      if (Number(radioButtons[i].dataset.number) <= picked) {
        radioButtons[i].classList.add('radio__button_filled')
      }
    }
  } 
  radioInputs.forEach(button => button.addEventListener('change', (e) => handleRadioButton(e)))

  // чекбоксы аккордеона
  const accordionInputs = document.querySelectorAll('.accordion__input');
  const accordionLists = document.querySelectorAll('.accordion__list');
  const openAccordionList = (e) => {
    let currentList = e.currentTarget.dataset.listNumber - 1;
    accordionLists[currentList].classList.toggle('accordion__list_opened')
  }
  accordionInputs.forEach(button => button.addEventListener('click', (e) => openAccordionList(e)))

  // связь аккордеона со списком тегов
  const accordionLabels = document.querySelectorAll('.accordion__item-label');
  const accordionCheckbox = document.querySelectorAll('.accordion__item-input');
  const accordionTagsContainer = document.querySelector('.select__tags');
  let accordionCloseButtons = document.querySelectorAll('.tag__close-btn');
  let accordionTags = [];
  //region Tags
  // удаление по кнопке тега
  const removeTag = (e) => {
    accordionCheckbox.forEach(checkbox => {
      if (checkbox.dataset.accordionNumber === e.currentTarget.parentElement.dataset.accordionNumber) {
        checkbox.checked = false;
      }
    })
    handleTags();
  }
  
  // отрисовка тегов
  const handleTags = () => {
    accordionTagsContainer.innerHTML = ``;
    accordionTags = [];
    accordionCheckbox.forEach((check, index) => {
      if (check.checked) {
        accordionTags.push({
          text: accordionLabels[index].textContent.trim(), 
          id: accordionLabels[index].firstElementChild.dataset.accordionNumber
        })
      }
    })
    accordionTags.forEach((item, index) => {
      accordionTagsContainer.innerHTML += `<li class="tag" data-accordion-number=${accordionTags[index].id}>${accordionTags[index].text}<button class="tag__close-btn"></button></li>`
    })
    accordionCloseButtons = document.querySelectorAll('.tag__close-btn');
    accordionCloseButtons.forEach(button => {
      button.addEventListener('click', (e) => removeTag(e))
    })
  }

  accordionCheckbox.forEach(checkbox => {
    checkbox.addEventListener('change', handleTags)
  })


  handleTags();
  //region Modal
  const sortButton = document.querySelector('.sort');
  const sortModal = document.querySelector('.modal');
  const handleSortModal = () => {
    sortModal.classList.toggle('modal_opened');
  }
  sortButton.addEventListener('click', handleSortModal);
});