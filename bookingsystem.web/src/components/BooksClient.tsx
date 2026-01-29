"use client";

import { useState } from "react";
import { Book } from "../types/book";
import { AddBookForm } from "./AddBookForm";
import { EditBookForm } from "./EditBookForm";
import { DeleteBookButton } from "./DeleteBookButton";
import { useRouter } from "next/navigation";

interface BooksClientProps {
  initialBooks: Book[];
  initialError: string | null;
}

export function BooksClient({ initialBooks, initialError }: BooksClientProps) {
  const router = useRouter();
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleBookAdded = () => {
    // Refresh the page to show the new book
    router.refresh();
  };

  const handleBookUpdated = () => {
    setEditingBook(null);
    router.refresh();
  };

  const handleBookDeleted = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-900">
      {editingBook && (
        <EditBookForm
          book={editingBook}
          onBookUpdated={handleBookUpdated}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Book Collection
            </h1>
            <span className="rounded-full bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {initialBooks.length}{" "}
              {initialBooks.length === 1 ? "book" : "books"}
            </span>
          </div>
          <AddBookForm onBookAdded={handleBookAdded} />
        </div>

        {initialError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            <p className="font-medium">Error loading books</p>
            <p className="text-sm">{initialError}</p>
          </div>
        )}

        {initialBooks.length === 0 && !initialError && (
          <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-zinc-400 dark:text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              No books yet
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Get started by adding your first book to the collection
            </p>
          </div>
        )}

        {initialBooks.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initialBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h2 className="mb-2 text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
                      {book.title}
                    </h2>
                    <p className="mb-1 text-sm text-zinc-600 dark:text-zinc-400">
                      by {book.author}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingBook(book)}
                      className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                      title="Edit book"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <DeleteBookButton
                      book={book}
                      onBookDeleted={handleBookDeleted}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-zinc-500 dark:text-zinc-500">
                    Published: {book.year}
                  </p>
                  {book.isbn && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-600">
                      ISBN: {book.isbn}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Connected to API via{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              .NET Aspire
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
