dapp bookfood
1. Tổng quan dự án
Đây là dự án dapp (ứng dụng phi tập trung) có tên là dapp bookfood.

2. Cấu trúc thư mục
Cấu trúc thư mục của dự án như sau:

Src/
├── assets/         # Chứa file animation, chứa ảnh động.
├── constract/      # Chứa file json abi của smc (smart contract).
├── context/        # Chứa file redux lưu các global state của dự án.
├── cpns/           # Chứa các code component con tái sử dụng.
├── layout/         # Chứa file layout của các page hiện có.
├── page/           # Chứa các file page chính của dự án.
├── router/         # Chứa file config route.
├── scss/           # Chứa các file scss.
└── utils/          # Chứa các file function hỗ trợ dự án.
3. Mô tả một số file component
Trong thư mục cpns/
BlockFood: Hiển thị cấu trúc hiển thị thông tin food.

Nhận vào:
food: Danh sách food.
widthImage, heightImage: Độ dài và cao của image.
hightlight (boolean): Cần hiển thị block đặc biệt.
btn (boolean): Cần hiển thị nút bấm.
BtnBack: Hiển thị nút bấm trở về.

BtnConfirm: Hiển thị nút submit.

Carousel: Hiển thị danh sách thức ăn có thể trượt.

Nhận vào:
listfood: Danh sách cần hiển thị.
text, detail: Phần nội dung có thể thêm để hiển thị.
Trong thư mục utils/
Services.js: Nơi kết nối với smc (smart contract), chứa các hàm để gọi smc, các biến khởi tạo để lưu thông tin kết nối với smc:
abi: Nơi lưu file json abi (file trong thư mục constract).
contractAddress: Chuỗi địa chỉ được tạo ra khi deploy smc.
wsURL: Sử dụng địa chỉ ws để kết nối smc.
Lưu ý: Cần private key của ví Metamask để đăng nhập ứng dụng và sử dụng.
