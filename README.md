Dapp BookFood
1. Tổng quan dự án
Tên dự án: Dapp BookFood

2. Cấu trúc thư mục
css
Copy
Edit
src/
├── assets/        # Chứa các file animation, hình ảnh động
├── constract/     # Chứa file JSON ABI của smart contract
├── context/       # Chứa các file Redux lưu các global state
├── cpns/          # Chứa các component con tái sử dụng
├── layout/        # Chứa các file layout của các page
├── page/          # Chứa các page chính của dự án
├── router/        # Chứa file cấu hình route
├── scss/          # Chứa các file SCSS
├── utils/         # Chứa các function hỗ trợ cho dự án
3. Mô tả một số file/component
Trong thư mục cpns/
BlockFood/
Hiển thị cấu trúc thông tin food.
Props nhận vào:

food: danh sách món ăn

widthImage, heightImage: độ rộng và cao của ảnh

highlight (boolean): có cần hiển thị block đặc biệt hay không

btn (boolean): có cần hiển thị nút bấm hay không

BtnBack/
Hiển thị nút bấm trở về.

BtnConfirm/
Hiển thị nút submit xác nhận.

Carousel/
Hiển thị danh sách thức ăn có thể trượt.

Props nhận vào:

listfood: danh sách món ăn

text, detail: nội dung thêm để hiển thị kèm theo

Trong thư mục utils/
Services.js
Quản lý việc connect với smart contract (SMC).
Bao gồm:

abi: file JSON ABI (lấy từ folder constract/)

contractAddress: địa chỉ smart contract sau khi deploy

wsURL: địa chỉ WebSocket để kết nối với smart contract

Lưu ý:
Cần private key của ví Metamask để đăng nhập và sử dụng ứng dụng.
