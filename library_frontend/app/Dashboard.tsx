import { useEffect, useState } from 'react';
import axios from 'axios'
import Link from 'next/link';
import { useAppContext} from './Context';
import ModalDialog from './modal';


interface Book {
  SSID: number;
  Title: string;
  Author: string;
  Year: number;
}

export default function Dashboard() {
  // commenting out values now stored in context
  //const [books, setBooks] = useState<Book[]>([]);
  const { state, setBooks } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  //Modal first implementation temporary
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'edit' | 'delete' | 'add' | null>(null);

  //INITIAL FORM for new book
//   const [newBook, setNewBook] = useState<{ Title: string; Author: string; Year: number }>({ Title: '', Author: '', Year: 0 });
     const [newBook, setNewBook] = useState<{ Title: string; Author: string}>({ Title: '', Author: '' });

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get('/api/books/');
        //console.log(response.data)
        //console.log(response.data[0].SSID)
        //Context API rework
        setBooks(response.data)
        //console.log(state.books)
      } catch (error) {
        console.error('Error fetching books:', error);
        setError(error.message || 'Error fetching books')
      }
    }
    fetchBooks();
  }, []);

  // WILL ADD YEAR AFTER BACKEND REVISION UNCOMMENT HERE AND IN MODAL
  //const isFormValid = newBook.Title && newBook.Author && newBook.Year;
  const isFormValid = newBook.Title && newBook.Author;

  //   MODAL HANDLING
  const openModal = (type: 'edit' | 'delete' | 'add', book?: Book) => {
    setSelectedBook(book || null);
    setModalType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setModalType(null);
    setModalIsOpen(false);
  };

  //CRUD HANDLERS

  const handleEdit = () => {
    //console.log(`Edit book:', ${selectedBook?.Title}`);
    //console.log(selectedBook?.Author)
    const editedBookJson = JSON.stringify(selectedBook)
    console.log(editedBookJson)
    async function editBook(){
        try{
            const response = await axios.put(`api/books/${selectedBook?.SSID}`,editedBookJson)
            console.log(response.data)

        } catch (error) {
            console.error('Error fetching books:', error);
            setError(error.message || 'Error fetching books')
        }
    }
    editBook()
    //closeModal();
  };

  const handleDelete = () => {
    console.log(`Delete book:' ${selectedBook}`);
    console.log(selectedBook?.SSID)
    async function deleteBook() {
        try{
            const response = await axios.delete(`/api/books/${selectedBook?.SSID}`)
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching books:', error);
            setError(error.message || 'Error fetching books')
        }
    }
    deleteBook()
    closeModal();
  };

  const handleAddbook = () => {
    //DATA CHECK DELETE ONCE working
    //console.log(newBook);
    const newBookJson = JSON.stringify(newBook)
    console.log(newBookJson)
    async function addBook() {
        try {
          const response = await axios.post('/api/books/',newBookJson,{
            headers: {
                'Content-Type': 'application/json'
            }
          });
          console.log(response.data)
        } catch (error) {
          console.error('Error fetching books:', error);
          setError(error.message || 'Error fetching books')
        }
    }
    addBook()
    closeModal();
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-center font-bold mb-4">Dashboard</h1>

      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => openModal('add')}>
        Add Book
      </button> d
      <button onClick={()=>{console.log(state)}}>click</button>
      
      {/* Grid layout for displaying books */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {state.books.map((book) => (
          <div key={book.SSID} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
            {/* Book information section */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{book.Title}</h2>
              <p className="text-gray-600">{book.Author}</p>
              <p className="text-gray-600">Year: {book.year}</p>
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
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">View Details</button>
                </Link>
              
            </div>
          </div>
        ))}
      </div>


{/* Modal for edit, delete, and add */}
      <ModalDialog isOpen={modalIsOpen} onClose={closeModal} title={modalType === 'add' ? "Add Book" : modalType === 'edit' ? "Edit Book" : "Delete Book"}>
        <div>
          {modalType === 'edit' && (
            
            <div>
              <h2>Edit Book Form</h2>
              <form>
                <label>
                    Title:
                    <input
                        type="text"
                        placeholder={selectedBook?.Title}
                        value={selectedBook?.Title}
                        maxLength={255}
                        onChange={(e) => setSelectedBook(selectedBook ? { ...selectedBook, Title: e.target.value } : null)}
                        className="border rounded px-2 py-1 mb-2 w-full"
                    />
                </label>
                <label>
                    Author:
                    <input
                    type="text"
                    placeholder={selectedBook?.Author}
                    value={selectedBook?.Author}
                    maxLength={255}
                    onChange={(e) => setSelectedBook(selectedBook ? { ...selectedBook, Author: e.target.value } : null)}
                    className="border rounded px-2 py-1 mb-2 w-full"
                />
                </label>
                {/* <label>
                    Year:
                    <input
                    type="number"
                    placeholder={selectedBook?.Year}
                    value={newBook.Year}
                    onChange={(e) => setNewBook({ ...newBook, Year: parseInt(e.target.value) })}
                    className="border rounded px-2 py-1 mb-2 w-full"
                    />
                </label> */}

              </form>
              <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </div>
          )}
          {modalType === 'delete' && (
            <div>
              <p>Are you sure you want to delete the book "{selectedBook?.Title}"?</p>
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Delete Book
              </button>
              <button onClick={closeModal} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          )}
          {modalType === 'add' && (
            <div>
              <h2>Add Book Form</h2>
              <form>
              <label>
                Title:
                <input
                  type="text"
                  value={newBook.Title}
                  maxLength={255}
                  onChange={(e) => setNewBook({ ...newBook, Title: e.target.value })}
                  className="border rounded px-2 py-1 mb-2 w-full"
                />
              </label>
              <label>
                Author:
                <input
                  type="text"
                  value={newBook.Author}
                  maxLength={255}
                  onChange={(e) => setNewBook({ ...newBook, Author: e.target.value })}
                  className="border rounded px-2 py-1 mb-2 w-full"
                />
              </label>
              {/* <label>
                Year:
                <input
                  type="number"
                  value={newBook.Year}
                  onChange={(e) => setNewBook({ ...newBook, Year: parseInt(e.target.value) })}
                  className="border rounded px-2 py-1 mb-2 w-full"
                />
              </label> */}
              </form>
              <p>Your add book form components go here</p>
              {/* Placeholder button for adding book */}
              <button
              onClick={()=>{handleAddbook()}}
              disabled={!isFormValid} 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Add Book
              </button>
            </div>
          )}
        </div>
      </ModalDialog>
      

    </div>
  );
}

