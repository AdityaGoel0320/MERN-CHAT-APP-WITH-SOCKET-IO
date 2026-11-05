import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { Menu, MenuItem } from "@mui/material";
import { FileUp, Image, Music, Video } from "lucide-react";

const FileMenu = ({ chatId, anchorEl }) => {
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
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    if (files.length <= 0) return;
    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);
    if (files.some((file) => file.size > 5 * 1024 * 1024))
      return toast.error("Each attachment must be 5 MB or smaller");

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
      <Menu
        anchorEl={anchorEl}
        open={isFileMenu}
        onClose={closeFileMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        MenuListProps={{ "aria-label": "Attachments" }}
      >
        <MenuOptionItem
          Icon={Image}
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
          Icon={Music}
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
          Icon={Video}
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
          Icon={FileUp}
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
      </Menu>
    </>
  );
};

/* --- SUB-COMPONENT: INTERACTIVE MENU ROW OPTION --- */
const MenuOptionItem = ({ Icon, label, onClick }) => (
  <MenuItem onClick={onClick} sx={{ gap: 1.5, fontSize: 14, minWidth: 170 }}>
    <Icon size={18} />
    {label}
  </MenuItem>
);

export default FileMenu;
