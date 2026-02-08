# HUST Streaming Platform

Hệ thống phát trực tiếp và lưu trữ video sử dụng kiến trúc Microservices đơn giản hóa với Docker.
Dự án bao gồm tính năng đăng nhập xác thực sinh viên, phát luồng trực tiếp từ OBS và upload video tự động chuyển mã sang chuẩn HLS.

## Tính năng chính

* **Xác thực người dùng:** Đăng nhập thông qua API xác thực của HUST (toolhub)
* **Live streaming:** Server nhận luồng RTMP (từ OBS) và phát lại dưới dạng HLS (với độ trễ thấp)
* **Video on Demand (VOD):**
    * Upload file video '.mp4'.
    * Tự động xử lý (Transcode) sang HLS (`.m3u8`) bằng FFmpeg.
    * Xem lại video ngay trên trình duyệt.
* **Hạ tầng:** Đóng gói Backend và Media Server bằng Docker.

## Công nghệ sử dụng

* **Frontend:** ReactJS (Vite), Hls.js
* **Backend:** Node.js, Express, Multer, Fluent-FFmpeg
* **Media Server:** MediaMTX (Docker)
* **Containerization:** Docker & Docker Compose

## Yêu cầu cài đặt (Prerequisites)

Để chạy được dự án này, máy tính của bạn cần cài đặt:
1.  [Docker Desktop](https://www.docker.com/products/docker-desktop) (Để chạy Backend & Media Server)
2.  [Node.js](https://nodejs.org/) (Để chạy Frontend)
3.  [OBS Studio](https://obsproject.com/) (Để giả lập luồng livestream)

## Hướng dẫn cài đặt & Khởi chạy

### Bước 1: Khởi động Backend & Media Server
Mở terminal tại thư mục gốc của dự án và chạy:

docker-compose up -d

Lệnh này sẽ tự động tải các image cần thiết, cài đặt FFmpeg và khởi động server tại cổng 3000 (API) và 8888 (HLS).

### Bước 2: Khởi động Frontend
Mở một terminal khác, di chuyển vào thư mục frontend:

cd frontend
npm install  # Chỉ cần chạy lần đầu
npm run dev

Truy cập giao diện Web tại: http://localhost:5173

### Bước 3: Cấu hình OBS Studio (dùng cho livestream)
Mở OBS Studio và cấu hình như sau:

* Settings -> Stream
* Service: Custom
* Server: rtmp://localhost:1935
* Stream Key: live
* Nhấn Start Streaming.

## Hướng dẫn sử dụng:

### 1: Đăng nhập: 
Sử dụng tài khoản email sinh viên HUST và mật khẩu tương ứng (Hệ thống gọi API thực tế để kiểm tra).

### 2: Xem Live Stream: 
Sau khi đăng nhập, nếu OBS đang chạy, video sẽ tự động phát.

### 3: Upload Video:
Chọn file .mp4 từ máy tính.
Nhấn Upload. Hệ thống sẽ xử lý ngầm và chuyển hướng player sang video vừa tải lên.

