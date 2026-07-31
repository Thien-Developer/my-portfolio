import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
  Code2,
  Terminal,
  Globe,
  Layers,
  Database,
  Github,
  Server,
  Cloud,
  Network,
  Palette,
  Monitor,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Coffee,
  MessageSquare,
  ShieldCheck,
  X,
  MapPin,
  Calendar,
  BookOpen,
  Zap,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import avatarImg from './assets/images/avatar.jpg';

// --- COMPONENT RENDER 3D: MODERN LOGIC MECHANICAL KEYBOARD ---
const CyberWorkspace = ({ onHover }) => {
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
      { label: "HTML", symbol: "</>", color: "#f97316", group: "main", level: "95%" },
      { label: "CSS", symbol: "{#}", color: "#0ea5e9", group: "main", level: "95%" },
      { label: "JS", symbol: "JS", color: "#eab308", group: "main", level: "90%" },
      { label: "TS", symbol: "TS", color: "#3b82f6", group: "main", level: "85%" },
      { label: "PHP", symbol: "🐘", color: "#818cf8", group: "main", level: "85%" },
      { label: "REACT", symbol: "⚛", color: "#61dbfb", group: "accent", level: "80%" },
      { label: "NEXTJS", symbol: "▲", color: "#f8fafc", group: "accent", level: "85%" },
      { label: "NODE", symbol: "⬢", color: "#4ade80", group: "accent", level: "85%" },
      { label: "NESTJS", symbol: "N", color: "#ef4444", group: "accent", level: "80%" },
      { label: "TAILWIND", symbol: "~", color: "#22d3ee", group: "accent", level: "90%" },
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

    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 0.4, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
    );
    chassis.position.y = -0.15;
    group.add(chassis);

    const keyGeo = new THREE.BoxGeometry(0.75, 0.5, 0.75);
    const keyMeshes = [];

    skills.forEach((skill, i) => {
      const row = Math.floor(i / 5);
      const col = i % 5;

      const material = new THREE.MeshStandardMaterial({
        map: createKeyTexture(skill.label, skill.symbol, skill.color, skill.group),
        emissive: skill.color,
        emissiveIntensity: 0.15,
        roughness: 0.4,
        metalness: 0.1
      });

      const key = new THREE.Mesh(keyGeo, material);
      key.position.set(-2.1 + col * 1.05, 0.35, -1 + row * 1.05);
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
};

const StudentIDCard = () => {
  const [step, setStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setStep((prev) => (prev + 1) % 3);
  };

  return (
    <div className="absolute top-0 left-0 z-[60] flex flex-col items-start pointer-events-none origin-top-left transition-all duration-700">
      {/* Dây đeo */}
      <motion.div
        initial={{ height: 15 }}
        animate={{
          height: step === 0 ? 15 : 140,
        }}
        transition={{
          height: { type: "spring", stiffness: 70, damping: 20 },
        }}
        className="w-[3px] relative origin-top flex flex-col items-center"
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#334155,#334155_2px,#64748b_2px,#64748b_4px)] rounded-full shadow-lg" />
        <div className="absolute top-0 w-3 h-3 bg-slate-800 rounded-full border border-slate-600 -translate-y-1/2" />
      </motion.div>

      {/* Thẻ và Holder */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        initial={{ rotateY: 0, scale: 0.25, y: -5 }}
        animate={{
          rotateY: step === 2 ? 180 : 0,
          scale: step === 0 ? 0.25 : 1,
          y: step === 0 ? -5 : 0,
          rotateZ: step === 0 ? 0 : (isHovered ? [-6, 6] : [-3, 3]),
        }}
        transition={{
          rotateY: { type: "spring", stiffness: 120, damping: 20 },
          rotateZ: {
            duration: isHovered ? 1.5 : 3.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          },
          scale: { type: "spring", stiffness: 150, damping: 25 }
        }}
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        className="relative w-44 h-64 md:w-56 md:h-80 cursor-pointer pointer-events-auto group mt-[-2px] origin-top-left"
      >
        {/* Móc sắt */}
        <div className="absolute -top-3 left-0 w-5 h-5 border-4 border-slate-500 rounded-full z-20 bg-slate-900 shadow-lg" />

        {/* Mặt trước */}
        <div
          className="absolute inset-0 bg-slate-900 border-[5px] border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full -translate-y-16 translate-x-16" />

          <div className="w-full text-center border-b border-white/10 pb-2 mb-4 relative z-10">
             <p className="text-[9px] font-black text-white uppercase tracking-widest">Student Card</p>
             <p className="text-[6px] text-sky-400 font-bold uppercase">Lập Trình Web</p>
          </div>

          <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden border-2 border-white/5 bg-slate-800 relative group-hover:scale-105 transition-transform duration-500 z-10">
            <img
              src={avatarImg}
              alt="Võ Thiên Nhi"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
          </div>

          <div className="text-center mt-5 relative z-10">
            <h3 className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase italic leading-none">THIÊN NHI</h3>
            <p className="text-slate-500 text-[8px] font-bold mt-1 uppercase tracking-widest">ID: 2026.CD.ST</p>
          </div>

          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500/20 via-purple-500/10 to-transparent blur-[8px] animate-pulse" />
        </div>

        {/* Mặt sau */}
        <div
          className="absolute inset-0 bg-slate-900 border-[5px] border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="absolute top-0 left-0 w-full h-16 bg-sky-500/10 -skew-y-12 -translate-y-8" />

          <div className="relative z-10 space-y-4 mt-2">
            {[
              { icon: <Calendar />, label: "Ngày sinh", val: "21 / 05 / 2004" },
              { icon: <BookOpen />, label: "Chuyên ngành", val: "Lập Trình Web" },
              { icon: <MapPin />, label: "Địa chỉ", val: "Thủ Đức, TP.HCM" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="text-sky-400 w-3.5 h-3.5">{item.icon}</div>
                <div>
                  <p className="text-[7px] text-slate-500 uppercase font-black">{item.label}</p>
                  <p className="text-[10px] text-white font-bold">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-center border-t border-white/10 pt-4">
             <p className="text-[8px] text-slate-500 font-medium italic">Fresher Fullstack Developer</p>
             <p className="text-[10px] text-sky-500 font-black tracking-widest mt-1">THIEN.DEV</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [hoverDetail, setHoverDetail] = useState("RÊ CHUỘT LÊN PHÍM ĐỂ XEM CHI TIẾT...");
  const [showZaloQR, setShowZaloQR] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const skillsData = [
    { name: "HTML / CSS", level: "95%", icon: <Palette className="w-5 h-5" />, color: "text-orange-400" },
    { name: "JavaScript / TS", level: "90%", icon: <Code2 className="w-5 h-5" />, color: "text-yellow-400" },
    { name: "PHP / Java", level: "85%", icon: <Coffee className="w-5 h-5" />, color: "text-indigo-400" },
    { name: "React / Next.js", level: "85%", icon: <Layers className="w-5 h-5" />, color: "text-sky-400" },
    { name: "Node.js / NestJS", level: "85%", icon: <Terminal className="w-5 h-5" />, color: "text-green-400" },
    { name: "Tailwind CSS", level: "90%", icon: <Monitor className="w-5 h-5" />, color: "text-cyan-400" },
    { name: "Socket.io", level: "80%", icon: <MessageSquare className="w-5 h-5" />, color: "text-emerald-400" },
    { name: "MySQL / Supabase", level: "85%", icon: <Database className="w-5 h-5" />, color: "text-purple-400" },
    { name: "Git & GitHub", level: null, icon: <Github className="w-5 h-5" />, color: "text-white" },
    { name: "AWS EC2 / Apache", level: null, icon: <Cloud className="w-5 h-5" />, color: "text-orange-600" },
    { name: "Groq AI Integration", level: null, icon: <Zap className="w-5 h-5" />, color: "text-yellow-500" },
    { name: "OAuth / Bảo mật", level: null, icon: <KeyRound className="w-5 h-5" />, color: "text-blue-400" }
  ];

  const projects = [
    {
      title: "Tuấn Huy Computer",
      tech: "PHP THUẦN • MYSQL • AWS EC2",
      desc: "Website TMĐT bán linh kiện máy tính, xây dựng bằng PHP thuần và MySQL — không dùng framework, không Composer, không npm. Tích hợp AI hỗ trợ nghiệp vụ, đăng nhập Google OAuth, công cụ build cấu hình PC và hệ thống quản trị phân quyền nhiều cấp. Đồ án tốt nghiệp kiêm dự án thực tập.",
      features: [
        "Tự viết router MVC thuần qua .htaccess, không dùng framework/Composer/npm.",
        "Giỏ hàng, áp mã giảm giá, đặt hàng, thanh toán Techcombank VietQR hoặc MoMo deeplink.",
        "Đăng ký/đăng nhập truyền thống hoặc qua Google OAuth 2.0.",
        "Công cụ build cấu hình PC theo linh kiện, tự kiểm tra tương thích.",
        "Trợ lý AI (Groq vision): sinh tên/mô tả sản phẩm, tìm ảnh, xóa nền ảnh, phát hiện trùng lặp, chatbot hỗ trợ nghiệp vụ.",
        "Trang quản trị đầy đủ: sản phẩm, danh mục, đơn hàng, khách hàng, tồn kho, banner, thống kê doanh thu.",
        "Phân quyền 3 cấp (Admin/Manager/Staff) qua Middleware — Staff chỉ sửa sản phẩm trong 15 phút sau khi tạo.",
        "Bot Telegram thông báo đơn hàng/sự kiện real-time, xử lý qua cron/daemon.",
        "CI/CD tự động qua GitHub Actions, tối ưu hiệu năng bằng nén gzip + cache trình duyệt qua .htaccess."
      ],
      icon: <Globe className="w-10 h-10 text-sky-400" />,
      theme: "sky",
      liveUrl: "http://44.200.84.42",
      githubUrl: "https://github.com/Thien-Developer/tuanhuy-computer"
    },
    {
      title: "NextTalk",
      tech: "NESTJS • SOCKET.IO • SUPABASE",
      desc: "Ứng dụng nhắn tin thời gian thực. Backend đã deploy live trên Render, frontend đang hoàn thiện — dự án đang trong quá trình phát triển.",
      features: [
        "Xây dựng backend NestJS + TypeScript, REST API và schema dữ liệu bằng Prisma trên PostgreSQL (Supabase).",
        "Nhắn tin thời gian thực, quản lý nhóm chat bằng Socket.io.",
        "Admin Dashboard phân quyền RBAC để quản trị người dùng.",
        "Đăng nhập Google OAuth; frontend Next.js, quản lý state với Zustand và React Query."
      ],
      icon: <MessageSquare className="w-10 h-10 text-indigo-400" />,
      theme: "indigo",
      liveUrl: null,
      githubUrl: "https://github.com/Thien-Developer/NextTalk"
    },
    {
      title: "LaptopCenter",
      tech: "NEXT.JS 16 • SUPABASE • GROQ AI",
      desc: "Website TMĐT chuyên bán lẻ laptop Gaming, Văn phòng, MacBook, Ultrabook và Workstation chính hãng, xây dựng trên Next.js App Router. Đầy đủ luồng mua hàng cho khách và trang quản trị đa vai trò (4 cấp quyền) với bộ công cụ AI hỗ trợ vận hành.",
      features: [
        "Trang chủ động: tìm kiếm + lọc nhanh theo thương hiệu, danh mục Bán chạy nhất, Flash Sale đếm ngược thời gian thực, Hàng mới về, đánh giá khách hàng.",
        "Tìm kiếm/lọc sản phẩm theo từ khóa, thương hiệu, danh mục, khoảng giá — đồng bộ qua query string, chia sẻ link lọc được.",
        "Giỏ hàng lưu localStorage, checkout khách vãng lai lẫn thành viên, chọn COD hoặc chuyển khoản, áp mã giảm giá xác thực lại phía server.",
        "Đăng nhập email/mật khẩu hoặc Google OAuth; hồ sơ cá nhân, lịch sử đơn hàng.",
        "Trang quản trị /admin phân quyền 4 cấp (Customer/Admin/Manager/Staff): sản phẩm, danh mục, tồn kho, đơn hàng, khách hàng, nhân sự.",
        "Audit Logs ghi lại toàn bộ thao tác tạo/sửa/xóa quan trọng trong hệ thống admin.",
        "Bộ 3 tính năng AI (Groq): AI Generator (viết mô tả, đọc thông tin từ ảnh sản phẩm), AI Assistant (chatbot kèm ngữ cảnh số liệu thật), AI Report (phân tích bán hàng, đề xuất giá).",
        "Bảo mật nhiều lớp: JWT (jose) + cookie httpOnly, bcrypt, Row Level Security (Supabase), rate limiting theo IP, validate input server-side.",
        "Xuất hóa đơn PDF, biểu đồ doanh thu (Recharts), SEO tự động (sitemap.xml, OpenGraph).",
        "Triển khai trên Vercel; cron keep-alive giữ Supabase free-tier không bị ngủ."
      ],
      icon: <Monitor className="w-10 h-10 text-emerald-400" />,
      theme: "emerald",
      liveUrl: "https://laptopcenter.vercel.app",
      githubUrl: "https://github.com/Thien-Developer/laptopcenter-next"
    }
  ];

  return (
    <div className="bg-[#020617] text-slate-200 min-h-screen font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 z-[100] origin-left" style={{ scaleX }} />

      {/* Navbar */}
      <nav className="fixed top-2 md:top-6 left-0 w-full z-50 px-3 md:px-6 pointer-events-none">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-5xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/5 p-2 rounded-xl md:rounded-2xl flex justify-between items-center shadow-2xl pointer-events-auto"
        >
          <div className="flex items-center">
            <div className="relative w-0 h-0">
              <StudentIDCard />
            </div>
            <div className="px-2 md:px-4 font-black text-base md:text-xl tracking-tighter cursor-pointer group" onClick={() => scrollToSection('hero')}>
              <span className="text-white group-hover:text-sky-400 transition-colors uppercase tracking-widest pl-0">THIEN</span>
              <span className="text-sky-500">.DEV</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {['skills', 'projects', 'contact'].map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="px-2 md:px-4 py-1.5 rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {id === 'skills' ? 'Kỹ năng' : id === 'projects' ? 'Dự án' : 'Liên hệ'}
              </button>
            ))}
          </div>
        </motion.div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-12 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-sky-500/10 blur-[120px] rounded-full -z-10 animate-pulse" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-16 items-center w-full relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black tracking-widest uppercase mx-auto lg:mx-0">
              <ShieldCheck className="w-3 h-3" /> Fresher Fullstack Developer
            </div>
            <h1 className="text-[clamp(2.5rem,12vw,6.5rem)] font-black leading-[0.85] tracking-tighter uppercase italic">
              <span className="block text-white">THIÊN</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 animate-gradient-x">
                PORTFOLIO
              </span>
            </h1>
            <p className="text-slate-400 text-sm md:text-lg max-w-md leading-relaxed font-medium mx-auto lg:mx-0">
              Vừa tốt nghiệp ngành Lập trình Web, chuyên xây dựng ứng dụng <span className="text-white">Web</span>, <span className="text-white">Real-time Chat</span> & tích hợp <span className="text-white">AI</span> tối ưu hiệu suất.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <button onClick={() => scrollToSection('projects')} className="px-8 py-4 bg-sky-500 text-white text-xs md:text-sm font-black rounded-xl hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20 active:scale-95">
                XEM DỰ ÁN
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-8 py-4 bg-slate-900 border border-slate-800 text-white text-xs md:text-sm font-black rounded-xl hover:bg-slate-800 transition-all active:scale-95">
                LIÊN HỆ
              </button>
            </div>
          </motion.div>

          {/* 3D KEYBOARD DISPLAY */}
          <div className="relative h-[400px] md:h-[550px] lg:h-[650px] w-full bg-slate-900/20 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-sm order-1 lg:order-2">
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-30 pointer-events-none">
              <div className="bg-slate-950/95 backdrop-blur-2xl px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl border border-white/10 shadow-2xl min-w-[200px] md:min-w-[260px]">
                <div className="flex items-center gap-2 mb-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                   <span className="text-[8px] md:text-[9px] text-sky-400 font-black uppercase tracking-[0.2em]">SKILL ANALYZER</span>
                </div>
                <p className="text-[10px] md:text-xs font-black text-white leading-tight italic uppercase">
                  {hoverDetail}
                </p>
              </div>
            </div>
            <CyberWorkspace onHover={setHoverDetail} />
          </div>
        </div>
      </section>

      {/* 2. SKILLS SECTION */}
      <section id="skills" className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                KỸ NĂNG CÔNG NGHỆ
              </h2>
              <div className="h-1 w-16 bg-sky-500 rounded-full" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px]">Đa nền tảng • Hiệu suất • Thẩm mỹ</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {skillsData.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-5 md:p-8 bg-slate-900/40 border border-white/5 rounded-2xl md:rounded-3xl hover:bg-slate-800/60 transition-all group relative overflow-hidden"
              >
                <div className={`mb-4 md:mb-6 p-2 md:p-3 bg-slate-800 w-fit rounded-lg md:rounded-xl group-hover:bg-sky-500 group-hover:text-white transition-all ${s.color}`}>
                  {s.icon}
                </div>
                <div className="font-black text-[9px] md:text-xs uppercase tracking-widest text-slate-400 mb-1 group-hover:text-white transition-colors truncate">{s.name}</div>

                {s.level ? (
                  <>
                    <div className="text-white font-black text-lg md:text-2xl italic tracking-tighter mb-3">{s.level}</div>
                    <div className="w-full bg-white/5 h-1 md:h-1.5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: s.level }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-sky-600 to-sky-400"
                        />
                    </div>
                  </>
                ) : (
                  <div className="mt-2 md:mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                    <CheckCircle2 className="w-3 md:w-4 h-3 md:h-4 text-sky-500" />
                    <span className="text-[7px] md:text-[9px] font-bold uppercase text-slate-500 tracking-wider">Công cụ hỗ trợ</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROJECTS SECTION */}
      <section id="projects" className="py-20 md:py-32 px-4 md:px-6 relative bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16 md:mb-24">
              <p className="text-sky-500 font-black tracking-[0.3em] text-[9px] md:text-[10px] uppercase mb-4">Portfolio Highlights</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">DỰ ÁN TIÊU BIỂU</h2>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="p-8 md:p-10 bg-slate-900 border border-white/5 rounded-[2rem] group transition-all relative overflow-hidden flex flex-col min-h-[400px]"
              >
                <div className="mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">{p.icon}</div>
                <h3 className="text-xl md:text-2xl font-black mb-3 uppercase italic tracking-tighter text-white">{p.title}</h3>
                <p className={`font-mono text-[8px] md:text-[9px] mb-5 uppercase font-black tracking-[0.2em] p-2 bg-white/5 rounded-lg w-fit ${
                  p.theme === 'sky' ? 'text-sky-400' : p.theme === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'
                }`}>
                  {p.tech}
                </p>
                <p className="text-slate-400 leading-relaxed text-sm mb-8 font-medium flex-grow">
                  {p.desc}
                </p>
                <div className="pt-6 border-t border-white/5">
                   <button onClick={() => setSelectedProject(p)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-sky-400 transition-all">
                    XEM CHI TIẾT <ChevronRight className="w-3 h-3 text-sky-500" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACT SECTION */}
      <section id="contact" className="py-24 md:py-40 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10 md:space-y-12">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}>
              <h2 className="text-4xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
                KẾT NỐI <span className="text-sky-500">LIÊN HỆ</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4">
                Luôn sẵn sàng cho các cơ hội hợp tác và dự án sáng tạo mới. Hãy kết nối để cùng tạo nên giá trị!
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
              <a href="mailto:nhthin366@gmail.com" className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-white text-black text-xs md:text-sm font-black rounded-xl md:rounded-2xl hover:bg-sky-500 hover:text-white transition-all shadow-2xl active:scale-95 text-center">
                GỬI EMAIL NGAY
              </a>
              <div className="flex gap-4">
                <a href="https://github.com/Thien-Developer" target="_blank" rel="noopener noreferrer" className="p-4 md:p-5 bg-slate-900 rounded-xl md:rounded-2xl border border-white/5 hover:border-sky-500 transition-colors text-white">
                    <Github className="w-6 h-6" />
                </a>
                <button onClick={() => setShowZaloQR(true)} className="p-4 md:p-5 bg-slate-900 rounded-xl md:rounded-2xl border border-white/5 hover:border-sky-500 transition-colors text-white">
                    <MessageSquare className="w-6 h-6" />
                </button>
              </div>
            </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center px-4">
        <p className="text-[9px] md:text-[11px] font-black tracking-[1em] md:tracking-[1.5em] uppercase text-slate-600">THIEN • PORTFOLIO • 2026</p>
      </footer>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-[2rem] max-w-2xl w-full relative shadow-[0_0_50px_rgba(14,165,233,0.1)] max-h-[85vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 z-20 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 md:p-10 pb-0 flex-shrink-0">
                <div className="mb-6">{selectedProject.icon}</div>
                <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white mb-3 pr-10">{selectedProject.title}</h3>
                <p className={`font-mono text-[8px] md:text-[9px] mb-2 uppercase font-black tracking-[0.2em] p-2 bg-white/5 rounded-lg w-fit ${
                  selectedProject.theme === 'sky' ? 'text-sky-400' : selectedProject.theme === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'
                }`}>
                  {selectedProject.tech}
                </p>
              </div>

              <div className="px-8 md:px-10 py-6 overflow-y-auto flex-1">
                <p className="text-slate-400 leading-relaxed text-sm mb-6 font-medium">
                  {selectedProject.desc}
                </p>

                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div className="space-y-3">
                    {selectedProject.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          selectedProject.theme === 'sky' ? 'text-sky-400' : selectedProject.theme === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'
                        }`} />
                        <p className="text-slate-300 text-sm leading-relaxed">{f}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(selectedProject.liveUrl || selectedProject.githubUrl) && (
                <div className="p-6 md:p-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 flex-shrink-0">
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-sky-400 transition-all">
                      <ExternalLink className="w-4 h-4" /> Xem Demo
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all">
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zalo QR Modal */}
      <AnimatePresence>
        {showZaloQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setShowZaloQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] max-w-sm w-full relative shadow-[0_0_50px_rgba(14,165,233,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setShowZaloQR(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[9px] font-black uppercase tracking-widest">Zalo Connect</div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">KẾT NỐI TRỰC TIẾP</h3>
                <div className="aspect-square bg-white p-4 rounded-3xl overflow-hidden flex items-center justify-center mx-auto w-full shadow-inner">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent("https://zalo.me/84382766381")}`} alt="Zalo QR" className="w-full h-full object-contain"/>
                </div>
                <div className="space-y-1">
                    <p className="text-white font-black text-lg">THIÊN NHI</p>
                    <p className="text-slate-400 text-xs font-medium italic">"Quét mã để trao đổi nhanh chóng"</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>
    </div>
  );
}
