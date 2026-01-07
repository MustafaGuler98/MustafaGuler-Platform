# MustafaGuler.Platform

![Status](https://img.shields.io/badge/Status-Under_Development_-orange)
![.NET](https://img.shields.io/badge/.NET-10-purple)
![Next.js](https://img.shields.io/badge/Next.js-15_-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

**MustafaGuler.Platform** is a scalable, modular personal portal designed to represent my digital footprint. Instead of relying on standard CMS solutions, this system is custom-engineered to unify my articles, personal curation, and professional portfolio in a single, high-performance environment. Built upon modern software architecture principles using .NET backend, it utilizes Next.js to ensure optimal SEO performance and speed.
 
> The project is currently deployed at [mustafaguler.me](https://mustafaguler.me).  
> Live environment is currently running an older version.

---

## 🏗 Architecture & Tech Stack

The project operates as a **Monorepo**, managing both the .NET backend and Next.js frontend in a single repository.

*   **Backend:** .NET 10, Onion Architecture, EF Core, AutoMapper, FluentValidation.
*   **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI.
*   **Database:** PostgreSQL.
*   **Logging:** Serilog
*   **Infrastructure:** Docker, Nginx, Hetzner VPS.

---

## 🌟 Key Features

*   **Standardized API:** Global Response Wrapper for consistent JSON responses.
*   **Secure Auth:** Stateless JWT Authentication with Access/Refresh token rotation.
*   **Localization Ready:** Database schema designed with `GroupId` logic to support future multi-language content without JSON columns.
*   **Clean Code:** Strict adherence to SOLID principles and Clean Architecture.

---

## 📂 Project Structure

```bash
MustafaGuler-Platform/
├── backend/
│   ├── MustafaGuler.API/        # Controllers
│   ├── MustafaGuler.Core/       # Domain entities, Interfaces
│   ├── MustafaGuler.Service/    # Business logic
│   └── MustafaGuler.Repository/ # Database context, Migrations
├── frontend/
│   ├── src/app/                 # Next.js App Router pages
│   ├── src/components/          # Reusable UI components
│   └── public/                  # Static assets
└── nginx/                       # Proxy configurations
```
---

### 📬 Contact



Website: [mustafaguler.me](https://mustafaguler.me)

Mail: mail.mustafaguler@gmail.com
