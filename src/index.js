import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const countryInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

countryInputEl.addEventListener('input', debounce(onCountryInputEl, DEBOUNCE_DELAY));

function onCountryInputEl() {
    const name = countryInputEl.value.trim();
    if (name === '') {
        return (countryInfoEl.innerHTML = ''), (countryInfoEl.innerHTML = '');
    }

    fetchCountries(name)
        .then(country => {
            countryListEl.innerHTML = '';
            countryInfoEl.innerHTML = '';

            if (country.length === 1) {
                countryInfoEl.insertAdjacentHTML('beforeend', markupCountryInfo(country));
            } else if (country.length >= 10) {
                ifTooManyMatchesAlert();
            } else {
                countryListEl.insertAdjacentHTML('beforeend', markupCountryList(country));
            }
        })
        .catch(ifWrongNameAlert);
};

function ifTooManyMatchesAlert() {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
};

function ifWrongNameAlert() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
};

function markupCountryList(country) {
    const layoutCountryList = country
        .map(({ name, flags }) => {
            const layout = `
          <li class="country-list__item">
              <img class="country-list__item--flag" src="${flags.svg}" alt="Flag of ${name.official}">
              <h2 class="country-list__item--name">${name.official}</h2>
          </li>
          `;
            return layout;
        })
        .join('');
    return layoutCountryList;
};

function markupCountryInfo(country) {
    const layoutCountryInfo = country
        .map(({ name, flags, capital, population, languages }) => {
            const layout = `
        <ul class="country-info__list">
            <li class="country-info__item">
              <img class="country-info__item--flag" src="${flags.svg}" alt="Flag of ${name.official
                }">
              <h2 class="country-info__item--name">${name.official}</h2>
            </li>
            <li class="country-info__item"><span class="country-info__item--categories">Capital: </span>${capital}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Population: </span>${population}</li>
            <li class="country-info__item"><span class="country-info__item--categories">Languages: </span>${Object.values(
                    languages,
                ).join(', ')}</li>
        </ul>
        `;
            return layout;
        })
        .join('');
    return layoutCountryInfo;
};

