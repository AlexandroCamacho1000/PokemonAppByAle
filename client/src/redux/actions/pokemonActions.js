import axios from 'axios';

// URL base
const API_URL = 'http://localhost:3001';

// Action Types
export const GET_ALL_POKEMONS = 'GET_ALL_POKEMONS';
export const GET_POKEMON_DETAIL = 'GET_POKEMON_DETAIL';
export const SEARCH_POKEMONS = 'SEARCH_POKEMONS';
export const CREATE_POKEMON = 'CREATE_POKEMON';
export const FILTER_BY_TYPE = 'FILTER_BY_TYPE';
export const FILTER_BY_ORIGIN = 'FILTER_BY_ORIGIN';
export const SORT_POKEMONS = 'SORT_POKEMONS';
export const SET_LOADING = 'SET_LOADING';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const CLEAR_DETAIL = 'CLEAR_DETAIL';

// Obtener todos los Pokémon
export const getAllPokemons = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const { data } = await axios.get(`${API_URL}/pokemons`);
      
      dispatch({
        type: GET_ALL_POKEMONS,
        payload: data
      });
      
      dispatch({ type: SET_LOADING, payload: false });
      return data;
      
    } catch (error) {
      console.error('Error getting all pokemons:', error.response?.data || error.message);
      dispatch({ type: SET_LOADING, payload: false });
      throw error;
    }
  };
};

// Obtener detalle de un Pokémon por ID
export const getPokemonDetail = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const { data } = await axios.get(`${API_URL}/pokemons/${id}`);
      
      dispatch({
        type: GET_POKEMON_DETAIL,
        payload: data
      });
      
      dispatch({ type: SET_LOADING, payload: false });
      return data;
      
    } catch (error) {
      console.error('Error getting pokemon detail:', error.response?.data || error.message);
      dispatch({ type: SET_LOADING, payload: false });
      throw error;
    }
  };
};

// Buscar Pokémon por nombre
export const searchPokemons = (name) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const { data } = await axios.get(`${API_URL}/pokemons/name?name=${name}`);
      
      dispatch({
        type: SEARCH_POKEMONS,
        payload: data
      });
      
      dispatch({ type: SET_LOADING, payload: false });
      return data;
      
    } catch (error) {
      console.error('Error searching pokemons:', error.response?.data || error.message);
      dispatch({ type: SET_LOADING, payload: false });
      dispatch({
        type: SEARCH_POKEMONS,
        payload: []
      });
      return [];
    }
  };
};

// Crear nuevo Pokémon
export const createPokemon = (pokemonData) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(`${API_URL}/pokemons`, pokemonData);
      
      dispatch({
        type: CREATE_POKEMON,
        payload: data
      });
      
      return data;
      
    } catch (error) {
      console.error('Error creating pokemon:', error.response?.data || error.message);
      throw error;
    }
  };
};

// Actions para filtros y ordenamiento
export const filterByType = (type) => ({
  type: FILTER_BY_TYPE,
  payload: type
});

export const filterByOrigin = (origin) => ({
  type: FILTER_BY_ORIGIN,
  payload: origin
});

export const sortPokemons = (sortBy) => ({
  type: SORT_POKEMONS,
  payload: sortBy
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page
});

export const clearDetail = () => ({
  type: CLEAR_DETAIL
});