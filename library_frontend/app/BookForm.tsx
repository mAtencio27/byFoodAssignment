import React, { useState, useEffect } from 'react';
import { useAppContext } from './Context';

interface BookFormProps {
  closeModal: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ closeModal }) => {
  const { state, setState } = useAppContext();
  const [formData, setFormData] = useState({
    SSID: state.currentBook?.SSID || '',
    Title: state.currentBook?.Title || '',
    Author: state.currentBook?.Author || '',
    Year: state.currentBook?.Year || '',
  });

  useEffect(() => {
    if (state.currentBook) {
      setFormData({
        SSID: state.currentBook.SSID,
        Title: state.currentBook.Title,
        Author: state.currentBook.Author,
        Year: state.currentBook.Year,
      });
    }
  }, [state.currentBook]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.isEditing) {
      // Update existing book logic
      try {
        await axios.put(`/api/books/${formData.SSID}`, formData);
        const updatedBooks = state.books.map((book) =>
          book.SSID === formData.SSID ? formData : book
        );
        setState((prevState) => ({ ...prevState, books: updatedBooks }));
      } catch (error) {
        console.error('Error updating book:', error);
      }
    } else {
      // Add new book logic
      try {
        const response = await axios.post('/api/books', formData);
        setState((prevState) => ({
          ...prevState,
          books: [...prevState.books, response.data],
        }));
      } catch (error) {
        console.error('Error adding book:', error);
      }
    }
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="Title"
          value={formData.Title}
          onChange={handleChange}
          required
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block mb-2">Author</label>
        <input
          type="text"
          name="Author"
          value={formData.Author}
          onChange={handleChange}
          required
          className="border px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block mb-2">Year</label>
        <input
          type="number"
          name="Year"
          value={formData.Year}
          onChange={handleChange}
          required
          className="border px-2 py-1 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4">
        {state.isEditing ? 'Update Book' : 'Add Book'}
      </button>
    </form>
  );
};

export default BookForm;
