# 📚 The Koloqwa Dictionary (Frontend)

The Koloqwa Dictionary frontend is a modern, responsive web application that allows users to search Liberian local language words and phrases without login, and contribute entries through a clean submission system.

---

## 🚀 Features

### 🌍 Public Dictionary Access
- Search words and meanings
- Search phrase glossary
- Fast, mobile-friendly UI
- No authentication required for browsing

### 👤 Contribution Access
- User registration & login
- Submit new words and phrases
- View submission status

---

## 🏗️ Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Fetch API (backend integration)

---

## 🔌 API Integration

This frontend connects to the Koloqwa Dictionary backend API:

- `GET /dictionary/search`
- `GET /phrases/search`
- `POST /auth/login`
- `POST /auth/register`
- `POST /submissions`

Environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
