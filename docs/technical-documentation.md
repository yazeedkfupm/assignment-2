

Overview
This web application demonstrates dynamic UI, client-side data handling, animations, error handling, and AI-assisted development practices.

Architecture
-index.html: Semantic layout with header, tabs, and three sections.
-css/styles.css: Design tokens, dark mode, layout, components, animations.
-js/script.js: State management, rendering, events, validation, API demo.

Data Flow
-UI state is kept in memory (`state`) and persisted selectively in `localStorage` (theme, username).
-Projects list is filtered, searched, and sorted in a pure function `filterAndSort`.
-API demo fetches from a public endpoint with timeout and retry.

Components
-Tabs: updates aria-selected, aria-hidden; transitions powered by CSS.
-Projects Grid: renders cards, collapsible details via `max-height` transition.
-Contact Form: validators map + inline errors + async success.
-Theme Toggle: toggles `.dark` class on `:root` and persists.
-Greeting: based on current time and optional stored username.

Accessibility
-Roles/aria: `role="tablist"`, `role="tabpanel"`, `aria-selected`, `aria-hidden`.
-Focusable controls have visible styles; color contrast respects dark mode.

Performance
-No frameworks; minimal CSS/JS; critical CSS loaded synchronously.
-Avoids large images/fonts; grid is responsive.
-DOM updates batched per render; no expensive observers.

Error Handling
-API demo: loading state, timeout, error with retry.
-Form: inline field errors, non-blocking status messaging.
-Projects: empty state when filters yield no results.

Testing
-Browsers: Chrome, Firefox, Safari, Edge (latest).
-Scenarios: no localStorage, offline mode, invalid inputs, extreme filters.