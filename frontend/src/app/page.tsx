'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getAllPerfumes } from './api-helpers/api-helpers';

const Page = () => {
    const [perfumes, setPerfumes] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [userSelectedItems, setUserSelectedItems] = useState<{ id: any; price: number }[]>([]);

    const handleItemAdd = (perfume: { _id: any; price: number; }) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.push({ id: perfume._id, price: perfume.price });
    userSelectedItems.push({ id: perfume._id, price: perfume.price });
    console.log("Item added to cart", cartItems);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setCartItemCount(userSelectedItems.length); 

    setUserSelectedItems([...userSelectedItems, { id: perfume._id, price: perfume.price }]);
};
    
    const calculateTotalAmount = () => {
        const userSelectedItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        return userSelectedItems.reduce((total: number, item: { price: number; }) => total + (item.price || 0), 0);
    };

    useEffect(() => {
        const updateTotalAmount = () => {
            setTotalAmount(calculateTotalAmount());
        };

        window.addEventListener('storage', updateTotalAmount);

        return () => {
            window.removeEventListener('storage', updateTotalAmount);
        };
    }, []);

    useEffect(() => {
        const fetchPerfumes = async () => {
            const data = await getAllPerfumes();
            console.log("the data from the frontend", data);
            setPerfumes(data.perfumes || []);
        };
        fetchPerfumes();
    }, []);


    useEffect(() => {
        setTotalAmount(calculateTotalAmount());
    }, [perfumes]);

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItemCount(userSelectedItems.length); 
        setTotalAmount(calculateTotalAmount()); 
    }, []);

    return (
        <>
            <div>
                <div className={styles.box}>
                    <div className={styles.col4}></div>
                    <div className={`${styles.col4} ${styles.signText}`}>
                        Sign up and get 20% off on your first order. &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="" className={styles.a}>Sign Up Now</a>
                    </div>
                </div>
                <div className={styles.col4}>
                    <img src="../img/cross.svg" alt="" />
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
                    <span className={styles.searchIcon}><img src="/home/page/assets/icons/search-icon.png" alt="" /></span>
                </div>

                <div className={styles.icons}>
                    <div className={`${styles.icon} ${styles.wishlist}`}>
                        <span><img src="../assets/icons/Vector.png" alt="" /></span>
                        <a href="../cart/cart.html"></a>
                        <div className={`${styles.icon} ${styles.cart}`}>
                            <span><img src="../assets/icons/Cart1.png" alt="" /></span>
                            
                        </div>
                        <div className={`${styles.icon} ${styles.profile}`}>
                            <span><img src="../assets/icons/person.png" alt="" /></span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className={styles.mainContentWrapper}>
                <div className={styles.exploreBlock}>
                    <div className={styles.imageContainer}>
                        <img src="../img/img-2.svg" alt="Explore Image" className={styles.fullWidthImage} />
                    </div>
                </div>

                <div className={styles.collections}>
                    <div className={styles.collectionLeft}>
                    </div>

                    <div className={styles.cartSummary}>
                        <h2>Cart Summary</h2>
                        <p>Total Amount: ${totalAmount}</p>
                        <span className={styles.badge}>{cartItemCount}</span>
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
                                            {/* <img src="../img/heart.svg" alt="Heart" className={styles.heartImage} /> */}
                                        </div>
                                        <div className={styles.badgeWrapper}>
                                            {/* <img src="../img/badge.svg" alt="Badge" className={styles.badgeImage} /> */}
                                        </div>
                                        {/* <a href="../cart/cart.html"> */}
                                        <button className={styles.buyButton} onClick={() => handleItemAdd(perfume)}>Add to Cart</button>
                                        {/* </a> */}
                                    </div>
                                    <div className={styles.productDetails}>
                                        <h3>{perfume.name}</h3>
                                        <p>{perfume.description}</p>
                                        <p>Brand: {perfume.brand}</p>
                                        <p>Price: ${perfume.price}</p>
                                        <p>Quantity: {perfume.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                
            

            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerBrand}>
                        <h2>Scentora</h2>
                        <p>
                            We have perfumes that suits your <br />style and which you’re proud.
                        </p>
                        <div className={styles.socialIcons}>
                            <a href="#"><img src="../assets/icons/twitter.png" alt="" /></a>
                            <a href="#"><img src="../assets/icons/fb2.png" alt="" /></a>
                            <a href="#"><img src="../assets/icons/insta.png" alt="" /></a>
                            <a href="#"><img src="../assets/icons/git.png" alt="" /></a>
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
                        <img src="../assets/icons/visa.png" alt="Visa" />
                        <img src="../assets/icons/master.png" alt="MasterCard" />
                        <img src="../assets/icons/paypal.png" alt="PayPal" />
                        <img src="../assets/icons/applepay.png" alt="Apple Pay" />
                        <img src="../assets/icons/gpay.png" alt="Google Pay" />
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Page;
