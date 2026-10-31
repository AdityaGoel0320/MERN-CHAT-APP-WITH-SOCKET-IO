import { test } from "node:test";
import assert from "node:assert/strict";
import { registerChatHandlers } from "./socketHandlers.js";
import { NEW_MESSAGE, START_TYPING } from "../constants/events.js";

const chatId = "a".repeat(24);
const createFixture = ({ members = ["user", "friend"], fails = false } = {}) => {
  const handlers = {};
  const emitted = [];
  const saved = [];
  const socket = { user: { _id: "user", name: "Taylor" }, on: (event, handler) => { handlers[event] = handler; }, to: (recipients) => ({ emit: (event, payload) => emitted.push({ recipients, event, payload }) }) };
  const io = { to: socket.to };
  registerChatHandlers({ io, socket, Chat: { findById: async () => ({ members }) }, Message: { create: async (message) => { if (fails) throw new Error("database down"); saved.push(message); return { ...message, _id: "saved-id", createdAt: "2026-01-01" }; } }, getSockets: (recipients) => recipients, onlineUsers: new Set(["user"]) });
  return { handlers, emitted, saved };
};

test("messages use verified recipients and persisted IDs", async () => {
  const fixture = createFixture();
  let result;
  await fixture.handlers[NEW_MESSAGE]({ chatId, members: ["stranger"], message: " hello " }, (response) => { result = response; });
  assert.equal(result.success, true);
  assert.equal(fixture.saved[0].content, "hello");
  assert.deepEqual(fixture.emitted[0].recipients, ["user", "friend"]);
  assert.equal(fixture.emitted[0].payload.message._id, "saved-id");
});

test("non-members cannot message or send typing events", async () => {
  const fixture = createFixture({ members: ["stranger"] });
  let result;
  await fixture.handlers[NEW_MESSAGE]({ chatId, message: "hello" }, (response) => { result = response; });
  await fixture.handlers[START_TYPING]({ chatId, members: ["friend"] });
  assert.equal(result.success, false);
  assert.equal(fixture.saved.length, 0);
  assert.equal(fixture.emitted.length, 0);
});

test("failed persistence is acknowledged without broadcasting", async () => {
  const fixture = createFixture({ fails: true });
  let result;
  await fixture.handlers[NEW_MESSAGE]({ chatId, message: "hello" }, (response) => { result = response; });
  assert.equal(result.success, false);
  assert.equal(fixture.emitted.length, 0);
});

test("malformed payloads and empty or oversized messages are rejected", async () => {
  const fixture = createFixture();
  for (const payload of [null, {}, { chatId: "bad", message: "hello" }, { chatId, message: " " }, { chatId, message: "x".repeat(4001) }]) {
    let result;
    await fixture.handlers[NEW_MESSAGE](payload, (response) => { result = response; });
    assert.equal(result.success, false);
  }
  assert.equal(fixture.saved.length, 0);
});