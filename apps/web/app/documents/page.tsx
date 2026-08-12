"use client";

import { useEffect, useState } from "react";

type Document = {
  _id: string;
  filename: string;
  originalName: string;
  size: number;
  pages: number;
  createdAt: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ==========================================
  // Load Documents
  // ==========================================

  async function loadDocuments() {
    try {
      setLoading(true);

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

      setDocuments(data.data || []);
    } catch (err) {
      console.error("Load Documents Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // Delete Document
  // ==========================================

  async function deleteDocument(id: string) {
    const ok = confirm(
      "Delete this document?\n\nThis will also remove all embeddings."
    );

    if (!ok) {
      return;
    }

    try {
      setDeletingId(id);

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
        prev.filter((doc) => doc._id !== id)
      );
    } catch (err) {
      console.error("Delete Document Error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    loadDocuments();
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="mx-auto max-w-6xl p-10">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Documents
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage documents stored in your MindWeave
          knowledge base.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
          Loading documents...
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-10 text-center text-zinc-400">
          No documents uploaded.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">

          <table className="w-full">

            <thead className="bg-zinc-950">
              <tr>
                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Size
                </th>

                <th className="p-4 text-left">
                  Pages
                </th>

                <th className="p-4 text-left">
                  Uploaded
                </th>

                <th className="p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc._id}
                  className="border-t border-zinc-700 transition hover:bg-zinc-800/40"
                >
                  <td className="max-w-xs truncate p-4 font-medium text-white">
                    {doc.originalName}
                  </td>

                  <td className="p-4 text-zinc-300">
                    {(doc.size / 1024).toFixed(1)} KB
                  </td>

                  <td className="p-4 text-zinc-300">
                    {doc.pages}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {new Date(
                      doc.createdAt
                    ).toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() =>
                        deleteDocument(doc._id)
                      }
                      disabled={
                        deletingId === doc._id
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === doc._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </main>
  );
}