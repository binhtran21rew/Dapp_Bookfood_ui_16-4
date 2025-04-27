# 🚀 dapp bookfood

## 📝 1. Giới thiệu

Đây là một dự án **dapp (ứng dụng phi tập trung)** có tên là **dapp bookfood**. Dự án này được xây dựng để... (***Bạn nên thêm một đoạn mô tả ngắn gọn về mục đích chính của dự án ở đây, ví dụ: "đặt món ăn trực tuyến trên nền tảng blockchain."***).

## ✨ 2. Tính năng chính

- **Hiển thị danh sách các món ăn:** Sử dụng component `BlockFood` và `Carousel`.
- **Xem thông tin chi tiết món ăn:** (***Nếu có tính năng này, hãy thêm vào.***)
- **Tương tác với Smart Contract:** Thông qua file `Services.js`.
- **Quản lý trạng thái ứng dụng:** Sử dụng Redux trong thư mục `context`.
- **Điều hướng giữa các trang:** Được quản lý bởi cấu hình trong thư mục `router`.
- **Giao diện người dùng được định kiểu:** Sử dụng SCSS trong thư mục `scss`.
- **Các chức năng hỗ trợ:** Được cung cấp bởi các hàm trong thư mục `utils`.
- **Xác nhận và quay lại:** Sử dụng các component `BtnConfirm` và `BtnBack`.

## 💻 3. Cài đặt và Chạy dự án

Để chạy dự án này trên môi trường local của bạn, làm theo các bước sau:

1.  **Clone repository:**
    ```bash
    git clone <đường dẫn đến repository của bạn>
    cd dapp-bookfood
    ```

2.  **Cài đặt các dependency:**
    ```bash
    npm install
    ```

3.  **Cấu hình Smart Contract:**
    - Đặt file `abi` (từ thư mục `constract`) vào vị trí thích hợp trong `Services.js`.
    - Cập nhật `contractAddress` và `wsURL` trong file `Services.js` với thông tin của smart contract đã được deploy của bạn.

4.  **Cần có ví Metamask:**
    - Bạn cần cài đặt và có một ví Metamask.
    - **Lưu ý quan trọng:** Cần **private key của ví Metamask** để đăng nhập ứng dụng và thực hiện các giao dịch tương tác với smart contract. (***Cần lưu ý về vấn đề bảo mật khi sử dụng private key trong quá trình phát triển/kiểm thử.***)

5.  **Chạy dự án:**
    ```bash
    npm start
    ```
    Dự án sẽ được chạy trên trình duyệt của bạn tại địa chỉ `http://localhost:3000` (hoặc một cổng khác nếu được cấu hình).

## 📖 4. Hướng dẫn sử dụng

(***Trong phần này, bạn nên mô tả cách người dùng có thể tương tác với ứng dụng của bạn. Ví dụ:***)

- **Đăng nhập bằng ví Metamask:** Hướng dẫn cách kết nối ví.
- **Xem danh sách món ăn:** Mô tả cách carousel hoạt động.
- **Đặt món ăn:** (***Nếu đây là tính năng chính, hãy mô tả chi tiết.***)
- **Thực hiện thanh toán:** (***Nếu có.***)

## 📂 5. Cấu trúc thư mục

Cấu trúc thư mục của dự án được tổ chức như sau:

- `Src/`
    - `assets/`         # 🖼️ Chứa file animation, chứa ảnh động.
    - `constract/`      # 📜 Chứa file json ABI (Application Binary Interface) của smart contract (smc).
    - `context/`        # 🔄 Chứa file Redux để quản lý các global state của dự án.
    - `cpns/`           # 🧩 Chứa các **component con** có thể tái sử dụng trong toàn bộ ứng dụng.
    - `layout/`         # 🧱 Chứa các file **layout** chung cho các trang (page) hiện có.
    - `page/`           # 📄 Chứa các file **trang (page)** chính của dự án.
    - `router/`         # 🗺️ Chứa file **cấu hình route** (đường dẫn) cho ứng dụng.
    - `scss/`           # 🎨 Chứa các file **SCSS** (Sass) để định kiểu giao diện.
    - `utils/`          # 🛠️ Chứa các file **hàm hỗ trợ** (utility functions) được sử dụng trong dự án.

## 🧩 6. Mô tả một số component quan trọng

### 📂 Trong thư mục `cpns/`

- **`BlockFood`:** Component dùng để **hiển thị thông tin chi tiết của một món ăn**.
    - **Props:**
        - `food`: **Danh sách dữ liệu** của món ăn cần hiển thị.
        - `widthImage`, `heightImage`: **Kích thước (chiều rộng và chiều cao)** của hình ảnh món ăn.
        - `hightlight` (boolean): Nếu là `true`, block sẽ được **hiển thị nổi bật đặc biệt**.
        - `btn` (boolean): Nếu là `true`, sẽ **hiển thị nút bấm** trên block.

- **`BtnBack`:** Component đơn giản hiển thị một **nút bấm "Trở về"**.

- **`BtnConfirm`:** Component hiển thị một **nút bấm "Xác nhận" (Submit)**.

- **`Carousel`:** Component tạo một **slider (thanh trượt)** để hiển thị danh sách thức ăn.
    - **Props:**
        - `listfood`: **Danh sách các món ăn** cần hiển thị trong carousel.
        - `text`, `detail`: **Nội dung văn bản** có thể được thêm vào để hiển thị kèm theo.

### 🛠️ Trong thư mục `utils/`

- **`Services.js`:** Đây là file **quan trọng nhất** dùng để **kết nối và tương tác với smart contract (smc)**.
    - Bao gồm các **hàm (functions)** để gọi các phương thức trên smart contract.
    - Chứa các **biến khởi tạo** để lưu thông tin kết nối với smc:
        - `abi`: **Nơi lưu trữ nội dung của file JSON ABI** (lấy từ thư mục `constract`).
        - `contractAddress`: **Địa chỉ duy nhất của smart contract** sau khi được deploy (triển khai) lên blockchain.
        - `wsURL`: Sử dụng **địa chỉ WebSocket (ws)** để thiết lập kết nối liên tục với smart contract.
    - **Lưu ý:** Để đăng nhập ứng dụng và sử dụng các chức năng liên quan đến smart contract, bạn **cần phải có private key của ví Metamask** của mình.

---
