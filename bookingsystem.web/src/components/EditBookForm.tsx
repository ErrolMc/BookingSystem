"use client";

import { useState } from "react";
import { Book } from "../types/book";

interface EditBookFormProps {
  book: Book;
  onBookUpdated: () => void;
  onCancel: () => void;
}

export function EditBookForm({
  book,
  onBookUpdated,
  onCancel,
}: EditBookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    year: book.year,
    isbn: book.isbn || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get API URL the same way as in api.ts
      const getApiUrl = () => {
        const aspireHttpsUrl =
          process.env.NEXT_PUBLIC_services__bookingsystem_api__https__0;
        const aspireHttpUrl =
          process.env.NEXT_PUBLIC_services__bookingsystem_api__http__0;

        if (aspireHttpsUrl) return aspireHttpsUrl;
        if (aspireHttpUrl) return aspireHttpUrl;
        if (process.env.NEXT_PUBLIC_API_URL)
          return process.env.NEXT_PUBLIC_API_URL;

        return "http://localhost:5080";
      };

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      onBookUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update book");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Edit Book
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Title *
            </label>
            <input
              type="text"
              id="edit-title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label
              htmlFor="edit-author"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Author *
            </label>
            <input
              type="text"
              id="edit-author"
              required
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label
              htmlFor="edit-year"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Year *
            </label>
            <input
              type="number"
              id="edit-year"
              required
              min="1000"
              max={new Date().getFullYear() + 10}
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value) })
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-isbn"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              ISBN (optional)
            </label>
            <input
              type="text"
              id="edit-isbn"
              value={formData.isbn}
              onChange={(e) =>
                setFormData({ ...formData, isbn: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
              placeholder="Enter ISBN"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isSubmitting ? "Updating..." : "Update Book"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
