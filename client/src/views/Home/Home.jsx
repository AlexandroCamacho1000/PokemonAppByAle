import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPokemons } from '../../redux/actions/pokemonActions';
import Card from '../../components/Card/Card';
import SearchBar from '../../components/SearchBar/SearchBar'; // <-- Añade esta importación
import styles from './Home.module.css';

const Home = () => {
  const dispatch = useDispatch();
  const { displayedPokemons, loading } = useSelector(state => state.pokemon);

  useEffect(() => {
    dispatch(getAllPokemons());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getAllPokemons());
  };

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
      <div className={styles.headerContent}>
        <h1>EXPLORA EL MUNDO POKÉMON</h1>
        <div className={styles.counter}>
          {displayedPokemons.length} Pokémon descubiertos
        </div>
        <p className={styles.subtitle}>
          Descubre, colecciona y explora todas las criaturas del universo Pokémon
        </p>
      </div>

      {/* AÑADE LA SEARCH BAR AQUÍ */}
      <div className={styles.searchSection}>
        <SearchBar />
      </div>

      <div className={styles.pokemonGrid}>
        {displayedPokemons.length > 0 ? (
          displayedPokemons.map(pokemon => (
            <div key={pokemon.id} className={styles.cardContainer}>
              <Card pokemon={pokemon} />
            </div>
          ))
        ) : (
          <div className={styles.noPokemons}>
            <h2>¡Oh no! No hay Pokémon aquí</h2>
            <p>
              Parece que no hemos podido encontrar ningún Pokémon. 
              Esto podría deberse a un problema de conexión o que la base de datos esté vacía.
            </p>
            <button className={styles.refreshButton} onClick={handleRefresh}>
              🔄 Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;