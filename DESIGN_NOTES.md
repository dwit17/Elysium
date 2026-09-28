# Copilot Capital — Working With Us Design Specifications & Notes

## 1. Core Visual System & Tokens

### Color Palette
- **Background (Canvas)**: `#f6f5f1` (Warm aviation off-white / light bone)
- **Primary Text / Navy**: `#121334` (Deep twilight navy)
- **Muted Text / Slate**: `#758696` / `#5d6c7b`
- **Surface / Card Background**: `#ffffff` (Pure white)
- **Footer Dark Card Surface**: `#121334` (Deep navy card)
- **Footer Sky Gradient**: `linear-gradient(180deg, #d3e4f6 0%, #b8d4f0 100%)` (Pale stratospheric daylight)
- **Borders & Dividers**: `rgba(18, 19, 52, 0.12)` / `1px solid rgba(18, 19, 52, 0.15)`
- **Dashed Flight Path Stroke**: `#121334` (Stroke width: 1.5px, stroke-dasharray: 5 6)
- **Accent / Tag Fill**: `rgba(18, 19, 52, 0.06)`

### Typography
- **Primary Font Family**: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace / Tags / Time / Buttons**: `'Geist Mono', 'SFMono-Regular', Consolas, Menlo, monospace`
- **Weights**:
  - Headings (`h1`, `h2`): `300` (Light) and `400` (Regular)
  - Subheadings (`h3`, `h4`, `h5`): `400` / `500`
  - Body Text: `400` (Regular)
  - Buttons / Navigation / Tags: `600` / `700` uppercase tracking `0.12em`
- **Heading Scales**:
  - `H1 (Hero)`: `clamp(2.5rem, 6.5vw, 5.25rem)` (Light 300, leading 1.05)
  - `H2 (Mission / Section Titles)`: `clamp(2rem, 4.2vw, 3.75rem)` (Light 300, leading 1.15)
  - `H3 / Card Titles`: `clamp(1.25rem, 2vw, 1.75rem)` (Medium 500)
  - `H6 / Card Descriptions`: `0.95rem - 1.05rem` (Regular 400, color `#5d6c7b`, leading 1.55)
  - `Button / Chips`: `0.75rem - 0.8rem` (Semibold, tracking `0.15em`, uppercase)

### Layout & Spacing
- **Max Width**: `1360px` (standard container), with `px-4 sm:px-8 md:px-12` padding
- **Card Border Radii**: `16px` (large rounded corners)
- **Photo Border Radii**: `16px`
- **Chip / Pill Border Radii**: `9999px` (full pill)

---

## 2. Interactive Components & Signatures

### Fixed Flight Header
- **Live Local Time Chip**: Displays dynamic visitor time (e.g., `13 52`) with pulsing colon, crosshair GPS icon, and visitor timezone (`IST` / `EST` / `GMT`).
- **Center Logo**: "copilot capital" typography with stylized paper plane mark.
- **Navigate Button**: Outlined pill button `NAVIGATE ···` opening full-screen navigation modal.

### The Signature Flight Path
- **Continuous SVG Dashed Line**: `1.5px` stroke with `stroke-dasharray: 5 6`.
- Winds smoothly down the page with rounded bezier corners:
  - Down from Hero -> loops under Team photo -> flows past Mission -> loops across Partner Criteria grid -> connects "How We Help" and the 5-slide Carousel -> enters CTA box with down-chevron terminal node.
- **Scroll-Driven Plane Nodes**: Circular nodes (dashed ring `r=45`, white filled center `r=16`) with directional paper plane icons following the path scroll.

### 5-Slide Interactive Carousel
- **Left Column**: Tall vertical photo (`workingwithus-03.webp`).
- **Right Column**: Interactive white card displaying:
  1. Slide title (`text-h5`)
  2. Slide description (`text-h6`)
  3. 5 interactive pagination dot indicators
  4. Circular previous / next navigation arrow buttons (`btn-circ`)
- **Slides**:
  1. *Utilising AI* — "Learn to leverage this invaluable tool for growth."
  2. *Energising Sales* — "Super-charge your organic growth by investing in winning strategies."
  3. *Internationalisation* — "Enter new markets with confidence and clear goals."
  4. *Acquisitions* — "Transform your business through bold acquisitions."
  5. *Customer Success* — "Focus on your existing customers to tap into new growth opportunities."

### Mission Scroll-Driven Text Reveal
- Right-column paragraph words transition progressively from muted gray (`#b0b8c2`) to deep navy (`#121334`) based on scroll position into the viewport.

### Footer "Ready for take-off"
- Light sky-blue vertical gradient background.
- Floating curved dashed flight trajectory arcs with circular plane markers.
- Dual-card footer module:
  - White Card: Email (`hello@copilotcptl.com`), phone (`(+44) 333-242-4008`), LinkedIn, and decorative boarding pass barcode.
  - Navy Card: Navigation directory (Home, Who we are, Working with us, Meet the team, Inflight entertainment, Our investments, Blog, Contact us), Back to top CTA, copyright, terms, privacy, and UK FCA regulatory footnote.
