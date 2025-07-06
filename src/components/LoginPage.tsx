'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/// <reference types="google.accounts" />

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

export default function LoginPage() {
  const router = useRouter();
  const googleSignInButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure the Google SDK is loaded before initializing
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string, // Your Google Client ID
        callback: async (response) => {
          // This callback is executed when the user successfully signs in
          const idToken = response.credential;
          console.log('Google ID Token:', idToken);

          try {
            // Send the ID token to your backend for verification
            const res = await fetch(`${API_URL}/api/auth/google`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ token : idToken }),
            });

            if (res.ok) {
              const data = await res.json();
              console.log('Backend verification successful:', data);
              
              // Save the token in cookies for future use
              document.cookie = `access_token=${idToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
              
              // Save user details in cookies as well
              if (data.user) {
                document.cookie = `user_session_id=${data.user.google_id}; path=/; max-age=${60 * 60 * 24 * 7}`;
              }
              
              console.log('User details saved:', data.user);
              // Only redirect if success is true
              if (data.success === true) {
                document.cookie = `user_id=${data.user.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
                router.push('/chat'); // Redirect to a protected page
              }
            } else {
              const errorData = await res.json();
              console.error('Backend verification failed:', errorData);
              // Handle errors from your backend
              toast.error('Login failed: ' + errorData.message);
            }
          } catch (error) {
            console.error('Error sending token to backend:', error);
            toast.error('An unexpected error occurred during login.');
          }
        },
      });

      // Render the Google Sign-In button
      if (googleSignInButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleSignInButtonRef.current,
          {
          theme: 'outline',
          size: 'large',
          }
        );
      }
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          padding: '48px 32px 40px 32px',
          maxWidth: '370px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <img
          src="/logo.png"
          alt="App Logo"
          style={{ width: 64, height: 64, marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
        />
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: 8,
            color: '#222',
            letterSpacing: '-0.5px',
          }}
        >
          Welcome Back
        </h1>
        <p
          style={{
            color: '#555',
            fontSize: '1.05rem',
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          Sign in to continue to your account
        </p>
        {/* This div will be replaced by the Google Sign-In button */}
        <div
          ref={googleSignInButtonRef}
          style={{ margin: '0 auto', display: 'inline-block', minHeight: 40 }}
          aria-label="Sign in with Google"
        ></div>
        <div style={{ marginTop: 32, fontSize: 13, color: '#aaa' }}>
          <span>
            By signing in, you agree to our{' '}
            <a href="/terms-of-service" style={{ color: '#4f8cff', textDecoration: 'underline' }}>Terms</a> &{' '}
            <a href="/privacy-policy" style={{ color: '#4f8cff', textDecoration: 'underline' }}>Privacy Policy</a>.
          </span>
        </div>
      </div>
    </div>
  );
}