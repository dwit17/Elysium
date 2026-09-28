const fs = require('fs');

// Perfect S Vector Path:
// Outer contour runs clockwise:
// (80,66) -> C up to apex (42,40) -> C down left (2,68) -> C through center (42,100) -> C down right (82,132) -> C down to bottom apex (42,160) -> C up left to terminal (4,134)
// -> L to inner terminal (24,134)
// -> C down to inner bottom apex (42,141) -> C up right (62,128) -> C through center inner spine (42,90) -> C up left (22,72) -> C up to inner top apex (42,59) -> C down right to inner top terminal (60,66)
// -> Z (close back to 80,66)

const S_flawless = "M 80 66 C 80 50 63 40 42 40 C 19 40 2 52 2 70 C 2 87 15 96 36 101 L 48 104 C 67 108 82 116 82 131 C 82 148 64 160 42 160 C 20 160 4 149 4 134 L 24 134 C 24 140 31 142 42 142 C 52 142 62 136 62 129 C 62 118 51 113 32 108 L 22 105 C 8 101 2 90 2 70 C 2 46 19 22 42 22 C 65 22 80 34 80 66 Z";

// Let's refine it so top inner curve and outer curve have exactly 19.5px - 20px thickness:
// Notice in the previous S:
// Start at top right terminal: (80, 66)
// Outer curve to top apex: C 80 50, 63 40, 42 40
// Outer curve to upper-left: C 20 40, 2 52, 2 70
// Outer curve to waist left: C 2 87, 16 96, 36 101
// Spine transition: L 48 104
// Outer curve to lower-right: C 68 108, 82 116, 82 131
// Outer curve to bottom apex: C 82 148, 64 160, 42 160
// Outer curve to bottom-left terminal: C 20 160, 4 149, 4 134
// Terminal cut: L 24 134
// Inner bottom curve: C 24 140, 31 142, 42 142
// Inner lower-right curve: C 52 142, 62 136, 62 129
// Inner waist transition: C 62 118, 51 113, 32 108
// Inner spine transition: L 22 105
// Inner upper-left curve: C 8 101, 22 85, 22 70
// Inner top curve: C 22 58, 31 59, 42 59
// Inner upper-right curve: C 53 59, 60 62, 60 66
// Terminal cut: L 80 66 Z

const S_perfect = "M 80 66 C 80 50 63 40 42 40 C 20 40 2 52 2 70 C 2 87 16 96 36 101 L 48 104 C 68 108 82 116 82 131 C 82 148 64 160 42 160 C 20 160 4 149 4 134 L 24 134 C 24 140 31 142 42 142 C 52 142 62 136 62 129 C 62 118 51 113 32 108 L 22 105 C 8 101 22 84 22 70 C 22 58 31 59 42 59 C 53 59 60 62 60 66 L 80 66 Z";

console.log("Length of S path:", S_perfect.length);
