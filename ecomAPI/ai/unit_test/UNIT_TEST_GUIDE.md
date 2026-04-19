# Unit Testing Guide & Report Checklist

## 1. Tools and Libraries

Xác định framework test theo ngôn ngữ:

* JavaScript → Jest (+ Mocha nếu cần)

### Việc cần làm:

* Tạo thư mục `tests/`
* Cài đặt thư viện test
* Chạy thử một test đơn giản để verify setup

---

## 2. Scope of Testing

### 2.1. Các thành phần CẦN test

* Business logic (hàm xử lý chính)
* Service / Class xử lý dữ liệu
* API handler (nếu có)

**Ví dụ:**

```
UserService.py
PaymentService.py
utils/validator.py
```

---

### 2.2. Các thành phần KHÔNG cần test

* UI / frontend
* Code auto-generated
* Getter/setter đơn giản

**Yêu cầu:**
Phải giải thích lý do trong report.

---

## 3. Unit Test Cases (Excel)

### Format:

| Test Case ID | Class/File | Test Objective | Input | Expected Output | Notes |
| ------------ | ---------- | -------------- | ----- | --------------- | ----- |

### Ví dụ:

| TC_001 | UserService | Kiểm tra login đúng | username=abc, pass=123 | True | valid case |
| TC_002 | UserService | Sai mật khẩu | abc, 999 | False | invalid |

### Lưu ý:

* Phải có:

  * Happy case
  * Edge case
  * Error case

---

## 4. Unit Test Scripts

### Ví dụ (PyTest):

```python
# TC_001 - Test login thành công
def test_login_success():
    result = login("abc", "123")
    assert result == True
```

### Yêu cầu:

* Có comment chứa Test Case ID
* Tên hàm rõ nghĩa
* Code dễ đọc, có comment

---

## 5. Database Testing (Nếu có DB)

### CheckDB:

* Verify dữ liệu sau khi chạy function

### Rollback:

* Đảm bảo DB quay lại trạng thái ban đầu sau test

### Cách làm:

* Dùng transaction + rollback
* Hoặc mock database (khuyến khích)

---

## 6. Project Link

* Upload code lên GitHub
* Cung cấp link repo

---

## 7. Execution Report

### Nội dung:

* Số test pass / fail

**Ví dụ:**

```
10 passed, 2 failed
```

### Yêu cầu:

* Chụp màn hình kết quả chạy test

---

## 8. Code Coverage Report

### Python example:

```
pip install coverage
coverage run -m pytest
coverage report
coverage html
```

### Yêu cầu:

* Báo % coverage
* Chụp màn hình kết quả

---

## 9. References + Prompts

### Tài liệu:

* Official docs (PyTest, JUnit,...)
* StackOverflow

### Prompt AI:

```
Write unit test for login function using pytest
```

---

## 10. Workflow tổng thể

1. Setup test framework
2. Xác định scope test
3. Viết test case (Excel)
4. Viết test script
5. Xử lý database (nếu có)
6. Push GitHub
7. Run test + screenshot
8. Generate coverage
9. Hoàn thiện report

---

## 11. Lỗi thường gặp

* Không map test script với Test Case ID
* Không rollback DB
* Coverage thấp
* Thiếu edge case
* Test chỉ toàn happy case

---

## 12. Gợi ý sử dụng AI

Bạn có thể dùng AI để:

* Sinh test case từ code
* Viết test script tự động
* Generate mock data
* Phân tích coverage

### Ví dụ prompt:

```
Generate pytest test cases for this function including edge cases and error handling
```

---

## 13. Naming Convention

* File: `test_<module>.py`
* Function: `test_<function>_<case>`
* Test Case ID: `TC_XXX`

---
