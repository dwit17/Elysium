# ELYSIUM — ADVANCED GSAP MOTION SYSTEM BRIEF

## Purpose

You are working on an existing premium home decor / interior design website called **Elysium**.

The goal is to evolve the website into a **high-end, cinematic, editorial, interaction-driven experience** using GSAP while preserving the existing brand language and production stability.

This document is the implementation brief for the IDE/AI coding agent.

---

# 1. EXISTING TECHNICAL CONTEXT

Current stack:

- Next.js 16.3.5
- React 19.2.8
- TypeScript
- Tailwind CSS v4
- Framer Motion 13.4.0
- Lucide React
- HTML5 Canvas 2D
- Native requestAnimationFrame
- Next.js Image / native img
- 181-frame hero image sequence
- Next.js App Router
- Existing SEO / JSON-LD utilities

Existing website architecture includes:

```text
Global Layout
├── Navbar
├── Main Page Content
└── Footer

Home
├── Image Sequence Hero
├── Philosophy Teaser
├── Featured Pieces
└── Story / Craft Teaser

Artisan Collection
├── Product Catalogue
└── Product Detail

Materiality
├── Material Selector
└── Lighting / Macro Explorer

Our Story
├── Atelier Story
└── Craft Chronology

Philosophy
├── Hero Statement
├── Quote
└── Design Pillars

Contact
├── Atelier Information
└── Enquiry Form
```

The home hero currently uses:

- 400vh scroll track
- sticky 100dvh viewport
- 181 sequential JPG frames
- HTML5 2D canvas
- custom image sequence loader
- scroll progress
- floating narrative pill
- hero typography
- enquiry CTA
- scroll indicator

---

# 2. CORE CREATIVE DIRECTION

The animation language must communicate:

**Quiet luxury + architectural precision + tactile materials + editorial storytelling.**

The website should feel:

- cinematic
- slow but responsive
- tactile
- sophisticated
- intentional
- premium
- architectural
- natural
- immersive

Avoid making the site feel:

- like a gaming website
- like a SaaS landing page
- overly futuristic
- overly colorful
- cartoonish
- full of random motion
- full of unnecessary 3D rotations
- visually noisy

The motion should support the physical quality of furniture, stone, wood, metal, clay and interior spaces.

Think:

> "The website should reveal the product like an architect reveals a space."

---

# 3. MOST IMPORTANT RULE

## DO NOT ANIMATE EVERYTHING.

Every animation must have a reason.

Use motion to communicate one of these:

1. hierarchy
2. narrative
3. depth
4. transformation
5. materiality
6. navigation
7. spatial relationship
8. interaction feedback

If an animation does not improve one of those, do not add it.

---

# 4. GSAP ARCHITECTURE

Use GSAP as the primary animation engine for new motion.

Preferred packages:

```bash
npm install gsap @gsap/react
```

Potential plugins, only where genuinely useful:

- ScrollTrigger
- SplitText
- Flip
- Draggable
- Observer

Do NOT automatically add every plugin.

Evaluate the requirement before using a plugin.

---

# 5. REACT + GSAP RULES

Use:

```tsx
useGSAP()
```

from:

```tsx
@gsap/react
```

GSAP animations must be scoped to a component/container.

Preferred pattern:

```tsx
const container = useRef<HTMLDivElement>(null);

useGSAP(() => {
  // GSAP logic
}, { scope: container });
```

Avoid attaching high-frequency animation state to React.

DO NOT do:

```tsx
setState(...)
```

for every scroll tick.

Prefer:

- refs
- GSAP setters
- GSAP timelines
- ScrollTrigger callbacks
- direct DOM/canvas updates

React should own application state.

GSAP should own animation state.

---

# 6. FRAMER MOTION RULE

The existing site uses Framer Motion.

Do NOT blindly remove Framer Motion across the project.

Instead:

- keep existing Framer Motion where it is useful and isolated
- migrate individual motion-heavy components to GSAP when needed
- never allow GSAP and Framer Motion to control the same transform property on the same element

If GSAP controls:

```text
x
y
xPercent
yPercent
scale
rotation
opacity
```

do not simultaneously control those properties with Framer Motion.

---

# 7. ANIMATION OWNERSHIP RULE

Every animated element must have one clear owner.

Example:

