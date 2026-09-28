const fs = require('fs');

// Master Typography Definition
const E_path = "M 0 40 L 82 40 L 82 59 L 20 59 L 20 91 L 72 91 L 72 109 L 20 109 L 20 141 L 82 141 L 82 160 L 0 160 Z";
const L_path = "M 0 40 L 20 40 L 20 141 L 76 141 L 76 160 L 0 160 Z";
const Y_path = "M 0 40 L 24 40 L 46 88 L 68 40 L 92 40 L 56 102 L 56 160 L 36 160 L 36 102 Z";

// Refined architectural grotesque S with perfect curvature & 19.5px uniform weight
// Width: 84, Height: 120 (40 to 160), Center: (42, 100)
const S_path = "M 78 68 C 78 51 63 40 42 40 C 20 40 6 52 6 70 C 6 86 17 95 38 100 L 48 102 C 63 106 72 113 72 128 C 72 145 58 160 38 160 C 18 160 6 148 6 132 L 25 132 C 25 140 31 142 38 142 C 47 142 53 136 53 128 C 53 118 44 113 28 109 L 18 106 C 5 102 0 91 0 70 C 0 44 19 23 42 23 C 68 23 88 41 88 68 Z";

// Let's create an even cleaner closed bezier path for S:
// Outer contour + Inner contour
const S_clean = "M 76 68 C 76 52 62 40 42 40 C 21 40 6 53 6 70 C 6 86 17 95 36 100 L 48 103 C 63 107 72 114 72 128 C 72 144 58 160 38 160 C 18 160 6 147 6 131 L 26 131 C 26 139 31 142 38 142 C 47 142 53 136 53 128 C 53 117 44 112 28 108 L 18 105 C 4 101 0 90 0 70 C 0 45 18 22 42 22 C 67 22 88 41 88 68 Z";

// Actually, let's create a mathematically perfect true closed S path with outer boundary & inner cuts:
const S_exact = "M 80 66 C 80 50 64 40 42 40 C 20 40 6 52 6 70 C 6 87 18 96 38 101 L 46 103 C 63 107 72 114 72 129 C 72 145 58 160 38 160 C 18 160 5 148 5 131 L 24 131 C 24 139 30 142 38 142 C 47 142 53 136 53 129 C 53 118 44 113 29 109 L 20 106 C 5 102 0 91 0 70 C 0 45 18 23 42 23 C 67 23 88 41 88 66 Z";

const I_path = "M 0 40 L 20 40 L 20 160 L 0 160 Z";
const U_path = "M 0 40 L 20 40 L 20 118 C 20 132 30 141 44 141 C 58 141 68 132 68 118 L 68 40 L 88 40 L 88 118 C 88 144 69 160 44 160 C 19 160 0 144 0 118 Z";
const M_path = "M 0 40 L 22 40 L 57 114 L 92 40 L 114 40 L 114 160 L 94 160 L 94 76 L 65 136 L 49 136 L 20 76 L 20 160 L 0 160 Z";

// Let's create an SVG file to test
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 200" width="1100" height="200" style="background:#ececec;">
  <g id="elysium" fill="#1c1c1c">
    <!-- E -->
    <path id="let-E" d="${E_path}" transform="translate(117, 0)" />
    <!-- L -->
    <path id="let-L" d="${L_path}" transform="translate(253, 0)" />
    <!-- Y -->
    <path id="let-Y" d="${Y_path}" transform="translate(373, 0)" />
    <!-- S -->
    <g id="let-S-wrap" transform="translate(513, 0)">
      <path id="let-S" d="${S_exact}" />
    </g>
    <!-- I -->
    <path id="let-I" d="${I_path}" transform="translate(653, 0)" />
    <!-- U -->
    <path id="let-U" d="${U_path}" transform="translate(729, 0)" />
    <!-- M -->
    <path id="let-M" d="${M_path}" transform="translate(869, 0)" />
  </g>
</svg>
`;

fs.writeFileSync('e:/Elysium-Project/.system_generated_scratch/elysium_test.svg', svg);
console.log("Written elysium_test.svg");
