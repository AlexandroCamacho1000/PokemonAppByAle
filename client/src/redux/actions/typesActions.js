import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const GET_TYPES = 'GET_TYPES';

// Obtener todos los tipos
export const getTypes = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${API_URL}/types`);
      
      dispatch({
        type: GET_TYPES,
        payload: data
      });
      
      return data;
      
    } catch (error) {
      console.error('Error getting types:', error.response?.data || error.message);
      throw error;
    }
  };
};