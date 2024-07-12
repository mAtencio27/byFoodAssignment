import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Book {
  SSID: number;
  Title: string;
  Author: string;
  Year: number;
}

interface AppState {
  books: Book[];
  selectedBook: Book | null;
  newBook: { Title: string; Author: string };
  modalType: 'edit' | 'delete' | 'add' | null;
  modalIsOpen: boolean;
  error: string | null;
}

const initialState: AppState = {
  books: [],
  selectedBook: null,
  newBook: { Title: '', Author: '' },
  modalType: null,
  modalIsOpen: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setBooks: (books: Book[]) => void;
  addBook: () => Promise<void>;
  editBook: () => Promise<void>;
  deleteBook: () => Promise<void>;
  openModal: (type: 'edit' | 'delete' | 'add', book?: Book) => void;
  closeModal: () => void;
  setNewBook: (field: keyof AppState['newBook'], value: string) => void;
  setSelectedBook: (field: keyof Book, value: string | number) => void;
}>({
  state: initialState,
  setState: () => {},
  setBooks: () => {},
  addBook: async () => {},
  editBook: async () => {},
  deleteBook: async () => {},
  openModal: () => {},
  closeModal: () => {},
  setNewBook: () => {},
  setSelectedBook: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setBooks = (books: Book[]) => {
    setState((prevState) => ({
      ...prevState,
      books,
    }));
  };

  const addBook = async () => {
    const newBookJson = JSON.stringify(state.newBook);
    try {
      const response = await axios.post('/api/books/', newBookJson, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setBooks([...state.books, response.data]);
      closeModal();
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message || 'Error adding book',
      }));
    }
  };

  const editBook = async () => {
    const editedBookJson = JSON.stringify(state.selectedBook);
    try {
      const response = await axios.put(`/api/books/${state.selectedBook?.SSID}`, editedBookJson, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const updatedBooks = state.books.map((book) =>
        book.SSID === state.selectedBook?.SSID ? response.data : book
      );
      setBooks(updatedBooks);
      closeModal();
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message || 'Error editing book',
      }));
    }
  };

  const deleteBook = async () => {
    try {
      await axios.delete(`/api/books/${state.selectedBook?.SSID}`);
      const updatedBooks = state.books.filter((book) => book.SSID !== state.selectedBook?.SSID);
      setBooks(updatedBooks);
      closeModal();
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message || 'Error deleting book',
      }));
    }
  };

  const openModal = (type: 'edit' | 'delete' | 'add', book?: Book) => {
    console.log(type)
    setState((prevState) => ({
      ...prevState,
      selectedBook: book || null,
      modalType: type,
      modalIsOpen: true,
    }));
  };

  const closeModal = () => {
    setState((prevState) => ({
      ...prevState,
      selectedBook: null,
      modalType: null,
      modalIsOpen: false,
    }));
  };

  const setNewBook = (field: keyof AppState['newBook'], value: string) => {
    setState((prevState) => ({
      ...prevState,
      newBook: {
        ...prevState.newBook,
        [field]: value,
      },
    }));
  };

  const setSelectedBook = (field: keyof Book, value: string | number) => {
    if (state.selectedBook) {
      setState((prevState) => ({
        ...prevState,
        selectedBook: {
          ...prevState.selectedBook,
          [field]: field === 'SSID' ? (value as number) : (value as string),
        },
      }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        setBooks,
        addBook,
        editBook,
        deleteBook,
        openModal,
        closeModal,
        setNewBook,
        setSelectedBook,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);