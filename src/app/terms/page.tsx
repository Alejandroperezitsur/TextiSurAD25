// src/app/terms/page.tsx
"use client"; // Required for useRouter

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft
import { useRouter } from "next/navigation"; // Import useRouter

export default function TermsPage() {
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

      <Card className="max-w-3xl mx-auto border shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Términos y Condiciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground prose prose-sm sm:prose-base max-w-none">
          <p className="font-semibold text-lg text-foreground">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            1. Introducción
          </h2>
          <p>
            Bienvenido a TextiSur. Estos términos y condiciones describen las
            reglas y regulaciones para el uso del sitio web de TextiSur, ubicado
            en [Tu URL aquí]. Al acceder a este sitio web, asumimos que aceptas
            estos términos y condiciones. No continúes usando TextiSur si no
            estás de acuerdo con todos los términos y condiciones establecidos
            en esta página.
          </p>

          <h2 className="text-xl font-semibold text-foreground">2. Cuentas</h2>
          <p>
            Cuando creas una cuenta con nosotros, debes proporcionarnos
            información precisa, completa y actualizada en todo momento. El
            incumplimiento de esto constituye una violación de los Términos, lo
            que puede resultar en la terminación inmediata de tu cuenta en
            nuestro Servicio.
          </p>
          <p>
            Eres responsable de salvaguardar la contraseña que utilizas para
            acceder al Servicio y de cualquier actividad o acciones bajo tu
            contraseña, ya sea que tu contraseña sea con nuestro Servicio o un
            servicio de terceros.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            3. Compras y Ventas
          </h2>
          <p>
            Si deseas comprar o vender cualquier producto o servicio disponible
            a través del Servicio ("Compra"), es posible que se te solicite que
            suministres cierta información relevante para tu Compra, incluida,
            entre otras, tu información de tarjeta de crédito, la dirección de
            envío, etc.
          </p>
          <p>
            TextiSur actúa como intermediario entre compradores y vendedores. No
            garantizamos la calidad, seguridad o legalidad de los artículos
            publicados, la veracidad o exactitud de los listados de los
            usuarios, la capacidad de los vendedores para vender artículos o la
            capacidad de los compradores para pagar los artículos.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            4. Contenido
          </h2>
          <p>
            Nuestro Servicio te permite publicar, vincular, almacenar, compartir
            y poner a disposición cierta información, texto, gráficos, videos u
            otro material ("Contenido"). Eres responsable del Contenido que
            publicas en el Servicio, incluida su legalidad, fiabilidad y
            adecuación.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            5. Propiedad Intelectual
          </h2>
          <p>
            El Servicio y su contenido original (excluyendo el Contenido
            proporcionado por los usuarios), características y funcionalidad son
            y seguirán siendo propiedad exclusiva de TextiSur y sus
            licenciantes.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            6. Limitación de Responsabilidad
          </h2>
          <p>
            En ningún caso TextiSur, ni sus directores, empleados, socios,
            agentes, proveedores o afiliados, serán responsables por daños
            indirectos, incidentales, especiales, consecuentes o punitivos,
            incluidos, entre otros, la pérdida de beneficios, datos, uso, buena
            voluntad u otras pérdidas intangibles, resultantes de (i) tu acceso
            o uso o incapacidad para acceder o usar el Servicio; (ii) cualquier
            conducta o contenido de cualquier tercero en el Servicio...
          </p>
          {/* Add more sections as needed */}

          <h2 className="text-xl font-semibold text-foreground">
            7. Modificaciones
          </h2>
          <p>
            Nos reservamos el derecho, a nuestra entera discreción, de modificar
            o reemplazar estos Términos en cualquier momento. Si una revisión es
            material, intentaremos proporcionar al menos 30 días de aviso previo
            a que entren en vigencia los nuevos términos. Lo que constituye un
            cambio material se determinará a nuestra entera discreción.
          </p>

          <h2 className="text-xl font-semibold text-foreground">8. Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre estos Términos, por favor
            contáctanos en [Tu Email de Contacto].
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
