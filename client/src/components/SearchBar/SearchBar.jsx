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

    setMessage('Buscando...');
    
    try {
      console.log('🔍 Buscando Pokémon:', searchTerm);
      const results = await dispatch(searchPokemons(searchTerm.toLowerCase().trim()));
      console.log('📦 Resultados recibidos:', results);
      
      if (results && results.length > 0) {
        setMessage(`✅ Encontrados ${results.length} Pokémon`);
      } else {
        setMessage('❌ No se encontró el Pokémon');
      }
    } catch (error) {
      console.error('❌ Error en búsqueda:', error);
      setMessage('❌ Error al buscar. Intenta de nuevo.');
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
            placeholder="Ej: pikachu, charizard, bulbasaur..."
            className={styles.searchInput}
          />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.searchButton}>
              🔍 Buscar
            </button>
            <button type="button" onClick={handleClear} className={styles.clearButton}>
              ✕
            </button>
          </div>
        </div>
        
        {message && (
          <div className={message.includes('✅') ? styles.successMessage : styles.errorMessage}>
            {message}
          </div>
        )}
        
        <div className={styles.debugInfo}>
          <p><strong>Prueba con:</strong> pikachu, charizard, bulbasaur</p>
          <p><small>Abre la consola (F12) para ver los logs</small></p>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;