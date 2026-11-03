import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useInputValidation } from "6pp";
import Cropper from "react-easy-crop";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { server } from "../constants/frontendConstant";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import { ArrowLeft, ArrowRight, Camera, Check, CheckCheck, Eye, EyeOff, LoaderCircle, MessageCircle, Plus, Send, X } from "lucide-react";
import ThemeToggle from "../components/shared/ThemeToggle";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const cropAvatar = async (source, area) => {
  const image = new Image();
  image.src = source;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image cropping is unavailable in this browser");
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, 512, 512);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not crop this image");
  return new File([blob], "avatar.png", { type: "image/png" });
};

const Login = () => {
  const reduceMotion = useReducedMotion();
  const [isLogin, setIsLogin] = useState(true);
  const [signUpStep, setSignUpStep] = useState(1); // 1: Profile Info, 2: Account Security
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState({ file: null, preview: "", error: "" });
  const [cropSource, setCropSource] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropError, setCropError] = useState("");

  // 6pp validation custom hooks
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const signupSubtitle = signUpStep === 1 ? "First, a little about you." : "Make it yours. You're almost there.";
  const subtitle = isLogin ? "Good to see you. Let's pick up where you left off." : signupSubtitle;

  useEffect(() => () => {
    if (cropSource) URL.revokeObjectURL(cropSource);
  }, [cropSource]);

  useEffect(() => () => {
    if (avatar.preview) URL.revokeObjectURL(avatar.preview);
  }, [avatar.preview]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setAvatar((current) => ({ ...current, error: "" }));
    if (!file.type.startsWith("image/") || file.size > MAX_AVATAR_SIZE) {
      setAvatar((current) => ({
        ...current,
        error: file.size > MAX_AVATAR_SIZE ? "File size too large. Choose an image under 5 MB." : "Choose an image file.",
      }));
      return;
    }
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
    setCropError("");
    setCropSource(URL.createObjectURL(file));
  };

  const saveAvatarCrop = async () => {
    if (!croppedArea || isCropping) return;
    setIsCropping(true);
    setCropError("");
    try {
      const file = await cropAvatar(cropSource, croppedArea);
      if (file.size > MAX_AVATAR_SIZE) throw new Error("Cropped image must be under 5 MB");
      setAvatar({ file, preview: URL.createObjectURL(file), error: "" });
      setCropSource("");
    } catch (error) {
      setCropError(error.message || "Could not crop this image");
    } finally {
      setIsCropping(false);
    }
  };

  const dispatch = useDispatch();

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
    setShowPassword(false);
    setSignUpStep(1); // Reset step on toggle
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    // Basic validation before moving forward
    if (!name.value.trim() || !bio.value.trim() || !avatar.file || avatar.error) {
      toast.error("Add a profile photo, your name, and a bio");
      return;
    }
    setSignUpStep(2);
  };

  const handlePrevStep = () => {
    setSignUpStep(1);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username: username.value, password: password.value },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (username.error || avatar.error || !avatar.file) {
      toast.error(username.error || avatar.error || "Choose a profile photo");
      return;
    }
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header"><a href="/" className="brand"><span className="brand-mark"><MessageCircle size={22} /></span>ChatBuddy</a><ThemeToggle /></header>
      <main className="auth-main">
      <aside className="auth-visual" aria-label="ChatBuddy conversation preview">
        <div className="auth-visual-heading"><span className="auth-live"><span /> A little closer, wherever you are</span><h2>ChatBuddy<span>Your people.<br />One happy place.</span></h2></div>
        <div className="auth-conversation" aria-hidden="true">
          <div className="auth-conversation-header"><div className="auth-group-icon"><MessageCircle size={22} /></div><div><strong>The everyday crew</strong><span>3 friends, endless conversations</span></div><div className="auth-online-dot" /></div>
          <div className="auth-conversation-date">TODAY</div>
          <div className="auth-demo-message auth-demo-first"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" alt="" /><div><span className="auth-demo-name">Maya</span><p>Same time. Same people.<br />New memories?</p><time>10:24</time></div></div>
          <div className="auth-demo-message auth-demo-sent"><div><p>Wouldn&apos;t miss it for the world.</p><time>10:24 <CheckCheck size={14} /></time></div></div>
          <div className="auth-demo-message auth-demo-last"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80" alt="" /><div><span className="auth-demo-name">Alex</span><p>My favorite notification.</p><time>10:25</time></div></div>
          <div className="auth-demo-typing"><span /><span /><span /></div>
          <div className="auth-demo-composer"><Plus size={18} /><span>Message your people...</span><span className="auth-demo-send"><Send size={16} /></span></div>
        </div>
        <div className="auth-visual-bottom"><span className="auth-mini-mark"><MessageCircle size={17} /> Made for the everyday moments.</span><span>01 / 01</span></div>
      </aside>
      <section className="auth-form-section auth-panel">
        <div className="auth-mode-switch" aria-label="Account access">
          <button type="button" aria-pressed={isLogin} disabled={isLoading} onClick={() => { if (!isLogin) toggleLogin(); }}>Sign in</button>
          <button type="button" aria-pressed={!isLogin} disabled={isLoading} onClick={() => { if (isLogin) toggleLogin(); }}>Create account</button>
        </div>
        <div className="auth-form-heading">
          <span className="auth-heading-icon"><MessageCircle size={23} /></span>
          <p className="eyebrow">{isLogin ? "YOUR PEOPLE ARE HERE" : "A NEW CONNECTION STARTS HERE"}</p>
          <h1>{isLogin ? "Welcome back." : "Create your account."}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {!isLogin && (
            <ol className="auth-steps" aria-label="Registration progress">
              <li className="is-current" aria-current={signUpStep === 1 ? "step" : undefined}><span>{signUpStep === 2 ? <Check size={13} /> : "1"}</span>Your profile</li>
              <li className={signUpStep === 2 ? "is-current" : ""} aria-current={signUpStep === 2 ? "step" : undefined}><span>2</span>Your account</li>
            </ol>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
        <motion.div key={isLogin ? "login" : `signup-${signUpStep}`} initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
          {isLogin ? (
            /* --- LOGIN FORM --- */
            <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
              <div className="flex flex-col gap-1">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  autoComplete="username"
                  type="text"
                  required
                  value={username.value}
                  onChange={username.changeHandler}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                  placeholder="enter username"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="login-password">Password</label>
                <div className="password-control">
                <input
                  id="login-password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password.value}
                  onChange={password.changeHandler}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                  placeholder="••••••••"
                />
                <button type="button" className="icon-button" aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-extrabold text-sm uppercase tracking-widest shadow-md transition-all duration-150 flex items-center justify-center gap-2"
              >
                {isLoading && <LoaderCircle size={18} className="animate-spin" />}
                {isLoading ? "Signing in..." : "Sign in"}<ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* --- SIGN UP MULTI-STEP MIXIN --- */
            <div className="overflow-hidden">
              {signUpStep === 1 ? (
                /* STEP 1: Profile Customization */
                <form onSubmit={handleNextStep} className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col items-center group relative my-1">
                    <div className="avatar-upload">
                      {avatar.preview ? <img src={avatar.preview} alt="Profile preview" /> : <span className="avatar-placeholder"><Camera size={24} /></span>}
                      <label htmlFor="signup-avatar"><span>Profile photo</span>
                        <input
                          id="signup-avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          aria-invalid={Boolean(avatar.error)}
                          aria-describedby={avatar.error ? "avatar-error" : undefined}
                        />
                      </label>
                    </div>
                    {avatar.error && (
                      <span id="avatar-error" role="alert" className="text-red-500 text-xs mt-1 font-semibold">{avatar.error}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="signup-name">Full name</label>
                    <input
                      id="signup-name"
                      autoComplete="name"
                      maxLength={80}
                      type="text"
                      required
                      value={name.value}
                      onChange={name.changeHandler}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="signup-bio">Bio</label>
                    <input
                      id="signup-bio"
                      maxLength={200}
                      type="text"
                      required
                      value={bio.value}
                      onChange={bio.changeHandler}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="Developer & Maker"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm uppercase tracking-widest shadow-md transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </form>
              ) : (
                /* STEP 2: Account Security Setup */
                <form onSubmit={handleSignUp} className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="signup-username">Username</label>
                    <input
                      id="signup-username"
                      autoComplete="username"
                      aria-invalid={Boolean(username.error)}
                      type="text"
                      required
                      value={username.value}
                      onChange={username.changeHandler}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="Choose a username"
                    />
                    {username.error && (
                      <span className="text-red-500 text-[10px] font-medium mt-0.5">{username.error}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="signup-password">Password</label>
                    <div className="password-control">
                    <input
                      id="signup-password"
                      autoComplete="new-password"
                      minLength={8}
                      type={showPassword ? "text" : "password"}
                      required
                      value={password.value}
                      onChange={password.changeHandler}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="••••••••"
                    />
                    <button type="button" className="icon-button" aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="w-1/3 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-sm uppercase tracking-wider transition-all"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || Boolean(username.error)}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-extrabold text-sm uppercase tracking-widest shadow-md transition-all duration-150 flex items-center justify-center gap-2"
                    >
                      {isLoading && <LoaderCircle size={18} className="animate-spin" />}
                      {isLoading ? "Creating account..." : "Create account"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
        </AnimatePresence>

        <div className="auth-switch-footer">
          <span>{isLogin ? "New around here?" : "Already one of the crew?"}</span>
          <button
            type="button"
            disabled={isLoading}
            onClick={toggleLogin}
            className="w-full py-2 text-indigo-600 hover:text-indigo-500 font-bold text-xs transition-colors duration-150 focus:outline-none"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </div>
      </section>
      </main>
      <Dialog
        open={Boolean(cropSource)}
        onClose={() => { if (!isCropping) setCropSource(""); }}
        fullWidth
        maxWidth="sm"
        aria-labelledby="avatar-crop-title"
        PaperProps={{ className: "dialog-panel" }}
      >
        <DialogTitle id="avatar-crop-title">Crop profile photo</DialogTitle>
        <DialogContent>
          <div className="avatar-crop-stage">
            {cropSource && <Cropper
              image={cropSource}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, area) => setCroppedArea(area)}
              onMediaLoaded={() => setCropError("")}
              mediaProps={{ onError: () => { setCroppedArea(null); setCropError("Could not open this image. Choose another photo."); } }}
            />}
          </div>
          <label className="avatar-crop-zoom" htmlFor="avatar-zoom"><span>Zoom</span>
            <input id="avatar-zoom" type="range" min="1" max="3" step="0.05" value={zoom} disabled={isCropping} onChange={(event) => setZoom(Number(event.target.value))} />
          </label>
          {cropError && <p role="alert" className="text-red-500 text-sm">{cropError}</p>}
        </DialogContent>
        <DialogActions>
          <button type="button" className="text-action inline-flex items-center gap-2 px-3 py-2" disabled={isCropping} onClick={() => setCropSource("")}><X size={18} />Cancel</button>
          <button type="button" className="primary-button" disabled={isCropping || !croppedArea || Boolean(cropError)} onClick={saveAvatarCrop}>{isCropping ? <LoaderCircle size={18} className="animate-spin" /> : <Check size={18} />}{isCropping ? "Saving..." : "Save photo"}</button>
        </DialogActions>
      </Dialog>
      <footer className="auth-footer">ChatBuddy &copy; {new Date().getFullYear()}</footer>
    </div>
  );
};

export default Login;