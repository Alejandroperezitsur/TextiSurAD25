// src/app/about/page.tsx
"use client"; // Required for useRouter

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft, Users, MapPin, Heart } from "lucide-react"; // Import ArrowLeft
import { useRouter } from "next/navigation"; // Import useRouter
import Image from "next/image";

export default function AboutPage() {
  const router = useRouter(); // Initialize router

  const handleGoBack = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <div className="container mx-auto flex-1 py-12 px-4 md:px-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 group text-muted-foreground hover:text-foreground pl-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
        Volver
      </Button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
          Sobre TextiSur
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Conectando la tradición textil local con el mundo digital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-semibold mb-4 text-primary">
            Nuestra Misión
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            TextiSur nació de la pasión por la rica herencia textil de nuestra
            región. Nuestro objetivo es crear un puente entre los talentosos
            artesanos y productores locales y los compradores que valoran la
            calidad, la autenticidad y las historias detrás de cada prenda.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Creemos en el poder del comercio local para fortalecer nuestra
            comunidad, preservar nuestras tradiciones y ofrecer productos únicos
            y sostenibles. Facilitamos una plataforma fácil de usar donde los
            vendedores pueden mostrar su trabajo y los compradores pueden
            descubrir tesoros textiles.
          </p>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden border">
          <Image
            src="https://periodicocorreo.com.mx/__export/sites/correo/img/2021/10/14/middle-plaza2-157234860.jpg"
            alt="Taller textil con artesanos trabajando"
            fill
            style={{ objectFit: "cover" }}
            data-ai-hint="textile workshop"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
        <Card className="p-6 border hover:border-primary transition-colors">
          <Users className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Comunidad Local</h3>
          <p className="text-sm text-muted-foreground">
            Apoyamos a los productores y vendedores de nuestra área, fomentando
            la economía local.
          </p>
        </Card>
        <Card className="p-6 border hover:border-primary transition-colors">
          <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Enfoque Regional</h3>
          <p className="text-sm text-muted-foreground">
            Celebramos la identidad y las técnicas textiles únicas de nuestra
            región.
          </p>
        </Card>
        <Card className="p-6 border hover:border-primary transition-colors">
          <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Pasión por lo Textil</h3>
          <p className="text-sm text-muted-foreground">
            Nos encanta la moda, la artesanía y la calidad que solo los textiles
            pueden ofrecer.
          </p>
        </Card>
      </div>

      {/* Optional: Team Section Placeholder */}
      {/* <div className="text-center">
            <h2 className="text-3xl font-semibold mb-8">Nuestro Equipo</h2>
            <p className="text-muted-foreground">Conoce a las personas detrás de TextiSur (próximamente).</p>
        </div> */}
    </div>
  );
}
