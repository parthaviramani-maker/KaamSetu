// =============================================================================
// KAAMSETU — TYPED REDUX HOOKS
// Always import from here, NOT from 'react-redux' directly
// =============================================================================

import { useDispatch, useSelector } from 'react-redux';

/**
 * Typed dispatch hook — use this instead of useDispatch()
 * @returns {import('@reduxjs/toolkit').ThunkDispatch} dispatch
 */
export const useAppDispatch = () => useDispatch();

/**
 * Typed selector hook — use this instead of useSelector()
 * @template T
 * @param {(state: import('./store').RootState) => T} selector
 * @returns {T}
 */
export const useAppSelector = (selector) => useSelector(selector);
