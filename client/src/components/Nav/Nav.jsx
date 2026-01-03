// /client/src/components/Nav/Nav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link to="/home">POKÉDEX</Link>
      </div>
      <div className={styles.links}>
        <Link to="/home">Home</Link>
        <Link to="/create">Create Pokémon</Link>
        <Link to="/">Landing</Link>
      </div>
    </nav>
  );
};

export default Nav;