import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

// SearchComponent.tsx
interface SearchComponentProps {
    onSearch: (searchTerm: string) => void;
  }
  
  const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearch = () => {
      onSearch(searchTerm);
    };
  
    return (
      <div className="flex items-center space-x-2 border border-gray-700 bg-transparent text-white p-1 rounded">
        <FiSearch className="text-gray-500 cursor-pointer" onClick={handleSearch} />
        <input
          type="text"
          placeholder="Search address..."
          className="bg-transparent text-white placeholder-gray-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
    );
  };
  
  export default SearchComponent;
  