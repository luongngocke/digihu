# Hướng dẫn kết nối Google Sheets

Để sử dụng Google Sheets làm cơ sở dữ liệu cho ứng dụng, bạn cần làm theo các bước thiết lập cấu trúc bảng tính (Google Sheet) và mã Google Apps Script (đã được tạo sẵn trong file `Code.gs` ở cây thư mục bên trái).

## 1. Thiết lập cấu trúc các Sheet
Hãy tạo một file Google Sheet mới và tạo ra 4 Trang tính (Sheets) với ĐÚNG tên như sau:

### Sheet 1: `Transactions` (Quản lý giao dịch)
Tạo các cột ở hàng đầu tiên (Hàng 1) với tên như sau:
* **id** (Mã ID giao dịch - Cột A)
* **date** (Ngày giao dịch - Cột B)
* **amount** (Số tiền - Cột C)
* **category** (Hạng mục - Cột D)
* **note** (Ghi chú - Cột E)
* **type** (Loại: `income` hoặc `expense` - Cột F)
* **walletId** (ID Ví - Cột G)

### Sheet 2: `Wallets` (Quản lý ví / tài khoản)
Tạo các cột ở hàng đầu tiên (Hàng 1) với tên như sau:
* **id** (Mã ID ví - Cột A)
* **name** (Tên ví/ngân hàng - Cột B)
* **balance** (Số dư tài khoản - Cột C)
* **isDefault** (Có phải mặc định không: `TRUE`/`FALSE` - Cột D)

### Sheet 3: `Debts` (Quản lý các khoản Vay/Nợ)
Tạo các cột ở hàng đầu tiên (Hàng 1) với tên như sau:
* **id** (Mã ID khoản nợ - Cột A)
* **person** (Người liên quan - Cột B)
* **amount** (Số tiền - Cột C)
* **type** (Loại: `borrow` hoặc `lend` - Cột D)
* **date** (Ngày ghi nợ - Cột E)
* **note** (Ghi chú khoản nợ - Cột F)

### Sheet 4: `Settings` (Cài đặt)
Tạo các cột ở hàng đầu tiên (Hàng 1) với tên như sau:
* **key** (Tên cài đặt - Cột A)
* **value** (Giá trị - Cột B)

---

## 2. Thêm Script vào Google Sheets

1. Mở file Google Sheets vừa tạo.
2. Trên thanh menu, chọn **Tiện ích mở rộng > Apps Script (Extensions > Apps Script)**.
3. Trong trình chỉnh sửa Apps Script, hãy xóa trắng nội dung có sẵn (`function myFunction() {...}`).
4. Mở file `Code.gs` trong cây thư mục bên trái màn hình giao diện này, **copy toàn bộ nội dung** dán sang vùng làm việc của trình chỉnh sửa Apps Script.
5. Sửa tên dự án (phía trên cùng bên trái) thành "SheetMoney API" theo ý thích.
6. Bấm phím **Ctrl + S** (hoặc Cmd + S trên Mac) để lưu file.

---

## 3. Triển khai Ứng dụng Web (Deploy)

1. Ở góc trên cùng bên phải cửa sổ Apps Script, bấm vào nút màu xanh **Bắt đầu triển khai (Deploy) > Triển khai mới (New deployment)**.
2. Ở cột bên trái của popup, bấm vào biểu tượng "Bánh răng" (Select type) và chọn **Ứng dụng web (Web app)**.
3. Trong ô cấu hình:
    * **Mô tả (Description):** Cập nhật v1
    * **Thực thi dưới dạng (Execute as):** Chọn "Tôi" (Me).
    * **Người có quyền truy cập (Who has access):** CHỌN MỤC TÙY CHỌN **"Bất kỳ ai" (Anyone)**. (Rất quan trọng, nếu không thì App không fetch được data đâu).
4. Bấm **Triển khai (Deploy)**.
5. (Lần đầu tiên) Google sẽ yêu cầu "Cấp quyền truy cập", bạn hãy đăng nhập Google, chọn Advanced (Nâng cao) -> Go to App (Không an toàn) -> Allow (Cho phép).
6. **Sao chép URL Ứng dụng web (Web App URL)**, và dán URL này vào hàm fetch API trong ứng dụng Frontend của bạn.

Bây giờ bạn đã có API sử dụng Google Sheet làm Database để tiến hành gọi GET/POST!
