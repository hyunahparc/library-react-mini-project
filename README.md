# 📚 Book Library React App (Book Lovers' Library)


A **React** app for browsing books using **Open Library API**, with **React Query** for data fetching, **mock API** support using **MSW**, and **Playwright** for end-to-end testing,

---

## 🔗 Live Demo
[**book-lovers-library.netlify.app**](https://book-lovers-library.netlify.app)

---

## 🖱️ Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Data Fetching:** React Query
- **Styling:** Tailwind CSS, React Bootstrap
- **API Mocking:** MSW (Mock Service Worker)
- **Routing:** React Router v6
- **Testing:** Playwright

---

## 🔧 Features
- **Search books** by title, author, year of publication or subject
- **Book detail** pages with author, cover image, description, subjects
- **Wikipedia description** integration for short open library API description
- **Pagination** for search results
- **Carousels** for books
- **Mock API** support with MSW
- **UI Tests** using Playwright

---

## 🚀 Getting Started

### 1. You can either:
Clone the repository:
```bash
git clone https://github.com/hyunahparc/library-react-mini-project.git
```
Or use the provided project files directly.

### 2. Install dependencies

```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

---

## 🍡 Mock API (MSW)

- Mock handlers are located in src/mocks/handlers.ts
- Fixture data is in src/mocks/fixtures/
- MSW intercepts API requests in development mode.
- To toggle mock mode:
comment out worker.start() in src/mocks/browser.ts

---

## 👓 Testing
Playwright UI Tests
```bash
npx playwright test --ui
```
- Tests located in tests/
- Example: Home page, search page, advanced search page, book detail page

---

## ⌨️ Available Scripts
```bash
npm run dev               # Start dev server
npx playwright test --ui  # Run Playwright UI tests
```

---

## 🗂️ Project Structure
```bash
src/
├─ components/
├─ layout/        
├─ mocks/            
├─ pages/
├─ tests/       
├─ App.tsx            
├─ main.tsx          
├─ route.ts   
```