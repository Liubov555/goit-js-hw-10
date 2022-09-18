const fetchCountries = function (name) {
    return fetch(
        `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,languages,flags`,
    )
        .then(
            response => {
                if (response.status === 404) {
                    return Promise.reject(new Error());
                }
                return response.json();
            });
}

export { fetchCountries };