const fs = require('fs');

// Master Typography Configuration
// Cap height: 120 (Y: 40 to 160), Baseline: 160
// Stem thickness: 20

// Letter path definitions (relative to glyph origin 0,0 at baseline y=160, top y=40)
// Each letter has glyphWidth, and path string 'd' (assuming glyph origin is x=0, y=0 where y=40 is top and y=160 is bottom)

const glyphs = {
  E: {
    width: 82,
    d: "M 0 40 L 82 40 L 82 59 L 20 59 L 20 90 L 74 90 L 74 109 L 20 109 L 20 141 L 82 141 L 82 160 L 0 160 Z"
  },
  L: {
    width: 76,
    d: "M 0 40 L 20 40 L 20 141 L 76 141 L 76 160 L 0 160 Z"
  },
  Y: {
    width: 92,
    d: "M 0 40 L 23 40 L 46 88 L 69 40 L 92 40 L 56 103 L 56 160 L 36 160 L 36 103 Z"
  },
  S: {
    width: 84,
    // Carefully crafted continuous geometric/grotesk S path with uniform 19.5px stroke weight
    d: "M 78 68 C 78 52 64 40 42 40 C 20 40 6 53 6 71 C 6 88 18 97 38 102 L 48 104 C 64 108 72 114 72 127 C 72 143 57 160 38 160 C 18 160 6 147 6 132 L 24 132 C 24 140 30 143 38 143 C 48 143 54 136 54 127 C 54 116 44 111 28 107 L 18 104 C 4 100 0 88 0 71 C 0 44 18 23 42 23 C 68 23 96 42 96 68 Z"
  },
  I: {
    width: 20,
    d: "M 0 40 L 20 40 L 20 160 L 0 160 Z"
  },
  U: {
    width: 90,
    d: "M 0 40 L 20 40 L 20 122 C 20 134 30 142 45 142 C 60 142 70 134 70 122 L 70 40 L 90 40 L 90 122 C 90 146 72 160 45 160 C 18 160 0 146 0 122 Z"
  },
  M: {
    width: 114,
    d: "M 0 40 L 22 40 L 57 114 L 92 40 L 114 40 L 114 160 L 94 160 L 94 77 L 65 136 L 49 136 L 20 77 L 20 160 L 0 160 Z"
  }
};

console.log("Glyph widths:", Object.fromEntries(Object.entries(glyphs).map(([k,v]) => [k, v.width])));
