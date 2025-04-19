export default function isValidJSON(str) {
    try {
      JSON.parse(str);  // Thử parse chuỗi
      return true;      // Nếu không có lỗi, chuỗi là JSON hợp lệ
    } catch (e) {
      return false;     // Nếu có lỗi, chuỗi không hợp lệ
    }
  }