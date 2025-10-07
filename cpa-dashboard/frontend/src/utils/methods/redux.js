export const handleAsyncThunk = (builder, thunk, { pending, fulfilled, rejected }) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      if (fulfilled) fulfilled(state, action);
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Something went wrong';
      if (rejected) rejected(state, action);
    });
};
