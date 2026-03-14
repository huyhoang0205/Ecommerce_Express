# ⚡ Tóm tắt: Cơ chế JWT với Public/Private Key
**JWT tao ma và RSA là thuât toán**
## 1. Bản chất của cặp khóa
- Private Key (Khóa riêng tư): Dùng để Ký (Sign). Chỉ Server tạo Token (Auth Server) giữ.
- Public Key (Khóa công khai): Dùng để Xác minh (Verify). Được chia sẻ cho các Service khác hoặc công khai trên internet.
- Mối quan hệ: Chúng là một cặp bài trùng về toán học. Chỉ có Public Key tương ứng mới giải mã hoặc kiểm chứng được chữ ký tạo ra bởi Private Key đó.
## 2. Giải đáp mâu thuẫn: "Tại sao không giữ khóa vẫn kiểm tra được?
"Mâu thuẫn biến mất khi ta hiểu quy trình Băm (Hashing) và Đối chiếu:
- Public Key không dùng để "tạo ra" chữ ký, nó dùng để mở lớp mã hóa của chữ ký nhằm lấy ra mã băm (hash) nguyên thủy mà Private Key đã đóng dấu vào.
- Nếu mã băm giải mã được khớp với mã băm của nội dung hiện tại -> Token chuẩn.
## 3. Quy trình hoạt động 4 bước
|Bước|Đối tượng|Hành động kỹ thuật|
|----|---------|------------------|
|1. Ký|Auth Server|Lấy Payload + Private Key → Tạo ra Signature. Gộp lại thành chuỗi JWT gửi cho User.|
|2. Lưu|User (Client)|Lưu JWT vào bộ nhớ (LocalStorage/Cookie) và gửi kèm mỗi Request.|
|3. Nhận|Resource Server|Nhận JWT từ User. Tách phần Payload và phần Signature riêng ra.|
|4. Verify|Resource Server|"Dùng Public Key để ""soi"" Signature. Nếu khớp với Payload → Cho phép truy cập."|