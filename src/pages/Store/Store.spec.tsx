import { render, screen } from "@testing-library/react";
import { Store } from "./Store";
import storeItems from "../../data/items.json";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext.tsx";

describe("Store", () => {
  const renderStore = () =>
    render(
      <ShoppingCartProvider>
        <Store />
      </ShoppingCartProvider>
    );
  
  test("renders the store heading", () => {
    renderStore();

    const heading = screen.getByRole("heading", { name: /store/i });
    expect(heading).toBeInTheDocument();
  });
  
  test("renders the correct number of store items", () => {
    renderStore();
    
    const items = screen.getAllByTestId("store-item");
    expect(items.length).toBe(storeItems.length);
  });
});
