import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterByType, filterByOrigin, sortPokemons, getAllPokemons } from '../../redux/actions/pokemonActions';
import { getTypes } from '../../redux/actions/typesActions';
import styles from './Filters.module.css';

const Filters = () => {
  const dispatch = useDispatch();
  const { allTypes } = useSelector(state => state.types);
  const { filters, sortBy } = useSelector(state => state.pokemon);
  
  const [localType, setLocalType] = useState(filters.type);
  const [localOrigin, setLocalOrigin] = useState(filters.origin);
  const [localSort, setLocalSort] = useState(sortBy);

  // Cargar tipos cuando el componente se monta
  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  // Sincronizar con Redux
  useEffect(() => {
    setLocalType(filters.type);
    setLocalOrigin(filters.origin);
    setLocalSort(sortBy);
  }, [filters, sortBy]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setLocalType(type);
    dispatch(filterByType(type));
  };

  const handleOriginChange = (e) => {
    const origin = e.target.value;
    setLocalOrigin(origin);
    dispatch(filterByOrigin(origin));
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setLocalSort(sort);
    dispatch(sortPokemons(sort));
  };

  const handleReset = () => {
    setLocalType('all');
    setLocalOrigin('all');
    setLocalSort('none');
    dispatch(filterByType('all'));
    dispatch(filterByOrigin('all'));
    dispatch(sortPokemons('none'));
    dispatch(getAllPokemons());
  };

  const isFiltered = filters.type !== 'all' || filters.origin !== 'all' || sortBy !== 'none';

  return (
    <div className={styles.filtersContainer}>
      <h3 className={styles.filtersTitle}>🔧 Filtros y Ordenamiento</h3>
      
      <div className={styles.filtersGrid}>
        {/* FILTRO POR TIPO */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <span className={styles.labelIcon}>🎯</span>
            Tipo de Pokémon
          </label>
          <select 
            value={localType} 
            onChange={handleTypeChange}
            className={styles.filterSelect}
          >
            <option value="all">Todos los tipos</option>
            {allTypes.map((type) => (
              <option key={type.id || type} value={typeof type === 'string' ? type : type.name}>
                {typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1) : type.name}
              </option>
            ))}
          </select>
        </div>

        {/* FILTRO POR ORIGEN */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <span className={styles.labelIcon}>🌐</span>
            Origen
          </label>
          <div className={styles.originButtons}>
            <button
              className={`${styles.originButton} ${localOrigin === 'all' ? styles.active : ''}`}
              onClick={() => {
                setLocalOrigin('all');
                dispatch(filterByOrigin('all'));
              }}
            >
              Todos
            </button>
            <button
              className={`${styles.originButton} ${localOrigin === 'api' ? styles.active : ''}`}
              onClick={() => {
                setLocalOrigin('api');
                dispatch(filterByOrigin('api'));
              }}
            >
              API Original
            </button>
            <button
              className={`${styles.originButton} ${localOrigin === 'db' ? styles.active : ''}`}
              onClick={() => {
                setLocalOrigin('db');
                dispatch(filterByOrigin('db'));
              }}
            >
              Creados por mí
            </button>
          </div>
        </div>

        {/* ORDENAMIENTO */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <span className={styles.labelIcon}>📊</span>
            Ordenar por
          </label>
          <select 
            value={localSort} 
            onChange={handleSortChange}
            className={styles.filterSelect}
          >
            <option value="none">Sin ordenar</option>
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="attack-asc">Ataque (Menor a Mayor)</option>
            <option value="attack-desc">Ataque (Mayor a Menor)</option>
          </select>
        </div>
      </div>

      {/* BOTÓN RESET */}
      {isFiltered && (
        <div className={styles.resetContainer}>
          <button 
            onClick={handleReset}
            className={styles.resetButton}
          >
            <span className={styles.resetIcon}>🔄</span>
            Limpiar todos los filtros
          </button>
          <p className={styles.activeFilters}>
            Filtros activos: 
            {filters.type !== 'all' && ` Tipo: ${filters.type}`}
            {filters.origin !== 'all' && ` Origen: ${filters.origin === 'api' ? 'API' : 'Base de Datos'}`}
            {sortBy !== 'none' && ` Orden: ${getSortLabel(sortBy)}`}
          </p>
        </div>
      )}
    </div>
  );
};

// Función helper para mostrar labels de ordenamiento
const getSortLabel = (sortBy) => {
  switch(sortBy) {
    case 'name-asc': return 'Nombre (A-Z)';
    case 'name-desc': return 'Nombre (Z-A)';
    case 'attack-asc': return 'Ataque ↑';
    case 'attack-desc': return 'Ataque ↓';
    default: return '';
  }
};

export default Filters;