import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { LicenseKeysMeta } from "./types";
import type { LicenseKeys, LicenseKeysState } from "./types";

import {
  generateCommonReducers,
  genericInitialState,
} from "app/store/utils/slice";

type CreateParams = {
  distro_series: LicenseKeys["distro_series"];
  license_key?: LicenseKeys["license_key"];
  osystem: LicenseKeys["osystem"];
};

type UpdateParams = CreateParams & {
  [LicenseKeysMeta.PK]: LicenseKeys[LicenseKeysMeta.PK];
};

const licenseKeysSlice = createSlice({
  name: LicenseKeysMeta.MODEL,
  initialState: genericInitialState as LicenseKeysState,
  reducers: {
    ...generateCommonReducers<
      LicenseKeysState,
      LicenseKeysMeta.PK,
      CreateParams,
      UpdateParams
    >(LicenseKeysMeta.MODEL, LicenseKeysMeta.PK),
    create: {
      prepare: (params: {
        osystem: LicenseKeys["osystem"];
        distro_series: LicenseKeys["distro_series"];
        license_key: LicenseKeys["license_key"];
      }) => ({
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    delete: {
      prepare: (params: LicenseKeys) => ({
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    dismissStart: (state: LicenseKeysState) => {
      state.saved = false;
      state.saving = true;
    },
    dismissError: (
      state: LicenseKeysState,
      action: PayloadAction<LicenseKeysState["errors"]>
    ) => {
      state.errors = action.payload;
      state.saving = false;
    },
    deleteSuccess: (state: LicenseKeysState, action) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
      const deleteIndex = state.items.findIndex(
        (item: LicenseKeys) =>
          item.osystem === action.payload.osystem &&
          item.distro_series === action.payload.distro_series
      );
      state.items.splice(deleteIndex, 1);
    },
    fetch: {
      prepare: () => ({
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    update: {
      prepare: (params: {
        osystem: LicenseKeys["osystem"];
        distro_series: LicenseKeys["distro_series"];
        license_key: LicenseKeys["license_key"];
      }) => ({
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    updateSuccess: (state: LicenseKeysState, action) => {
      state.errors = null;
      state.saved = true;
      state.saving = false;
      const updateIndex = state.items.findIndex(
        (item: LicenseKeys) =>
          item.osystem === action.payload.osystem &&
          item.distro_series === action.payload.distro_series
      );
      state.items[updateIndex] = action.payload;
    },
  },
});

export const { actions } = licenseKeysSlice;

export default licenseKeysSlice.reducer;
