import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchPokemons, getAllPokemons } from '../../redux/actions/pokemonActions';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      // Si está vacío, mostrar todos los Pokémon
      dispatch(getAllPokemons());
      setError('');
      return;
    }

    try {
      const results = await dispatch(searchPokemons(searchTerm.toLowerCase().trim()));
      
      if (results.length === 0) {
        setError(`No se encontró ningún Pokémon llamado "${searchTerm}"`);
      } else {
        setError('');
      }
    } catch (error) {
      setError('Error al buscar Pokémon');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setError('');
    dispatch(getAllPokemons());
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setError(''); // Limpiar error al escribir
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Buscar Pokémon por nombre..."
            className={styles.searchInput}
            aria-label="Buscar Pokémon"
          />
          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.searchButton}
              disabled={!searchTerm.trim()}
            >
              <span className={styles.searchIcon}>🔍</span>
              Buscar
            </button>
            <button 
              type="button" 
              onClick={handleClear}
              className={styles.clearButton}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </div>
        )}
        
        <div className={styles.searchTips}>
          <p className={styles.tipTitle}>Consejos de búsqueda:</p>
          <ul className={styles.tipList}>
            <li>Usa el nombre exacto del Pokémon</li>
            <li>Ejemplos: <em>pikachu, charizard, mewtwo</em></li>
            <li>La búsqueda no distingue mayúsculas/minúsculas</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;