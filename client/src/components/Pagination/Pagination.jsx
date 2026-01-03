import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../../redux/actions/pokemonActions';
import styles from './Pagination.module.css';

const Pagination = () => {
  const dispatch = useDispatch();
  const { displayedPokemons, currentPage } = useSelector(state => state.pokemon);
  
  const pokemonsPerPage = 12;
  const totalPages = Math.ceil(displayedPokemons.length / pokemonsPerPage);
  
  // Si hay menos de 2 páginas, no mostrar paginación
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch(setCurrentPage(page));
      // Scroll suave hacia arriba
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Lógica para mostrar páginas con "..."
      if (currentPage <= 3) {
        // Primeras páginas
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Últimas páginas
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Páginas del medio
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  // Calcular qué Pokémon se muestran en esta página
  const startIndex = (currentPage - 1) * pokemonsPerPage + 1;
  const endIndex = Math.min(currentPage * pokemonsPerPage, displayedPokemons.length);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        Mostrando Pokémon <span className={styles.highlight}>{startIndex}-{endIndex}</span> de{" "}
        <span className={styles.highlight}>{displayedPokemons.length}</span>
      </div>
      
      <div className={styles.paginationControls}>
        {/* Botón Anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.pageButton} ${styles.prevButton}`}
          aria-label="Página anterior"
        >
          ◀ Anterior
        </button>

        {/* Números de página */}
        <div className={styles.pageNumbers}>
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                aria-label={`Ir a página ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${styles.pageButton} ${styles.nextButton}`}
          aria-label="Página siguiente"
        >
          Siguiente ▶
        </button>
      </div>

      {/* Selector rápido de página */}
      <div className={styles.pageJump}>
        <label htmlFor="pageJump" className={styles.jumpLabel}>
          Ir a página:
        </label>
        <select
          id="pageJump"
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          className={styles.jumpSelect}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;