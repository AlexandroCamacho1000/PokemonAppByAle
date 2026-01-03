import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // <-- Añadido
import { getAllPokemons } from '../../redux/actions/pokemonActions';
import Card from '../../components/Card/Card';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import Pagination from '../../components/Pagination/Pagination';
import styles from './Home.module.css';

const Home = () => {
  const dispatch = useDispatch();
  const { displayedPokemons, loading, currentPage } = useSelector(state => state.pokemon);
  
  const pokemonsPerPage = 12;
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = displayedPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  useEffect(() => {
    dispatch(getAllPokemons());
  }, [dispatch]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <h2>Cargando Pokémon...</h2>
        <p>Preparando tu aventura Pokémon</p>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {/* HEADER CON BOTÓN DE CREATE */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>EXPLORA EL MUNDO POKÉMON</h1>
          <div className={styles.counter}>
            {displayedPokemons.length} Pokémon descubiertos
          </div>
          <p className={styles.subtitle}>
            Descubre, colecciona y explora todas las criaturas del universo Pokémon
          </p>
        </div>
        
        {/* BOTÓN PARA CREAR POKÉMON */}
        <Link to="/create" className={styles.createButton}>
          <span className={styles.plusIcon}>＋</span>
          Crear Pokémon
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className={styles.searchSection}>
        <SearchBar />
      </div>

      {/* FILTROS */}
      <div className={styles.filtersSection}>
        <Filters />
      </div>

      {/* GRID DE POKÉMON CON PAGINACIÓN */}
      <div className={styles.pokemonGrid}>
        {currentPokemons.length > 0 ? (
          currentPokemons.map(pokemon => (
            <div key={pokemon.id} className={styles.cardContainer}>
              <Card pokemon={pokemon} />
            </div>
          ))
        ) : (
          <div className={styles.noPokemons}>
            <h2>¡Oh no! No hay Pokémon aquí</h2>
            <p>
              No se encontraron Pokémon con los filtros actuales.
              Intenta cambiar los filtros o crea un nuevo Pokémon.
            </p>
            <button 
              className={styles.refreshButton} 
              onClick={() => dispatch(getAllPokemons())}
            >
              🔄 Mostrar todos
            </button>
            <Link to="/create" className={styles.createButtonAlt}>
              ✨ Crear nuevo Pokémon
            </Link>
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {displayedPokemons.length > pokemonsPerPage && (
        <div className={styles.paginationSection}>
          <Pagination />
        </div>
      )}
    </div>
  );
};

export default Home;