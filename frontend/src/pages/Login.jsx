import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useFileHandler, useInputValidation } from "6pp";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import { ArrowRight, Camera, Eye, EyeOff, LoaderCircle, MessageCircle } from "lucide-react";
import ThemeToggle from "../components/shared/ThemeToggle";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signUpStep, setSignUpStep] = useState(1); // 1: Profile Info, 2: Account Security
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 6pp validation custom hooks
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single", 5);

  const dispatch = useDispatch();

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
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

      {/* --- RESPONSIVE GLASS CONTAINER --- */}
      <section className="auth-form-section auth-panel">
        
        {/* Header Branding section */}
        <div className="mb-7">
          <p className="eyebrow">LET&apos;S CONNECT</p>
          <h1>{isLogin ? "Welcome back." : "Create your account."}</h1>
          <p className="auth-subtitle">{isLogin ? "Sign in to your ChatBuddy workspace." : `Step ${signUpStep} of 2`}</p>
          {!isLogin && (
            <div className="flex justify-center items-center gap-2 mt-2">
              <span className={`w-8 h-1.5 rounded-full transition-all duration-300 ${signUpStep === 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <span className={`w-8 h-1.5 rounded-full transition-all duration-300 ${signUpStep === 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            </div>
          )}
        </div>

        {/* --- DYNAMIC MULTI-STAGE AUTH FLOW --- */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
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
                      <label htmlFor="signup-avatar">Profile photo
                        <input
                          id="signup-avatar"
                          type="file"
                          accept="image/*"
                          onChange={avatar.changeHandler}
                        />
                      </label>
                    </div>
                    {avatar.error && (
                      <span className="text-red-500 text-[10px] mt-1 font-semibold">{avatar.error}</span>
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
                      Back
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
        </div>

        {/* Dynamic Navigation Toggle Footer Area */}
        <div className="mt-4 space-y-3">

          <button
            type="button"
            disabled={isLoading}
            onClick={toggleLogin}
            className="w-full py-2 text-indigo-600 hover:text-indigo-500 font-bold text-xs transition-colors duration-150 focus:outline-none"
          >
            {isLogin ? "Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
      <aside className="auth-visual" aria-label="ChatBuddy workspace"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85" alt="A team working together around a table" /><div className="auth-visual-caption"><span>CHATBUDDY</span><h2>A place for your people.</h2></div></aside>
      </main>
      <footer className="auth-footer">ChatBuddy &copy; {new Date().getFullYear()}</footer>
    </div>
  );
};

export default Login;