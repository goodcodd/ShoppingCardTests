import { Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../../context/ShoppingCartContext.tsx";
import { CartItem } from "../CartItem/CartItem.tsx";
import { formatCurrency } from "../../utilities/formatCurrency.ts";
import StoreItems from "../../data/items.json";

interface ShoppingCartProps {
    isOpen: boolean;
}

export function ShoppingCart({ isOpen }: ShoppingCartProps) {
    const { closeCart, cartItems } = useShoppingCart();

    const totalPrice = cartItems.reduce((total, cartItem) => {
        const item = StoreItems.find(i => i.id === cartItem.id);
        return total + (item?.price || 0) * cartItem.quantity;
    }, 0);

    return (
        <Offcanvas show={isOpen} onHide={closeCart} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {cartItems.map(item => (
                        <CartItem key={item.id} {...item} />
                    ))}
                    <div className="ms-auto fw-bold fs-5">
                        Total: {formatCurrency(totalPrice)}
                    </div>
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