```text
Hero canvas       → GSAP / custom canvas renderer
Hero typography   → GSAP
Navbar indicator  → GSAP
Product image     → GSAP
Form interactions → React / CSS
Lamp interaction  → existing CSS/React unless redesigned
```

Avoid competing animation systems.

---

# 8. PERFORMANCE RULES

Performance is a first-class requirement.

Target:

- smooth 60fps on normal desktop
- smooth interaction on modern 120Hz displays
- usable performance on mobile
- minimal layout shift
- minimal forced reflow

Prefer animating:

```text
transform
opacity
clip-path
```

Be careful with:

```text
width
height
top
left
margin
padding
box-shadow
filter
```

Do not animate layout properties continuously unless necessary.

Use:

```text
will-change
```

sparingly.

Do not add `will-change` globally.

---

# 9. SCROLLTRIGGER RULES

Use ScrollTrigger for:

- pinned sections
- scrubbed animation
- section reveals
- parallax
- cinematic timeline choreography
- horizontal storytelling

Avoid creating many independent ScrollTriggers for every small element.

Prefer:

```text
1 section
→ 1 master timeline
→ multiple child animations
```

when possible.

Use labels:

```js
tl.addLabel("intro")
  .addLabel("product")
  .addLabel("statement")
```

This makes the timeline maintainable.

Use scrub strategically.

Do not make everything `scrub: true`.

For heavy scenes, consider:

```js
scrub: 0.5
```

or another small smoothing value.

---

# 10. RESPONSIVE MOTION RULES

Desktop and mobile are NOT the same animation environment.

Use:

```js
ScrollTrigger.matchMedia()
```

or the current recommended GSAP responsive approach.

Desktop may use:

- pinning
- horizontal sections
- magnetic cursor
- larger parallax distances

Mobile should generally use:

- shorter travel distances
- fewer effects
- reduced pinning
- no custom cursor
- simplified horizontal narratives
- reduced blur
- reduced canvas resolution

Never force a complex desktop animation onto mobile.

---

# 11. REDUCED MOTION

Respect:

```css
prefers-reduced-motion: reduce
```

Users who request reduced motion should receive:

- minimal transitions
- no large parallax
- no aggressive pinning
- no cursor-following effects
- no unnecessary autoplay motion

The experience should remain understandable without animation.

---

# 12. HERO — PRIMARY SIGNATURE EXPERIENCE

Component:

```text
components/hero/ImageSequenceHero.tsx
```

Current system:

```text
400vh track
→ sticky viewport
→ 181-frame canvas
→ scroll-driven frame rendering
```

Do NOT replace the existing frame asset system unless there is a clear technical reason.

Refactor the scroll orchestration so GSAP/ScrollTrigger can coordinate:

```text
canvas frame progress
+
hero typography
+
story pill
+
progress indicator
+
CTA
+
transitions
```

Use a master timeline.

Suggested narrative:

```text
0–20%
Brand introduction

20–45%
Material/product reveal

45–70%
Editorial statement

70–90%
Collection / craft narrative

90–100%
Final CTA / transition
```

The exact percentages should be tuned visually rather than treated as fixed requirements.

Hero motion should feel like a continuous cinematic sequence, not a collection of individual animations.

---

# 13. HERO TYPOGRAPHY

Use GSAP for:

- headline reveal
- line movement
- opacity
- subtle letter-spacing changes where visually justified
- narrative text transitions

Preferred motion:

```text
fade
+
vertical displacement
+
mask reveal
```

Avoid:

- bouncing
- exaggerated scaling
- random character rotations
- excessive blur

Typography should remain elegant.

---

# 14. PHILOSOPHY SECTION

Current structure includes:

- large editorial quote
- supporting text
- three design pillars

Recommended interaction:

## Reading-progress typography

Split the quote into words or lines.

Scroll controls opacity:

```text
0.20 → 1.00
```

Use subtle vertical movement.

The effect should feel like the statement is gradually being revealed.

Do not use large kinetic typography.

---

# 15. FEATURED PIECES

Current product grid uses:

- grayscale images
- hover color reveal
- image scale
- overlays

Upgrade to:

```text
section reveal
→ image mask
→ subtle image parallax
→ metadata reveal
→ CTA interaction
```

Recommended image structure:

```text
overflow-hidden container
└── inner image
```

Animate the inner image rather than moving the whole card.

Example concept:

```text
container remains fixed
image moves slowly inside container
```

