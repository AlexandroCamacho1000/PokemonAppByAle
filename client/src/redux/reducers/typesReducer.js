import { GET_TYPES } from '../actions/typesActions';

const initialState = {
  allTypes: []
};

const typesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TYPES:
      return {
        ...state,
        allTypes: action.payload
      };
    
    default:
      return state;
  }
};

export default typesReducer;