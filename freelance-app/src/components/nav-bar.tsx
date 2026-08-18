import Link from "next/link";
import { HelpCircle, Settings, Ticket, User, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";

export async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-sm font-bold tracking-wider text-foreground hover:opacity-80 transition-opacity"
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Ticket className="size-4" strokeWidth={2.5} />
            </div>
            GIGBOARD
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Button variant="ghost" asChild size="sm">
              <Link href="/gigs">Browse Gigs</Link>
            </Button>
            <Button variant="ghost" asChild size="sm">
              <Link href="/help">Help & FAQ</Link>
            </Button>
          </nav>
        </div>

        {/* Right side navigation & user profile actions */}
        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Button variant="ghost" asChild size="sm">
                <Link href="/dashboard" className="flex items-center gap-1.5">
                  <LayoutDashboard className="size-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>

              <Button variant="ghost" asChild size="sm">
                <Link href="/profile" className="flex items-center gap-1.5">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </Button>

              <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/settings" className="flex items-center gap-1.5">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>
              </Button>

              <div className="hidden lg:flex items-center pl-2 pr-1">
                <span className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">
                  {profile?.full_name || user.email}
                </span>
              </div>

              <form action={logout}>
                <Button variant="outline" size="sm" type="submit" title="Log out">
                  <LogOut className="size-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/help" className="flex items-center gap-1">
                  <HelpCircle className="size-4" /> Help
                </Link>
              </Button>
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
