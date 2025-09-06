# Copilot Instructions — Expanded, Practical, Developer-Ready

## Legal / Branding
- The app should look and feel “browser style” (modern cool-tone browser UI) but **must not use Microsoft trademarks, logos, or the word “Edge”** anywhere in the UI, product name, or shipped strings.
- Use neutral wording like “browser style” or “modern system browser”.

## Project Overview
Create a desktop/browser-style web app (Electron + web UI) that mimics a modern browser UI and automatically applies a configurable blur to every image and video on pages rendered in the app.  
Blur static `<img>` and `<video>` elements, and media inserted dynamically (DOM changes, single-page apps).  
App must be accessible, performant, themeable, and ship with a settings panel to control blur behavior.

## Suggested File Layout
```
/src
  /renderer
    index.html
    app.ts (or main.tsx)
    /styles
      theme.css
      base.css
      topbar.css
      controlbar.css
    /components
      TopBar.tsx
      BottomBar.tsx
      SettingsPanel.tsx
      MediaBlurController.ts
  /preload
    preload.ts
  /main
    main.ts (Electron main process)
  /types
    index.ts
/tests
  /e2e (playwright)
  /unit (vitest)
package.json
tsconfig.json
```

## Core Features & Acceptance Criteria

### Global Media Blur
- On initial page load, every `<img>` and `<video>` should have a blur applied.
- When new media elements are added dynamically, they must be blurred automatically.
- **Acceptance:** Load sample pages with many images and SPA content; all media show blur class by default.

### Configurable Settings
- Blur intensity (range slider).
- Toggle blur on images (on/off), toggle blur on videos (on/off).
- Theme switch (light/dark), accessibility options (high contrast, font size).
- Settings persist to localStorage (or Electron store) and load on start.

### Browser-Style UI
- Header/topbar + bottom control bar, optional left sidebar.
- Custom draggable bottom bar for Electron (`-webkit-app-region: drag`), with non-draggable controls (`-webkit-app-region: no-drag`).
- Clean minimal controls (back/forward, address/search box, settings shortcut).

### Accessibility
- All controls keyboard accessible, visible focus states, ARIA labels on buttons and toggles.
- Respect `prefers-reduced-motion` and `prefers-contrast`.
- Provide skip links where appropriate.

### Electron Integration & Security
- Renderer: `contextIsolation: true`, `nodeIntegration: false`.
- Use a preload script that exposes a minimal, typed API (`window.appApi.*`) for IPC.
- For web content inside the app use `<webview>` or a controlled browsing method; inject blur CSS/JS via `webContents.insertCSS` or webview preload.
- Secure default CSP and disable remote content that could execute arbitrary code in the app context.

### Testing
- Unit tests for blur controller (simulate DOM mutation).
- E2E tests with Playwright: verify blur and settings persistence.
- Accessibility checks with axe-core.

## Implementation Notes

### Blurring Strategy
- Prefer CSS `filter: blur(px)` for both images and videos.
- Use `.media-blurred { filter: blur(var(--blur-radius)); transition: filter 180ms ease; }`
- Use CSS variables for theme and blur.
- Use MutationObserver in TypeScript to apply blur to new media elements.

### Example: MediaBlurController.ts
```typescript
export interface MediaBlurOptions {
  blurImages: boolean;
  blurVideos: boolean;
  blurRadiusPx: number;
}

export class MediaBlurController {
  private opts: MediaBlurOptions;
  private mo: MutationObserver;

  constructor(initial: MediaBlurOptions) {
    this.opts = initial;
    this.mo = new MutationObserver(this.handleMutations.bind(this));
  }

  start() {
    this.applyToExisting();
    this.mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset', 'poster'],
    });
  }

  stop() { this.mo.disconnect(); }

  updateOptions(opts: Partial<MediaBlurOptions>) {
    Object.assign(this.opts, opts);
    document.documentElement.style.setProperty('--blur-radius', `${this.opts.blurRadiusPx}px`);
    this.applyToExisting();
  }

  private applyToExisting() {
    if (this.opts.blurImages) {
      document.querySelectorAll('img').forEach(this.blurElementIfNeeded);
    }
    if (this.opts.blurVideos) {
      document.querySelectorAll('video').forEach(this.blurElementIfNeeded);
    }
  }

  private blurElementIfNeeded(el: Element) {
    if (!el.classList.contains('media-blurred')) {
      el.classList.add('media-blurred');
      el.setAttribute('data-blurred', 'true');
    }
  }

  private handleMutations(records: MutationRecord[]) {
    for (const r of records) {
      for (const node of Array.from(r.addedNodes)) {
        if (!(node instanceof Element)) continue;
        if (this.opts.blurImages && node.matches('img')) this.blurElementIfNeeded(node);
        if (this.opts.blurVideos && node.matches('video')) this.blurElementIfNeeded(node);
        node.querySelectorAll?.('img,video').forEach(el => {
          if (el instanceof HTMLImageElement && this.opts.blurImages) this.blurElementIfNeeded(el);
          if (el instanceof HTMLVideoElement && this.opts.blurVideos) this.blurElementIfNeeded(el);
        });
      }
      if (r.type === 'attributes' && r.target instanceof Element) {
        const t = r.target;
        if ((t.tagName === 'IMG' && this.opts.blurImages) || (t.tagName === 'VIDEO' && this.opts.blurVideos)) {
          this.blurElementIfNeeded(t);
        }
      }
    }
  }
}
```

