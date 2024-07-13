import React from 'react';
import { useAppContext } from './Context';

const Header: React.FC = () => {
  const { openModal } = useAppContext();

  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center px-4 py-2 bg-white shadow-md z-50">
      <h1 className="text-3xl font-semibold text-[#ff4d55]">Library..</h1>
      <button
        onClick={() => openModal('add')}
        className="bg-[#ff4d55] hover:bg-[#e0444d] font-bold text-white px-4 py-2 rounded">
        Add Book
      </button>
    </div>
  );
};

export default Header;

