import {typeFood} from './constant';

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

export function removeVietnameseTones(str) {
    return str
      .normalize("NFD") // tách dấu khỏi chữ
      .replace(/[\u0300-\u036f]/g, "") // xóa các ký tự dấu
      .replace(/đ/g, "d").replace(/Đ/g, "D") // thay đ thành d
      .toLowerCase();
}

export function checkIsDrink(chuoi) {
    const noDiacritics = removeVietnameseTones(chuoi);
    const regex = /(nuoc|thuc|do)\s+uong/i;
    return regex.test(noDiacritics);
}


export function checkIsVegetable(chuoi) {
    const normalized = removeVietnameseTones(chuoi);
    const regex = /\brau\b/;
    return regex.test(normalized);
}

export function getFoodTypes(data) {
    return Object.keys(typeFood)
        .filter((key) => data[key])
        .map((key) => typeFood[key]);
}


export function arrSlice(arr,  blockSize){
    const res = [];
    const temp = [...arr];
    const block = temp.splice(0, blockSize);
    res.push(block, temp);

    return res;
}

export function groupByCategory(foodArray) {
    return foodArray.reduce((acc, item) => {
        const { categoryName } = item;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
    }, {});
}

export function getMaxRating(items){
    const res =  items.map((item) => ({
        ...item,
        rating: parseFloat(item.totalStars) / parseFloat(item.totalRatings || 1),
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 1);


      return res;
}