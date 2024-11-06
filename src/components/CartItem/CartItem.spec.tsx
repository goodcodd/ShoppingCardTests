import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CartItem } from "./CartItem";
import StoreItems from "../../data/items.json";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext.tsx";
import { formatCurrency } from "../../utilities/formatCurrency";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ShoppingCartProvider>{children}</ShoppingCartProvider>
);

const mockItem = StoreItems[0];
const mockRemoveFromCart = jest.fn();

jest.mock("../../context/ShoppingCartContext", () => ({
  ...jest.requireActual("../../context/ShoppingCartContext"),
  useShoppingCart: () => ({
    removeFromCart: mockRemoveFromCart,
    cartItems: [],
  }),
}));

describe("CartItem", () => {
  test("renders correctly with item name, quantity, and price", () => {
    const expectedPrice = formatCurrency(mockItem.price * 2);

    render(
      <Wrapper>
        <CartItem id={mockItem.id} quantity={2} />
      </Wrapper>
    );

    expect(screen.getByText(mockItem.name)).toBeInTheDocument();
    expect(screen.getByText(/x2/i)).toBeInTheDocument();
    expect(screen.getByText(expectedPrice)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /×/i })).toBeInTheDocument();
  });

  test("renders without quantity text when quantity is 1", () => {
    render(
      <Wrapper>
        <CartItem id={mockItem.id} quantity={1} />
      </Wrapper>
    );

    expect(screen.queryByText(/x1/i)).not.toBeInTheDocument();
  });
  
  test("calls removeFromCart when delete button is clicked", async () => {
    render(
      <Wrapper>
        <CartItem id={mockItem.id} quantity={1} />
      </Wrapper>
    );
    
    const deleteButton = screen.getByRole("button", { name: /×/i });
    await userEvent.click(deleteButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith(mockItem.id);
  });

  test("returns null if item is not found", () => {
    render(
      <Wrapper>
        <CartItem id={9999} quantity={1} />
      </Wrapper>
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
