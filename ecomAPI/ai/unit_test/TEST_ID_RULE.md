# Quy tắc đặt tên Test Case ID

Tài liệu này mô tả quy ước đặt `Test Case ID` để tránh trùng lặp giữa các file test.

## 1) Mục tiêu

- Mỗi test case có ID **duy nhất** trong toàn project.
- Nhìn vào ID biết ngay test thuộc module nào.
- Dễ mapping với report/test case Excel.

## 2) Format chuẩn

```text
TC_<module>_<number>
```

Trong đó:

- `<module>`: tên module/controller viết theo camel/lower style (không dấu, không khoảng trắng)
- `<number>`: số thứ tự 3 chữ số, bắt đầu từ `001`

## 3) Ví dụ đang áp dụng

- `TC_addressUser_001`
- `TC_allcode_001`
- `TC_comment_001`
- `TC_interaction_001`
- `TC_message_001`
- `TC_product_001`

## 4) Quy tắc đánh số

- Đánh số tăng dần trong **từng file test**: `001`, `002`, `003`, ...
- Không tái sử dụng số đã dùng trong cùng file.
- Khi thêm test mới, dùng số kế tiếp.

## 5) Nơi bắt buộc xuất hiện ID

Mỗi test case phải có ID ở cả 2 vị trí:

1. Comment ngay phía trên test
2. Tên test (`test(...)`)

Ví dụ:

```js
// TC_addressUser_001: Kiểm tra tạo địa chỉ người dùng thành công.
test('TC_addressUser_001 - createNewAddressUser should return service data', async () => {
  // test logic
});
```

## 6) Quy tắc cho test lỗi (error case)

- Có thể dùng cùng ID chính và thêm hậu tố mô tả trong tên test.
- Ví dụ: `TC_product_001_ERR` (nếu team muốn tách rõ happy/error).
- Nếu không dùng hậu tố, tạo ID mới riêng cho error case cũng được, miễn nhất quán trong file.

## 7) Checklist nhanh trước khi commit

- [ ] ID đúng format `TC_<module>_<number>`
- [ ] Không trùng ID trong cùng file
- [ ] Có ID ở comment và tên test
- [ ] Số thứ tự liên tục, dễ theo dõi
