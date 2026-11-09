# 🚗 Real-Time Vehicle Speed Estimation System

> **Hệ thống thị giác máy tính ước lượng tốc độ phương tiện giao thông từ camera đường phố / thiết bị di động.**

## 📖 Giới thiệu
Dự án nghiên cứu và triển khai mô hình đo lường, ước lượng vận tốc của các phương tiện lưu thông trên đường (ô tô, xe máy) dựa trên video stream. Hệ thống phân tích chuyển động giữa các frame liên tiếp, hiệu chuẩn toạ độ thực tế và hiển thị tốc độ ước tính.

## 📁 Cấu trúc dự án
```
├── devices/             # Cấu hình và kết nối các thiết bị ngoại vi
├── phone/               # Ứng dụng/kịch bản ghi hình từ điện thoại di động
├── server/              # Máy chủ xử lý trung tâm và thuật toán phân tích
├── layout/              # Giao diện giám sát luồng giao thông
└── document/            # Tài liệu thiết kế hệ thống, sơ đồ luồng dữ liệu (drawio, docx)
```

## ✨ Luồng hoạt động (Data Flow)
1. **Thu nhận video**: Camera giám sát hoặc camera điện thoại truyền luồng video về server.
2. **Phát hiện & bám vết (Detection & Tracking)**: Định vị bounding box phương tiện và duy trì ID qua các khung hình.
3. **Hiệu chuẩn hình học (Perspective Transform)**: Chuyển đổi toạ độ pixel trong ảnh sang toạ độ mặt đường thực tế (mét).
4. **Tính toán tốc độ**: Tính quãng đường di chuyển chia cho khoảng thời gian giữa các frame để đưa ra vận tốc (km/h).

## 🚀 Hướng dẫn khởi chạy
Xem chi tiết sơ đồ thiết kế trong thư mục `document/` và làm theo hướng dẫn trong `server/` để cấu hình luồng RTSP / video đầu vào.
