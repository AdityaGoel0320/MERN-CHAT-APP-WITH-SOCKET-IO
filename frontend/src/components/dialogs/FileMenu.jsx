import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;
    if (files.length > 5) return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      if (res.data) {
        toast.success(`${key} sent successfully`, { id: toastId });
      } else {
        toast.error(`Failed to send ${key}`, { id: toastId });
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong", { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  if (!isFileMenu) return null;

  return (
    <>
      {/* Clickable backdrop overlay to close the menu when clicking outside */}
      <div 
        onClick={closeFileMenu} 
        className="fixed inset-0 z-40 bg-transparent" 
      />

      {/* --- FLOATING PASTEL GLASS CONTEXT MENU --- */}
      <div
        className="absolute bottom-20 left-4 sm:left-6 z-50 w-44 p-2 rounded-2xl bg-white/80 border border-white/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] animate-fadeIn select-none flex flex-col gap-0.5"
      >
        <MenuOptionItem
          iconClass="fas fa-image"
          label="Image"
          onClick={selectImage}
          colorClass="text-indigo-600 bg-indigo-50/60"
        />
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/gif"
          className="hidden"
          onChange={(e) => fileChangeHandler(e, "Images")}
          ref={imageRef}
        />

        <MenuOptionItem
          iconClass="fas fa-music"
          label="Audio"
          onClick={selectAudio}
          colorClass="text-emerald-600 bg-emerald-50/60"
        />
        <input
          type="file"
          multiple
          accept="audio/mpeg, audio/wav"
          className="hidden"
          onChange={(e) => fileChangeHandler(e, "Audios")}
          ref={audioRef}
        />

        <MenuOptionItem
          iconClass="fas fa-video"
          label="Video"
          onClick={selectVideo}
          colorClass="text-amber-600 bg-amber-50/60"
        />
        <input
          type="file"
          multiple
          accept="video/mp4, video/webm, video/ogg"
          className="hidden"
          onChange={(e) => fileChangeHandler(e, "Videos")}
          ref={videoRef}
        />

        <MenuOptionItem
          iconClass="fas fa-file-upload"
          label="Document"
          onClick={selectFile}
          colorClass="text-slate-600 bg-slate-100/80"
        />
        <input
          type="file"
          multiple
          accept="*"
          className="hidden"
          onChange={(e) => fileChangeHandler(e, "Files")}
          ref={fileRef}
        />
      </div>
    </>
  );
};

/* --- SUB-COMPONENT: INTERACTIVE MENU ROW OPTION --- */
const MenuOptionItem = ({ iconClass, label, onClick, colorClass }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/60 transition-all duration-150 group text-left relative"
  >
    {/* Colored Icon Badge */}
    <div className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold shrink-0 transition-transform duration-200 group-hover:scale-105 ${colorClass}`}>
      <i className={iconClass} />
    </div>

    {/* Option Text Label */}
    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 tracking-wide transition-colors">
      {label}
    </span>

    {/* CSS Micro Native Tooltip */}
    <span className="absolute left-[105%] top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-slate-800 text-white font-bold text-[9px] uppercase tracking-wider opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-md z-50">
      Upload {label}
    </span>
  </button>
);

export default FileMenu;