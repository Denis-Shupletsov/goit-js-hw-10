import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
    const name = countryInput.value.trim();
    if (name === '') {
        return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
    }

    fetchCountries(name)
        .then(country => {
            countryList.innerHTML = '';
            countryInfo.innerHTML = '';

            if (country.length === 1) {
                countryInfo.insertAdjacentHTML('beforeend', markupCountryInfo(country));
            } else if (country.length >= 10) {
                ifTooManyMatchesAlert();
            } else {
                countryList.insertAdjacentHTML('beforeend', markupCountryList(country));
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
}