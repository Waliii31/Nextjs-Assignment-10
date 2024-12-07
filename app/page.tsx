"use client"
import { useEffect, useState } from 'react';
import { Trash2, Plus, BookOpen } from 'lucide-react';

// Define Book type directly in the file
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', genre: '' });

  // Fetch books when the page loads
  useEffect(() => {
    fetch('http://localhost:3000/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data.data));
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, author, genre } = newBook;
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, genre }),
    });
    const data = await response.json();
    if (data.success) {
      setBooks((prevBooks) => [...prevBooks, data.data]);
      setNewBook({ title: '', author: '', genre: '' }); // Reset form
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/books?id=${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (data.success) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-indigo-600 text-white flex items-center">
            <BookOpen className="mr-3" />
            <h1 className="text-2xl font-bold">Book Collection</h1>
          </div>
          
          {books.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No books in your collection. Add some books below!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {books.map((book) => (
                <li 
                  key={book.id} 
                  className="px-6 py-4 hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500">
                      by {book.author} • {book.genre}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(book.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add a New Book</h2>
          <form onSubmit={handleAddBook} className="space-y-4">
            <input
              type="text"
              placeholder="Book Title"
              required
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Author Name"
              required
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Genre"
              required
              value={newBook.genre}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <Plus className="mr-2" /> Add Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;