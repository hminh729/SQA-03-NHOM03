# Quy ước cấu trúc thư mục tests (cho team)

Tài liệu này dùng để cả nhóm follow thống nhất khi viết unit test.

## 1) Cấu trúc chuẩn

```text
tests/
  setup.test.js                # test verify framework (Step 1)
  unit/
    controllers/
      test_<controller>.test.js
    services/
      test_<service>.test.js
    middlewares/
      test_<middleware>.test.js
    utils/
      test_<util>.test.js
  fixtures/
    <module>.fixture.js        # dữ liệu mẫu cho test
  mocks/
    <module>.mock.js           # mock DB/API/external service
  helpers/
    testHelper.js              # hàm dùng chung cho test
```

> Có thể chưa cần tạo đủ tất cả thư mục con ngay. Viết đến đâu tạo đến đó, nhưng giữ đúng quy ước.

## 2) Quy tắc đặt tên

- File test: `test_<module>.test.js`
  - Ví dụ: `test_userService.test.js`, `test_orderController.test.js`
- Hàm test: `test_<function>_<case>`
  - Ví dụ: `test_login_success`, `test_login_wrong_password`
- Mỗi test có comment Test Case ID theo format `TC_XXX`
  - Ví dụ: `// TC_001 - Login success`

## 3) Mapping theo source code

- `src/controllers/*` → `tests/unit/controllers/*`
- `src/services/*` → `tests/unit/services/*`
- `src/middlewares/*` → `tests/unit/middlewares/*`
- `src/utils/*` → `tests/unit/utils/*`

## 4) Nội dung tối thiểu mỗi file test

Mỗi file test nên có:

1. Import module cần test
2. Mock dependency bên ngoài (DB, API, mail, ...)
3. Nhóm test bằng `describe()`
4. Có đủ:
   - Happy case
   - Edge case
   - Error case
5. Comment Test Case ID cho từng test

Ví dụ khung:

```js
// TC_001 - Example happy case
describe('userService.login', () => {
  test('test_login_success', async () => {
    // arrange
    // act
    // assert
  });
});
```

## 5) Nguyên tắc làm việc nhóm

- Mỗi người phụ trách một nhóm module (services/controllers/...)
- Không sửa test của người khác nếu chưa trao đổi
- Tạo test mới đúng thư mục theo quy ước
- Trước khi push: chạy `npm test`

## 6) Checklist trước khi merge

- [ ] Đúng thư mục (`unit/controllers`, `unit/services`, ...)
- [ ] Đúng naming convention
- [ ] Có Test Case ID trong comment
- [ ] Có đủ happy/edge/error case
- [ ] Test chạy pass local (`npm test`)
