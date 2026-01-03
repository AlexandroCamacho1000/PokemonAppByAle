import {
  GET_ALL_POKEMONS,
  GET_POKEMON_DETAIL,
  SEARCH_POKEMONS,
  CREATE_POKEMON,
  FILTER_BY_TYPE,
  FILTER_BY_ORIGIN,
  SORT_POKEMONS,
  SET_LOADING,
  SET_CURRENT_PAGE,
  CLEAR_DETAIL
} from '../actions/pokemonActions';

const initialState = {
  allPokemons: [],
  displayedPokemons: [],
  pokemonDetail: {},
  loading: false,
  currentPage: 1,
  filters: {
    type: 'all',
    origin: 'all'
  },
  sortBy: 'none'
};

const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case GET_ALL_POKEMONS:
      return {
        ...state,
        allPokemons: action.payload,
        displayedPokemons: action.payload,
        loading: false
      };
    
    case GET_POKEMON_DETAIL:
      return {
        ...state,
        pokemonDetail: action.payload,
        loading: false
      };
    
    case SEARCH_POKEMONS:
  return {
    ...state,
    displayedPokemons: action.payload,
    allPokemons: action.payload, // IMPORTANTE: actualizar también allPokemons
    filters: {
      type: 'all',
      origin: 'all'
    },
    sortBy: 'none',
    currentPage: 1,
    loading: false
  };
    
    case CREATE_POKEMON:
      return {
        ...state,
        allPokemons: [...state.allPokemons, action.payload],
        displayedPokemons: [...state.displayedPokemons, action.payload]
      };
    
    case FILTER_BY_TYPE: {
      const type = action.payload;
      const newFilters = { ...state.filters, type };
      
      let filtered = state.allPokemons;
      
      if (type !== 'all') {
        filtered = filtered.filter(pokemon => 
          pokemon.types && pokemon.types.some(t => 
            (typeof t === 'string' ? t : t.name) === type
          )
        );
      }
      
      if (state.filters.origin !== 'all') {
        filtered = filtered.filter(pokemon => {
          if (state.filters.origin === 'api') return pokemon.id < 10000;
          if (state.filters.origin === 'db') return pokemon.id > 10000;
          return true;
        });
      }
      
      if (state.sortBy !== 'none') {
        filtered = applySorting([...filtered], state.sortBy);
      }
      
      return {
        ...state,
        displayedPokemons: filtered,
        filters: newFilters,
        currentPage: 1
      };
    }
    
    case FILTER_BY_ORIGIN: {
      const origin = action.payload;
      const newFilters = { ...state.filters, origin };
      
      let filtered = state.allPokemons;
      
      if (origin !== 'all') {
        filtered = filtered.filter(pokemon => {
          if (origin === 'api') return pokemon.id < 10000;
          if (origin === 'db') return pokemon.id > 10000;
          return true;
        });
      }
      
      if (state.filters.type !== 'all') {
        filtered = filtered.filter(pokemon => 
          pokemon.types && pokemon.types.some(t => 
            (typeof t === 'string' ? t : t.name) === state.filters.type
          )
        );
      }
      
      if (state.sortBy !== 'none') {
        filtered = applySorting([...filtered], state.sortBy);
      }
      
      return {
        ...state,
        displayedPokemons: filtered,
        filters: newFilters,
        currentPage: 1
      };
    }
    
    case SORT_POKEMONS: {
      const sortBy = action.payload;
      let sorted = [...state.displayedPokemons];
      
      if (sortBy !== 'none') {
        sorted = applySorting(sorted, sortBy);
      }
      
      return {
        ...state,
        displayedPokemons: sorted,
        sortBy: sortBy,
        currentPage: 1
      };
    }
    
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    
    case CLEAR_DETAIL:
      return {
        ...state,
        pokemonDetail: {}
      };
    
    default:
      return state;
  }
};

const applySorting = (pokemons, sortBy) => {
  switch (sortBy) {
    case 'name-asc':
      return pokemons.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'name-desc':
      return pokemons.sort((a, b) => b.name.localeCompare(a.name));
    
    case 'attack-asc':
      return pokemons.sort((a, b) => a.attack - b.attack);
    
    case 'attack-desc':
      return pokemons.sort((a, b) => b.attack - a.attack);
    
    default:
      return pokemons;
  }
};

export default pokemonReducer;