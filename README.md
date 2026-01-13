## 🌿 Active Amla Products

A full-stack role-based e-commerce & order management system built for Active Amla Products, supporting Users, Traders (Wholesale), and Admin workflows.

# This platform allows:
- Retail users to browse products
- Traders to place bulk orders at wholesale prices
- Admins to manage products, approve orders, and generate bills

## 🚀 Tech Stack

- Frontend
1. Next.js 15 (App Router)
2. React + TypeScript
3. Tailwind CSS
4. Lucide Icons

- Backend
1. Next.js API Routes
2. JWT Authentication
3. Middleware-based Role Protection

- Database
1. PostgreSQL
2. Prisma ORM
* 👥 User Roles & Features
* 👤 USER

## Browse products

- View retail prices
- Contact via WhatsApp

# 🧑‍💼 TRADER (Wholesale)

1. Login with trader role
2. View wholesale product prices
3. Place bulk orders
4. View order history
5. View generated bills
- Access payment details (UPI / bank info)

# 🛠️ ADMIN

1. Secure admin dashboard
2. Create / update products
3. View all orders
4. Approve trader orders

- Create bills with:
1. Base amount
2. Transport charges
3. Extra charges
4. Discounts
5. Mark bills as Paid

- Manage users & traders

- 🧾 Order & Billing Flow
```
Trader places bulk order
Order status → REQUESTED
Admin approves order → APPROVED
Admin creates bill → PENDING
Trader pays offline (UPI / Bank)
Admin marks bill → PAID

```

## 🔐 Authentication & Security

- JWT stored in HTTP-only cookies
- Role-based access via Next.js Middleware

# Protected routes:

```
/admin/*
/trader/*
/api/admin/*
/api/traders/*

```

## 🗂️ Prisma Schema Highlights

```
User (USER / TRADER / ADMIN)
Product (Retail & Wholesale pricing)
Order
OrderItem
Bill

```

## ⚙️ Setup Instructions
# 1️⃣ Clone Repository
```
git clone https://github.com/codewithadityaj/Active_Amla_Products.git
cd Active_Amla_Products
```

# 2️⃣ Install Dependencies
```
npm install
```

# 3️⃣ Environment Variables (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/active_products
JWT_SECRET=your_super_secret_key
```

# 4️⃣ Prisma Setup
```
npx prisma generate
npx prisma db push
```

# 5️⃣ Run Development Server
```
npm run dev
```

## App runs at:
- 👉 http://localhost:3000

## 📁 Project Structure (Simplified)

```

app/
 ├─ api/
 │   ├─ auth/
 │   ├─ admin/
 │   └─ traders/
 ├─ admin/dashboard/
 ├─ trader/dashboard/
 ├─ products/
 └─ login/
lib/
 ├─ prisma.ts
 └─ auth.ts
components/
 ├─ admin/
 └─ ui/

```

## 📌 Key Highlights

- ✔ Role-based dashboards
- ✔ Wholesale ordering system
- ✔ Manual billing (business-friendly)
- ✔ Secure authentication
- ✔ Scalable architecture
- ✔ Production-ready structure

## 🧑‍💻 Author
```
Aditya Ashok Jadhav
📍 Maharashtra, India
🔗 GitHub: codewithadityaj
```

## 📄 License

This project is licensed for educational & internal business use.
