import Link from "next/link";
import { Ticket } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";

export async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wide"
        >
          <Ticket className="size-4" strokeWidth={2} />
          GIGBOARD
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Button variant="ghost" asChild size="sm">
            <Link href="/gigs">Browse Gigs</Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                {user.email}
              </span>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
