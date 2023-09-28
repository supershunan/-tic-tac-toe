import { configureStore } from '@reduxjs/toolkit';
import gameSice from './game/gameSlice';

const store = configureStore({ reducer: { game: gameSice } });

export default store;
