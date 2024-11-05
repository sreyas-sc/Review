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
}

const Page = () => {
    const [perfumes, setPerfumes] = useState<Perfume[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const getStoredCartItems = (): CartItem[] => {
        if (typeof window === 'undefined') return [];
        
        try {
            const items = localStorage.getItem('cartItems');
            if (!items) return [];
            return JSON.parse(items);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    };

    const setStoredCartItems = (items: CartItem[]) => {
        if (typeof window === 'undefined') return;
        
        try {
            localStorage.setItem('cartItems', JSON.stringify(items));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };

    const handleItemAdd = async (perfume: Perfume) => {
        const existingCartItems = getStoredCartItems();
        const existingItem = existingCartItems.find(item => item.id === perfume._id);
        
        let updatedCartItems: CartItem[];
        if (existingItem) {
            updatedCartItems = existingCartItems.map(item =>
                item.id === perfume._id
                    ? { ...item, quantity: (item.quantity || 1) + 1 }
                    : item
            );
        } else {
            updatedCartItems = [...existingCartItems, {
                id: perfume._id,
                code: perfume.code,
                name: perfume.name,
                price: perfume.price,
                quantity: 1
            }];
        }
        
        setStoredCartItems(updatedCartItems);
        setCartItems(updatedCartItems);
        updateTotals(updatedCartItems);
    
        const cartItem = updatedCartItems.find(item => item.id === perfume._id);
        if (cartItem) {
            await addToCart(updatedCartItems);
        }
    };

    const handleItemRemove = (itemId: string) => {
        const existingCartItems = getStoredCartItems();
        const updatedCartItems = existingCartItems.filter(item => item.id !== itemId);
        
        setStoredCartItems(updatedCartItems);
        setCartItems(updatedCartItems);
        updateTotals(updatedCartItems);
    };

    const handleQuantityChange = (itemId: string, change: number) => {
        const existingCartItems = getStoredCartItems();
        const updatedCartItems = existingCartItems.map(item => {
            if (item.id === itemId) {
                const newQuantity = Math.max(1, (item.quantity || 1) + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        
        setStoredCartItems(updatedCartItems);
        setCartItems(updatedCartItems);
        updateTotals(updatedCartItems);
    };

    const updateTotals = (items: CartItem[]) => {
        const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        setTotalAmount(total);
    };

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
                        <span><img src="../assets/icons/Vector.png" alt="" /></span>
                        <a href="../cart/cart.html"></a>
                        <div className={`${styles.icon} ${styles.cart}`}>
                            <span><img src="../assets/icons/Cart1.png" alt="" /></span>
                            
                        </div>
                        <div className={`${styles.icon} ${styles.profile}`}>
                            <span><img src="/assets/icons/person.png" alt="" /></span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContentWrapper}>
                <div className={styles.exploreBlock}>
                    <div className={styles.imageContainer}>
                        <img src="/assets/img/img-2.svg" alt="Explore Image" className={styles.fullWidthImage} />
                    </div>
                </div>

                <div className={styles.collections}>
                    <div className={styles.collectionLeft}>
                    </div>

                    <div className={styles.cartSummary}>
                        <h2>Cart Summary</h2>
                        <div className={styles.cartItems}>
                            {cartItems.map((item) => (
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
                                            onClick={() => handleQuantityChange(item.id, 1)}
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
                            ))}
                        </div>
                        <div className={styles.cartTotal}>
                            <p>Total Items: {cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}</p>
                            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
                        </div>
                        {cartItems.length > 0 && (
                            <button 
                                className={styles.checkoutBtn}
                                onClick={() => alert('Proceeding to checkout...')}
                            >
                                Proceed to Checkout
                            </button>
                        )}
                    </div>
                </div>
                    <div className={styles.collectionRight}>
                        <div className={styles.ourCollections}>Our Collections</div>
                        <div className={styles.resultsInfo}>
                            <div className={styles.resultsCount}>Showing {perfumes.length} results</div>
                            <div className={styles.sortBy}></div>
                                <span>Sorted by : <b>Popularity</b>
                                    <img className={styles.mt50} src="../img/down-arrow.svg" alt="" />
                                </span>
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
                                        </div>
                                        <div className={styles.badgeWrapper}>
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
