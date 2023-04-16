const allCountries = 'https://restcountries.com/v3.1/name/';

const countryInformation = 'fields=name,capital,population,flags,languages';

export async function fetchCountries(name) {
    try {
        const response = await fetch(`${allCountries}${name}?${countryInformation}`);
        return await response.json();
    } catch (error) {
        return console.log(error);
    }
};