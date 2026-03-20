import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer        from './authSlice';
import themeReducer       from './themeSlice';
import { jobApi }         from '../services/jobApi';
import { applicationApi } from '../services/applicationApi';
import { agentApi }       from '../services/agentApi';
import { adminApi }       from '../services/adminApi';
import { userApi }        from '../services/userApi';

const rootReducer = combineReducers({
  auth:  authReducer,
  theme: themeReducer,
  // RTK Query API caches (not persisted)
  [jobApi.reducerPath]:         jobApi.reducer,
  [applicationApi.reducerPath]: applicationApi.reducer,
  [agentApi.reducerPath]:       agentApi.reducer,
  [adminApi.reducerPath]:       adminApi.reducer,
  [userApi.reducerPath]:        userApi.reducer,
});

const persistConfig = {
  key: 'kaamsetu-root',
  storage,
  whitelist: ['auth', 'theme'], // Only persist auth + theme, NOT api caches
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    .concat(
      jobApi.middleware,
      applicationApi.middleware,
      agentApi.middleware,
      adminApi.middleware,
      userApi.middleware,
    ),
});

export const persistor = persistStore(store);
export default store;
