import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";

export async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          GigBoard
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
              <span className="text-muted-foreground hidden sm:inline">
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
