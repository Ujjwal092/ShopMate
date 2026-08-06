# ShopMate

> Full-stack e-commerce web application built with React, Node.js, and Stripe.

![Build status](https://img.shields.io/github/actions/workflow/status/Ujjwal092/ShopMate/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=CI) ![GitHub stars](https://img.shields.io/github/stars/Ujjwal092/ShopMate?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/Ujjwal092/ShopMate?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/Ujjwal092/ShopMate?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/Ujjwal092/ShopMate?style=for-the-badge&logo=github)

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Deployment](#deployment)
- [Contributors](#contributors)
- [Contributing](#contributing)

## 📝 Description

ShopMate is a full-stack web application designed for online commerce, digital store management, and payment processing. Grounded in the MERN tech stack, the platform coordinates customer interactions on the frontend with backend services and database operations. The client application is built with React and Vite, utilizing Redux for centralized state management, Tailwind CSS for styling, and Framer Motion for interactive UI components. The Node.js backend initializes database connections, provisions system tables automatically at launch, manages Cloudinary media integrations, and processes user payments via Stripe. This architecture serves as a foundation for developers looking to deploy or customize a complete full-stack web application with dedicated frontend, backend, and dashboard modules.

## ✨ Key Features

- **🛒 Redux Client State Management** — Manages frontend state across React components using Redux and Redux Store.
- **💳 Stripe Payment Processing** — Handles secure transaction capabilities through Stripe integration.
- **☁️ Cloudinary Media Management** — Configures Cloudinary API credentials on the server for cloud-based media asset handling.
- **🎨 Tailwind and Framer Motion** — Delivers responsive styling using Tailwind CSS and interactive UI animations with Framer Motion.
- **🗄️ Automated Database Table Creation** — Connects to the backend database and automatically creates necessary tables upon server initialization.

## 🎯 Use Cases

- Building and deploying a full-stack e-commerce store with integrated payment gateways.
- Serving as a reference architecture for React, Redux, and Express application integration.
- Managing digital store assets and media uploads through Cloudinary API integration.

## 📸 Screenshots

## Home-Page(with chatbot)
<img width="1876" height="861" alt="Screenshot 2026-08-07 021509" src="https://github.com/user-attachments/assets/1ab1a160-994c-4895-89bc-bea000dda29d" />

## Recently - Visited Products
<img width="1884" height="826" alt="Screenshot 2026-08-07 021756" src="https://github.com/user-attachments/assets/b30ab2ed-8b73-47f2-88c1-25a398e0f7fe" />

## Testimonials & Stay-In-Loop
<img width="1869" height="849" alt="Screenshot 2026-08-07 022036" src="https://github.com/user-attachments/assets/8594525e-919a-4469-b13d-cf1c60548d43" />

## Products page
<img width="1892" height="857" alt="Screenshot 2026-08-07 022144" src="https://github.com/user-attachments/assets/adeb07a9-df82-4933-bdc7-0cec4c3cdc86" />

## AI - Search
<img width="1262" height="741" alt="Screenshot 2026-08-07 022155" src="https://github.com/user-attachments/assets/1c6a083f-27ab-4ce1-be4f-3a64aea9e6e1" />

## SideBar with Profile pannel
<img width="1886" height="864" alt="Screenshot 2026-08-07 022321" src="https://github.com/user-attachments/assets/97c00d33-4138-41ae-b7ea-c515ce6295d9" />

## My Order
<img width="1543" height="710" alt="Screenshot 2026-08-07 022521" src="https://github.com/user-attachments/assets/bbbdca65-b868-42af-8c09-4621706cb5e1" />

## Payment 
<img width="1639" height="757" alt="Screenshot 2026-08-07 022706" src="https://github.com/user-attachments/assets/980d3097-9222-4484-b2d2-268eb2b55b60" />

## Admin-Panel
<img width="1874" height="844" alt="Screenshot 2026-08-07 021110" src="https://github.com/user-attachments/assets/6c69ac41-f1db-4377-b6d5-9cd5128150ae" />

## Product - Management
<img width="1883" height="870" alt="Screenshot 2026-08-07 021339" src="https://github.com/user-attachments/assets/6665a716-9749-46b2-8e07-1aea68436a2c" />


## 🛠️ Tech Stack

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Notable libraries:** Framer Motion, Redux, Stripe

## 🏗️ Architecture

A high-level view of how the main pieces fit together:

```mermaid
flowchart TD
    User["👤 User / Browser"]
    FE["🖼️ React Frontend"]
    User --> FE
    API["⚙️ API Server"]
    FE --> API
    EXT0["🔌 Stripe"]
    API --> EXT0
```

## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/Ujjwal092/ShopMate.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

## 📦 Key Dependencies

```
@n8n/chat: ^1.7.1
@reduxjs/toolkit: ^2.11.2
@stripe/react-stripe-js: ^5.6.0
@stripe/stripe-js: ^8.7.0
axios: ^1.13.4
framer-motion: ^12.31.1
jspdf: ^4.2.1
lucide-react: ^0.563.0
motion: ^12.34.0
react: ^19.2.4
react-countup: ^6.5.3
react-dom: ^19.2.4
react-hook: ^0.0.1
react-redux: ^9.2.0
react-router-dom: ^7.13.0
```

## 🚀 Available Scripts

- **dev** — `npm run dev`
- **build** — `npm run build`
- **lint** — `npm run lint`
- **preview** — `npm run preview`

## 🌐 API Endpoints

Detected endpoints (best-effort scan):

```
POST /api/v1/payment/webhook
```

## 📁 Project Structure

```
.
├── Client
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── Cart.gif
│   │   ├── avatar-holder.avif
│   │   ├── electronics.jpg
│   │   ├── fashion.jpg
│   │   ├── favicon.jpg
│   │   ├── furniture.jpg
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── place-holder.jpg
│   │   │   ├── react.svg
│   │   │   └── sorryProd.png
│   │   ├── components
│   │   │   ├── Home
│   │   │   │   ├── CategoryGrid.jsx
│   │   │   │   ├── FeatureSection.jsx
│   │   │   │   ├── HeroSlider.jsx
│   │   │   │   ├── ImpactSection.jsx
│   │   │   │   ├── LazyImage.jsx
│   │   │   │   ├── NewsletterSection.jsx
│   │   │   │   ├── ProductSlider.jsx
│   │   │   │   ├── PromoStrip.jsx
│   │   │   │   ├── RecentlyViewed.jsx
│   │   │   │   └── TestimonialCarousel.jsx
│   │   │   ├── Layout
│   │   │   │   ├── CartSidebar.jsx
│   │   │   │   ├── ChatBot.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoginModal.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProfilePanel.jsx
│   │   │   │   ├── SearchOverlay.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   └── Products
│   │   │       ├── AISearchModal.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── ProductCard.jsx
│   │   │       ├── ReviewsContainer.jsx
│   │   │       ├── Similarproducts.jsx
│   │   │       └── WishlistButton.jsx
│   │   ├── contexts
│   │   │   └── ThemeContext.jsx
│   │   ├── data
│   │   │   └── products.js
│   │   ├── index.css
│   │   ├── lib
│   │   │   ├── abTest.js
│   │   │   ├── axios.js
│   │   │   ├── currency.js
│   │   │   └── recentlyViewed.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── About.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── Wishlist.jsx
│   │   ├── store
│   │   │   ├── slices
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── cartSlice.js
│   │   │   │   ├── orderSlice.js
│   │   │   │   ├── popupSlice.js
│   │   │   │   ├── productSlice.js
│   │   │   │   └── wishlistSlice.js
│   │   │   └── store.js
│   │   └── toast.css
│   ├── tailwind.config.js
│   └── vite.config.js
├── Server
│   ├── Dockerfile
│   ├── app.js
│   ├── babel.config.json
│   ├── config
│   │   └── swagger.js
│   ├── controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   ├── newsletterController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── stockAlertController.js
│   │   ├── testStockAlertController.js
│   │   ├── testimonialController.js
│   │   └── wishlistController.js
│   ├── database
│   │   └── db.js
│   ├── jest.config.js
│   ├── loadtest.js
│   ├── middlewares
│   │   ├── authMiddleware.js
│   │   ├── catchAsyncError.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimit.js
│   ├── models
│   │   ├── contactModel.js
│   │   ├── newsletterModel.js
│   │   ├── orderItemsTable.js
│   │   ├── ordersTable.js
│   │   ├── paymentsTable.js
│   │   ├── productReviewsTable.js
│   │   ├── productTable.js
│   │   ├── shippinginfoTable.js
│   │   ├── stockAlertModel.js
│   │   ├── testimonialModel.js
│   │   ├── userTable.js
│   │   └── wishlistModel.js
│   ├── package.json
│   ├── routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── newsletterRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── stockAlertRoutes.js
│   │   ├── testRoutes.js
│   │   ├── testimonialRoutes.js
│   │   └── wishlistRoutes.js
│   ├── server.js
│   ├── tests
│   │   ├── auth.test.js
│   │   ├── middleware.test.js
│   │   ├── order.test.js
│   │   ├── product.test.js
│   │   └── setupTests.js
│   ├── uploads
│   │   ├── tmp-1-108401781418450091
│   │   ├── tmp-1-295521781434867499
│   │   ├── tmp-1-501441781344816163
│   │   ├── tmp-2-108401781418521250
│   │   ├── tmp-3-108401781418525342
│   │   ├── tmp-4-108401781419132602
│   │   └── tmp-5-108401781419195357
│   └── utils
│       ├── createTables.js
│       ├── generateContactFormEmailTemplate.js
│       ├── generateForgotPasswordEmailTemplate.js
│       ├── generatePaymentIntent.js
│       ├── generateResetPasswordToken.js
│       ├── generateStockAlertEmailTemplate.js
│       ├── getAIRecommendation.js
│       ├── jwtToken.js
│       ├── knnRecommendation.js
│       └── sendEmail.js
└── dashboard
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   ├── favicon.jpg
    │   └── vite.svg
    ├── src
    │   ├── App.jsx
    │   ├── assets
    │   │   ├── avatar.jpg
    │   │   ├── laptop.webp
    │   │   ├── pic.webp
    │   │   └── react.svg
    │   ├── components
    │   │   ├── Dashboard.jsx
    │   │   ├── Header.jsx
    │   │   ├── Orders.jsx
    │   │   ├── Products.jsx
    │   │   ├── Profile.jsx
    │   │   ├── SideBar.jsx
    │   │   ├── Users.jsx
    │   │   └── dashboard-components
    │   │       ├── MiniSummary.jsx
    │   │       ├── MonthlySalesChart.jsx
    │   │       ├── OrdersChart.jsx
    │   │       ├── Stats.jsx
    │   │       ├── TopProductsChart.jsx
    │   │       └── TopSellingProducts.jsx
    │   ├── index.css
    │   ├── lib
    │   │   ├── axios.js
    │   │   └── helper.js
    │   ├── main.jsx
    │   ├── modals
    │   │   ├── CreateProductModal.jsx
    │   │   ├── UpdateProductModal.jsx
    │   │   └── ViewProductModal.jsx
    │   ├── pages
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Login.jsx
    │   │   └── ResetPassword.jsx
    │   └── store
    │       ├── slices
    │       │   ├── adminSlice.js
    │       │   ├── authSlice.js
    │       │   ├── extraSlice.js
    │       │   ├── orderSlice.js
    │       │   └── productsSlice.js
    │       └── store.js
    ├── tailwind.config.js
    └── vite.config.js
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

### Docker
1. `docker build -t my-app .`
2. `docker run -p 3000:3000 my-app`

## 🚢 Deployment

### Docker
```bash
docker build -t shopmate .
docker run -p 3000:3000 shopmate
```

> ⚙️ CI/CD is configured via GitHub Actions (see `.github/workflows/`).

## 👥 Contributors

Thanks to everyone who has contributed to this project:

<p align="left">
<a href="https://github.com/Ujjwal092" title="Ujjwal092"><img src="https://avatars.githubusercontent.com/u/149806888?v=4&s=64" width="64" height="64" alt="Ujjwal092" style="border-radius:50%" /></a>
</p>

[See the full list of contributors →](https://github.com/Ujjwal092/ShopMate/graphs/contributors)

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/Ujjwal092/ShopMate.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.

---

<div align="center">

[![Made with ReadmeBuddy](https://img.shields.io/badge/Made%20with-ReadmeBuddy-8B5CFF?style=for-the-badge&logo=markdown&logoColor=white)](https://readmebuddy.com)

<sub>Generate beautiful READMEs in seconds → <a href="https://readmebuddy.com">readmebuddy.com</a></sub>

</div>
