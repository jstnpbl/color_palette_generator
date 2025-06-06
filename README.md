# 🎨 Color Palette Generator

A sleek, accessible, and responsive Color Palette Generator built with HTML, CSS, and JavaScript. Effortlessly generate beautiful color palettes based on color harmony rules (monochromatic, analogous, complementary, triadic, tetradic, or random), save your favorites, and manage palette history — all in your browser.

---

## 🚀 Features

- **Palette Types**
  - Random
  - Monochromatic
  - Analogous
  - Complementary
  - Triadic
  - Tetradic

- **Interactive Controls**
  - Base color selector
  - Palette size slider (3 to 10 colors)
  - Instant palette preview and live UI demo

- **Palette Management**
  - Save generated palettes locally (browser storage)
  - View, rename, and reuse saved palettes
  - Clear palette history

- **Export & Sharing**
  - Copy all palette colors in HEX, RGB, HSL, or CSS custom properties
  - Export palettes as CSS, JSON, or Tailwind config
  - Download palette as PNG image
  - Share palettes via unique URL

- **Accessibility & UX**
  - Modal dialogs (edit/import) are now fully centered and keyboard accessible
  - Contrast checker for WCAG AA compliance
  - Dark mode toggle
  - Responsive, modern UI with smooth transitions

- **Favicon & PWA Ready**
  - Includes a full set of favicons and manifest for cross-device support

---

## 🛠️ Technologies Used

- **HTML5** – Semantic structure
- **CSS3** – Responsive design, animations, and layout
- **JavaScript** – Dynamic palette generation, modals, and localStorage

---

## 📂 Project Structure

```
📁 Color Palette Generator
├── index.html
├── style.css
├── app.js
├── favicon/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── site.webmanifest
│   └── ... (other favicon assets)
└── README.md
```

---

## 📸 Screenshots

![Screenshot of Color Palette Generator UI](https://github.com/user-attachments/assets/86a1c64b-b094-4ce5-81fc-41026ef19cb2)

---

## 📦 Installation & Usage

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/color-palette-generator.git
   ```
2. **Open `index.html` in any modern web browser.**

> No build tools or server required — it's 100% frontend and self-contained.

---

## 🧩 Favicon & Manifest Integration

To ensure your app looks great on all devices and platforms, include all files from the `favicon/` folder and reference them in your `<head>`:

```html
<link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="favicon/apple-touch-icon.png">
<link rel="manifest" href="favicon/site.webmanifest">
<link rel="shortcut icon" href="favicon/favicon.ico">
```

---

## 💡 Recent Improvements

- Improved modal centering and accessibility for import/edit dialogs
- Enhanced CSS structure for maintainability and consistency
- UI polish: better button styles, transitions, and dark mode support
- Added guidance for favicon usage and PWA readiness
- Improved color contrast checker and accessibility features

---

## 💡 Future Enhancements

- Export palettes to design tools (Figma, Adobe XD)
- More advanced accessibility features
- Palette import/export via file
- User authentication for cloud palette sync

---

## 🧠 Inspiration

This project was created to explore color theory programmatically and provide a handy tool for developers and designers seeking quick, customizable palette ideas.

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).
