export const fetchStarWarsPlanets = async () => {
    try {
        const response = await fetch('https://swapi.dev/api/planets/');
        if (response) {
            const result = await response.json();
            return result.results;
        }
        return null;
    } catch {
        return null;
    }
};
