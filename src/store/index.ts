import { configureStore } from '@reduxjs/toolkit';
import piecesData from './pieces/pieces-data';

const store = configureStore({
  reducer: {
    piecesData
  },
});

export default store;