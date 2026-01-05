import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemonDetail, clearDetail, deletePokemon } from '../../redux/actions/pokemonActions';
import styles from './Detail.module.css';

const Detail = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { pokemonDetail, loading } = useSelector(state => state.pokemon);
  
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    dispatch(clearDetail());
    dispatch(getPokemonDetail(id));

    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, id]);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${pokemonDetail?.name}?`)) {
      try {
        await dispatch(deletePokemon(id));
        alert(`${pokemonDetail?.name} deleted successfully!`);
        history.push('/home');
      } catch (error) {
        alert('Error deleting: ' + error.message);
      }
    }
  };

  const handleTypeColor = (type) => {
    const colors = {
      fire: '#ff6b6b',
      water: '#4d96ff',
      grass: '#5cd85a',
      electric: '#ffde59',
      ice: '#98d8d8',
      fighting: '#c03028',
      poison: '#a040a0',
      ground: '#e0c068',
      flying: '#a890f0',
      psychic: '#f85888',
      bug: '#a8b820',
      rock: '#b8a038',
      ghost: '#705898',
      dragon: '#7038f8',
      dark: '#705848',
      steel: '#b8b8d0',
      fairy: '#ee99ac',
      normal: '#a8a878'
    };
    return colors[type] || '#8a8a8a';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <h2>Loading Pokemon...</h2>
      </div>
    );
  }

  if (!pokemonDetail || !pokemonDetail.id) {
    return (
      <div className={styles.errorContainer}>
        <h2>Pokemon not found!</h2>
        <p>The Pokemon you're looking for doesn't exist or couldn't be loaded.</p>
        <div className={styles.errorButtons}>
          <button onClick={handleGoBack} className={styles.backButton}>
            ↩ Go back
          </button>
          <Link to="/home" className={styles.homeButton}>
            🏠 Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const {
    name = 'Unknown',
    image = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    hp = 0,
    attack = 0,
    defense = 0,
    speed = 0,
    height = 0,
    weight = 0,
    types = [],
    source = 'api',
    created = false
  } = pokemonDetail;

  const isUserCreated = source === 'db' || created === true;
  const maxStat = 255;
  const statPercentage = (stat) => Math.min((stat / maxStat) * 100, 100);

  return (
    <div className={styles.detailContainer}>
      <div className={styles.navigation}>
        <button onClick={handleGoBack} className={styles.navButton}>
          ↩ Back
        </button>
        <Link to="/home" className={styles.navButton}>
          🏠 Home
        </Link>
        <Link to="/create" className={styles.navButton}>
          ✨ Create Pokemon
        </Link>
      </div>

      <div className={styles.pokemonHeader}>
        <h1 className={styles.pokemonName}>
          {name.toUpperCase()}
          <span className={styles.pokemonId}>#{id}</span>
        </h1>
        <div className={styles.sourceBadge}>
          {isUserCreated ? 'Created by me' : 'Original API'}
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.imageWrapper}>
            <img 
              src={image} 
              alt={name} 
              className={styles.pokemonImage}
              onError={(e) => {
                e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
              }}
            />
          </div>
          
          <div className={styles.typesSection}>
            <h3 className={styles.sectionTitle}>Type{types.length > 1 ? 's' : ''}</h3>
            <div className={styles.typesContainer}>
              {types.map((type, index) => {
                const typeName = typeof type === 'string' ? type : type.name;
                return (
                  <span 
                    key={index}
                    className={styles.typeBadge}
                    style={{ backgroundColor: handleTypeColor(typeName) }}
                  >
                    {typeName.toUpperCase()}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'stats' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 Statistics
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'info' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('info')}
            >
              ℹ️ Information
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'stats' ? (
              <div className={styles.statsSection}>
                <h3 className={styles.sectionTitle}>Base Statistics</h3>
                
                {[
                  { label: 'HP', value: hp, color: '#ff6b6b' },
                  { label: 'Attack', value: attack, color: '#ff8e53' },
                  { label: 'Defense', value: defense, color: '#4d96ff' },
                  { label: 'Speed', value: speed, color: '#82e882' }
                ].map((stat, index) => (
                  <div key={index} className={styles.statRow}>
                    <div className={styles.statLabel}>
                      <span className={styles.statName}>{stat.label}</span>
                      <span className={styles.statValue}>{stat.value}</span>
                    </div>
                    <div className={styles.statBarContainer}>
                      <div 
                        className={styles.statBar}
                        style={{
                          width: `${statPercentage(stat.value)}%`,
                          backgroundColor: stat.color
                        }}
                      />
                      <div className={styles.statBarBackground} />
                    </div>
                  </div>
                ))}
                
                <div className={styles.statsSummary}>
                  <div className={styles.statTotal}>
                    <span className={styles.totalLabel}>Base Total:</span>
                    <span className={styles.totalValue}>{hp + attack + defense + speed}</span>
                  </div>
                  <p className={styles.statsNote}>
                    * Base stats determine the Pokemon's battle potential.
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>Physical Information</h3>
                
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Height</span>
                    <span className={styles.infoValue}>
                      {height ? `${height / 10} m` : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Weight</span>
                    <span className={styles.infoValue}>
                      {weight ? `${weight / 10} kg` : 'Unknown'}
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Speed</span>
                    <span className={styles.infoValue}>
                      {speed || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Origin</span>
                    <span className={styles.infoValue}>
                      {isUserCreated ? 'Database' : 'Pokemon API'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.description}>
                  <h4 className={styles.descriptionTitle}>About {name}</h4>
                  <p className={styles.descriptionText}>
                    {name} is a {types.map(t => typeof t === 'string' ? t : t.name).join('/')} 
                    {isUserCreated 
                      ? ' Pokemon created by trainers.' 
                      : ' Pokemon found in the wild.'}
                    With {hp} health points and {attack} attack, it's a formidable 
                    {isUserCreated ? ' adventure companion.' : ' battle contender.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <Link to={`/create`} className={styles.createButton}>
          ✨ Create Similar Pokemon
        </Link>
        <button onClick={handleGoBack} className={styles.exploreButton}>
          🔍 Explore more Pokemon
        </button>
      </div>

      {isUserCreated && (
        <>
          <div className={styles.adminButtons}>
            <button 
              onClick={() => history.push(`/edit/${id}`)}
              className={styles.editButton}
            >
              ✏️ Edit Pokemon
            </button>
            
            <button 
              onClick={handleDelete}
              className={styles.deleteButton}
            >
              🗑️ Delete Pokemon
            </button>
          </div>
          <p className={styles.adminNotice}>
            This Pokemon was created by you. You can edit or delete it.
          </p>
        </>
      )}

      {!isUserCreated && (
        <div className={styles.apiNotice}>
          ℹ️ This is an original Pokemon from the API. Only user-created Pokemon can be edited or deleted.
        </div>
      )}
    </div>
  );
};

export default Detail;