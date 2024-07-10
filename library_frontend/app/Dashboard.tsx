import { useEffect, useState } from 'react';
import axios from 'axios'

interface Book {
  SSID: number;
  Title: string;
  Author: string;
  // Add more fields as per your book schema
}

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get('/api/books/');
        console.log(response.data)
        console.log(response.data[0].SSID)
        setBooks(response.data); // Assuming your API returns books in a 'books' array
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {books.map((book) => (
          <li key={book.SSID}>
            <h2>{book.Title}</h2>
            <p>{book.Author}</p>
            {/* Render other details of the book */}
          </li>
        ))}
      </ul>
    </div>
  );
}
