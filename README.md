🚀 dapp bookfood
📚 1. Tổng quan dự án
Đây là một dự án dapp (ứng dụng phi tập trung) có tên là dapp bookfood.

📂 2. Cấu trúc thư mục
Cấu trúc thư mục của dự án được tổ chức như sau:

Src/
├── assets/         # 🖼️ Chứa file animation, chứa ảnh động.
├── constract/      # 📜 Chứa file json ABI (Application Binary Interface) của smart contract (smc).
├── context/        # 🔄 Chứa file Redux để quản lý các global state của dự án.
├── cpns/           # 🧩 Chứa các **component con** có thể tái sử dụng trong toàn bộ ứng dụng.
├── layout/         # 🧱 Chứa các file **layout** chung cho các trang (page) hiện có.
├── page/           # 📄 Chứa các file **trang (page)** chính của dự án.
├── router/         # 🗺️ Chứa file **cấu hình route** (đường dẫn) cho ứng dụng.
├── scss/           # 🎨 Chứa các file **SCSS** (Sass) để định kiểu giao diện.
└── utils/          # 🛠️ Chứa các file **hàm hỗ trợ** (utility functions) được sử dụng trong dự án.
🧩 3. Mô tả một số component quan trọng
📂 Trong thư mục cpns/
BlockFood: Component dùng để hiển thị thông tin chi tiết của một món ăn.

Nhận vào các props sau:
food: Danh sách dữ liệu của món ăn cần hiển thị.
widthImage, heightImage: Kích thước (chiều rộng và chiều cao) của hình ảnh món ăn.
hightlight (boolean): Nếu là true, block sẽ được hiển thị nổi bật đặc biệt.
btn (boolean): Nếu là true, sẽ hiển thị nút bấm trên block.
BtnBack: Component đơn giản hiển thị một nút bấm "Trở về".

BtnConfirm: Component hiển thị một nút bấm "Xác nhận" (Submit).

Carousel: Component tạo một slider (thanh trượt) để hiển thị danh sách thức ăn.

Nhận vào các props sau:
listfood: Danh sách các món ăn cần hiển thị trong carousel.
text, detail: Nội dung văn bản có thể được thêm vào để hiển thị kèm theo.
🛠️ Trong thư mục utils/
Services.js: Đây là file quan trọng nhất dùng để kết nối và tương tác với smart contract (smc).
Bao gồm các hàm (functions) để gọi các phương thức trên smart contract.
Chứa các biến khởi tạo để lưu thông tin kết nối với smc:
abi: Nơi lưu trữ nội dung của file JSON ABI (lấy từ thư mục constract).
contractAddress: Địa chỉ duy nhất của smart contract sau khi được deploy (triển khai) lên blockchain.
wsURL: Sử dụng địa chỉ WebSocket (ws) để thiết lập kết nối liên tục với smart contract.
Lưu ý quan trọng: Để đăng nhập ứng dụng và sử dụng các chức năng liên quan đến smart contract, bạn cần phải có private key của ví Metamask của mình.
