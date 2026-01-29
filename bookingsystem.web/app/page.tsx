import { booksApi } from "../src/lib/api";
import { Book } from "../src/types/book";
import { BooksClient } from "../src/components/BooksClient";

export default async function Home() {
  let books: Book[] = [];
  let error = null;

  try {
    books = await booksApi.getAll();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load books";
    console.error("Error fetching books:", e);
  }

  return <BooksClient initialBooks={books} initialError={error} />;
}
