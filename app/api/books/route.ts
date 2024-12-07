import { NextResponse } from 'next/server';

// Define the Book type
export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  image?: string; // Optional image for book
}

// In-memory books data (replace with a database for production)
const books: Book[] = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction" },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic" },
];

// GET: Fetch all books
export async function GET() {
  return NextResponse.json({ success: true, data: books });
}

// POST: Add a new book
export async function POST(req: Request) {
  const body = await req.json();

  const { title, author, genre } = body;
  if (!title || !author || !genre) {
    return NextResponse.json(
      { success: false, message: "Title, author, and genre are required" },
      { status: 400 }
    );
  }

  const newBook: Book = {
    id: books.length + 1,
    title,
    author,
    genre,
  };
  books.push(newBook);

  return NextResponse.json({ success: true, data: newBook }, { status: 201 });
}

// DELETE: Remove a book by ID
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID is required" },
      { status: 400 }
    );
  }

  const bookIndex = books.findIndex((book) => book.id === parseInt(id));
  if (bookIndex === -1) {
    return NextResponse.json(
      { success: false, message: "Book not found" },
      { status: 404 }
    );
  }

  books.splice(bookIndex, 1);
  return NextResponse.json({ success: true, message: "Book deleted successfully" });
}
