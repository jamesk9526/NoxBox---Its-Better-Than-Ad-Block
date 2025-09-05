# NoxBox - Privacy Browser

A modern, browser-style desktop application built with Electron that automatically blurs images and videos for enhanced privacy and focus.

## Features

- 🔒 **Automatic Media Blurring**: All images and videos are automatically blurred on page load
- 🎯 **Dynamic Content Detection**: Uses MutationObserver to blur newly added media elements
- 🎨 **Customizable Settings**: Control blur intensity, toggle image/video blurring separately
- 🌙 **Theme Support**: Light, dark, and high-contrast themes
- ♿ **Accessibility First**: Full keyboard navigation, ARIA labels, and screen reader support
- 🖥️ **Browser-Style UI**: Familiar interface with top bar, address bar, and navigation controls
- 🔐 **Security Focused**: Context isolation, secure preload scripts, and safe defaults

## Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # Main application entry point
│   └── utils.ts    # Utility functions
├── preload/        # Secure preload scripts
│   └── preload.ts  # IPC bridge for renderer
├── renderer/       # Web UI (runs in browser context)
│   ├── index.html  # Main HTML page
│   ├── app.ts      # Main application logic
│   ├── styles/
│   │   └── main.css # Application styles
│   └── components/ # UI components
│       ├── TopBar.ts
│       ├── BottomBar.ts
│       └── SettingsPanel.ts
└── types/          # TypeScript type definitions
    └── index.ts
```

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
# Start development server (runs both Electron and Vite)
npm run dev
```

### Building
```bash
# Build for production
npm run build

# Create distributable packages
npm run build:electron
```

### Testing
```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

## Architecture

### Media Blurring System
The core functionality is provided by the `MediaBlurController` class which:
- Uses CSS `filter: blur()` for optimal performance
- Monitors DOM changes with `MutationObserver`
- Applies blur to all existing and newly added media elements
- Supports configurable blur radius and media type selection

### Security
- **Context Isolation**: Renderer process cannot access Node.js APIs
- **Preload Scripts**: Minimal, typed API exposed to renderer
- **Input Validation**: All IPC messages are validated in main process
- **CSP Headers**: Content Security Policy for additional protection

### Accessibility
- Full keyboard navigation support
- ARIA labels and roles on all interactive elements
- High contrast theme option
- Reduced motion support
- Skip links for screen readers

## Configuration

Settings are stored locally and include:
- Media blur options (images, videos, intensity)
- Theme selection
- Accessibility preferences
- UI customization options

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Technologies Used

- **Electron**: Cross-platform desktop app framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Playwright**: End-to-end testing
- **Vitest**: Unit testing framework
- **CSS Variables**: Dynamic theming system