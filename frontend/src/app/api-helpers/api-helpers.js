import axios from 'axios';
export const getAllPerfumes = async () => {
    // console.log("get all perfume!!!!!!!!!!!!!!!! from helpers");
    try {
      const res = await axios.get(`http://localhost:5000/perfume`);
  
      if (res.status !== 200) {
        console.log("No Data");
        return { movies: [] };
      }
      const data = await res.data;
      // console.log("Data: ", data);
      return data;
    } catch (err) {
      console.log("Error: ", err.message);
      return { movies: [] };
    }
  };

  // add to cart logic
export const addToCart = async (cartItems = [], perfume) => {
  console.log("Cart: ", cartItems);
  console.log("Perfume: ", perfume);

  const existingItem = cartItems.find(item => item._id === perfume._id);
  let updatedCart;
  if (existingItem) {
      updatedCart = cartItems.map(item =>
          item._id === perfume._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
  } else {
      updatedCart = [...cartItems, { ...perfume, quantity: 1 }];
  }

  try {
    const res = await axios.post(`http://localhost:5000/cart`, { items: updatedCart });
    if (res.status !== 200) {
      console.log("Failed to update cart");
      return cartItems;
    }
    // Ensure the updated cart is returned
    return res.data.items;
  } catch (err) {
    console.log("Error: ", err.message);
    return cartItems;
  }
};
