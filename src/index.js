import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const refs = {
    inputBox: document.querySelector('#search-box'),
    countriList: document.querySelector('.country-list'),
    countriInfo: document.querySelector('.country-info'),
};

refs.inputBox.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
    const countryName = e.target.value.trim();

    if (!countryName) {
        clearTemplate();
        return;
    }

    fetchCountries(countryName)
        .then(data => {
            if (data.length > 10) {
                specificNameInfo();
                clearTemplate();
                return;
            }
            renderTemplate(data);
        })
        .catch(error => {
            clearTemplate();
            errorWarn();
        });
}

function errorWarn() {
    Notify.failure(`Oops, there is no country with that name`);
}

function specificNameInfo() {
    Notify.info(`Too many matches found. Please enter a more specific name.`);
}

function clearTemplate() {
    refs.countriInfo.innerHTML = '';
    refs.countriList.innerHTML = '';
}

function renderTemplate(elements) {
    let template = '';
    let refsTemplate = '';
    clearTemplate();

    if (elements.length === 1) {
        template = createItem(elements);
        refsTemplate = refs.countriInfo;
    } else {
        template = createList(elements);
        refsTemplate = refs.countriList;
    }

    drawTemplate(refsTemplate, template);
}

function createItem(element) {
    return element.map(
        ({ name, capital, population, flags, languages }) =>
            `
      <img
        src="${flags.svg}" 
        alt="${name.official}" 
        width="80" 
        height="50">
      <h1 class="country-info__title">${name.official}</h1>
      <ul class="country-info__list">
          <li class="country-info__item">
          <span>Capital:</span>
        ${capital}
          </li>
          <li class="country-info__item">
          <span>Population:</span>
          ${population}
          </li>
          <li class="country-info__item">
          <span>Lenguages:</span>
          ${Object.values(languages)}
          </li>
      </ul>
  `
    );
}

function createList(elements) {
    return elements
        .map(
            ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img" 
          src="${flags.svg}" 
          alt="${name.official}" 
          width="50" 
          height="50">
        ${name.official}
      </li>`
        )
        .join('');
}

function drawTemplate(refs, markup) {
    refs.innerHTML = markup;
}