This creates premium editorial photography movement.

---

# 16. PRODUCT CARD RULE

Furniture and decor are physical objects.

Do NOT distort them excessively.

Avoid:

```text
rotation > ±4deg
large perspective tilt
aggressive scaling
```

Do not visually change product proportions.

Motion should enhance photography without compromising product truth.

---

# 17. MAGNETIC CTA RULE

Magnetic interaction is optional.

Use it only on:

- large CTA buttons
- small number of key interactive elements

Use GSAP quickTo or equivalent performant updates.

Do NOT make every button magnetic.

Do NOT use magnetic interactions on:

- form inputs
- specification controls
- navigation links everywhere
- accessibility-critical controls

Desktop only unless there is a clear reason otherwise.

---

# 18. CRAFT CHRONOLOGY

Current phases:

```text
01 — Quarry Extraction
02 — Clay Curing
03 — Diamond Finishing
```

Recommended desktop experience:

```text
vertical scroll
      ↓
section pins
      ↓
cards move horizontally
      ↓
progress indicator advances
```

This should feel like moving through an architectural exhibition.

Use:

```text
ScrollTrigger
+
master timeline
+
horizontal translation
```

Optional:

- thin SVG progress line
- stage number transitions
- subtle image reveal

Mobile should use a simplified vertical version when horizontal pinning becomes uncomfortable.

---

# 19. NEW SECTION: THE ROOM

Add a new cinematic section called:

## THE ROOM

Purpose:

Transform the website from a catalogue into an interior experience.

Concept:

```text
Full-screen interior photograph
        ↓
scroll / camera-like movement
        ↓
individual decor pieces become highlighted
        ↓
small editorial label appears
        ↓
product information appears
```

Possible UI:

```text
01  TRAVERTINE CONSOLE
1800 × 450 × 820 MM

02  RAW BRASS LIGHT
HAND FINISHED
```

Use subtle motion.

Do not turn this into a game.

Optional future evolution:

- multiple clickable hotspots
- product links
- image transitions
- layered depth

---

# 20. MATERIALITY PAGE

Current features:

- material selector
- lighting simulator
- macro zoom

Potential GSAP system:

```text
material selection
→ crossfade
→ spatial transition
→ lighting adjustment
→ macro zoom
```

Consider GSAP Flip if layout geometry changes between material states.

The lighting experience should feel tactile, as if the user is moving a light source across a physical surface.

Avoid excessive UI animations.

---

# 21. MATERIAL MICRO-INTERACTIONS

Potential interactions:

- subtle material texture movement
- highlight shift
- lighting sweep
- macro scale transition
- selector underline movement

Do not use artificial glitter, sparkles or flashy particle effects unless visually justified by a specific material concept.

---

# 22. NAVBAR

Current navbar changes state after scrolling.

Keep the existing concept.

Possible GSAP refinement:

```text
initial transparent header
↓
background / blur appears
↓
logo scale changes slightly
↓
nav spacing changes slightly
```

Keep these changes subtle.

Navigation must remain immediately usable.

---

# 23. FOOTER / ATELIER ROOM

Current footer contains:

- full-screen decorative room image
- hanging lamp
- ambient light interaction
- brand information
- WhatsApp CTA

Keep the existing lamp concept.

Potential sequence:

```text
room enters
↓
ambient darkness
↓
lamp glow increases
↓
brand statement appears
↓
atelier details reveal
↓
CTA
```

The footer should feel like the final scene of the experience.

---

# 24. TRANSITIONS BETWEEN SECTIONS

Do not make every section simply:

```text
opacity: 0 → 1
```

Use a mixture of:

- clip-path
- masked image reveal
- vertical movement
- image parallax
- scale
- scrub
- pinning
- typography reveal

But maintain a consistent motion language.

---

# 25. SECTION TRANSITION PHILOSOPHY

A premium transition often consists of:

```text
one element leaving
+
one element entering
+
one element connecting both
```

Example:

```text
Hero object moves upward
+
new section image enters
+
thin line remains as continuity
```

This is preferable to unrelated fade animations.

---

# 26. CURSOR SYSTEM

A custom cursor can be considered for desktop.

Potential states:

```text
default
DRAG
VIEW
EXPLORE
OPEN
```

The cursor should be:

- tiny
- minimal
- fast
- subtle

