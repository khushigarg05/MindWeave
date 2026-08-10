"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, RefreshCw, Trash2, Upload } from "lucide-react";

type DocumentItem = {
  _id: string;
  filename: string;
  originalName: string;
  size?: number;
  pages?: number;
  uploadedAt?: string;
  createdAt?: string;
};

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // Load Documents
  // ==========================================

  async function loadDocuments() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:5000/upload/documents",
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load documents");
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to load documents"
        );
      }

      setDocuments(data.data ?? []);
    } catch (err) {
      console.error("Document Load Error:", err);
      setError("Unable to load documents.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    loadDocuments();
  }, []);

  // ==========================================
  // Upload Document
  // ==========================================

  async function uploadDocument(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch(
        "http://localhost:5000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to upload document"
        );
      }

      console.log("Upload Success:", data);

      await loadDocuments();

    } catch (err) {
      console.error("Upload Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload document."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  // ==========================================
  // Delete Document
  // ==========================================

  async function deleteDocument(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const res = await fetch(
        `http://localhost:5000/upload/documents/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete document"
        );
      }

      setDocuments((prev) =>
        prev.filter(
          (document) => document._id !== id
        )
      );
    } catch (err) {
      console.error("Delete Error:", err);

      setError("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================
  // Format File Size
  // ==========================================

  function formatFileSize(size?: number) {
    if (!size) {
      return "Unknown size";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-full p-10">

      {/* ==========================================
          Header
      ========================================== */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Knowledge Base
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage the documents used by MindWeave AI.
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* Hidden File Input */}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={uploadDocument}
            className="hidden"
          />

          {/* Upload Button */}

          <button
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={16} />

            {uploading
              ? "Uploading..."
              : "Upload PDF"}
          </button>

          {/* Refresh Button */}

          <button
            onClick={loadDocuments}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-cyan-500 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

        </div>

      </div>

      {/* ==========================================
          Error
      ========================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ==========================================
          Stats
      ========================================== */}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Documents */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

          <p className="text-sm text-zinc-500">
            Documents
          </p>

          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {documents.length}
          </p>

        </div>

        {/* Knowledge Status */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

          <p className="text-sm text-zinc-500">
            Knowledge Status
          </p>

          <p
            className={`mt-2 text-lg font-semibold ${
              documents.length > 0
                ? "text-green-400"
                : "text-zinc-500"
            }`}
          >
            {documents.length > 0
              ? "Indexed"
              : "Empty"}
          </p>

        </div>

        {/* RAG */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

          <p className="text-sm text-zinc-500">
            RAG
          </p>

          <p className="mt-2 text-lg font-semibold text-cyan-400">
            Active
          </p>

        </div>

      </div>

      {/* ==========================================
          Uploaded Documents
      ========================================== */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900">

        <div className="border-b border-zinc-800 p-5">

          <h2 className="text-xl font-semibold">
            Uploaded Documents
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            These documents are available to the RAG
            system.
          </p>

        </div>

        {/* Loading */}

        {loading ? (

          <div className="p-10 text-center text-zinc-500">
            Loading documents...
          </div>

        ) : documents.length === 0 ? (

          /* Empty */

          <div className="flex flex-col items-center justify-center p-12 text-center">

            <FileText
              size={48}
              className="mb-4 text-zinc-700"
            />

            <h3 className="text-lg font-semibold text-zinc-300">
              No documents yet
            </h3>

            <p className="mt-2 text-sm text-zinc-500">
              Upload a PDF to start building your
              knowledge base.
            </p>

          </div>

        ) : (

          /* Documents List */

          <div className="divide-y divide-zinc-800">

            {documents.map((document) => (

              <div
                key={document._id}
                className="flex items-center justify-between gap-4 p-5 transition hover:bg-zinc-800/40"
              >

                {/* Document Info */}

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <FileText size={22} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-medium text-white">
                      {document.originalName}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500">

                      <span>
                        {formatFileSize(
                          document.size
                        )}
                      </span>

                      <span>
                        {document.pages ?? 0} pages
                      </span>

                      <span>
                        Uploaded{" "}
                        {document.createdAt
                          ? new Date(
                              document.createdAt
                            ).toLocaleDateString()
                          : "Unknown"}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Delete */}

                <button
                  onClick={() =>
                    deleteDocument(document._id)
                  }
                  disabled={
                    deletingId === document._id
                  }
                  className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Trash2 size={16} />

                  {deletingId === document._id
                    ? "Deleting..."
                    : "Delete"}

                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}