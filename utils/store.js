
import {create} from 'zustand';


const useCartStore = create(set => ({
  cart: [],
  favorites: [],
  addToCart: (product, quantity) => {
    set(state => {
      if (!state.cart.some(item => item.product.id === product.id)) {
        return {
          cart: [
            ...state.cart,
            {
              product,
              quantity,
            },
          ],
        };
      }
      return state;
    });
  },
  removeFromCart: productId => {
    set(state => ({
      cart: state.cart.filter(item => item.product.id !== productId),
    }));
  },
  updateCartItemQuantity: (productId, newQuantity) => {
    set(state => ({
      cart: state.cart.map(item =>
        item.product.id === productId ? {...item, quantity: newQuantity} : item
      ),
    }));
  },
  clearCart: () => {
    set({cart: []});
  },
  addToFavorites: product => {
    set(state => {
      if (!state.favorites.some(fav => fav.id === product.id)) {
        return {
          favorites: [...state.favorites, product],
        };
      }
      return state;
    });
  },
  removeFromFavorites: productId => {
    set(state => ({
      favorites: state.favorites.filter(product => product.id !== productId),
    }));
  },
}));

export default useCartStore;