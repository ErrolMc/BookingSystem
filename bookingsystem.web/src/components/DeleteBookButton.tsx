"use client";

import { useState } from "react";
import { Book } from "../types/book";

interface DeleteBookButtonProps {
  book: Book;
  onBookDeleted: () => void;
}

export function DeleteBookButton({
  book,
  onBookDeleted,
}: DeleteBookButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
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
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      onBookDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
      setIsDeleting(false);
    }
  };

  if (!isConfirming) {
    return (
      <button
        onClick={() => setIsConfirming(true)}
        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        title="Delete book"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
