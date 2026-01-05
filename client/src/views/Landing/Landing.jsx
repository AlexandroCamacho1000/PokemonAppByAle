import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Landing.module.css';
import miLogo from '../../assets/alesoft.png';

const Landing = () => {
  const history = useHistory();

  const handleEnter = () => {
    history.push('/home');
  };

  return (
    <div className={styles.landingContainer}>
      <div className={styles.content}>
        <img src={miLogo} alt="Alesoft Logo" className={styles.logo} />
        
        <div className={styles.titleContainer}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
            alt="Pokeball" 
            className={styles.pokeballLogo}
          />
          <h1 className={styles.title}>POKEMON APP</h1>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" 
            alt="Pokeball" 
            className={styles.pokeballLogo}
          />
        </div>
        
        <p className={styles.subtitle}>Explore the world of Pokemon</p>
        <button className={styles.enterButton} onClick={handleEnter}>
          ENTER
        </button>
      </div>
    </div>
  );
};

export default Landing;