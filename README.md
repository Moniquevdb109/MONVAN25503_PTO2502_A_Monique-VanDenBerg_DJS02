# DJS02 – Web Component: Podcast Preview

## Overview

For this project, I built a reusable and fully encapsulated **custom HTML element** that displays a podcast preview.  

My goal was to create a modular component that works independently from the main application logic, reduces duplication, and keeps the codebase clean and maintainable.

I used the native **Web Component standard** with `customElements.define()` and implemented Shadow DOM to properly isolate structure and styles.

---

## What I Built

I created a custom element that:

- Accepts podcast data via **attributes or properties**
- Displays:
  - Cover image
  - Podcast title
  - Genre names
  - Number of seasons
  - Last updated date (formatted for readability)
- Uses **Shadow DOM** for full encapsulation
- Dispatches a **custom event** when clicked so the parent app can handle actions (like opening a modal)

The component itself is stateless and depends entirely on the data passed into it.

---

## Technical Approach

- Used **Vanilla JavaScript (ES6+)**
- Registered the component using `customElements.define()`
- Attached a **Shadow Root** to prevent style leakage
- Kept logic self-contained and modular
- Used custom events to avoid tight coupling with the main application
- Followed clean formatting and added JSDoc comments where necessary

No third-party libraries or frameworks were used.

---

## Key Features

- Reusable and scalable design
- Fully encapsulated styling
- Responsive layout (desktop and mobile friendly)
- Clean separation between UI component and app logic
- Easy to integrate into any project

---

## How to Use

1. Import the component file (e.g., `PodcastPreview.js`)
2. Register it automatically via `customElements.define()`
3. Pass in podcast data as attributes or properties
4. Listen for the custom event to handle user interaction

---

## Final Thoughts

This project helped me solidify my understanding of:

- Web Components
- Shadow DOM
- Custom events
- Component-based architecture using native JavaScript

I focused on writing clean, modular, and reusable code that could realistically scale in a production environment.
