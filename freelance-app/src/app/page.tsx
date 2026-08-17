import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          GigBoard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Companies post work. Freelancers pick it up and get paid.
          Simple as that.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/gigs">Browse Gigs</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid w-full max-w-3xl gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Post</CardTitle>
            <CardDescription>
              Companies list a job with a title, description, and price.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Claim</CardTitle>
            <CardDescription>
              Freelancers browse open gigs and claim the ones they want.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">3. Get Paid</CardTitle>
            <CardDescription>
              Submit the work, get approved, and get paid.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
