import { CartItemService } from "../../../utils/services/CartItemService";
import {
  getAllCartItems,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
} from "../reduserSlises/cartItemSlice";

export const getCartItems = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    CartItemService.setAuthorizationToken(token);

    const res = await CartItemService.getAllCartItems();

    dispatch(getAllCartItems(res));
  } catch (error) {
    console.error("Fetching cart items failed", error);
  }
};

export const createCartItem = (cartItem) => async (dispatch) => {
  try {
    const res = await CartItemService.createCartItem(cartItem);

    dispatch(addCartItem(res));
    return { success: true, message: "Cart item added successfully" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors?.Message ||
      "An error occurred while adding the cart item";
    return { success: false, message: errorMessage };
  }
};

export const updateCartItem = (cartItemId, quantity) => async (dispatch) => {
  try {
    const res = await CartItemService.updateCartItemQuantity(cartItemId, quantity);

    dispatch(updateCartItemQuantity({ id: cartItemId, quantity }));
    return { success: true, message: "Cart item updated successfully" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors?.Message ||
      "An error occurred while updating the cart item";
    return { success: false, message: errorMessage };
  }
};

export const deleteCartItemById = (cartItemId) => async (dispatch) => {
  try {
    await CartItemService.deleteCartItem(cartItemId);

    dispatch(deleteCartItem({ id: cartItemId }));
    return { success: true, message: "Cart item deleted successfully" };
  } catch (error) {
    console.error("Deleting cart item failed", error);
    return { success: false, message: "Failed to delete cart item" };
  }
};