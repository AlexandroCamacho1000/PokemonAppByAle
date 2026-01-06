import axios from 'axios';

// Base URL
//const API_URL = 'http://localhost:3001';
const API_URL = process.env.REACT_APP_API_URL || 'https://pokemon-backend-fl2n.onrender.com';

// Action Types
export const UPDATE_POKEMON = 'UPDATE_POKEMON';
export const DELETE_POKEMON = 'DELETE_POKEMON';
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

// Update Pokemon action
export const updatePokemon = (id, pokemonData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      console.log('Sending UPDATE for ID:', id);
      
      const { data } = await axios.put(`${API_URL}/pokemons/${id}`, pokemonData);
      
      console.log('Update successful:', data);
      
      dispatch({
        type: UPDATE_POKEMON,
        payload: data
      });
      
      dispatch({ type: SET_LOADING, payload: false });
      return data;
      
    } catch (error) {
      console.error('Error in update:', error.response?.data || error.message);
      dispatch({ type: SET_LOADING, payload: false });
      throw error;
    }
  };
};

// Delete Pokemon action
export const deletePokemon = (id) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      console.log('DELETE action initiated');
      console.log('ID received:', id);
      console.log('ID type:', typeof id);
      
      const idString = id.toString();
      console.log('ID as string:', idString);
      console.log('Full URL:', `${API_URL}/pokemons/${idString}`);
      
      const response = await axios.delete(`${API_URL}/pokemons/${idString}`);
      
      console.log('DELETE successful:', response.data);
      
      dispatch({
        type: DELETE_POKEMON,
        payload: idString
      });
      
      dispatch({ type: SET_LOADING, payload: false });
      return response.data;
      
    } catch (error) {
      console.error('Error in DELETE action:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      dispatch({ type: SET_LOADING, payload: false });
      throw error;
    }
  };
};

// Get all Pokemon
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

// Get Pokemon detail by ID
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

// Search Pokemon by name
export const searchPokemons = (name) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      console.log(`Searching: ${name}`);
      const { data } = await axios.get(`${API_URL}/pokemons/name?name=${name}`);
      console.log('API result:', data);
      
      const pokemons = Array.isArray(data) ? data : [data];
      
      dispatch({
        type: SEARCH_POKEMONS,
        payload: pokemons
      });
      
      dispatch({ type: SET_LOADING, payload: false });
      return pokemons;
      
    } catch (error) {
      console.error('Error searching pokemons:', error.response?.data || error.message);
      dispatch({ type: SET_LOADING, payload: false });
      
      if (error.response?.status === 404) {
        dispatch({
          type: SEARCH_POKEMONS,
          payload: []
        });
        return [];
      }
      
      throw error;
    }
  };
};

// Create new Pokemon
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

// Filter and sort actions
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