/**
 * Elysium Atelier — Synchronized Physical Pendant Lamp & WebGL LightRays Engine
 * 
 * Unifies the hanging pendant lamp bulb with the React Bits WebGL LightRays background.
 * The lamp is the physical light source; rays emanate directly from the bulb aperture
 * with zero gap, authentic downward conic dispersion, watery/atmospheric distortion,
 * gentle cursor response, and smooth scroll intensity fading.
 */
(function() {
  // --- CONFIGURATION & DEBUG TOGGLES ---
  const DEBUG_LIGHT_SOURCE = false; // Set to true to inspect red alignment marker and bounding boxes

  const RAYS_COLOR = '#F5E8C8';      // Warm architectural incandescent ivory/amber
  const RAYS_SPEED = 0.75;          // Slow, dignified organic pace
  const LIGHT_SPREAD = 0.62;        // Broad downward cone
  const RAY_LENGTH = 3.2;           // Depth of light projection
  const FADE_DISTANCE = 1.35;       // Soft falloff
  const NOISE_AMOUNT = 0.04;        // Subtle fluid dispersion (0.03 - 0.08)
  const DISTORTION = 0.07;          // Atmospheric watery refraction (0.05 - 0.12)
  const MOUSE_INFLUENCE = 0.04;     // Gentle atmospheric cursor response (0.03 - 0.06)
  const PULSATING = true;           // Subtle organic breathing

  const hexToRgb = hex => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [0.96, 0.91, 0.78];
  };

  function initLightRays() {
    const container = document.getElementById('footer-rays-layer');
    const footerContainer = document.getElementById('footer-decor-container');
    const lampBtn = document.getElementById('footer-bulb-btn');

    if (!container || !footerContainer) return;

    // Clear previous canvases if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full block pointer-events-none custom-rays';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    canvas.style.opacity = '1';
    canvas.style.mixBlendMode = 'multiply'; // Rich warm illumination onto neutral #ECECEC
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true }) ||
               canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });

    if (!gl) {
      console.warn('[Elysium] WebGL not supported for LightRays');
      return;
    }

    // --- DEBUG OVERLAY SETUP ---
    let debugMarker = null;
    if (DEBUG_LIGHT_SOURCE) {
      debugMarker = document.getElementById('elysium-light-debug-marker');
      if (!debugMarker) {
        debugMarker = document.createElement('div');
        debugMarker.id = 'elysium-light-debug-marker';
        debugMarker.style.position = 'absolute';
        debugMarker.style.width = '12px';
        debugMarker.style.height = '12px';
        debugMarker.style.borderRadius = '50%';
        debugMarker.style.backgroundColor = '#ff0033';
        debugMarker.style.boxShadow = '0 0 10px #ff0000, 0 0 20px #ff0000';
        debugMarker.style.border = '2px solid #ffffff';
        debugMarker.style.transform = 'translate(-50%, -50%)';
        debugMarker.style.zIndex = '9999';
        debugMarker.style.pointerEvents = 'none';
        footerContainer.appendChild(debugMarker);
      }
    }

    // --- SHADERS ---
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
      uniform float intensity;

      varying vec2 vUv;

      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                        float seedA, float seedB, float speed) {
        vec2 sourceToCoord = coord - raySource;
        vec2 dirNorm = normalize(sourceToCoord);
        float cosAngle = dot(dirNorm, rayRefDirection);

        // Subtle watery / atmospheric refraction
        float wave = sin(iTime * 1.5 * speed + length(sourceToCoord) * 0.012);
        float distortedAngle = cosAngle + distortion * wave * 0.22;
        float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

        float distance = length(sourceToCoord);
        float maxDistance = iResolution.x * rayLength;
        float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
        
        float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.35, 1.0);
        float pulse = pulsating > 0.5 ? (0.94 + 0.06 * sin(iTime * speed * 2.0)) : 1.0;

        float baseStrength = clamp(
          (0.46 + 0.18 * sin(distortedAngle * seedA + iTime * speed)) +
          (0.36 + 0.16 * cos(-distortedAngle * seedB + iTime * speed)),
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

        vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 34.2214, 20.11349, 1.3 * raysSpeed);
        vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 21.3991, 16.02340, 0.95 * raysSpeed);

        fragColor = rays1 * 0.62 + rays2 * 0.52;

        // 3D Curvilinear emission matching the exact downward elliptical lip of the lamp bell
        float dx = (coord.x - rayPos.x) / max(rimRadiusX, 1.0);
        float rimCurveY = rimCenterY - rimSagY * (1.0 - min(dx * dx, 1.35));
        
        // Starts emitting directly from the bulb opening with ZERO gap
        float rimFade = smoothstep(rimCurveY - 10.0, rimCurveY + 22.0, coord.y);
        fragColor *= rimFade;

        // Subtle fluid noise
        if (noiseAmount > 0.0) {
          float n = noise(coord * 0.008 + iTime * 0.08);
          fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
        }

        // Architectural warm incandescent coloration
        float brightness = 1.0 - (coord.y / iResolution.y);
        fragColor.x *= 0.96 + brightness * 0.04;
        fragColor.y *= 0.90 + brightness * 0.10;
        fragColor.z *= 0.78 + brightness * 0.22;

        fragColor.rgb *= raysColor;
        fragColor *= intensity;
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
      distortion: gl.getUniformLocation(program, 'distortion'),
      intensity: gl.getUniformLocation(program, 'intensity')
    };

    const mouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };
    let isVisible = true;
    let isLitActive = true;
    let animId = null;

    // Smooth scroll / visibility intensity interpolation
    let targetIntensity = 1.0;
    let currentIntensity = 1.0;

    function calculateLampGeometry() {
      const cRect = footerContainer.getBoundingClientRect();
      const lRect = lampBtn ? lampBtn.getBoundingClientRect() : null;

      const wCSS = footerContainer.clientWidth || window.innerWidth;
      const hCSS = footerContainer.clientHeight || window.innerHeight;

      let sourceX = wCSS * 0.5;
      let sourceY = 180;
      let rimRadius = 80;
      let rimSag = 22;

      if (lRect && cRect) {
        // Exact horizontal center of the physical lamp
        sourceX = (lRect.left + lRect.width * 0.5) - cRect.left;
        // The bottom opening/aperture where light physically emerges (approx 74% of lamp container height)
        sourceY = (lRect.top + lRect.height * 0.74) - cRect.top;
        rimRadius = lRect.width * 0.44;
        rimSag = lRect.height * 0.085;
      }

      // Update CSS variables for the light pool and atmospheric gradients
      footerContainer.style.setProperty('--lamp-pos-x', `${Math.round(sourceX)}px`);
      footerContainer.style.setProperty('--lamp-pos-y', `${Math.round(sourceY)}px`);

      if (DEBUG_LIGHT_SOURCE && debugMarker) {
        debugMarker.style.left = `${sourceX}px`;
        debugMarker.style.top = `${sourceY}px`;
        console.log(`[Elysium Light Debug] Lamp: ${sourceX.toFixed(1)}px, ${sourceY.toFixed(1)}px | Radius: ${rimRadius.toFixed(1)}px`);
      }

      return { sourceX, sourceY, rimRadius, rimSag, wCSS, hCSS };
    }

    function updatePlacement() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const geom = calculateLampGeometry();

      const w = geom.wCSS * dpr;
      const h = geom.hCSS * dpr;

      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);

      gl.useProgram(program);
      gl.uniform2f(uLoc.iResolution, w, h);

      // Virtual origin inside the bell housing for conic apex
      const virtualOriginY = geom.sourceY - (geom.rimRadius * 1.5);

      gl.uniform2f(uLoc.rayPos, geom.sourceX * dpr, virtualOriginY * dpr);
      gl.uniform2f(uLoc.rayDir, 0.0, 1.0); // Travel strictly downwards into the space
      gl.uniform1f(uLoc.rimCenterY, geom.sourceY * dpr);
      gl.uniform1f(uLoc.rimRadiusX, geom.rimRadius * dpr);
      gl.uniform1f(uLoc.rimSagY, geom.rimSag * dpr);

      const rgb = hexToRgb(RAYS_COLOR);
      gl.uniform3f(uLoc.raysColor, rgb[0], rgb[1], rgb[2]);
      gl.uniform1f(uLoc.raysSpeed, RAYS_SPEED);
      gl.uniform1f(uLoc.lightSpread, LIGHT_SPREAD);
      gl.uniform1f(uLoc.rayLength, RAY_LENGTH);
      gl.uniform1f(uLoc.pulsating, PULSATING ? 1.0 : 0.0);
      gl.uniform1f(uLoc.fadeDistance, FADE_DISTANCE);
      gl.uniform1f(uLoc.saturation, 1.15);
      gl.uniform1f(uLoc.mouseInfluence, MOUSE_INFLUENCE);
      gl.uniform1f(uLoc.noiseAmount, NOISE_AMOUNT);
      gl.uniform1f(uLoc.distortion, DISTORTION);
      gl.uniform1f(uLoc.intensity, currentIntensity);
    }

    function loop(t) {
      if (!isVisible) {
        animId = null;
        return;
      }

      // Smooth intensity interpolation on scroll / state toggle
      targetIntensity = isLitActive ? 1.0 : 0.0;
      currentIntensity += (targetIntensity - currentIntensity) * 0.08;

      gl.useProgram(program);
      gl.uniform1f(uLoc.iTime, t * 0.001);
      gl.uniform1f(uLoc.intensity, currentIntensity);

      if (MOUSE_INFLUENCE > 0.0) {
        const smoothing = 0.92;
        smoothMouse.x = smoothMouse.x * smoothing + mouse.x * (1 - smoothing);
        smoothMouse.y = smoothMouse.y * smoothing + mouse.y * (1 - smoothing);
        gl.uniform2f(uLoc.mousePos, smoothMouse.x, smoothMouse.y);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', e => {
      const rect = footerContainer.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    }, { passive: true });

    // ResizeObserver for dynamic reactive layout tracking
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        updatePlacement();
      });
      ro.observe(footerContainer);
      if (lampBtn) ro.observe(lampBtn);
    } else {
      window.addEventListener('resize', updatePlacement, { passive: true });
    }

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
      isLitActive = active;
      canvas.style.opacity = active ? '1' : '0';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightRays);
  } else {
    initLightRays();
  }
})();
