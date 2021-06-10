import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import DomainsTable from "./DomainsTable";

import type { RootState } from "app/store/root/types";
import {
  domain as domainFactory,
  domainState as domainStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

const getNameFromTable = (rowNumber: number, wrapper) =>
  wrapper
    .find("tbody TableRow")
    .at(rowNumber)
    .find("[data-test='domain-name']")
    .at(0); // both TableCell and td have the same data-test value

describe("DomainsTable", () => {
  let initialState: RootState;
  beforeEach(() => {
    initialState = rootStateFactory({
      domain: domainStateFactory({
        items: [
          domainFactory({
            id: 1,
            name: "b",
            is_default: true,
          }),
          domainFactory({
            id: 2,
            name: "c",
            is_default: false,
          }),
          domainFactory({
            id: 3,
            name: "a",
            is_default: false,
          }),
        ],
      }),
    });
  });

  it("can update the sort order", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <DomainsTable />
        </MemoryRouter>
      </Provider>
    );

    // Sorted ascending by name by default
    expect(getNameFromTable(0, wrapper).text()).toBe("a");
    expect(getNameFromTable(1, wrapper).text()).toBe("b (default)");
    expect(getNameFromTable(2, wrapper).text()).toBe("c");

    // Change to sort descending by name
    wrapper.find("[data-test='domain-name-header']").at(0).simulate("click");
    expect(getNameFromTable(0, wrapper).text()).toBe("c");
    expect(getNameFromTable(1, wrapper).text()).toBe("b (default)");
    expect(getNameFromTable(2, wrapper).text()).toBe("a");

    // Change to no sort
    wrapper.find("[data-test='domain-name-header']").at(0).simulate("click");
    expect(getNameFromTable(0, wrapper).text()).toBe("b (default)");
    expect(getNameFromTable(1, wrapper).text()).toBe("c");
    expect(getNameFromTable(2, wrapper).text()).toBe("a");
  });

  it("has a (defaut) next to the default domain's title", () => {
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <DomainsTable />
        </MemoryRouter>
      </Provider>
    );

    expect(getNameFromTable(1, wrapper).text()).toBe("b (default)");
  });

  it("calls the setDefault action if set default is clicked", () => {
    const store = mockStore(initialState);

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/domains", key: "testKey" }]}
        >
          <DomainsTable />
        </MemoryRouter>
      </Provider>
    );

    act(() =>
      wrapper.find("tbody TableRow").at(0).find("Formik").invoke("onSubmit")({})
    );

    expect(
      store.getActions().find((action) => action.type === "domain/setDefault")
    ).toStrictEqual({
      type: "domain/setDefault",
      meta: {
        method: "set_default",
        model: "domain",
      },
      payload: {
        params: {
          domain: 3,
        },
      },
    });
  });
});
