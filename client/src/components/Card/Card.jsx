import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Card.module.css';

const Card = ({ pokemon }) => {
  // Asegurar que tenemos datos
  if (!pokemon) return null;

  // Extraer datos con valores por defecto
  const {
    id,
    name = 'Unknown',
    image = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    types = [],
    attack = 0,
    hp = 0,
    defense = 0
  } = pokemon;

  // Procesar tipos (pueden venir como string o objeto)
  const typeNames = Array.isArray(types) 
    ? types.map(t => typeof t === 'string' ? t : t.name)
    : [];

  return (
    <Link to={`/detail/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img 
            src={image} 
            alt={name}
            className={styles.image}
            onError={(e) => {
              e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
            }}
          />
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.name}>{name.toUpperCase()}</h3>
          
          <div className={styles.types}>
            {typeNames.slice(0, 2).map((type, index) => (
              <span 
                key={index} 
                className={`${styles.type} ${styles[type.toLowerCase()] || styles.default}`}
              >
                {type}
              </span>
            ))}
          </div>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>HP</span>
              <span className={styles.statValue}>{hp}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>ATK</span>
              <span className={styles.statValue}>{attack}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>DEF</span>
              <span className={styles.statValue}>{defense}</span>
            </div>
          </div>
          
          <div className={styles.idBadge}>#{id}</div>
        </div>
      </div>
    </Link>
  );
};

export default Card;