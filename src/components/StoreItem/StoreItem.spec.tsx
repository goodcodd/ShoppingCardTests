import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoreItem } from "./StoreItem";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import { formatCurrency } from "../../utilities/formatCurrency";

const mockIncreaseCartQuantity = jest.fn();
const mockDecreaseCartQuantity = jest.fn();
const mockRemoveFromCart = jest.fn();
const mockGetItemQuantity = jest.fn().mockReturnValue(0);

jest.mock("../../context/ShoppingCartContext", () => ({
  ...jest.requireActual("../../context/ShoppingCartContext"),
  useShoppingCart: () => ({
    getItemQuantity: mockGetItemQuantity,
    increaseCartQuantity: mockIncreaseCartQuantity,
    decreaseCartQuantity: mockDecreaseCartQuantity,
    removeFromCart: mockRemoveFromCart,
    cartItems: [],
  }),
}));

describe("StoreItem", () => {
  const renderStoreItem = () =>
    render(
      <ShoppingCartProvider>
        <StoreItem
          id={1}
          name="Test Product"
          price={100}
          imgUrl="https://via.placeholder.com/150"
        />
      </ShoppingCartProvider>
    );
  
  test("renders item with name, price, and add to cart button", () => {
    renderStoreItem();

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(100))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /\+ add to cart/i })).toBeInTheDocument();
  });
  
  test("adds item to cart when 'Add To Cart' button is clicked", async () => {
    renderStoreItem();

    const addButton = screen.getByRole("button", { name: /\+ add to cart/i });
    await userEvent.click(addButton);
    
    expect(mockIncreaseCartQuantity).toHaveBeenCalledWith(1);
  });
  
  test("renders quantity controls when item is in cart", () => {
    mockGetItemQuantity.mockReturnValue(2);
    renderStoreItem();

    const cartItem = screen.getByText(/in cart/i).closest("div");

    expect(within(cartItem!).getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "-" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });
  
  test("increases item quantity when '+' button is clicked", async () => {
    mockGetItemQuantity.mockReturnValue(2);
    renderStoreItem();
    
    const increaseButton = screen.getByRole("button", { name: "+" });
    await userEvent.click(increaseButton);
    
    expect(mockIncreaseCartQuantity).toHaveBeenCalledWith(1);
  });
  
  test("decreases item quantity when '-' button is clicked", async () => {
    mockGetItemQuantity.mockReturnValue(2);
    renderStoreItem();
    
    const decreaseButton = screen.getByRole("button", { name: "-" });
    await userEvent.click(decreaseButton);
    
    expect(mockDecreaseCartQuantity).toHaveBeenCalledWith(1);
  });
  
  test("removes item from cart when 'Remove' button is clicked", async () => {
    mockGetItemQuantity.mockReturnValue(2);
    renderStoreItem();
    
    const removeButton = screen.getByRole("button", { name: /remove/i });
    await userEvent.click(removeButton);
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });
});
