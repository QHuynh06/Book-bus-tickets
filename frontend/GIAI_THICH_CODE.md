# Giải thích code FE1 (để bảo vệ đồ án)

## 1. Cấu trúc thư mục `src/`
```
pages/        Mỗi trang một file (Login, Home, SearchTrips, Profile, Dashboard...)
components/   Thành phần giao diện dùng lại (TripCard, SearchForm, TripFilters, Icon...)
layouts/      Khung chung: MainLayout (khách, có menu), Fe1Scope, Admin/AdminLayout (quản trị, của main)
routes/       AppRouter (danh sách đường dẫn của cả FE1/2/3), ProtectedRoute (chặn theo đăng nhập và role)
services/     Hàm gọi API backend thật (axios dùng chung ở api/axiosClient.js)
queries/      Hook useQuery lấy dữ liệu từ server
contexts/ + hooks/useAuth.js    Thông tin đăng nhập dùng chung
utils/        Hàm tiện ích: định dạng giá/ngày, lọc/sắp xếp chuyến
styles/       CSS của app, chia thành các file nhỏ (xem mục 7)
```

## 2. Luồng chạy chính
1. `main.jsx` bọc app bằng `QueryClientProvider` (TanStack Query), `AppRouter` bọc tiếp `AuthProvider` (đăng nhập) rồi khai báo toàn bộ route.
2. **Đăng nhập**: `Login.jsx` kiểm tra form, gọi `login()` qua `useMutation`. Thành công thì `AuthProvider` lưu `token` (khóa `accessToken`), `role` (khóa `userRole`) và `user` vào `localStorage` và vào state, sau đó chuyển trang. F5 không mất đăng nhập vì đọc lại từ `localStorage`.
3. **Gọi API**: `api/axiosClient.js` (axios, dùng chung cho FE1/FE2/FE3) tự gắn `Authorization: Bearer <token>` vào mỗi request. Nếu server trả 401 thì xóa phiên và về `/login`.
4. **Tìm chuyến**: form đẩy `from, to, date` lên URL. `SearchTrips` đọc URL, gọi `useSearchTrips(from, to, date)` để lấy danh sách, rồi **lọc/sắp xếp ở phía giao diện** bằng `filterTrips` và `sortTrips`.
5. **Chặn trang**: `ProtectedRoute` kiểm tra đã đăng nhập chưa (chưa thì về `/login`, đăng nhập xong quay lại trang cũ) và kiểm tra role (`CUSTOMER` hoặc `ADMIN`).

## 3. Hai loại state (câu hỏi hay gặp)
- **Server state** (dữ liệu nằm trên server: danh sách chuyến, dashboard) dùng **TanStack Query** (`useQuery`). Thư viện lo việc cache, trạng thái đang tải/lỗi, gọi lại khi cần.
- **Client state** (chỉ tồn tại trên giao diện: ô đang nhập, bộ lọc, kiểu sắp xếp, menu mobile) dùng **`useState`**.
- Thao tác **ghi dữ liệu** (đăng nhập, đăng ký, sửa hồ sơ) dùng **`useMutation`**.

## 4. Dữ liệu
Toàn bộ dữ liệu lấy từ backend Spring Boot (cổng 8080). Không còn dữ liệu giả. Địa chỉ backend cấu hình bằng `VITE_API_BASE_URL` trong `.env`.
Dashboard gọi `/admin/dashboard`, `/admin/bookings`, `/admin/trips` rồi tự tính doanh thu, vé theo trạng thái, chuyến sắp chạy, vé gần đây (xem `services/adminService.js`).

## 5. Câu hỏi thường gặp
**Vì sao không lưu danh sách chuyến bằng useState + useEffect?**
useQuery tự xử lý loading/error/cache/gọi lại, ít code hơn và ít lỗi hơn.

**Vì sao lọc ở giao diện mà không gọi API?**
Dữ liệu đã tải về rồi, lọc ngay thì nhanh và không tốn request. Nếu danh sách rất lớn mới cần lọc ở backend.

**Lưu token ở localStorage có an toàn không?**
Dễ làm, nhưng có thể bị đánh cắp nếu trang bị lỗi XSS. Hướng an toàn hơn là cookie HttpOnly do backend đặt. Với đồ án, localStorage là chấp nhận được.

**Chặn trang bằng ProtectedRoute có đủ bảo mật không?**
Không. Đó chỉ để thân thiện với người dùng. Bảo mật thật phải do backend kiểm tra token và quyền ở mỗi API.

**Sau khi sửa hồ sơ, tên trên thanh menu đổi theo bằng cách nào?**
`Profile` gọi `updateUser(user mới)` của `AuthProvider`, state `user` đổi nên mọi component dùng `useAuth()` tự hiển thị lại.

**Vì sao dùng React Router lồng nhau (`<Outlet />`)?**
Để dùng chung layout (thanh menu, chân trang) và gom các trang cần bảo vệ dưới một `ProtectedRoute`.

## 6. Quy tắc giao diện
Không dùng emoji/icon Unicode. Icon là SVG inline trong `components/common/Icon.jsx`, dùng `<Icon name="bus" />`. Thêm icon mới: thêm một mục vào object `PATHS` của file này.

## 7. Cách tổ chức CSS
- `src/index.css`: reset cơ bản của cả dự án (của nhánh main).
- `src/styles/fe1.css`: toàn bộ style của FE1, gồm màu chủ đạo (biến `--blue`...), chữ, bố cục (`.container`, `.row`, `.grid`, `.card`), menu, nút, form, thông báo, trang chủ, kết quả tìm chuyến, dashboard.
- **Mọi luật trong `fe1.css` đều nằm trong `.fe1`** để không làm hỏng giao diện riêng của FE2/FE3 và khu admin (các luật theo thẻ như `table`, `input`, `h1` chỉ áp dụng bên trong `.fe1`).
  - `MainLayout` gắn `.fe1` cho thanh menu và chân trang.
  - `Fe1Scope` gắn `.fe1` cho các trang FE1 (Home, SearchTrips, Login, Register, Profile, 404).
  - `Dashboard` tự gắn `.fe1` vì nằm trong khung admin của main.
- Thêm style cho trang FE1 mới: viết trong `fe1.css` và bắt đầu selector bằng `.fe1 `.
