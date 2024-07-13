import { useEffect, useState } from 'react';
import axios from 'axios'
import Link from 'next/link';
import { useAppContext} from './Context';
import ModalDialog from './modal';
import Header from './header';


interface Book {
  SSID: number;
  Title: string;
  Author: string;
  Year: number;
}

export default function Dashboard() {
  const {state,
         setBooks,
         addBook,
         editBook,
         deleteBook,
         openModal,
         closeModal,
         setNewBook,
         setSelectedBook,
         } = useAppContext();
         
  const [error, setError] = useState<string | null>(null);

  //INITIAL FORM for new book REMINDER
//   const [newBook, setNewBook] = useState<{ Title: string; Author: string; Year: number }>({ Title: '', Author: '', Year: 0 });
//     const [newBook, setNewBook] = useState<{ Title: string; Author: string}>({ Title: '', Author: '' });

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get('/api/books/');
        setBooks(response.data)
        setError(null)
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Error fetching books. Please try again later.')
      }
    }
    fetchBooks();
  }, []);

  // WILL ADD YEAR AFTER BACKEND REVISION UNCOMMENT HERE AND IN MODAL
  //const isFormValid = newBook.Title && newBook.Author && newBook.Year;
  //const isFormValid = state.newBook.Title && state.newBook.Author;




  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 pt-20">
      <Header />
      <h1 className="text-3xl text-center font-bold mb-4 text-[#ff4d55]">Dashboard</h1>

      {/* Grid layout for displaying books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {state.books.map((book) => (
          <div key={book.SSID} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
            {/* Book information section */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{book.Title}</h2>
              <p className="text-gray-600">{book.Author}</p>
              <p className="text-gray-600">Year: {book.Year}</p>
            </div>
            
            {/* Buttons section */}
    
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => openModal('edit', book)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Edit
              </button>
                
                <button
                    onClick={() => openModal('delete',book)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                    Delete
                </button>
                            
                    {/* Link to view details */}
                <Link href={`/${book.SSID}`} passHref>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded w-full">View Details</button>
                </Link>
              
            </div>
          </div>
        ))}
      </div>


{/* Modal for edit, delete, and add */}
      <ModalDialog>
        <div>
          {state.modalType === 'edit' && (
            
            <div>
              <form>
                <label>
                    Title:
                    <input
                        type="text"
                        placeholder={state.selectedBook?.Title}
                        value={state.selectedBook?.Title}
                        maxLength={255}
                        onChange={(e) => setSelectedBook('Title', e.target.value)}
                        className="border rounded px-2 py-1 mb-2 w-full"
                    />
                    
                </label>
                {/* Add validation error message */}
                {!state.selectedBook?.Title && <p className="text-red-500 text-sm mt-1">Title is required.</p>}
                <label>
                    Author:
                    <input
                    type="text"
                    placeholder={state.selectedBook?.Author}
                    value={state.selectedBook?.Author}
                    maxLength={255}
                    onChange={(e) => setSelectedBook('Author', e.target.value)}
                    className="border rounded px-2 py-1 mb-2 w-full"
                />
                {/* Add validation error message */}
                {!state.selectedBook?.Author && <p className="text-red-500 text-sm mt-1">Author is required.</p>}
                </label>
                <label>
                    Year:
                    <input
                    type="number"
                    value={state.selectedBook?.Year}
                    onChange={(e) => setSelectedBook('Year', e.target.value)}
                    className="border rounded px-2 py-1 mb-2 w-full"
                    />
                {/* Add validation error message */}
                {!state.selectedBook?.Year && <p className="text-red-500 text-sm mt-1">Year is required.</p>}
                </label>

              </form>
              <div className="flex mt-4 gap-2">
                <button
                    onClick={closeModal}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                    Back
                </button>
                <button onClick={editBook} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
              </div>
              {!state.selectedBook?.Title || !state.selectedBook?.Author || !state.selectedBook?.Year ? (
                <p className="text-red-500 text-sm mt-1">Please fill in all fields before saving changes.</p>
              ) : null}
            </div>
          )}
          {state.modalType === 'delete' && (
            <div>
              <p>Are you sure you want to delete the book "{state.selectedBook?.Title}"?</p>
              <div className="flex mt-4 gap-2">
                  <button
                      onClick={deleteBook}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                      Delete Book
                  </button>
                  <button
                      onClick={closeModal}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                      Cancel
                  </button>
              </div>

            </div>
          )}
          {state.modalType === 'add' && (
            <div>
              <form>
              <label>
                Title:
                <input
                  type="text"
                  value={state.newBook.Title}
                  maxLength={255}
                  onChange={(e) => setNewBook('Title', e.target.value)}
                  className="border rounded px-2 py-1 mb-2 w-full"
                />
              </label>
              {!state.newBook.Title && <p className="text-red-500 text-sm mt-1">Title is required.</p>}
              <label>
                Author:
                <input
                  type="text"
                  value={state.newBook.Author}
                  maxLength={255}
                  onChange={(e) => setNewBook('Author', e.target.value )}
                  className="border rounded px-2 py-1 mb-2 w-full"
                />
                {!state.newBook.Author && <p className="text-red-500 text-sm mt-1">Author is required.</p>}
              </label>
              <label>
                Year:
                <input
                  type="number"
                  value={state.newBook.Year}
                  onChange={(e) => setNewBook('Year', e.target.value)}
                  className="border rounded px-2 py-1 mb-2 w-full"
                />
                {!state.newBook.Year && <p className="text-red-500 text-sm mt-1">Year is required.</p>}
              </label>
              </form>
              <div className="flex mt-4 gap-2">
                  <button
                      onClick={closeModal}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                      Back
                  </button>
                  <button
                      onClick={addBook}
                      className="bg-[#ff4d55] hover:bg-[#e7434b] text-white px-4 py-2 rounded">
                        Add Book
                  </button>
              </div>
              {!state.newBook.Title || !state.newBook.Author || !state.newBook.Year ? (
                <p className="text-red-500 text-sm mt-1">Please fill in all fields before adding a book.</p>
              ) : null}
            </div>
          )}
        </div>
      </ModalDialog>
      

    </div>
  );
}

