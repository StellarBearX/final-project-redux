import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  activeRoute: string;
}

const initialState: UiState = {
  sidebarOpen: true,
  activeRoute: '/',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveRoute(state, action: PayloadAction<string>) {
      state.activeRoute = action.payload;
    },
  },
});

export const { toggleSidebar, setActiveRoute } = uiSlice.actions;
export default uiSlice.reducer;
