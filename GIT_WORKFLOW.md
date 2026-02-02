# 🌳 Git Workflow - Cơ Bản

## 📋 Tên nhánh

```
feature/<tên-feature>
fix/<tên-bug>
```

Ví dụ:
```
feature/booking-system
feature/payment-integration
fix/tour-filter-bug
```

## 💬 Commit Message

```
<type>: <mô tả ngắn>
```

| Type | Ví dụ |
|------|-------|
| `feat:` | `feat: add booking API` |
| `fix:` | `fix: resolve payment error` |
| `refactor:` | `refactor: clean up code` |
| `docs:` | `docs: update README` |

✅ Tốt: `feat: add tour category filter`  
❌ Xấu: `fixed bug`, `update`, `changes`

## 🔄 Workflow cơ bản

```bash
# 1. Tạo nhánh mới từ develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 2. Sửa code, commit
git add .
git commit -m "feat: add booking API"

# 3. Push lên
git push -u origin feature/your-feature-name

# 4. Tạo Pull Request trên GitHub
# Title: "feat: add booking API"
# Description: Mô tả ngắn gọn cái gì được thêm

# 5. Sau khi approve & merge
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```
