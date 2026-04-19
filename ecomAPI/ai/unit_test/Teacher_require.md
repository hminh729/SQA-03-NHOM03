# Quy định viết Unit Test & Code

## 1. Comment trong mã nguồn
- Cung cấp comment chi tiết để đảm bảo mã nguồn dễ hiểu.
- Giải thích rõ:
  - Mục đích của hàm
  - Logic xử lý chính
  - Các trường hợp đặc biệt (edge cases)

---

## 2. Comment Test Case ID
- Mỗi script test phải bao gồm comment xác định **Test Case ID** tương ứng.

**Ví dụ:**
```js
// TC_001: Kiểm tra tạo user thành công
test('should create user successfully', () => {
  // test logic
});