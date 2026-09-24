# Lusion Section 2 Recreation Specification — 1:1 Architecture & Motion Spec

## 1. Overview & Identity
Section 2 represents the iconic transition from the hero into the atelier showcase:
- **Background Color:** `#EFEFF9` (Flat Lavender) with dynamic transition to dark background on subsequent sections.
- **Side Margins / Container Inset:** `4.6vw` to `5.0vw` (~88px–96px at 1912px width).
- **Typography Engine:**
  - Font Primary: **Geist / Plus Jakarta Sans / Aeonik equivalent** (`font-sans`), geometric grotesque with tight tracking (`-0.02em`).
  - Font Mono / Eyebrow: `IBMPlexMono` / `Geist-Mono` (`font-mono`), tracking `0.45em`.
  - Headline Size: `10vw` (191.2px at 1912px viewport), line-height `1.0`.
  - Body Paragraph Size: `1.45vw` (~28px at 1912px viewport), line-height `1.45`.
  - CTA Button: Fully rounded white pill (`233px x 64px`), uppercase font `14px–19px`, `letter-spacing: 0.1em`, leading solid black dot (`●`).

---

## 2. Breakpoint Layout Metrics & Matrix

| Element | 1912x922 (Desktop Wide) | 1440x900 (Desktop) | 768x1024 (Tablet) | 390x844 (Mobile) |
|---|---|---|---|---|
| **Section Background** | `#EFEFF9` | `#EFEFF9` | `#EFEFF9` | `#EFEFF9` |
| **Horizontal Padding** | `95.6px` (5vw) | `72px` (5vw) | `38px` (5vw) | `20px` (5.1vw) |
| **Headline Size** | `191.2px` (10vw) | `144px` (10vw) | `76.8px` (10vw) | `44px` (11.2vw) |
| **Headline Line Height** | `191.2px` (1.0) | `144px` (1.0) | `78px` (1.0) | `46px` (1.05) |
| **Headline Layout** | 2 lines, Left-Anchored 62% width. Line 1 inset ~293px so both lines align on right edge. | 2 lines, Left-Anchored 62% width. Line 1 inset ~220px. | 2 lines, stacked. | 2 lines, stacked. |
| **Paragraph Position** | `x: 51vw`, `width: 44vw` | `x: 51vw`, `width: 44vw` | Below headline, full width | Below headline, full width |
| **Paragraph Size / Leading** | `28.68px` / `40.15px` | `21.6px` / `31px` | `18px` / `26px` | `15px` / `22px` |
| **CTA Pill Button** | `233px x 64px`, border-radius 100px | `200px x 56px`, border-radius 100px | `190px x 52px`, border-radius 100px | `100% width x 48px`, border-radius 100px |
| **3D Ribbon / Tube** | 3D Spline tube (35px diameter), #2B2FE8 → #5B7BFF gradient | 3D Spline tube (30px diameter) | 2D/3D smooth curve | Hidden or subtle SVG trace |
| **Card / Video Plane** | Starts bottom-left (45% width, 20px radius), stretches & warps to 90.8vw width, 75vh height, 24px radius | Similar proportional scale | Responsive proportional width | Responsive proportional width |
| **"PLAY REEL" Overlay** | `7.3vw` uppercase centered typography (`PLAY` & `REEL`) with center pill play button | `7.3vw` | `9vw` | `12vw` |
| **Registration Marks (+)** | 5 columns x 2 rows (top & bottom), rotate/scale in on frame dock | 5 cols x 2 rows | 3 cols x 2 rows | Hidden or 3 cols |

---

## 3. Motion Choreography & Scroll Stages

1. **Stage 1: Narrative Intro (`scrollProgress: 0.00 -> 0.25`)**
   - The headline, paragraph, and CTA pill button scroll upward with subtle differential parallax.
   - The initial blue card rises into the viewport from the bottom-left.
   - The 3D tubular ribbon enters along its spline path, curving smoothly behind and in front of the card.

2. **Stage 2: Morphing Quad & Velocity Warp (`scrollProgress: 0.25 -> 0.65`)**
   - The card begins expanding from its bottom-left anchor across toward the center-right.
   - A WebGL vertex shader warps and bends the geometry: the quad bends along the motion path with a dynamic skew and ripple proportional to scroll velocity.
   - The texture smoothly crossfades from the static atelier artwork to the showreel video stream.
   - The video begins tinted in the signature cobalt blue duotone (`#4F43F4` / `#2B2FE8`) and smoothly transitions to vibrant full natural color.

3. **Stage 3: Frame Docking & Registration Marks (`scrollProgress: 0.65 -> 0.85`)**
   - The quad settles into a pristine rounded rectangle frame (`width: 90.8vw`, `height: 75vh`, `border-radius: 24px`).
   - The "PLAY" and "ATELIER" (or "PLAY REEL") bold typography rises from below with a staggered reveal.
   - The white pill play button (`180px x 112px` with black play triangle) scales and morphs into position between the words.
   - Small `+` registration crosshair marks scale and rotate 90° into place along the top and bottom borders (5 evenly spaced columns).

4. **Stage 4: Exit & Handover (`scrollProgress: 0.85 -> 1.00`)**
   - The 3D ribbon accelerates off toward the top-right corner.
   - The docked video continues seamless looping playback while smoothly scrolling up as the next section engages.
   - Clicking the play button or video frame triggers a high-definition fullscreen modal player with custom controls and audio toggle.

---

## 4. Technical Architecture: CSS Variables & Palette Tokens
All colors, dimensions, and transition constants are isolated into CSS variables at the root of the component:
```css
:root {
  --lusion-bg: #EFEFF9;
  --lusion-text-dark: #000000;
  --lusion-accent-blue: #4F43F4;
  --lusion-ribbon-start: #2B2FE8;
  --lusion-ribbon-end: #5B7BFF;
  --lusion-card-radius: 22px;
  --lusion-frame-height: 75vh;
  --lusion-frame-width: 90.8vw;
  --lusion-side-padding: 4.6vw;
  --lusion-play-pill-w: 180px;
  --lusion-play-pill-h: 112px;
}
```
