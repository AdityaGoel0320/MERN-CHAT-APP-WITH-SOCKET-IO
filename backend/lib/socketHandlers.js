import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from "../constants/events.js";

export const registerChatHandlers = ({ io, socket, Chat, Message, getSockets, onlineUsers }) => {
  const user = socket.user;
  const authorizedChat = async (chatId) => {
    if (typeof chatId !== "string" || !/^[a-f\d]{24}$/i.test(chatId)) throw new Error("Invalid conversation");
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.members.some((member) => member.toString() === user._id.toString())) throw new Error("Conversation unavailable");
    return chat;
  };

  socket.on(NEW_MESSAGE, async (payload = {}, acknowledge) => {
    try {
      const { chatId, message } = payload || {};
      if (typeof message !== "string" || !message.trim() || message.length > 4000) throw new Error("Message must contain 1 to 4000 characters");
      const chat = await authorizedChat(chatId);
      const saved = await Message.create({ content: message.trim(), sender: user._id, chat: chatId });
      const recipients = getSockets(chat.members);
      io.to(recipients).emit(NEW_MESSAGE, {
        chatId,
        message: { _id: saved._id, content: saved.content, sender: { _id: user._id, name: user.name }, chat: chatId, createdAt: saved.createdAt },
      });
      io.to(recipients).emit(NEW_MESSAGE_ALERT, { chatId });
      if (typeof acknowledge === "function") acknowledge({ success: true });
    } catch (error) {
      if (typeof acknowledge === "function") acknowledge({ success: false, message: error.message === "Conversation unavailable" || error.message === "Invalid conversation" || error.message.startsWith("Message must") ? error.message : "Message could not be saved. Please try again." });
    }
  });

  for (const event of [START_TYPING, STOP_TYPING, CHAT_JOINED, CHAT_LEAVED]) {
    socket.on(event, async (payload = {}) => {
      try {
        const { chatId } = payload || {};
        const chat = await authorizedChat(chatId);
        const recipients = getSockets(chat.members);
        if (event === START_TYPING || event === STOP_TYPING) socket.to(recipients).emit(event, { chatId });
        else io.to(recipients).emit(ONLINE_USERS, Array.from(onlineUsers));
      } catch {}
    });
  }
};