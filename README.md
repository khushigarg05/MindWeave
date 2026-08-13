# 🧠 MindWeave

### AI Knowledge OS — Turn scattered documents into an intelligent, searchable knowledge space.

[![Live Demo](https://img.shields.io/badge/Live-Demo-black?style=for-the-badge)](https://mindweave-p0zyivyd6-ai-interview-agent1.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge\&logo=github)](https://github.com/khushigarg05/MindWeave)

> **Upload. Understand. Search. Remember.**

MindWeave is an AI-powered knowledge workspace that lets users upload documents, build a personal knowledge base, search information semantically, and interact with their knowledge through an AI chat interface.

---

## ✨ Features

* 📄 **PDF Upload** — Add documents to your personal knowledge base.
* 🧠 **Semantic Search** — Find information based on meaning, not just keywords.
* 💬 **AI Chat** — Ask natural-language questions about your knowledge.
* 🔎 **RAG Pipeline** — Retrieves relevant document chunks before generating answers.
* 🗂️ **Knowledge Base** — Manage documents used by the AI.
* 📊 **Dashboard** — View documents and knowledge activity.
* ⚡ **Modern UI** — Clean and responsive research workspace.

---

## 🚀 How It Works

```text
📄 Documents
     ↓
Text Extraction
     ↓
🧠 Embeddings
     ↓
📦 Qdrant Vector Database
     ↓
🔎 Semantic Retrieval
     ↓
Relevant Context
     ↓
🤖 Groq LLM
     ↓
💬 AI Response
```

MindWeave uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant information from uploaded documents before generating AI responses.

---

## 🏗️ Architecture

```text
              ┌────────────────────┐
              │   Next.js Frontend │
              └─────────┬──────────┘
                        │
                     REST API
                        │
              ┌─────────▼──────────┐
              │   Backend Server   │
              └──────┬─────┬───────┘
                     │     │
             ┌───────▼─┐ ┌─▼────────┐
             │ MongoDB │ │  Qdrant  │
             └─────────┘ └────┬─────┘
                              │
                       Semantic Search
                              │
                       Relevant Context
                              │
                        ┌─────▼─────┐
                        │  Groq LLM │
                        └─────┬─────┘
                              │
                        AI Response
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Node.js
* Express
* TypeScript

### AI & Search

* Groq
* Hugging Face Embeddings
* Qdrant
* Retrieval-Augmented Generation (RAG)

### Database & Deployment

* MongoDB
* Qdrant
* Vercel
* Render

---

## 📁 Project Structure

```text
MindWeave/
│
├── apps/
│   ├── web/              # Next.js frontend
│   └── server/           # Backend API
│
├── package.json
├── package-lock.json
└── README.md
```

---

## 🌐 Live Demo

### Frontend

[https://mindweave-p0zyivyd6-ai-interview-agent1.vercel.app](https://mindweave-p0zyivyd6-ai-interview-agent1.vercel.app)

### Backend

[https://mindweave-backend.onrender.com](https://mindweave-backend.onrender.com)

---

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/khushigarg05/MindWeave.git
cd MindWeave
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure frontend environment

Create:

```text
apps/web/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Configure backend environment

Add the required backend environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
```

> Never commit API keys or `.env` files to GitHub.

### 5. Start the frontend

```bash
npm run dev --workspace web
```

The frontend will run at:

```text
http://localhost:3000
```

### 6. Build the application

```bash
npm run build --workspace web
```

---

## 🔍 RAG Pipeline

MindWeave follows a simple RAG workflow:

**1. Upload**

The user uploads a PDF document.

**2. Extract**

The document content is extracted and divided into smaller chunks.

**3. Embed**

Chunks are converted into vector embeddings.

**4. Store**

Embeddings and document metadata are stored in Qdrant.

**5. Retrieve**

When the user asks a question, the query is converted into an embedding and relevant chunks are retrieved using semantic similarity.

**6. Generate**

The retrieved context is passed to the AI model to generate a grounded response.

---

## 🎯 Why MindWeave?

Traditional document storage helps you **store information**.

MindWeave helps you **interact with information**.

Instead of manually searching through multiple documents, users can upload their knowledge and ask questions naturally.

The system combines:

**Documents + Embeddings + Vector Search + RAG + AI**

to create a more intelligent knowledge experience.

---

## 🔮 Future Improvements

* 🤖 Multi-agent knowledge workflows
* 🧠 Long-term semantic memory
* 🔗 Web and external knowledge integration
* 📚 Support for additional document formats
* ⚡ Improved retrieval and ranking
* 🔐 Authentication and private workspaces
* 📈 Advanced knowledge analytics

---

## 👩‍💻 Built By

### Khushi Garg

Computer Science Engineering Student

**AI • Full Stack • RAG • Developer Tools**

GitHub: [https://github.com/khushigarg05](https://github.com/khushigarg05)

---

## ⭐ Support

If you find **MindWeave** interesting, consider giving the repository a ⭐.

> **MindWeave — Your knowledge, connected.**
