import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./Navbar";
import { BrowserRouter } from "react-router-dom";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";

const mockOpenCart = jest.fn();
const mockCloseCart = jest.fn();

jest.mock("../../context/ShoppingCartContext", () => ({
  ...jest.requireActual("../../context/ShoppingCartContext"),
  useShoppingCart: () => ({
    openCart: mockOpenCart,
    closeCart: mockCloseCart,
    cartQuantity: 2,
    cartItems: [],
  }),
}));

describe("Navbar", () => {
  const renderNavbar = () =>
    render(
      <BrowserRouter>
        <ShoppingCartProvider>
          <Navbar />
        </ShoppingCartProvider>
      </BrowserRouter>
    );
  
  test("renders navigation links", () => {
    renderNavbar();
    
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /store/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
  });
  
  test("renders cart button with correct quantity", () => {
    renderNavbar();
    
    const cartQuantity = screen.getByText("2");
    expect(cartQuantity).toBeInTheDocument();
  });
  
  test("calls openCart when cart button is clicked", async () => {
    renderNavbar();
    
    const cartButton = screen.getByRole("button");
    await userEvent.click(cartButton);
    
    expect(mockOpenCart).toHaveBeenCalled();
  });
});