### Electron Main / Preload Patterns (Security)
- Main process: create BrowserWindow with `frame: false` for custom bars.
- Preload script: expose minimal API via `contextBridge`.
- Validate all incoming data in the main process. Avoid exposing Node APIs to renderer.

### UX & Design
- Use CSS variables for all themeable properties (accent, background, blur radius, shadows).
- Spacing: 12–16px base unit; rounded corners 8px; subtle shadows.
- Font: Segoe UI if available; fallback to system sans (Arial, Inter).
- Provide visual affordance for blurred media (overlay icon or caption “blurred” when hovered).
- Keyboard shortcuts:
  - Ctrl/Cmd+Shift+B → toggle blur on/off
  - Ctrl/Cmd+, → open settings
- On-hover reveal (temporary unblur) only if explicitly allowed in settings (off by default).

### Accessibility (Detailed)
- Controls must have aria-label, proper role attributes and tabindex ordering.
- Focus style: visible, high contrast outlines.
- Respect `prefers-reduced-motion`.
- Provide high-contrast theme and large text option.
- Provide captions or transcripts for videos where possible.
- Screen-reader testing: run NVDA/VoiceOver test flows on all panels.

### Performance & Optimization
- Batch DOM updates; avoid per-image style writes that force layout thrashing.
- Debounce mutation handling for high-frequency DOM changes.
- Use CSS transitions sparingly.
- Provide a mode that applies blur via a topmost overlay element for extremely large numbers of media nodes.

### Testing & QA
- Unit tests: mock DOM, ensure MediaBlurController finds and marks elements.
- E2E (Playwright): tests to open sample pages, add images dynamically, assert data-blurred=true.
- Accessibility: use axe-core in CI to scan the renderer.
- Performance: measure repaint cost when toggling blur on pages with 100+ images.

### Developer Workflow
- TypeScript + ESLint + Prettier.
- Git hooks: lint-staged for formatting.
- CI: run unit tests, lint, build, axe accessibility scan, Playwright smoke test.
- PR checklist: feature implemented, tests, a11y pass, security review for any new IPC channels.

## Task Breakdown for Copilot

### Setup & Scaffolding
- Create TypeScript + Vite/React (or vanilla TS) project scaffold and Electron main process.
- **Acceptance:** `npm run dev` opens Electron window showing topbar and bottom bar.

### Media Blur Controller
- Implement MediaBlurController (see above).
- Add unit tests mocking DOM additions.
- **Acceptance:** add `<img>` in console → class media-blurred applied.

### Settings Panel & Persistence
- Implement UI and store settings in localStorage/Electron store.
- **Acceptance:** update blur slider → all media blur updates immediately; restart retains settings.

### Webview Injection
- Implement CSS injection for `<webview>` pages via preload or `webContents.insertCSS`.
- **Acceptance:** navigate webview to example.com with images → images blurred.

### Electron Security
- Enforce contextIsolation, build preload API, disable nodeIntegration.
- **Acceptance:** renderer cannot access require('fs'), preload exposes only allowed APIs.

### Accessibility & Keyboard
- Add aria tags and keyboard shortcuts.
- **Acceptance:** all controls reachable via keyboard; axe scan passes key rules.

### Tests & CI
- Add Playwright test that loads dynamic images in a sample page and validates blur.
- **Acceptance:** CI passes tests.

## Example Copilot Prompts

- “Create a TypeScript class MediaBlurController that uses a MutationObserver to add .media-blurred to newly added <img> and <video> elements. Include methods start(), stop(), and updateOptions().”
- “Add a settings panel UI that persists blurRadius, blurImages, and blurVideos to localStorage and calls MediaBlurController.updateOptions() on change.”
- “In Electron main process, create a frameless BrowserWindow with preload.ts that exposes appApi methods for window controls. Implement IPC handlers window:close, window:minimize, settings:update in the main process.”
- “Write Playwright E2E test: open the app, click settings, set blur radius to 12, inject a new image tag into the page, assert it has data-blurred=true and CSS filter value matches var.”

## Security & Privacy Considerations
- Default to privacy: do not send page content off-device.
- If injecting scripts into remote pages, warn users that this modifies page content; provide per-site opt-outs.
- Use secure CSP headers in the renderer where applicable.

## Styling & Theme Tokens (Example)
```css
:root {
  --bg: #f6f8fb;
  --panel: #ffffff;
  --accent: #0a6cf6;
  --muted: #6b7a90;
  --blur-radius: 10px;
  --radius: 8px;
  --shadow: 0 10px 18px rgba(11,27,43,0.06);
}
```

## PR/Commit Message Examples
- feat(media): add MediaBlurController with MutationObserver and options
- chore(electron): add preload API and secure BrowserWindow config
- test(e2e): add Playwright test for dynamic media blur

---

**Use these instructions as the authoritative guide for all code, UI, and test generation for