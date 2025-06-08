// app/(home)/not-found.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

/**
 * Página 404 customizada para a área pública/home do site.
 * Apresenta um tom mais amigável e focado no usuário final.
 */
export default function HomeNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <div className="flex max-w-lg flex-col items-center">
        <Compass className="h-20 w-20 text-muted-foreground" />

        <h1 className="mt-8 text-6xl font-bold tracking-tighter text-foreground sm:text-7xl">
          Página não encontrada - Home
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Parece que você pegou um caminho que não leva a lugar nenhum. Não se
          preocupe, podemos te guiar de volta.
        </p>

        <Button asChild className="mt-10">
          <Link href="/">Voltar para a Página Inicial</Link>
        </Button>
      </div>
    </main>
  );
}
