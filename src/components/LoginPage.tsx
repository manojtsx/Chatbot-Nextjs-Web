'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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
              body: JSON.stringify({ token : idToken }),
            });

            if (res.ok) {
              const data = await res.json();
              console.log('Backend verification successful:', data);
              
              // Save the token in cookies for future use
              document.cookie = `auth_token=${idToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
              
              // Save user details in cookies as well
              if (data.user) {
                document.cookie = `user_email=${data.user.email}; path=/; max-age=${60 * 60 * 24 * 7}`;
                document.cookie = `user_name=${encodeURIComponent(data.user.name)}; path=/; max-age=${60 * 60 * 24 * 7}`;
                document.cookie = `user_id=${data.user.id}; path=/; max-age=${60 * 60 * 24 * 7}`;
              }
              
              console.log('User details saved:', data.user);
              router.push('/chat'); // Redirect to a protected page
            } else {
              const errorData = await res.json();
              console.error('Backend verification failed:', errorData);
              // Handle errors from your backend
              alert('Login failed: ' + errorData.message);
            }
          } catch (error) {
            console.error('Error sending token to backend:', error);
            alert('An unexpected error occurred during login.');
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
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Login to Your App</h1>
      <p>Click the button below to sign in with your Google account.</p>
      {/* This div will be replaced by the Google Sign-In button */}
      <div ref={googleSignInButtonRef} style={{ marginTop: '20px', display: 'inline-block' }}></div>
    </div>
  );
}