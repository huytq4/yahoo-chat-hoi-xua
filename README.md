# Yahoo! Chat Hồi Xưa — chat thật với bạn bè, phong cách Yahoo Messenger

Ứng dụng chat thời gian thực: bạn bè vào cùng 1 link là thấy nhau trong Buddy List,
chat phòng chung hoặc nhấp đúp vào tên để chat riêng 1-1. Có BUZZ!!! rung cửa sổ,
emoticon kiểu cũ (`:)`, `:D`, `<3`), báo "đang gõ...", đổi trạng thái Available / Busy / Away
và dòng trạng thái. Không cần tài khoản, không cần database — chỉ cần gõ nick là chat.

## Tính năng
- 3 phòng chat: Phòng Việt Nam, Cà Phê 8x 9x, Tâm Sự Đêm Khuya (giữ 50 tin gần nhất cho người mới vào)
- Buddy List = danh sách người thật đang online, kèm avatar + dòng trạng thái
- Chat riêng 1-1, có thông báo tin chưa đọc
- BUZZ!!! — rung cửa sổ + âm thanh cho cả phòng hoặc 1 người
- Giao diện cửa sổ tím Yahoo Messenger trên nền Windows XP-era

## Biến thành app trên điện thoại (PWA — không cần App Store/CH Play)
App đã tích hợp sẵn chuẩn PWA. Sau khi có link trên mạng, bạn chỉ cần **gửi link đó cho bạn bè**:
- **Android (Chrome):** mở link → bấm nút **"📲 Cài thành app trên điện thoại"** trong app (hoặc menu ⋮ → Cài ứng dụng) → icon **Y! Chat Xưa** hiện ngoài màn hình chính, mở lên là giao diện app toàn màn hình.
- **iPhone (Safari):** mở link → nút Chia sẻ → **Thêm vào Màn hình chính** → có icon app như ứng dụng thường.
- Máy tính (Chrome/Edge) cũng cài được thành app qua biểu tượng cài đặt trên thanh địa chỉ.

Lưu ý quan trọng: app chỉ là "cái vỏ" — bạn bè chat được với nhau là nhờ **server ở giữa chạy 24/7**.
Gửi file cho nhau mà không có server đang chạy trên mạng thì không ai kết nối được với ai,
nên bước đưa server lên host (mục dưới) là bắt buộc làm trước, làm 1 lần duy nhất.

## Chạy thử trên máy của bạn
```
npm install
npm start
```
Mở http://localhost:3000 — muốn thử 2 người, mở thêm 1 tab ẩn danh và gõ nick khác.

## Đưa lên mạng cho bạn bè vào chat (chọn 1)

### Cách 1 — Render (dễ nhất, có gói miễn phí)
1. Đẩy thư mục này lên 1 repo GitHub của bạn.
2. Vào render.com → New → Web Service → nối repo đó.
3. Build Command: `npm install` — Start Command: `npm start` — Instance Type: Free.
4. Deploy xong Render cho 1 đường link dạng `https://ten-cua-ban.onrender.com` — gửi link đó cho bạn bè.
   (Gói free của Render cho máy ngủ sau một lúc không ai dùng, người đầu tiên vào lại phải chờ khoảng 30–60 giây để máy thức dậy.)

### Cách 2 — Railway / Fly.io / VPS của bạn
- Railway: New Project → Deploy from GitHub repo, Railway tự chạy `npm start`.
- VPS: `npm install && npm start` (nên chạy sau reverse proxy như Caddy/Nginx để có HTTPS), mở port của app.

## Lưu ý
- Tin nhắn chỉ giữ trong RAM của server: tắt/khởi động lại server là lịch sử phòng chat mất, đúng chất Yahoo xưa.
- Đây là bản cho nhóm bạn bè tin cậy: chưa có mật khẩu, chưa có quản trị viên/xoá tin. Đừng đăng link công khai ra chỗ đông người lạ.
- Muốn thêm phòng, sửa mảng `ROOMS` ở đầu file `server.js`.
