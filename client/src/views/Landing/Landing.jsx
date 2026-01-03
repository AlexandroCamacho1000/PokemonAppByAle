import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Landing.module.css';
import miLogo from '../../assets/alesoft.png'; // ← Tu logo

const Landing = () => {
  const history = useHistory();

  const handleEnter = () => {
    history.push('/home');
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.content}>
        <img src={miLogo} alt="Alesoft Logo" className={styles.logo} />
        <h1 className={styles.title}>POKÉMON APP</h1>
        <p className={styles.subtitle}>Explora el mundo de los Pokémon</p>
        <button className={styles.enterButton} onClick={handleEnter}>
          ENTRAR
        </button>
      </div>
    </div>
  );
};

export default Landing;