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

  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

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
      <h3 className={styles.filtersTitle}>Filters and Sorting</h3>
      
      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Pokemon Type
          </label>
          <select 
            value={localType} 
            onChange={handleTypeChange}
            className={styles.filterSelect}
          >
            <option value="all">All types</option>
            {allTypes.map((type) => (
              <option key={type.id || type} value={typeof type === 'string' ? type : type.name}>
                {typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1) : type.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Origin
          </label>
          <div className={styles.originButtons}>
            <button
              className={`${styles.originButton} ${localOrigin === 'all' ? styles.active : ''}`}
              onClick={() => {
                setLocalOrigin('all');
                dispatch(filterByOrigin('all'));
              }}
            >
              All
            </button>
            <button
              className={`${styles.originButton} ${localOrigin === 'api' ? styles.active : ''}`}
              onClick={() => {
                setLocalOrigin('api');
                dispatch(filterByOrigin('api'));
              }}
            >
              Original API
            </button>
            <button
              className={`${styles.originButton} ${localOrigin === 'db' ? styles.active : ''}`}
              onClick={() => {
                setLocalOrigin('db');
                dispatch(filterByOrigin('db'));
              }}
            >
              Created by me
            </button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Sort by
          </label>
          <select 
            value={localSort} 
            onChange={handleSortChange}
            className={styles.filterSelect}
          >
            <option value="none">No sorting</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="attack-asc">Attack (Low to High)</option>
            <option value="attack-desc">Attack (High to Low)</option>
          </select>
        </div>
      </div>

      {isFiltered && (
        <div className={styles.resetContainer}>
          <button 
            onClick={handleReset}
            className={styles.resetButton}
          >
            Clear all filters
          </button>
          <p className={styles.activeFilters}>
            Active filters: 
            {filters.type !== 'all' && ` Type: ${filters.type}`}
            {filters.origin !== 'all' && ` Origin: ${filters.origin === 'api' ? 'API' : 'Database'}`}
            {sortBy !== 'none' && ` Sort: ${getSortLabel(sortBy)}`}
          </p>
        </div>
      )}
    </div>
  );
};

const getSortLabel = (sortBy) => {
  switch(sortBy) {
    case 'name-asc': return 'Name (A-Z)';
    case 'name-desc': return 'Name (Z-A)';
    case 'attack-asc': return 'Attack ↑';
    case 'attack-desc': return 'Attack ↓';
    default: return '';
  }
};

export default Filters;