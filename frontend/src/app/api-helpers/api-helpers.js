import axios from 'axios';
export const getAllPerfumes = async () => {
    // console.log("get all perfume!!!!!!!!!!!!!!!! from helpers");
    try {
      const res = await axios.get(`https://review-38wx.onrender.com/perfume`);
  
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

  // Get token from local storage(for user authentication)
  const token = localStorage.getItem('token');

  // Check if the item is already in the cart
  const existingItem = cartItems.find(item => item._id);
  let updatedCart;
  // If the item is already in the cart, update the quantity
  if (existingItem) {
      updatedCart = cartItems.map(item => 
          ({ ...item, quantity: (item.quantity || 1) + 1 })
      );
  } else {
    // Add the item to the cart
      updatedCart = [...cartItems, { ...perfume, quantity: 1 }];
  }

  try {
    console.log("Updated Cart: ", updatedCart);
    // Send updated cart to the server
    const res = await axios.post(`https://review-38wx.onrender.com/cart`, 
      { items: updatedCart },
      {
        headers: {
          // Send the token in the headers
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }
    );
  
    if (res.status !== 200) {
      // If the server responds with an error
      console.log("Failed to update cart");
      return cartItems;
      
    }
    console.log("Response from controller: ", res.data);
    return res.data;
    // return updatedCart;
  } catch (err) {
    console.log("Error: ", err.message);
    return cartItems;
  }
};
