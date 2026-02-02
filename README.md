# Travel and Tour Management System

Hệ thống quản lý du lịch và tour đặt chỗ với NestJS, PostgreSQL, React, và Docker.

## 📋 Mục lục

- [Yêu cầu](#yêu-cầu)
- [Cài đặt & Khởi động](#cài-đặt--khởi-động)
- [Quy trình phát triển](#quy-trình-phát-triển)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Documentation](#api-documentation)
- [Quản lý Database](#quản-lý-database)
- [Troubleshooting](#troubleshooting)

## 🔧 Yêu cầu

- Docker Desktop (hoặc Docker + Docker Compose)
- Git
- **Không cần** Node.js, PostgreSQL cài trên máy local

## 🚀 Cài đặt & Khởi động

### 1. Clone dự án
```bash
git clone <repository-url>
cd TravelAndTour
```

### 2. Khởi động ứng dụng
```bash
# Khởi động tất cả services (PostgreSQL, Backend, Frontend, pgAdmin)
docker-compose --env-file .env.docker up -d

# Chạy database migration
docker exec -it travelandtour_backend npx prisma migrate deploy
```

### 3. Truy cập ứng dụng

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost | - |
| **Backend API** | http://localhost:3000 | - |
| **pgAdmin** | http://localhost:5050 | `admin@example.com` / `admin123` |
| **Database** | localhost:5432 | `traveltour` / `traveltour123` |

### 4. Dừng ứng dụng
```bash
# Dừng tất cả services
docker-compose --env-file .env.docker down

# Xóa volume database (cẩn thận!)
docker-compose --env-file .env.docker down -v
```

## 📝 Quy trình phát triển

### Mỗi khi sửa code Backend

**Bước 1: Sửa code**
```bash
# Ví dụ: Sửa src/auth/auth.service.ts
```

**Bước 2: Build local để check lỗi**
```bash
cd BE-TravelAndTour
npm run build
```

**Bước 3: Nếu build thành công, rebuild Docker**
```bash
cd ..
docker-compose --env-file .env.docker up -d --build
```

**Bước 4: Xem logs để kiểm tra lỗi**
```bash
docker-compose --env-file .env.docker logs backend -f
```

**Bước 5: Test API** (xem phần [API Documentation](#api-documentation))

### Mỗi khi sửa code Frontend

```bash
# Frontend sử dụng Vite, tự động reload
# Chỉ cần rebuild Docker:
docker-compose --env-file .env.docker up -d --build frontend

# Hoặc truy cập: http://localhost (đã tự động reload)
```

### Mỗi khi sửa Prisma Schema

**Bước 1: Sửa file `prisma/schema.prisma`**

**Bước 2: Tạo migration**
```bash
# Sử dụng Docker
docker exec -it travelandtour_backend npx prisma migrate dev --name <migration_name>

# Ví dụ:
docker exec -it travelandtour_backend npx prisma migrate dev --name add_tour_table
```

**Bước 3: Nếu chỉ update model (không migration)**
```bash
docker exec -it travelandtour_backend npx prisma generate
docker-compose --env-file .env.docker restart backend
```

**Bước 4: Deploy migration**
```bash
docker exec -it travelandtour_backend npx prisma migrate deploy
```

## 🏗️ Cấu trúc dự án

```
TravelAndTour/
├── BE-TravelAndTour/          # Backend NestJS
│   ├── src/
│   │   ├── auth/              # Authentication & JWT
│   │   ├── users/             # User management
│   │   ├── roles/             # Role management
│   │   ├── tours/             # Tours management
│   │   ├── bookings/          # Bookings management
│   │   ├── common/            # Shared decorators, interceptors
│   │   ├── prisma/            # Prisma service
│   │   ├── app.module.ts      # Main module
│   │   └── main.ts            # Entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Migration files
│   ├── Dockerfile
│   └── package.json
│
├── FE-TravelAndTour/          # Frontend React + Vite
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Pages
│   │   ├── api/               # API calls
│   │   └── main.jsx           # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml         # Docker configuration
├── .env.docker               # Environment variables
├── .gitignore
└── README.md
```

## 📡 API Documentation

### Authentication

**POST** `/auth/login`
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "john_doe",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Login successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe"
    }
  }
}
```

**GET** `/auth/profile` (Protected)
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Users

**POST** `/users` - Tạo user mới
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "0123456789"
  }'
```

**GET** `/users` - Lấy tất cả users
```bash
curl http://localhost:3000/users
```

**GET** `/users/:id` - Lấy user theo ID
```bash
curl http://localhost:3000/users/1
```

**PATCH** `/users/:id` - Cập nhật user
```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Updated"
  }'
```

**DELETE** `/users/:id` - Xóa user
```bash
curl -X DELETE http://localhost:3000/users/1
```

## 🗄️ Quản lý Database

### Truy cập pgAdmin
- URL: http://localhost:5050
- Email: `admin@example.com`
- Password: `admin123`

**Kết nối Database:**
1. Click "Add New Server"
2. Tab General → Name: `TravelAndTour`
3. Tab Connection:
   - Host: `postgres`
   - Port: `5432`
   - Username: `traveltour`
   - Password: `traveltour123`
   - Database: `travelandtour`
4. Click Save

### Truy cập Database qua CLI
```bash
docker exec -it travelandtour_db psql -U traveltour -d travelandtour
```

Một số lệnh SQL:
```sql
-- Xem tất cả tables
\dt

-- Xem schema user
\d "User"

-- Xem dữ liệu
SELECT * FROM "User";

-- Thoát
\q
```

### Prisma Studio (UI Prisma)
```bash
docker exec -it travelandtour_backend npx prisma studio
```

Truy cập: http://localhost:5555

## 📊 Hiển thị Logs

**Xem logs real-time tất cả services:**
```bash
docker-compose --env-file .env.docker logs -f
```

**Xem logs của service cụ thể:**
```bash
# Backend
docker-compose --env-file .env.docker logs backend -f

# Frontend
docker-compose --env-file .env.docker logs frontend -f

# Database
docker-compose --env-file .env.docker logs postgres -f

# pgAdmin
docker-compose --env-file .env.docker logs pgadmin -f
```

**Xem N dòng log gần nhất:**
```bash
docker-compose --env-file .env.docker logs backend --tail=50
```

## 🔄 Docker Workflow

### Kiểm tra status tất cả containers
```bash
docker-compose --env-file .env.docker ps
```

### Rebuild một service cụ thể
```bash
docker-compose --env-file .env.docker up -d --build backend
docker-compose --env-file .env.docker up -d --build frontend
```

### Xóa tất cả containers & volumes
```bash
docker-compose --env-file .env.docker down -v
```

### Xóa Docker images
```bash
docker rmi travelandtour-backend travelandtour-frontend
```

## 🐛 Troubleshooting

### Backend không khởi động
```bash
# Xem logs
docker-compose --env-file .env.docker logs backend -f

# Rebuild
docker-compose --env-file .env.docker up -d --build backend

# Nếu vẫn lỗi, clean và restart
docker-compose --env-file .env.docker down -v
docker-compose --env-file .env.docker up -d --build
```

### Database connection error
```bash
# Kiểm tra database đã healthy chưa
docker-compose --env-file .env.docker logs postgres

# Xóa volume và tạo lại
docker-compose --env-file .env.docker down -v
docker-compose --env-file .env.docker up -d
docker exec -it travelandtour_backend npx prisma migrate deploy
```

### Port bị chiếm dụng
Sửa file `docker-compose.yml`:
```yaml
# Thay vì "80:80" thành "8080:80"
ports:
  - "8080:80"
```

### JWT token invalid
- Kiểm tra JWT_SECRET trong `.env.docker` đúng không
- Token hết hạn? Chạy login lại

### Prisma schema lỗi
```bash
# Kiểm tra syntax
docker exec -it travelandtour_backend npx prisma validate

# Fix database schema
docker exec -it travelandtour_backend npx prisma db push --skip-generate
```

## 📚 Useful Commands

```bash
# SSH vào backend container
docker exec -it travelandtour_backend sh

# SSH vào database container
docker exec -it travelandtour_db bash

# Xem Docker image
docker images | grep travelandtour

# Xem Docker network
docker network ls

# Check disk usage by containers
docker system df
```

## 🎯 Next Steps

- [ ] Implement Role-Based Access Control (RBAC)
- [ ] Add Tour management endpoints
- [ ] Add Booking management endpoints
- [ ] Create Frontend UI
- [ ] Setup CI/CD pipeline
- [ ] Deploy to production

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Docker logs
2. Network connectivity
3. Environment variables trong `.env.docker`
4. File permissions

---

**Happy Coding! 🚀**
