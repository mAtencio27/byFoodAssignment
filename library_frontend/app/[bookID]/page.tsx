"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
  SSID: number;
  Title: string;
  Author: string;
  Year: number;
}

const BookDetailsPage = () => {
  const { bookID } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const response = await axios.get(`/api/books/${bookID}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError(error.message || 'Error fetching book details');
      }
    }

    fetchBookDetails();
  }, [bookID]);

  return (
    <div className="container h-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Book Details</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : book ? (
        <div>
          <h2 className="text-xl font-semibold">{book.Title}</h2>
          <p className="text-gray-600">Author: {book.Author}</p>
          <p className="text-gray-600">Year: {book.Year}</p>
          <p className="text-gray-600">SSID: {book.SSID}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BookDetailsPage;