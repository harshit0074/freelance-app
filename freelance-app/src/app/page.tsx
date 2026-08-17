import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusPipeline } from "@/components/status-pipeline";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-20 sm:py-28">
      <div className="w-full max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          GigBoard · Work orders for hire
        </p>

        <h1 className="mt-4 font-mono text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Post the work.
          <br />
          Pick it up.
          <br />
          Get paid.
        </h1>

        <p className="mt-5 max-w-md text-base text-muted-foreground">
          Companies write up a work order with a price attached.
          Freelancers claim the ones they want. No bidding, no
          middleman — just the ticket, start to finish.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Get started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/gigs">Browse open work</Link>
          </Button>
        </div>

        <div className="mt-16">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Every ticket follows the same path
          </p>
          <StatusPipeline />
        </div>
      </div>
    </div>
  );
}
