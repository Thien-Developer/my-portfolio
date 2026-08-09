import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- COMPONENT RENDER 3D: MODERN LOGIC MECHANICAL KEYBOARD ---
export default function CyberWorkspace({ onHover }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5.5, 7.2);
    camera.lookAt(0, -0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    containerRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      // Responsive scale for the 3D keyboard
      const scale = width < 480 ? 0.6 : width < 768 ? 0.8 : 1.05;
      group.scale.set(scale, scale, scale);
    };

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(0, 10, 5);
    scene.add(topLight);

    const skills = [
      { label: "HTML", symbol: "</>", color: "#f97316", group: "main", level: "Thành thạo" },
      { label: "CSS", symbol: "{#}", color: "#0ea5e9", group: "main", level: "Thành thạo" },
      { label: "JS", symbol: "JS", color: "#eab308", group: "main", level: "Thành thạo" },
      { label: "TS", symbol: "TS", color: "#3b82f6", group: "main", level: "Vững" },
      { label: "PHP", symbol: "🐘", color: "#818cf8", group: "main", level: "Vững" },
      { label: "REACT", symbol: "⚛", color: "#61dbfb", group: "accent", level: "Vững" },
      { label: "NEXTJS", symbol: "▲", color: "#f8fafc", group: "accent", level: "Vững" },
      { label: "NODE", symbol: "⬢", color: "#4ade80", group: "accent", level: "Vững" },
      { label: "NESTJS", symbol: "N", color: "#ef4444", group: "accent", level: "Vững" },
      { label: "TAILWIND", symbol: "~", color: "#22d3ee", group: "accent", level: "Thành thạo" },
      { label: "WORDPRESS", symbol: "W", color: "#21759b", group: "accent", level: "Cơ bản" },
      { label: "MYSQL", symbol: "DB", color: "#f59e0b", group: "sys" },
      { label: "SUPABASE", symbol: "⚡", color: "#4ade80", group: "sys" },
      { label: "SOCKET.IO", symbol: "⚙", color: "#a855f7", group: "sys" },
      { label: "GITHUB", symbol: "git", color: "#94a3b8", group: "sys" },
      { label: "AWS EC2", symbol: "☁", color: "#ea580c", group: "sys" },
    ];

    const createKeyTexture = (text, symbol, color, groupType) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      let bgColor = '#1e293b';
      if (groupType === 'accent') bgColor = '#0f172a';
      if (groupType === 'sys') bgColor = '#020617';

      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(0, 0, 512, 512, 50);
      ctx.fill();

      ctx.fillStyle = color;
      ctx.font = 'bold 180px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, 256, 220);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 60px "Inter", sans-serif';
      ctx.fillText(text, 256, 410);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const cols = 5;
    const rows = Math.ceil(skills.length / cols);
    const rowStart = -((rows - 1) / 2) * 1.05;
    const lastRowCount = skills.length - (rows - 1) * cols;

    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 0.4, rows * 1.05 + 0.7),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
    );
    chassis.position.y = -0.15;
    group.add(chassis);

    const keyGeo = new THREE.BoxGeometry(0.75, 0.5, 0.75);
    const keyMeshes = [];

    skills.forEach((skill, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const colsInRow = row === rows - 1 ? lastRowCount : cols;
      const colStart = -((colsInRow - 1) / 2) * 1.05;

      const material = new THREE.MeshStandardMaterial({
        map: createKeyTexture(skill.label, skill.symbol, skill.color, skill.group),
        emissive: skill.color,
        emissiveIntensity: 0.15,
        roughness: 0.4,
        metalness: 0.1
      });

      const key = new THREE.Mesh(keyGeo, material);
      key.position.set(colStart + col * 1.05, 0.35, rowStart + row * 1.05);
      key.userData = { ...skill, originalY: 0.35 };
      group.add(key);
      keyMeshes.push(key);
    });

    updateScale();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      updateScale();
    };

    window.addEventListener('resize', handleResize);

    const raycaster = new THREE.Raycaster();
    const mPos = new THREE.Vector2();

    const onMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      mPos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mPos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mPos, camera);
      const intersects = raycaster.intersectObjects(keyMeshes);

      keyMeshes.forEach(k => {
        k.position.y = THREE.MathUtils.lerp(k.position.y, k.userData.originalY, 0.15);
        k.material.emissiveIntensity = THREE.MathUtils.lerp(k.material.emissiveIntensity, 0.15, 0.1);
      });

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        obj.position.y = 0.22;
        obj.material.emissiveIntensity = 4.0;

        let infoText = "";
        if (obj.userData.group === "sys") {
          infoText = `${obj.userData.label} • CÔNG CỤ BỔ TRỢ`;
        } else {
          infoText = `${obj.userData.label} • THÔNG THẠO: ${obj.userData.level}`;
        }
        onHover(infoText);
      }
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);

    let animId;
    const animate = (time) => {
      const t = time * 0.001;
      group.rotation.y = Math.sin(t * 0.1) * 0.04;
      group.rotation.x = 0.25;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate(0);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', onMouseMove);
        if (renderer.domElement.parentNode) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[350px] md:min-h-[450px]" />;
}
