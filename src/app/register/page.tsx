import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { GDGMark } from "@/components/ui/gdg-mark";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="w-full max-w-md px-6">
          <div className="mb-8 flex justify-center">
            <GDGMark size={48} />
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface/50 p-8 backdrop-blur-sm sm:p-10">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-center">Join the Community</h1>
            <p className="mb-8 text-sm text-muted text-center">Create your GDG account</p>
            
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    placeholder="John" 
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    placeholder="Doe" 
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="you@example.com" 
                  className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="••••••••" 
                  className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>
              
              <button 
                type="button" 
                className="mt-4 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Create Account
              </button>
            </form>
            
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
