# Docker Setup Guide

Hướng dẫn thiết lập dự án với Docker Compose.

## Yêu cầu

- Docker Desktop (hoặc Docker + Docker Compose)
- Không cần cài đặt Node.js, PostgreSQL trên máy local

## Cấu trúc

Dự án bao gồm 3 services:
- **PostgreSQL**: Database (port 5432)
- **Backend (NestJS)**: API Server (port 3000)
- **Frontend (React/Vite)**: Web Application (port 80)

## Hướng dẫn sử dụng

### 1. Khởi động dự án

```bash
# Từ thư mục gốc của dự án
docker-compose up -d
```

Các service sẽ tự động:
- Xây dựng (build) các image
- Tạo container
- Chạy database migration
- Khởi động tất cả các service

### 2. Truy cập ứng dụng

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### 3. Kiểm tra trạng thái

```bash
# Xem logs
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 4. Dừng ứng dụng

```bash
# Dừng các container
docker-compose down

# Xóa cả volume (database)
docker-compose down -v
```

### 5. Rebuild images

```bash
# Rebuild mà không dùng cache
docker-compose up -d --build --no-cache

# Rebuild chỉ backend
docker-compose up -d --build backend
```

## Cấu hình Database

Mặc định:
- **Username**: traveltour
- **Password**: traveltour123
- **Database**: travelandtour

Để thay đổi, chỉnh sửa file `.env.docker` trước khi chạy:

```env
DB_USER=username_của_bạn
DB_PASSWORD=password_của_bạn
DB_NAME=tên_database
```

Sau đó load lại:
```bash
docker-compose down -v
docker-compose up -d
```

## Chạy lệnh trong container

```bash
# SSH vào backend container
docker exec -it travelandtour_backend sh

# Chạy command Prisma
docker exec -it travelandtour_backend npx prisma migrate deploy
docker exec -it travelandtour_backend npx prisma studio

# SSH vào database container
docker exec -it travelandtour_db psql -U traveltour -d travelandtour
```

## Troubleshooting

### Container không khởi động
```bash
docker-compose logs <service_name>
```

### Database connection error
- Chắc chắn service postgres đã ready (kiểm tra logs)
- Kiểm tra environment variables trong docker-compose.yml

### Port bị chiếm dụng
```bash
# Thay đổi port trong docker-compose.yml
# Ví dụ: "8000:3000" thay vì "3000:3000"
```

### Xóa mọi dữ liệu và bắt đầu lại
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## Development Mode

Để phát triển với hot-reload:

1. Sửa `docker-compose.yml` - Backend service:
```yaml
command: npm run start:dev
volumes:
  - ./BE-TravelAndTour/src:/app/src
  - ./BE-TravelAndTour/dist:/app/dist
```

2. Frontend đã hỗ trợ hot-reload qua Vite
