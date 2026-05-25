import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scrolled: false,
  isModalOpen: false,
  editMode: false,
  editData: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setScrolled(state, action) {
      state.scrolled = action.payload;
    },
    openModal(state, action) {
      state.isModalOpen = true;
      if (action.payload) {
        state.editMode = true;
        state.editData = action.payload;
      } else {
        state.editMode = false;
        state.editData = null;
      }
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.editMode = false;
      state.editData = null;
    }
  }
});

export const { setScrolled, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
