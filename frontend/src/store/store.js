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
import { walletApi }      from '../services/walletApi';

// When any logout is dispatched, reset ALL RTK Query caches
// This prevents User A's wallet/data from flashing on User B's screen
const apiCacheResetMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  if (action.type === 'auth/logout') {
    storeAPI.dispatch(walletApi.util.resetApiState());
    storeAPI.dispatch(jobApi.util.resetApiState());
    storeAPI.dispatch(applicationApi.util.resetApiState());
    storeAPI.dispatch(agentApi.util.resetApiState());
    storeAPI.dispatch(adminApi.util.resetApiState());
    storeAPI.dispatch(userApi.util.resetApiState());
  }
  return result;
};

const rootReducer = combineReducers({
  auth:  authReducer,
  theme: themeReducer,
  // RTK Query API caches (not persisted)
  [jobApi.reducerPath]:         jobApi.reducer,
  [applicationApi.reducerPath]: applicationApi.reducer,
  [agentApi.reducerPath]:       agentApi.reducer,
  [adminApi.reducerPath]:       adminApi.reducer,
  [userApi.reducerPath]:        userApi.reducer,
  [walletApi.reducerPath]:      walletApi.reducer,
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
      apiCacheResetMiddleware,
      jobApi.middleware,
      applicationApi.middleware,
      agentApi.middleware,
      adminApi.middleware,
      userApi.middleware,
      walletApi.middleware,
    ),
});

export const persistor = persistStore(store);
export default store;
