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

  async function loadDocuments() {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/upload/documents");

      const data = await res.json();

      setDocuments(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteDocument(id: string) {
    const ok = confirm(
      "Delete this document?\n\nThis will also remove all embeddings."
    );

    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:5000/upload/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-10">
      <h1 className="mb-8 text-4xl font-bold">
        Documents
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : documents.length === 0 ? (
        <div className="rounded-xl border border-zinc-700 p-10 text-center text-zinc-400">
          No documents uploaded.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-700">
          <table className="w-full">
            <thead className="bg-zinc-900">
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

                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc._id}
                  className="border-t border-zinc-700"
                >
                  <td className="p-4">
                    {doc.originalName}
                  </td>

                  <td className="p-4">
                    {(doc.size / 1024).toFixed(1)} KB
                  </td>

                  <td className="p-4">
                    {doc.pages}
                  </td>

                  <td className="p-4">
                    {new Date(
                      doc.createdAt
                    ).toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() =>
                        deleteDocument(doc._id)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                    >
                      Delete
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