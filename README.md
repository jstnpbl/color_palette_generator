# 🎨 Color Palette Generator

A sleek, accessible, and responsive Color Palette Generator built with HTML, CSS, and JavaScript. Effortlessly generate beautiful color palettes based on color harmony rules (monochromatic, analogous, complementary, triadic, tetradic, or random), save your favorites, and manage palette history — all in your browser.

---

## 🚀 Features

- **Palette Generation**
  - Generate palettes using color harmony rules: Random, Monochromatic, Analogous, Complementary, Triadic, Tetradic
  - Choose a base color and palette size (3–10 colors)
  - Live preview of palette applied to sample UI components

- **Palette Management**
  - Save palettes to browser storage
  - View, rename, and delete saved palettes
  - Drag-and-drop to reorder colors in a palette
  - Lock individual colors to keep them unchanged during regeneration

- **Editing & Importing**
  - Edit any color in a palette via a modal (HEX and HSL controls)
  - Import palettes by pasting HEX codes or JSON arrays (supports comma, space, or newline separation)

- **Export & Sharing**
  - Copy all palette colors in HEX, RGB, HSL, or CSS custom properties
  - Export palettes as CSS, JSON, or Tailwind config
  - Download palette as a PNG image
  - Share palettes via unique URL (palette encoded in the link)

- **Accessibility & UX**
  - Modal dialogs (edit/import) are fully centered and keyboard accessible
  - Contrast checker for WCAG AA compliance between palette colors
  - Dark mode toggle for comfortable viewing
  - Responsive, modern UI with smooth transitions
  - All controls and actions are accessible via keyboard and screen readers

- **Favicon & PWA Ready**
  - Includes a full set of favicons and manifest for cross-device and PWA support

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

## 📸 Screenshot

![image](https://github.com/user-attachments/assets/f9783992-d88d-49f4-b287-596402bd65b7)

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

This project began as a simple color palette generator built out of curiosity and a desire to experiment with color theory. One day, while feeling bored and looking for a creative challenge, I decided to revisit and level up my basic palette tool—this time, using only my phone and the Acode mobile code editor.

Working entirely on a mobile device, I set out to transform a minimal app into a full-featured, accessible, and visually polished color palette generator. Every feature, from the advanced color harmony logic to the drag-and-drop UI and accessibility enhancements, was crafted and tested on-the-go, proving that powerful web apps can be built anywhere, even from the palm of your hand.

This project is a testament to learning, improvisation, and the joy of building something useful—no matter where you are or what tools you have.

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).
