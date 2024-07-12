import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Book {
  SSID: number;
  Title: string;
  Author: string;
  Year: number;
}

interface AppState {
  books: Book[];
  modalOpen: boolean;
}

const initialState: AppState = {
  books: [],
  modalOpen: false,
};

const AppContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setBooks: (books: Book[]) => void;
}>({
  state: initialState,
  setState: () => {},
  setBooks: () => {},
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

  return (
    <AppContext.Provider value={{ state, setState, setBooks }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
