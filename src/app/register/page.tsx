"use client";

import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { GDGMark } from "@/components/ui/gdg-mark";
import { Suspense, useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

function RegisterContent() {
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();

  // Redirect if already fully registered and not currently signing up through this page
  useEffect(() => {
    if (!loading && user && userProfile && !isSigningIn) {
      router.push("/");
    }
  }, [user, userProfile, loading, router, isSigningIn]);

  const handleGoogleSignUp = async () => {
    try {
      setIsSigningIn(true);
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if they already have a profile
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // They are already registered! Show error and log them out so they use the Login flow
        await signOut(auth);
        setError("User is already registered, try logging in.");
        setIsSigningIn(false);
      } else {
        // New user! The auth-context will catch the onAuthStateChanged and router.push to /complete-profile
        router.push("/complete-profile");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google.");
      setIsSigningIn(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="w-full max-w-md px-6">
          <div className="mb-8 flex justify-center">
            <GDGMark size={48} />
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface/50 p-8 backdrop-blur-sm sm:p-10">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-center">Join the Community</h1>
            <p className="mb-8 text-sm text-muted text-center">Create your GDGoC RIT account</p>
            
            {error && (
              <div className="mb-6 rounded-md bg-accent-red/10 p-3 text-sm text-accent-red text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleGoogleSignUp}
                disabled={isSigningIn || loading}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-surface/80 disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {(isSigningIn || loading) ? "Creating Account..." : "Continue with Google"}
              </button>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center">Loading...</main>}>
      <RegisterContent />
    </Suspense>
  );
}
