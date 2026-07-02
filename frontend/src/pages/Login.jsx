import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useFileHandler, useInputValidation } from "6pp";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signUpStep, setSignUpStep] = useState(1); // 1: Profile Info, 2: Account Security
  const [isLoading, setIsLoading] = useState(false);

  // 6pp validation custom hooks
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
    setSignUpStep(1); // Reset step on toggle
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    // Basic validation before moving forward
    if (!name.value || !bio.value) {
      toast.error("Please complete all profile details");
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
    <div className="h-screen w-screen bg-gradient-to-tr from-violet-100 via-indigo-50 to-emerald-50 text-slate-700 flex justify-center items-center p-4 md:p-8 relative overflow-hidden select-none">
      
      {/* --- BACKGROUND PASTEL AMBIENT ORBS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-200/50 blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-emerald-100/60 blur-[120px] pointer-events-none animate-bounce duration-[12000ms] opacity-70" />

      {/* --- RESPONSIVE GLASS CONTAINER --- */}
      <div className="w-full max-w-md max-h-[90vh] flex flex-col justify-between p-6 sm:p-8 rounded-[2.5rem] bg-white/70 border border-white/50 backdrop-blur-2xl shadow-[0_20px_50px_rgba(79,70,229,0.08)] z-10 overflow-hidden transition-all duration-300">
        
        {/* Header Branding section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 mb-2 border border-indigo-500/20">
            <i className="fas fa-comments text-xl" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-indigo-700 to-violet-600 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Join Network"}
          </h2>
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Username</label>
                <input
                  type="text"
                  required
                  value={username.value}
                  onChange={username.changeHandler}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                  placeholder="enter username"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Password</label>
                <input
                  type="password"
                  required
                  value={password.value}
                  onChange={password.changeHandler}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-extrabold text-sm uppercase tracking-widest shadow-md transition-all duration-150 flex items-center justify-center gap-2"
              >
                {isLoading && <i className="fas fa-spinner animate-spin" />}
                Sign In
              </button>
            </form>
          ) : (
            /* --- SIGN UP MULTI-STEP MIXIN --- */
            <div className="overflow-hidden">
              {signUpStep === 1 ? (
                /* STEP 1: Profile Customization */
                <form onSubmit={handleNextStep} className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col items-center group relative my-1">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-slate-300 group-hover:border-indigo-500 transition-colors duration-200 bg-white/80 shadow-sm">
                      <img
                        src={avatar.preview || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                        <i className="fas fa-camera text-white text-lg" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={avatar.changeHandler}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {avatar.error && (
                      <span className="text-red-500 text-[10px] mt-1 font-semibold">{avatar.error}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name.value}
                      onChange={name.changeHandler}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="Aditya Goel"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bio</label>
                    <input
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
                    Continue <i className="fas fa-arrow-right text-xs" />
                  </button>
                </form>
              ) : (
                /* STEP 2: Account Security Setup */
                <form onSubmit={handleSignUp} className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Username</label>
                    <input
                      type="text"
                      required
                      value={username.value}
                      onChange={username.changeHandler}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="aditya_goel"
                    />
                    {username.error && (
                      <span className="text-red-500 text-[10px] font-medium mt-0.5">{username.error}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Password</label>
                    <input
                      type="password"
                      required
                      value={password.value}
                      onChange={password.changeHandler}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 focus:border-indigo-500 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
                      placeholder="••••••••"
                    />
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
                      disabled={isLoading}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-extrabold text-sm uppercase tracking-widest shadow-md transition-all duration-150 flex items-center justify-center gap-2"
                    >
                      {isLoading && <i className="fas fa-spinner animate-spin" />}
                      Register
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Navigation Toggle Footer Area */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-[10px] font-bold tracking-widest text-slate-400">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3">SECURE GATEWAY</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={toggleLogin}
            className="w-full py-2 text-indigo-600 hover:text-indigo-500 font-bold text-xs transition-colors duration-150 focus:outline-none"
          >
            {isLogin ? "Create an account instead" : "Back to active authorization portal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;