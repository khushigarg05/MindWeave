import mongoose from "mongoose";

// ===========================
// Source Schema
// ===========================

const sourceSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// ===========================
// Retrieved Chunk Schema
// ===========================

const retrievedChunkSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// ===========================
// Message Schema
// ===========================

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    // Only assistant messages use these
    sources: {
      type: [sourceSchema],
      default: [],
    },

    retrievedChunks: {
      type: [retrievedChunkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ===========================
// Conversation Schema
// ===========================

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "New Chat",
    },

    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Conversation",
  conversationSchema
);