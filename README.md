📚 Dapp BookFood
Một dự án Dapp giúp đặt thức ăn qua blockchain.

📖 Mục lục
Giới thiệu

Cấu trúc thư mục

Chi tiết Component

Chi tiết Service

Yêu cầu hệ thống

Cài đặt & Chạy dự án

Ghi chú

🚀 Giới thiệu
Tên dự án: Dapp BookFood
Mục tiêu:
Ứng dụng phi tập trung (Dapp) cho phép người dùng đặt món ăn, lưu trữ đơn hàng trên blockchain thông qua smart contract.

📂 Cấu trúc thư mục
graphql
Copy
Edit
src/
├── assets/         # File animation và hình ảnh động
├── constract/      # File JSON ABI của smart contract
├── context/        # Global state sử dụng Redux
├── cpns/           # Các component con tái sử dụng
├── layout/         # Các layout của page
├── page/           # Các page chính của dự án
├── router/         # Cấu hình router
├── scss/           # Các file SCSS
├── utils/          # Các function hỗ trợ dự án
🛠️ Chi tiết Component
Trong thư mục cpns/:

BlockFood/

Hiển thị thông tin món ăn.

Props:

food: danh sách món ăn

widthImage, heightImage: kích thước hình ảnh

highlight (boolean): block nổi bật

btn (boolean): hiển thị nút bấm

BtnBack/

Hiển thị nút quay lại.

BtnConfirm/

Hiển thị nút submit xác nhận.

Carousel/

Hiển thị danh sách thức ăn dạng trượt ngang.

Props:

listfood: danh sách món ăn

text, detail: nội dung tùy chỉnh thêm

🛠️ Chi tiết Service
Trong thư mục utils/:

Services.js

Chịu trách nhiệm kết nối với Smart Contract (SMC).

Các thành phần:

abi: file JSON ABI (từ constract/)

contractAddress: địa chỉ smart contract

wsURL: URL kết nối WebSocket

Yêu cầu: Private key từ ví MetaMask để đăng nhập và giao dịch.

💻 Yêu cầu hệ thống
Node.js >= 18.x

Metamask Extension

Trình duyệt hỗ trợ Web3 (Chrome, Brave, ...)

🛠️ Cài đặt & Chạy dự án
bash
Copy
Edit
# Clone dự án
git clone https://github.com/your-username/dapp-bookfood.git

# Cài đặt dependencies
cd dapp-bookfood
npm install

# Chạy ứng dụng
npm run dev
⚡ Ghi chú
Luôn kiểm tra lại địa chỉ contractAddress sau mỗi lần deploy smart contract mới.

Private key phải được bảo mật, không commit lên GitHub.

Dự án kết nối blockchain thông qua WebSocket (wsURL) nên cần mạng ổn định.
