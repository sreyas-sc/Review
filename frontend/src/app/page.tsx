'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getAllPerfumes, addToCart } from './api-helpers/api-helpers';

interface Perfume {
    _id: string;
    code: string;
    name: string;
    price: number;
    image: string;
    description: string;
    brand: string;
}

interface CartItem {
    id: string;
    code: string;
    name: string;
    price: number;
    quantity: number;
    message?: string;
}

interface CartResponse {
    items: CartItem[];
    totalCartPrice: number;
    discountMessage: string;
}

const Page = () => {
    // State variables for perfumes, cart items, total amount and discount message.
    const [perfumes, setPerfumes] = useState<Perfume[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountMessage, setDiscountMessage] = useState('');

    //  Retrieves the stored cart items from the local storage.(An array of cart items.)
     
    const getStoredCartItems = (): CartItem[] => {
        if (typeof window === 'undefined') return [];
        
        try {
            // Retrieve the cart items from the local storage.
            const items = localStorage.getItem('cartItems');
            if (!items) return [];
            // Parse the JSON string and return the cart items.
            return JSON.parse(items);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    };

    // Stores the cart items in the local storage.
    const setStoredCartItems = (items: CartItem[]) => {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem('cartItems', JSON.stringify(items));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };

    // Adds an item to the cart.
    const handleItemAdd = async (perfume: Perfume) => {
        // Retrieve the cart items from the local storage.
        const existingCartItems = getStoredCartItems();
        // Check if the item already exists in the cart.
        const existingItem = existingCartItems.find(item => item.id === perfume._id);

        //If the item already exists in the cart, update the quantity.
        let updatedCartItems: CartItem[];
        // If the item exists in the cart, update the quantity.
        if (existingItem) {
            updatedCartItems = existingCartItems.map(item =>
                // If the item is the one being added, update the quantity.
                item.id === perfume._id
                    ? { ...item, quantity: (item.quantity || 1)  }
                    : item
            );
            // If the item does not exist in the cart, add it to the cart.
        } else {
            // Add the new item to the existing cart items.
            updatedCartItems = [...existingCartItems, {
                id: perfume._id,
                code: perfume.code,
                name: perfume.name,
                price: perfume.price,
                quantity: 1
            }];
        }
        
        // Update the cart items in the local storage
        setStoredCartItems(updatedCartItems);
        // Update the cart items in the state.
        setCartItems(updatedCartItems);
        
        // Update the total amount based on the updated cart items.
        try {
            const cartResponse: CartResponse = await addToCart(updatedCartItems);
            // Update the total amount and discount message based on the cart response.
            setCartItems(cartResponse.items);
            setTotalAmount(cartResponse.totalCartPrice);
            setDiscountMessage(cartResponse.discountMessage);
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    // Removes an item from the cart.
    const handleItemRemove = (itemId: string) => {
        // Retrieve the cart items from the local storage.
        const existingCartItems = getStoredCartItems();
        // Filter out the item to be removed.
        const updatedCartItems = existingCartItems.filter(item => item.id !== itemId);
        
        // Update the cart items in the local storage and state.
        setStoredCartItems(updatedCartItems);
        setCartItems(updatedCartItems);
        updateTotals(updatedCartItems);
    };

    // Updates the quantity of a cart item.
    const handleQuantityChange = (itemId: string, change: number) => {
        // Retrieve the cart items from the local storage.
        const existingCartItems = getStoredCartItems();
        // Update the quantity of the item.
        const updatedCartItems = existingCartItems.map(item => {
            if (item.id === itemId) {
                // Ensure the quantity is at least 1.
                const newQuantity = Math.max(1, (item.quantity || 1) + change);
                // const newQuantity =  (item.quantity || 1) + change;
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        
        // Update the cart items in the local storage and state.
        setStoredCartItems(updatedCartItems);
        setCartItems(updatedCartItems);
        updateTotals(updatedCartItems);
    };

    // Updates the total amount based on the cart items.
    const updateTotals = (items: CartItem[]) => {
        // Calculate the total amount based on the cart items.
        const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        setTotalAmount(total);
    };

    // Fetches all perfumes from the API and sets the state.
    useEffect(() => {
        const fetchPerfumes = async () => {
            const data = await getAllPerfumes();
            setPerfumes(data.perfumes || []);
        };
        fetchPerfumes();
    }, []);

    return (
        <>
            <div className={styles.headerBox}>
                <div className={styles.box}>
                    <div className={styles.col4}></div>
                    <div className={`${styles.col4} ${styles.signText}`}></div>
                </div>
                <div className={styles.col4}>
                    <img src="/assets/img/cross.svg" alt="" />
                </div>
            </div>

            <nav className={styles.navbar}>
                <div className={styles.logo}>Scentora</div>

                <ul className={styles.navLinks}>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">New Arrivals</a></li>
                    <li><a href="#">Brands</a></li>
                </ul>

                <div className={styles.searchBar}>
                    <input type="text" placeholder="Search for products..." />
                    <span className={styles.searchIcon}><img src="/assets/icons/search-icon.png" alt="" /></span>
                </div>

                <div className={styles.icons}>
                        <div className={`${styles.icon} ${styles.wishlist}`}>
                            <span><img src="/assets/icons/Vector.png" alt="" /></span>
                        </div>

                        <div className={`${styles.icon} ${styles.cart}`}>
                            <span><img src="/assets/icons/Cart1.png" alt="" /></span>
                        </div>

                        <div className={`${styles.icon} ${styles.profile}`}>
                            <span><img src="/assets/icons/person.png" alt="" /></span>
                        </div>
                    </div>
                {/* </div> */}
            </nav>

            <div className={styles.mainContentWrapper}>
                <div className={styles.exploreBlock}>
                    <div className={styles.imageContainer}>
                        <img src="/assets/img/img-2.svg" alt="Explore Image" className={styles.fullWidthImage} />
                    </div>
                </div>


                <div className={styles.collections}>
                    <div className={styles.collectionLeft}>
                        <div className={styles.cartSummary}>
                            <h2>Cart Summary</h2>
                            <div className={styles.cartItems}>
                                {cartItems && cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <div key={item.id} className={styles.cartItem}>
                                            <div className={styles.itemInfo}>
                                                <span>{item.name} x {item.quantity}</span>
                                                <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                                            </div>
                                            <div className={styles.itemControls}>
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    className={styles.quantityBtn}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity || 1}</span>
                                                <button 
                                                    onClick={() => {
                                                        handleQuantityChange(item.id, 1);
                                                        const perfume = perfumes.find(p => p._id === item.id);
                                                        if (perfume) handleItemAdd(perfume);
                                                    }}
                                                    className={styles.quantityBtn}
                                                >
                                                    +
                                                </button>
                                                <button 
                                                    onClick={() => handleItemRemove(item.id)}
                                                    className={styles.removeBtn}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Your cart is empty.</p>
                                )}
                            </div>

                            <div className={styles.cartTotal}>
                            <p>Total Items: {(cartItems || []).reduce((sum, item) => sum + (item.quantity || 1), 0)}</p>
                            <p>Total Amount: ${totalAmount ? totalAmount.toFixed(2) : '0.00'}</p>
                            </div>
                            {cartItems?.length > 0 && (
                                <button 
                                    className={styles.checkoutBtn}
                                    onClick={() => alert('Proceeding to checkout...')}
                                >
                                    Proceed to Checkout
                                </button>
                            )}
                        </div>
                    <div>
                        {(discountMessage || cartItems.some(item => item.message)) && (
                            <div className={styles.offersContainer}>
                                <h3 className={styles.offersTitle}>Special Offers</h3>
                                <div className={styles.offersList}>
                                    {/* Individual Item Offers */}
                                    {cartItems.map((item, index) => (
                                        item.message && item.message !== 'Item added to cart' && (
                                            <div key={`${item.id}-${index}`} className={styles.offerItem}>
                                                <span className={styles.offerIcon}>🏷️</span>
                                                {item.message}
                                            </div>
                                        )
                                    ))}
                                    
                                    {/* Cart-wide Offers */}
                                    {discountMessage && discountMessage.split('. ').map((offer, index) => (
                                        <div key={`cart-offer-${index}`} className={styles.offerItem}>
                                            <span className={styles.offerIcon}>🛍️</span>
                                            {offer}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
                    <div className={styles.collectionRight}>
                        <div className={styles.ourCollections}>Our Collections</div>
                        <div className={styles.resultsInfo}>
                            <div className={styles.resultsCount}>Showing {perfumes.length} results</div>
                                <div className={styles.sortBy}>
                                    <span>Sorted by : <b>Popularity</b>
                                        <img className={styles.mt50} src="/assets/img/down-arrow.svg" alt="" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.classCard}>
                            {perfumes.map((perfume) => (
                                <div key={perfume._id} className={styles.productCard}>
                                    <div className={`${styles.textCenter} ${styles.imageWrap}`}>
                                        <div className={styles.imageBlock}>
                                            <img src={perfume.image} alt="Product" className={styles.productImage} />
                                        </div>
                                        <div className={styles.heartWrapper}>
                                        <img src="/assets/img/heart.svg" alt="Heart" className={styles.heartimage} />
                                        </div>
                                        <div className={styles.badgeWrapper}>
                                            <img src="/assets/img/badge.svg" alt="Heart" className={styles.badgewrapper} />
                                        </div>
                                        <button className={styles.buyButton} onClick={() => handleItemAdd(perfume)}>Add to Cart</button>
                                        {/* </a> */}
                                    </div>
                                    <div className={styles.productDetails}>
                                        <h3>{perfume.name}</h3>
                                        <p>{perfume.description}</p>
                                        <p>Brand: {perfume.brand}</p>
                                        <p>Price: ${perfume.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                
            

            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerBrand}>
                        <h2 className={styles.h2}>Scentora</h2>
                        <p>
                            We have perfumes that suits your <br />style and which you’re proud.
                        </p>
                        <div className={styles.socialIcons}>
                            <a href="#"><img src="/assets/icons/twitter.png" alt="" /></a>
                            <a href="#"><img src="/assets/icons/fb2.png" alt="" /></a>
                            <a href="#"><img src="/assets/icons/insta.png" alt="" /></a>
                            <a href="#"><img src="/assets/icons/git.png" alt="" /></a>
                        </div>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.footerColumn}>
                            <h3>Company</h3>
                            <ul>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Features</a></li>
                                <li><a href="#">Works</a></li>
                                <li><a href="#">Career</a></li>
                            </ul>
                        </div>
                        <div className={styles.footerColumn}>
                            <h3>Help</h3>
                            <ul>
                                <li><a href="#">Customer Support</a></li>
                                <li><a href="#">Delivery Details</a></li>
                                <li><a href="#">Terms & Conditions</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className={styles.footerColumn}>
                            <h3>FAQ</h3>
                            <ul>
                                <li><a href="#">Account</a></li>
                                <li><a href="#">Manage Deliveries</a></li>
                                <li><a href="#">Orders</a></li>
                                <li><a href="#">Payments</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>Scentora © 2000-2023, All Rights Reserved</p>
                    <div className={styles.paymentIcons}>
                        <img src="/assets/icons/visa.png" alt="Visa" />
                        <img src="/assets/icons/master.png" alt="MasterCard" />
                        <img src="/assets/icons/paypal.png" alt="PayPal" />
                        <img src="/assets/icons/applepay.png" alt="Apple Pay" />
                        <img src="/assets/icons/gpay.png" alt="Google Pay" />
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Page;
