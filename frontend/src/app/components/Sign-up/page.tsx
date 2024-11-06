'use client'; 
import { useState } from 'react';
import axios from 'axios';
import styles from './login.module.css';
import Link from 'next/link';
import Image from 'next/image';

const SignUp = () => {
  // State variables for name, email and password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle sign up
  const handleSignUp = async () => {
    try {
      // Axios post request to sign up
      console.log('Signing up...');
      const response = await axios.post('http://localhost:5000/user/signup', {
        name,
        email,
        password,
      });
      console.log('Sign up successful:', response.data);
      // Handle successful sign up 
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle sign up error
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ fontFamily: 'manrope' }}>
        <div className={styles.backgroundImage}>
          <div className={styles.card}>
            <img src="/assets/img/cross-ash.svg" alt="Close" className={styles.closeIcon} /> {/* Cross icon */}
            <h2 className={styles.heading}>Sign Up</h2>
            <div className={styles.inputFieldWrapper}>
              <p className={styles.inName}>Name</p>
              <input
                type="text"
                placeholder=""
                className={styles.inputField}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <p className={styles.inName}>Email or Phone Number</p>
              <input
                type="text"
                placeholder=""
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className={styles.inName}>Password</p>
              <div className={styles.passwordField}>
                <input
                  type="password"
                  placeholder=""
                  className={styles.inputField}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Image width={2} height={2} src={"/assets/img/eye.svg"} alt="Show Password" className={styles.eyeIcon} /> {/* Eye icon */}
              </div>

              <button className={styles.signUpButton} onClick={handleSignUp}>Sign Up</button>
              <p className={styles.signInText}>
                <Link href="/components/Sign-in" className={styles.signInLink}>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;


