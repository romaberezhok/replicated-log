const axios = require('axios');
const getSecondaryNodesURLs = async () => {
    try {
        const { data } = await axios.get('http://service-discovery:8080/api/rawdata');
        return data['services']['secondary-server-replicated-log@docker']['loadBalancer']['servers'].map((obj) => obj['url']);
    } catch (error) {
        throw new Error('Failed to get URLs of secondary nodes.')
    }
}

const findInsertionIndex = (sortedArray, newValue, compareProperty) => {
    let start = 0;
    let end = sortedArray.length - 1;

    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const midValue = sortedArray[mid][compareProperty];

        if (midValue < newValue[compareProperty]) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return start;
}

const insertIntoSortedArray = (sortedArray, newValue, compareProperty) => {
    const insertionIndex = findInsertionIndex(sortedArray, newValue, compareProperty);
    sortedArray.splice(insertionIndex, 0, newValue);
}

const pluralizeWord = (singularWord, pluralWord, count) => {
    return count > 1 ? pluralWord : singularWord;
}

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    getSecondaryNodesURLs,
    insertIntoSortedArray,
    pluralizeWord,
    getRandomNumber
}