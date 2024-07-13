"use client";
import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg py-20 px-10 max-w-lg w-full">
        <h1 className="text-4xl font-bold mb-10 text-center">Book Details</h1>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : book ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">{book.Title}</h2>
            <p className="text-gray-600 mb-4 text-lg"><span className="font-medium">Author:</span> {book.Author}</p>
            <p className="text-gray-600 mb-4 text-lg"><span className="font-medium">Year:</span> {book.Year}</p>
            <p className="text-gray-600 mb-4 text-lg"><span className="font-medium">SSID:</span> {book.SSID}</p>
          </div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
        <div className="text-center mt-10">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
