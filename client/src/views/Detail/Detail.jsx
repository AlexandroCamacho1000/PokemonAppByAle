import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemonDetail, clearDetail } from '../../redux/actions/pokemonActions';
import styles from './Detail.module.css';

const Detail = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { pokemonDetail, loading } = useSelector(state => state.pokemon);
  
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    // Limpiar detalle anterior al montar
    dispatch(clearDetail());
    
    // Obtener detalle del Pokémon
    dispatch(getPokemonDetail(id));

    // Limpiar al desmontar
    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, id]);

  const handleGoBack = () => {
    history.goBack();
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
        <h2>Cargando Pokémon...</h2>
      </div>
    );
  }

  if (!pokemonDetail || !pokemonDetail.id) {
    return (
      <div className={styles.errorContainer}>
        <h2>¡Pokémon no encontrado!</h2>
        <p>El Pokémon que buscas no existe o no pudo ser cargado.</p>
        <div className={styles.errorButtons}>
          <button onClick={handleGoBack} className={styles.backButton}>
            ↩ Volver atrás
          </button>
          <Link to="/home" className={styles.homeButton}>
            🏠 Ir al Home
          </Link>
        </div>
      </div>
    );
  }

  // Extraer datos con valores por defecto
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
    source = 'api'
  } = pokemonDetail;

  // Calcular porcentajes para barras de estadísticas
  const maxStat = 255; // Máximo posible en Pokémon
  const statPercentage = (stat) => Math.min((stat / maxStat) * 100, 100);

  return (
    <div className={styles.detailContainer}>
      {/* BOTONES DE NAVEGACIÓN */}
      <div className={styles.navigation}>
        <button onClick={handleGoBack} className={styles.navButton}>
          ↩ Volver
        </button>
        <Link to="/home" className={styles.navButton}>
          🏠 Home
        </Link>
        <Link to="/create" className={styles.navButton}>
          ✨ Crear Pokémon
        </Link>
      </div>

      {/* HEADER CON NOMBRE Y ID */}
      <div className={styles.pokemonHeader}>
        <h1 className={styles.pokemonName}>
          {name.toUpperCase()}
          <span className={styles.pokemonId}>#{id}</span>
        </h1>
        <div className={styles.sourceBadge}>
          {source === 'api' ? 'API Original' : 'Creado por mí'}
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className={styles.contentGrid}>
        {/* COLUMNA IZQUIERDA: IMAGEN Y TIPOS */}
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
          
          {/* TIPOS */}
          <div className={styles.typesSection}>
           <h3 className={styles.sectionTitle}>Tipo{types.length > 1 ? 's' : ''}</h3>
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

        {/* COLUMNA DERECHA: INFORMACIÓN DETALLADA */}
        <div className={styles.rightColumn}>
          {/* TABS DE NAVEGACIÓN */}
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'stats' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 Estadísticas
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'info' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('info')}
            >
              ℹ️ Información
            </button>
          </div>

          {/* CONTENIDO DE TABS */}
          <div className={styles.tabContent}>
            {activeTab === 'stats' ? (
              <div className={styles.statsSection}>
                <h3 className={styles.sectionTitle}>Estadísticas Base</h3>
                
                {[
                  { label: 'HP', value: hp, color: '#ff6b6b' },
                  { label: 'Ataque', value: attack, color: '#ff8e53' },
                  { label: 'Defensa', value: defense, color: '#4d96ff' },
                  { label: 'Velocidad', value: speed, color: '#82e882' }
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
                
                {/* STATS SUMMARY */}
                <div className={styles.statsSummary}>
                  <div className={styles.statTotal}>
                    <span className={styles.totalLabel}>Total Base:</span>
                    <span className={styles.totalValue}>{hp + attack + defense + speed}</span>
                  </div>
                  <p className={styles.statsNote}>
                    * Las estadísticas base determinan el potencial de batalla del Pokémon.
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>Información Física</h3>
                
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Altura</span>
                    <span className={styles.infoValue}>
                      {height ? `${height / 10} m` : 'Desconocida'}
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Peso</span>
                    <span className={styles.infoValue}>
                      {weight ? `${weight / 10} kg` : 'Desconocido'}
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Velocidad</span>
                    <span className={styles.infoValue}>
                      {speed || 'Desconocida'}
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Origen</span>
                    <span className={styles.infoValue}>
                      {source === 'api' ? 'API Pokémon' : 'Base de Datos'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.description}>
                  <h4 className={styles.descriptionTitle}>Acerca de {name}</h4>
                  <p className={styles.descriptionText}>
                    {name} es un Pokémon {types.map(t => typeof t === 'string' ? t : t.name).join('/')} 
                    {source === 'api' 
                      ? ' encontrado en la naturaleza Pokémon.' 
                      : ' creado por entrenadores Pokémon.'}
                    Con {hp} puntos de salud y {attack} de ataque, es un formidable 
                    {source === 'api' ? ' contendiente en batallas.' : ' compañero de aventuras.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className={styles.actionButtons}>
        <Link to={`/create`} className={styles.createButton}>
          ✨ Crear Pokémon Similar
        </Link>
        <button onClick={handleGoBack} className={styles.exploreButton}>
          🔍 Explorar más Pokémon
        </button>
      </div>
    </div>
  );
};

export default Detail;