Do not build an oversized flashy cursor.

Disable / simplify it on:

```text
touch devices
reduced-motion environments
small screens
```

---

# 27. IMAGE REVEALS

For photography-heavy sections, consider:

```text
clip-path
+
scale
+
slight vertical translation
```

Typical visual idea:

```text
image starts partially masked
↓
mask opens
↓
image settles
```

The image should not jump.

---

# 28. PARALLAX RULE

Parallax should communicate depth, not decoration.

Recommended movement:

```text
headline: small movement
container: almost static
image: slightly larger movement
background texture: very small movement
```

Avoid extreme distances.

The page should never feel seasick.

---

# 29. TEXT ANIMATION RULE

Prefer:

```text
line
word
phrase
```

over character-by-character animations for the majority of the website.

Character animations should be reserved for:

- hero brand statement
- very short editorial headings
- special moments

Typography is an architectural element here.

---

# 30. DO NOT ANIMATE THESE

Keep these stable and immediately usable:

- product technical specifications
- dimensions
- weight
- origin
- form inputs
- dropdowns while being used
- phone numbers
- email addresses
- critical contact information
- WhatsApp action
- accessibility controls

Never delay a primary conversion action with a decorative animation.

---

# 31. ASSET REQUIREMENTS

When an effect requires an asset, identify it clearly before coding.

Potential assets:

```text
WebP / AVIF photography
optimized product images
SVG decorative lines
SVG icons
GLB/GLTF only if 3D is genuinely necessary
short cinematic videos if useful
```

Do not introduce 3D just because the site uses GSAP.

Use WebGL/Three.js only when it provides meaningful value over Canvas/CSS.

---

# 32. PERFORMANCE ON THE HERO CANVAS

Current hero uses 181 frames.

Maintain:

- prioritized loading
- lazy/background loading for remaining frames
- correct canvas sizing
- DPR limits
- viewport-aware rendering

For mobile:

```text
prefer DPR around 1–1.5
```

rather than blindly rendering at very high DPR.

Pause expensive work when the hero is significantly outside the viewport where practical.

---

# 33. NEXT.JS / SSR RULE

GSAP must not execute during server rendering.

Use client components where required.

Avoid direct top-level browser access such as:

```js
window
document
navigator
```

unless inside a client-safe runtime.

GSAP initialization belongs inside client lifecycle logic.

---

# 34. STRICT MODE / CLEANUP

React development mode may mount and clean up components more than once.

Every GSAP setup must clean itself up correctly.

Use scoped GSAP contexts / `useGSAP()`.

No duplicated ScrollTriggers after navigation.

No orphaned timelines.

No persistent event listeners after component unmount.

---

# 35. ROUTING RULE

After navigation between Next.js routes:

- previous page animations must be cleaned up
- ScrollTriggers must not leak
- old timelines must not affect the new page
- scroll position should behave intentionally
- page entrance motion should remain short and unobtrusive

Do not introduce heavy global page-transition systems unless the entire transition model is designed first.

---

# 36. ACCESSIBILITY RULE

Animations must not reduce usability.

Important:

- content must exist without animation
- keyboard navigation must remain normal
- buttons remain clickable immediately
- text must remain readable
- no animation should trap focus
- reduced motion must be respected

Do not hide meaningful content permanently behind animation.

---

# 37. CODE QUALITY RULES

Before adding animation:

1. inspect the existing component
2. understand its DOM hierarchy
3. identify reusable elements
4. avoid unnecessary rewrites
5. preserve working functionality

Do not rebuild the application simply to add GSAP.

Prefer small, controlled refactors.

---

# 38. ANIMATION FILE ORGANIZATION

Preferred structure:

```text
animations/
├── hero.ts
├── philosophy.ts
├── featuredPieces.ts
├── chronology.ts
├── materiality.ts
├── room.ts
├── footer.ts
└── utils.ts
```

If animation code is tightly coupled to a component, it can remain in the component.

Do not over-engineer the system solely for organization.

---

# 39. MASTER MOTION TOKENS

Use consistent values throughout the experience.

Conceptually define:

```text
motion-fast
motion-medium
motion-slow

ease-primary
ease-soft
ease-exit

parallax-small
parallax-medium
parallax-large
```

Do not randomly choose different durations/eases in every section.

The site should feel like one motion system.

---

# 40. VISUAL MOTION RULE

Use:

