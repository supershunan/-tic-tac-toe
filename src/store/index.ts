import { configureStore } from '@reduxjs/toolkit';
import ticTacORgoBangSice from './game/gameSlice';

const store = configureStore({ reducer: { ticTacORgoBang: ticTacORgoBangSice } });

export default store;
