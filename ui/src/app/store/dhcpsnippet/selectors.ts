import { createSelector } from "@reduxjs/toolkit";

import { DHCPSnippetMeta } from "app/store/dhcpsnippet/types";
import type {
  DHCPSnippet,
  DHCPSnippetState,
} from "app/store/dhcpsnippet/types";
import type { RootState } from "app/store/root/types";
import { generateBaseSelectors } from "app/store/utils";

const searchFunction = (snippet: DHCPSnippet, term: string) =>
  snippet.name.includes(term) || snippet.description.includes(term);

const defaultSelectors = generateBaseSelectors<
  DHCPSnippetState,
  DHCPSnippet,
  DHCPSnippetMeta.PK
>(DHCPSnippetMeta.MODEL, DHCPSnippetMeta.PK, searchFunction);

/**
 * Finds snippets for a node.
 * @param state - The redux state.
 * @param systemId - A node's system id.
 * @returns Snippets for a node.
 */
const getByNode = createSelector(
  [
    defaultSelectors.all,
    (_state: RootState, node: DHCPSnippet["node"] | null) => node,
  ],
  (snippets: DHCPSnippet[], node) => {
    if (!node) {
      return [];
    }
    return snippets.filter((snippet) => snippet.node === node);
  }
);

const selectors = {
  ...defaultSelectors,
  getByNode,
};

export default selectors;
