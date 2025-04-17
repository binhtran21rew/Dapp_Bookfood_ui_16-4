export default function capitalizeWords(str, wordsToCapitalize) {
    const words = str.split(' ');
    const capitalizedWords = words.map(word => {
        if (wordsToCapitalize.includes(word.toLowerCase())) { // So sánh không phân biệt hoa thường
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
    });
    return capitalizedWords.join(' ');
}

export function checkIsDrink(chuoi) {
    const regex = /(nước|thức|đồ)\s+uống/i;
    return regex.test(chuoi);
}


export function checkIsVegetable(chuoi) {
    const regex = /rau/i;
    return regex.test(chuoi);
}