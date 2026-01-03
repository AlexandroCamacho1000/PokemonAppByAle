import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPokemons } from '../../redux/actions/pokemonActions';
import styles from './Home.module.css';

const Home = () => {
  const dispatch = useDispatch();
  const { displayedPokemons, loading } = useSelector(state => state.pokemon);

  useEffect(() => {
    console.log('Home mounted, fetching pokemons...');
    dispatch(getAllPokemons());
  }, [dispatch]);

  console.log('Pokemons in state:', displayedPokemons.length, displayedPokemons);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <h2>Cargando Pokémon...</h2>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <h1>Pokémon Home</h1>
      <p className={styles.counter}>Total Pokémon: {displayedPokemons.length}</p>
      
      <div className={styles.pokemonGrid}>
        {displayedPokemons.length > 0 ? (
          displayedPokemons.map(pokemon => (
            <div key={pokemon.id} className={styles.pokemonCard}>
              <h3 className={styles.name}>{pokemon.name?.toUpperCase()}</h3>
              <img 
                src={pokemon.image || pokemon.sprites?.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'} 
                alt={pokemon.name}
                className={styles.image}
                onError={(e) => {
                  e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
                }}
              />
              <div className={styles.stats}>
                <p><strong>Attack:</strong> {pokemon.attack}</p>
                <p><strong>HP:</strong> {pokemon.hp || pokemon.health || 50}</p>
                <p><strong>Types:</strong> {
                  pokemon.types ? 
                  (Array.isArray(pokemon.types) ? 
                    pokemon.types.map(t => typeof t === 'string' ? t : t.name).join(', ') 
                    : pokemon.types) 
                  : 'Unknown'
                }</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noPokemons}>
            <h2>No Pokémon found</h2>
            <p>Try refreshing the page or check your backend connection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;