"use client";

import { useState } from "react";

interface AddBookFormProps {
  onBookAdded: () => void;
}

export function AddBookForm({ onBookAdded }: AddBookFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: new Date().getFullYear(),
    isbn: "",
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
      const response = await fetch(`${apiUrl}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create book");
      }

      // Reset form and close
      setFormData({
        title: "",
        author: "",
        year: new Date().getFullYear(),
        isbn: "",
      });
      setIsOpen(false);
      onBookAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Book
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Add New Book
        </h2>
        <button
          onClick={() => setIsOpen(false)}
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
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
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
            htmlFor="author"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Author *
          </label>
          <input
            type="text"
            id="author"
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
            htmlFor="year"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Year *
          </label>
          <input
            type="number"
            id="year"
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
            htmlFor="isbn"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            ISBN (optional)
          </label>
          <input
            type="text"
            id="isbn"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
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
            {isSubmitting ? "Adding..." : "Add Book"}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
