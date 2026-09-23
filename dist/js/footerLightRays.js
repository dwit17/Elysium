/**
 * LightRays Component — Realistic 3D Curvilinear Luminaire Engine
 * Calibrated to project naturally along the curved 3D elliptical lip of the hanging lamp bell
 * with ZERO gap and smooth physical light cone dispersion
 */
(function() {
  const DEFAULT_COLOR = '#fff8e7'; // Warm incandescent atelier glow matching the bulb

  const hexToRgb = hex => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 0.97, 0.9];
  };

  function initLightRays() {
    const container = document.getElementById('footer-rays-layer');
    const footerContainer = document.getElementById('footer-decor-container');
    const lampBtn = document.getElementById('footer-bulb-btn');
    if (!container || !footerContainer) return;

    // Parameters:
    const raysColor = '#fffbe8';
    const raysSpeed = 0.85;
    const lightSpread = 0.65;
    const rayLength = 3.2;
    const followMouse = true;
    const mouseInfluence = 0.12;
    const noiseAmount = 0.02;
    const distortion = 0.015;
    const pulsating = true;
    const fadeDistance = 1.35;
    const saturation = 1.2;

    // Create WebGL canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full block pointer-events-none custom-rays';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '1';
    canvas.style.mixBlendMode = 'screen';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
               canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });

    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const vert = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const frag = `
      precision highp float;

      uniform float iTime;
      uniform vec2  iResolution;

      uniform vec2  rayPos;
      uniform vec2  rayDir;
      uniform float rimCenterY;
      uniform float rimRadiusX;
      uniform float rimSagY;
      uniform vec3  raysColor;
      uniform float raysSpeed;
      uniform float lightSpread;
      uniform float rayLength;
      uniform float pulsating;
      uniform float fadeDistance;
      uniform float saturation;
      uniform vec2  mousePos;
      uniform float mouseInfluence;
      uniform float noiseAmount;
      uniform float distortion;

      varying vec2 vUv;

      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                        float seedA, float seedB, float speed) {
        vec2 sourceToCoord = coord - raySource;
        vec2 dirNorm = normalize(sourceToCoord);
        float cosAngle = dot(dirNorm, rayRefDirection);

        float distortedAngle = cosAngle + distortion * sin(iTime * 1.8 + length(sourceToCoord) * 0.01) * 0.2;
        float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

        float distance = length(sourceToCoord);
        float maxDistance = iResolution.x * rayLength;
        float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
        
        float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.4, 1.0);
        float pulse = pulsating > 0.5 ? (0.92 + 0.08 * sin(iTime * speed * 2.0)) : 1.0;

        float baseStrength = clamp(
          (0.48 + 0.16 * sin(distortedAngle * seedA + iTime * speed)) +
          (0.34 + 0.18 * cos(-distortedAngle * seedB + iTime * speed)),
          0.0, 1.0
        );

        return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
        
        vec2 finalRayDir = rayDir;
        if (mouseInfluence > 0.0) {
          vec2 mouseScreenPos = mousePos * iResolution.xy;
          vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
          finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
        }

        vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.4 * raysSpeed);
        vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.02340, 1.0 * raysSpeed);

        fragColor = rays1 * 0.65 + rays2 * 0.55;

        // 3D Curvilinear emission matching the exact downward elliptical lip of the lamp bell
        float dx = (coord.x - rayPos.x) / max(rimRadiusX, 1.0);
        // Elliptical curve: at center dx=0, rimCurveY is lowest; as dx moves left/right, it curves upward
        float rimCurveY = rimCenterY - rimSagY * (1.0 - min(dx * dx, 1.4));
        
        // Starts emitting directly inside the curved bell rim with ZERO gap
        float rimFade = smoothstep(rimCurveY - 14.0, rimCurveY + 28.0, coord.y);
        fragColor *= rimFade;

        if (noiseAmount > 0.0) {
          float n = noise(coord * 0.01 + iTime * 0.1);
          fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
        }

        // Maintain warm incandescent color gradient
        float brightness = 1.0 - (coord.y / iResolution.y);
        fragColor.x *= 0.95 + brightness * 0.05;
        fragColor.y *= 0.88 + brightness * 0.12;
        fragColor.z *= 0.72 + brightness * 0.28;

        if (saturation != 1.0) {
          float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
          fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
        }

        fragColor.rgb *= raysColor;
      }

      void main() {
        vec4 color;
        mainImage(color, gl_FragCoord.xy);
        gl_FragColor = color;
      }
    `;

    function createShader(type, src) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vShader = createShader(gl.VERTEX_SHADER, vert);
    const fShader = createShader(gl.FRAGMENT_SHADER, frag);
    if (!vShader || !fShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return;
    }

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]), gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    const uLoc = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      rayPos: gl.getUniformLocation(program, 'rayPos'),
      rayDir: gl.getUniformLocation(program, 'rayDir'),
      rimCenterY: gl.getUniformLocation(program, 'rimCenterY'),
      rimRadiusX: gl.getUniformLocation(program, 'rimRadiusX'),
      rimSagY: gl.getUniformLocation(program, 'rimSagY'),
      raysColor: gl.getUniformLocation(program, 'raysColor'),
      raysSpeed: gl.getUniformLocation(program, 'raysSpeed'),
      lightSpread: gl.getUniformLocation(program, 'lightSpread'),
      rayLength: gl.getUniformLocation(program, 'rayLength'),
      pulsating: gl.getUniformLocation(program, 'pulsating'),
      fadeDistance: gl.getUniformLocation(program, 'fadeDistance'),
      saturation: gl.getUniformLocation(program, 'saturation'),
      mousePos: gl.getUniformLocation(program, 'mousePos'),
      mouseInfluence: gl.getUniformLocation(program, 'mouseInfluence'),
      noiseAmount: gl.getUniformLocation(program, 'noiseAmount'),
      distortion: gl.getUniformLocation(program, 'distortion')
    };

    const mouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };
    let isVisible = true;
    let animId = null;

    function updatePlacement() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const wCSS = container.clientWidth || footerContainer.clientWidth;
      const hCSS = container.clientHeight || footerContainer.clientHeight;
      const w = wCSS * dpr;
      const h = hCSS * dpr;

      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);

      gl.useProgram(program);
      gl.uniform2f(uLoc.iResolution, w, h);

      // Calculate the lamp center, bottom rim aperture, and elliptical curvature
      const fRect = footerContainer.getBoundingClientRect();
      const lRect = lampBtn ? lampBtn.getBoundingClientRect() : null;
      
      let bulbCenterX = wCSS * 0.5;
      let bulbRimY = 188;
      let rimRadius = 80;
      let rimSag = 24;

      if (lRect) {
        bulbCenterX = (lRect.left + lRect.width * 0.5) - fRect.left;
        // The lowest bottom edge of the glowing bell is at ~82% height of the lamp container:
        bulbRimY = (lRect.top + lRect.height * 0.82) - fRect.top;
        // Rim semi-width is ~44% of lamp width:
        rimRadius = lRect.width * 0.44;
        // The vertical depth (sag) of the 3D downward curve:
        rimSag = lRect.height * 0.09;
      }

      // Position the virtual apex inside the bell housing
      const virtualOriginY = bulbRimY - (rimRadius * 1.6);

      gl.uniform2f(uLoc.rayPos, bulbCenterX * dpr, virtualOriginY * dpr);
      gl.uniform2f(uLoc.rayDir, 0.0, 1.0); // downwards
      gl.uniform1f(uLoc.rimCenterY, bulbRimY * dpr);
      gl.uniform1f(uLoc.rimRadiusX, rimRadius * dpr);
      gl.uniform1f(uLoc.rimSagY, rimSag * dpr);

      const rgb = hexToRgb(raysColor);
      gl.uniform3f(uLoc.raysColor, rgb[0], rgb[1], rgb[2]);
      gl.uniform1f(uLoc.raysSpeed, raysSpeed);
      gl.uniform1f(uLoc.lightSpread, lightSpread);
      gl.uniform1f(uLoc.rayLength, rayLength);
      gl.uniform1f(uLoc.pulsating, pulsating ? 1.0 : 0.0);
      gl.uniform1f(uLoc.fadeDistance, fadeDistance);
      gl.uniform1f(uLoc.saturation, saturation);
      gl.uniform1f(uLoc.mouseInfluence, mouseInfluence);
      gl.uniform1f(uLoc.noiseAmount, noiseAmount);
      gl.uniform1f(uLoc.distortion, distortion);
    }

    function loop(t) {
      if (!isVisible) {
        animId = null;
        return;
      }

      gl.useProgram(program);
      gl.uniform1f(uLoc.iTime, t * 0.001);

      if (followMouse && mouseInfluence > 0.0) {
        const smoothing = 0.90;
        smoothMouse.x = smoothMouse.x * smoothing + mouse.x * (1 - smoothing);
        smoothMouse.y = smoothMouse.y * smoothing + mouse.y * (1 - smoothing);
        gl.uniform2f(uLoc.mousePos, smoothMouse.x, smoothMouse.y);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(loop);
    }

    if (followMouse) {
      window.addEventListener('mousemove', e => {
        const rect = footerContainer.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) / rect.width;
        mouse.y = (e.clientY - rect.top) / rect.height;
      });
    }

    window.addEventListener('resize', updatePlacement);
    updatePlacement();
    animId = requestAnimationFrame(loop);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(loop);
        }
      }, { threshold: 0.05 });
      observer.observe(footerContainer);
    }

    window.setFooterLightRaysActive = function(active) {
      canvas.style.opacity = active ? '1' : '0';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightRays);
  } else {
    initLightRays();
  }
})();
