import { configureStore } from '@reduxjs/toolkit';
import ticTacORgoBangSice from './ticTac/ticTacSlice';

const store = configureStore({ reducer: { ticTacORgoBang: ticTacORgoBangSice } });

export default store;
