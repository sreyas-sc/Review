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

  const token = localStorage.getItem('token');

  const existingItem = cartItems.find(item => item._id);
  let updatedCart;
  if (existingItem) {
      updatedCart = cartItems.map(item => 
          ({ ...item, quantity: (item.quantity || 1) + 1 })
      );
  } else {
      updatedCart = [...cartItems, { ...perfume, quantity: 1 }];
  }

  try {
    console.log("Updated Cart: ", updatedCart);
    const res = await axios.post(`http://localhost:5000/cart`, 
      { items: updatedCart },
      {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }
    );
    if (res.status !== 200) {
      console.log("Failed to update cart");
      return cartItems;
      
    }
    console.log("Response from controller: ", res.data);
    return res.data;
  } catch (err) {
    console.log("Error: ", err.message);
    return cartItems;
  }
};