```text
slow entrance
fast response
slow settle
```

Example:

```text
image begins slowly
→ user interacts quickly
→ object responds immediately
→ motion settles smoothly
```

The website must never feel sluggish even if the visual style is slow.

---

# 41. DO NOT OVERUSE BLUR

Blur is expensive and visually easy to overuse.

Use blur for:

- a rare transition
- subtle depth
- atmospheric moments

Do not animate blur continuously across large images.

---

# 42. DO NOT ADD RANDOM PARTICLES

No:

- floating particles
- random stars
- fake dust
- excessive noise
- unnecessary glowing dots

unless specifically connected to the creative concept.

Interior design should remain tangible and believable.

---

# 43. IMPLEMENTATION PROCESS

Do NOT implement the entire motion system in one pass.

Work in this order:

```text
PHASE 1
GSAP foundation
+
Hero

PHASE 2
Philosophy
+
Featured Pieces

PHASE 3
Craft Chronology

PHASE 4
Materiality

PHASE 5
The Room

PHASE 6
Footer

PHASE 7
Global refinements
+
mobile
+
reduced motion
+
performance
```

After each phase:

1. run the app
2. inspect the actual browser result
3. check console
4. check mobile
5. check scroll performance
6. correct regressions
7. only then continue

---

# 44. IMPORTANT IDE/AI RULE

Do not make large speculative changes.

Before implementation, explain:

```text
What will change?
Why?
Which components?
Which dependencies?
What animation technique?
What are the risks?
```

Then implement the smallest correct version.

Preserve existing functionality unless explicitly instructed otherwise.

---

# 45. TESTING RULE

Every major GSAP change must be checked at:

```text
Desktop:
1440px+
1920px+

Laptop:
1280px

Tablet:
768px

Mobile:
390px
430px
```

Also test:

```text
mouse
touch
slow scrolling
fast scrolling
route navigation
refresh
back/forward navigation
reduced motion
```

---

# 46. PERFORMANCE CHECKLIST

Before considering a section complete:

- no visible jank
- no obvious dropped-frame behavior
- no scroll locking
- no layout jumps
- no duplicate animations
- no console errors
- no memory leaks
- no broken mobile behavior
- no oversized assets loaded unnecessarily
- no excessive React re-renders from scrolling

---

# 47. DESIGN QUALITY CHECKLIST

Before considering an animation complete, ask:

1. Does this fit the Elysium brand?
2. Does it communicate something?
3. Does it make the product feel more premium?
4. Does it improve hierarchy?
5. Does it feel natural?
6. Is it too obvious?
7. Would the site still work if the animation were removed?
8. Is the animation worth its performance cost?

If the answer is no, reduce or remove it.

---

# 48. FINAL CREATIVE TARGET

The final website should feel like:

> An architectural showroom translated into a digital experience.

The user should feel that they are:

```text
entering a space
↓
discovering materials
↓
moving through rooms
↓
understanding craftsmanship
↓
discovering objects
↓
connecting with the atelier
```

not:

```text
scrolling through a website
↓
animation
↓
animation
↓
animation
```

Motion must be **continuous storytelling**, not decoration.

---

# 49. FIRST TASK FOR THE IDE

Do NOT implement everything from this document immediately.

Start with:

## TASK 01 — HERO MOTION SYSTEM

Requirements:

- preserve the current 181-frame canvas system
- preserve the existing visual design
- preserve preload behavior
- preserve hero copy/content
- remove high-frequency React state from the scroll path where appropriate
- introduce GSAP + ScrollTrigger
- build a master hero timeline
- coordinate canvas progress with hero typography
- coordinate the storytelling pill
- coordinate CTA/progress indicator
- ensure proper cleanup
- create responsive behavior
- test desktop and mobile

Before editing, inspect the current implementation and explain the exact files you intend to modify.

Then implement only the Hero Motion System.

Do not modify unrelated sections.

---

# 50. AFTER HERO

Once Hero is stable, proceed sequentially:

```text
02 — Philosophy Motion
03 — Featured Pieces Motion
04 — Craft Chronology
05 — Materiality Motion
06 — The Room
07 — Footer Motion
08 — Global Motion Polish
09 — Performance Audit
10 — Accessibility / Reduced Motion Audit
```

The goal is not maximum animation.

The goal is **maximum perceived quality with controlled motion.**
