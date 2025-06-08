import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { InkCanvas } from "@/components/ui/ink-canvas";

export default function AdminNotFound() {
  return (
    // O contêiner principal define o contexto de posicionamento
    <div className="relative min-h-screen w-full overflow-hidden">
      <InkCanvas />

      {/* O conteúdo agora fica diretamente sobre a animação.
        A legibilidade é garantida pelo uso de 'drop-shadow' no texto.
      */}
      <div className="relative z-10 flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        {/* Usamos 'drop-shadow' para criar um contorno suave que destaca os ícones e textos */}
        <ShieldAlert className="h-20 w-20 text-foreground drop-shadow-lg" />

        <h1 className="text-6xl font-black text-foreground drop-shadow-lg sm:text-7xl">
          Recurso Não Encontrado
        </h1>

        <p className="max-w-md text-lg text-foreground/80 drop-shadow-md">
          A página que você tentou acessar não existe ou foi movida.
        </p>

        {/* O botão já tem um fundo sólido, mas uma sombra ajuda a destacá-lo */}
        <Button asChild className="mt-8 shadow-2xl">
          <Link href="/admin">Ir para o Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
