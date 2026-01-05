import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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
        <h2>Loading Pokemon...</h2>
        <p>Preparing your Pokemon adventure</p>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>EXPLORE THE POKEMON WORLD</h1>
          <div className={styles.counter}>
            {displayedPokemons.length} Pokemon discovered
          </div>
          <p className={styles.subtitle}>
            Discover, collect and explore all creatures in the Pokemon universe
          </p>
        </div>
        
        <Link to="/create" className={styles.createButton}>
          <span className={styles.plusIcon}>＋</span>
          Create Pokemon
        </Link>
      </div>

      <div className={styles.searchSection}>
        <SearchBar />
      </div>

      <div className={styles.filtersSection}>
        <Filters />
      </div>

      <div className={styles.pokemonGrid}>
        {currentPokemons.length > 0 ? (
          currentPokemons.map(pokemon => (
            <div key={pokemon.id} className={styles.cardContainer}>
              <Card pokemon={pokemon} />
            </div>
          ))
        ) : (
          <div className={styles.noPokemons}>
            <h2>Oh no! No Pokemon here</h2>
            <p>
              No Pokemon found with current filters.
              Try changing filters or create a new Pokemon.
            </p>
            <button 
              className={styles.refreshButton} 
              onClick={() => dispatch(getAllPokemons())}
            >
              🔄 Show all
            </button>
            <Link to="/create" className={styles.createButtonAlt}>
              ✨ Create new Pokemon
            </Link>
          </div>
        )}
      </div>

      {displayedPokemons.length > pokemonsPerPage && (
        <div className={styles.paginationSection}>
          <Pagination />
        </div>
      )}
    </div>
  );
};

export default Home;