import { combineReducers } from 'redux';
import pokemonReducer from './pokemonReducer';
import typesReducer from './typesReducer';

const rootReducer = combineReducers({
  pokemon: pokemonReducer,
  types: typesReducer
});

export default rootReducer;