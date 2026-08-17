import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Gig } from "@/lib/types";

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: gig } = await supabase
    .from("gigs")
    .select("*")
    .eq("id", id)
    .single<Gig>();

  if (!gig) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{gig.title}</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {gig.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {gig.description}
          </p>
          <div className="text-2xl font-semibold">
            ${gig.price.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Claiming will be available in the next phase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
