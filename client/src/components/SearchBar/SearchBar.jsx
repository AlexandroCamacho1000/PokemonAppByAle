import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchPokemons, getAllPokemons } from '../../redux/actions/pokemonActions';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      dispatch(getAllPokemons());
      setMessage('');
      return;
    }

    setMessage('Searching...');
    
    try {
      console.log('Searching Pokemon:', searchTerm);
      const results = await dispatch(searchPokemons(searchTerm.toLowerCase().trim()));
      console.log('Search results:', results);
      
      if (results && results.length > 0) {
        setMessage(`Found ${results.length} Pokemon`);
      } else {
        setMessage('Pokemon not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('Search failed. Please try again.');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setMessage('');
    dispatch(getAllPokemons());
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ex: pikachu, charizard, bulbasaur..."
            className={styles.searchInput}
          />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
            <button type="button" onClick={handleClear} className={styles.clearButton}>
              Clear
            </button>
          </div>
        </div>
        
        {message && (
          <div className={message.includes('Found') ? styles.successMessage : styles.errorMessage}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;