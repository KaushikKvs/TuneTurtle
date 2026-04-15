import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets.js";
import { Eye, EyeOff, ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/* ── Starfield Canvas ─────────────────────────────────────── */
const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = Array.from({ length: 450 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.003,
        drift: (Math.random() - 0.5) * 0.12,
      }));
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const twinkle = Math.sin(t * s.speed + s.phase) * 0.5 + 0.5;
        const alpha = s.baseAlpha * (0.4 + twinkle * 0.6);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        s.y += s.drift * 0.3;
        s.x += s.drift * 0.1;
        if (s.y < -2) s.y = canvas.height + 2;
        if (s.y > canvas.height + 2) s.y = -2;
        if (s.x < -2) s.x = canvas.width + 2;
        if (s.x > canvas.width + 2) s.x = -2;
      });
      animId = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    animId = requestAnimationFrame(draw);
    const handleResize = () => { resize(); createStars(); };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

/* ── Login Component ──────────────────────────────────────── */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      toast.error("Please fill in all details");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success("Welcome, Administrator");
        navigate("/list-songs");
      } else {
        toast.error(result.message);
        setError(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center p-4 relative overflow-hidden">

      <Starfield />

      {/* Deep ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        <div className="absolute top-[-25%] left-[-10%] w-[55%] h-[55%] bg-white/[0.012] rounded-full blur-[150px] animate-[drift_22s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[55%] h-[55%] bg-white/[0.012] rounded-full blur-[150px] animate-[drift_28s_ease-in-out_infinite_reverse]" />
      </div>

      <div className="max-w-[420px] w-full relative z-10">

        {/* ── Logo ── */}
        <div className="text-center mb-10 animate-[fadeSlideUp_0.7s_ease-out]">
          <div className="flex items-center justify-center mb-8">
            <div 
              className="w-16 h-16 animate-[turtleWave_5s_ease-in-out_infinite]"
              style={{
                backgroundColor: '#ffffff',
                maskImage: `url(${assets.logo})`,
                WebkitMaskImage: `url(${assets.logo})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.6)) drop-shadow(0 0 15px rgba(255,255,255,0.35)) drop-shadow(0 0 35px rgba(255,255,255,0.15)) drop-shadow(0 0 60px rgba(255,255,255,0.07))'
              }}
            />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-1 leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.06)]">TuneTurtle</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">
            <ShieldCheck className="w-3 h-3" /> Admin Portal
          </div>
          <p className="text-neutral-500 text-sm font-medium tracking-wide mt-3">Elevated access for platform moderators</p>
        </div>

        {/* ── Form Card ── */}
        <div className="animate-[fadeSlideUp_0.9s_ease-out_0.15s_both]">
            <div className="premium-tracer-white bg-white/[0.025] backdrop-blur-2xl rounded-[22px] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)]">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3 text-red-400/90 text-sm font-medium animate-[shake_0.4s_ease-in-out]">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Admin Email</label>
                  <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_25px_rgba(255,255,255,0.03)]' : ''}`}>
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-white/60' : 'text-neutral-700'}`} />
                    <input type="email" autoComplete="email" required
                      className="block w-full pl-11 pr-4 py-3.5 border border-white/[0.05] rounded-xl bg-white/[0.015] text-[15px] text-white placeholder-neutral-700 focus:outline-none focus:border-white/[0.12] focus:bg-white/[0.03] transition-all duration-300"
                      placeholder="admin@tuneturtle.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-[0.15em]">Secure Password</label>
                  <div className={`relative rounded-xl transition-all duration-300 ${focusedField === 'password' ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_25px_rgba(255,255,255,0.03)]' : ''}`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${focusedField === 'password' ? 'text-white/60' : 'text-neutral-700'}`} />
                    <input type={showPassword ? "text" : "password"} autoComplete="current-password" required
                      className="block w-full pl-11 pr-12 py-3.5 border border-white/[0.05] rounded-xl bg-white/[0.015] text-[15px] text-white placeholder-neutral-700 focus:outline-none focus:border-white/[0.12] focus:bg-white/[0.03] transition-all duration-300"
                      placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-neutral-400 transition-colors duration-200">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <button disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-[15px] font-bold text-black bg-white hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_35px_rgba(255,255,255,0.10),0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.18),0_4px_25px_rgba(0,0,0,0.4)]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-neutral-300 border-t-black" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <span>Authenticate</span>
                        <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-neutral-700 mt-8 animate-[fadeSlideUp_1.1s_ease-out_0.3s_both]">
          &copy; 2026 TuneTurtle Advanced Administration. All rights reserved.
        </p>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -18px) scale(1.05); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes turtleWave {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          25%  { transform: translate(6px, -4px) rotate(1.5deg); }
          50%  { transform: translate(0px, -7px) rotate(0deg); }
          75%  { transform: translate(-6px, -4px) rotate(-1.5deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
};

export default Login;
