import { useEffect, useState } from 'react';
import axios from 'axios'
import BookCard from './BookCard';

interface Book {
  SSID: number;
  Title: string;
  Author: string;
  Year: number;
}

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get('/api/books/');
        console.log(response.data)
        console.log(response.data[0].SSID)
        setBooks(response.data); // Assuming your API returns books in a 'books' array
      } catch (error) {
        console.error('Error fetching books:', error);
        setError(error.message || 'Error fetching books')
      }
    }
    fetchBooks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      {/* Grid layout for displaying books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book.SSID} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
            {/* Book information section */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{book.Title}</h2>
              <p className="text-gray-600">{book.Author}</p>
              <p className="text-gray-600">Year: {book.year}</p>
            </div>
            
            {/* Buttons section */}
            <div className="grid grid-cols-1 gap-4">
              
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
              
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
