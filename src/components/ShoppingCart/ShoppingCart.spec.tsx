import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShoppingCart } from "./ShoppingCart";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import StoreItems from "../../data/items.json";
import { formatCurrency } from "../../utilities/formatCurrency";

const mockCloseCart = jest.fn();
const mockCartItems = [
  { id: 1, quantity: 2 },
  { id: 2, quantity: 1 },
];

jest.mock("../../context/ShoppingCartContext", () => ({
  ...jest.requireActual("../../context/ShoppingCartContext"),
  useShoppingCart: () => ({
    closeCart: mockCloseCart,
    cartItems: mockCartItems,
  }),
}));

describe("ShoppingCart", () => {
  const renderShoppingCart = (isOpen: boolean) =>
    render(
      <ShoppingCartProvider>
        <ShoppingCart isOpen={isOpen} />
      </ShoppingCartProvider>
    );
  
  test("renders cart items and total price correctly", () => {
    renderShoppingCart(true);

    expect(screen.getAllByRole("button", { name: /×/i }).length).toBe(2);

    const totalPrice = mockCartItems.reduce((total, cartItem) => {
      const item = StoreItems.find(i => i.id === cartItem.id);
      return total + (item?.price || 0) * cartItem.quantity;
    }, 0);

    expect(screen.getByText(`Total: ${formatCurrency(totalPrice)}`)).toBeInTheDocument();
  });

  test("calls closeCart when the Offcanvas is closed", async () => {
    renderShoppingCart(true);

    const closeButton = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);

    expect(mockCloseCart).toHaveBeenCalled();
  });

  test("does not render cart items when isOpen is false", () => {
    renderShoppingCart(false);
    
    expect(screen.queryByRole("button", { name: /×/i })).not.toBeInTheDocument();
  });
});
