// src/app/privacy/page.tsx
"use client"; // Required for useRouter

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft
import { useRouter } from "next/navigation"; // Import useRouter

export default function PrivacyPage() {
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
            Política de Privacidad
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
            1. Información que Recopilamos
          </h2>
          <p>
            Recopilamos varios tipos de información en relación con los
            Servicios, incluyendo:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Información que nos proporcionas directamente (por ejemplo, al
              registrarte, nombre, correo electrónico, dirección).
            </li>
            <li>
              Información que recopilamos automáticamente cuando utilizas
              nuestros Servicios (por ejemplo, información del dispositivo,
              datos de uso, cookies).
            </li>
            <li>
              Información de fuentes de terceros (si eliges conectar tu cuenta a
              servicios de terceros).
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">
            2. Cómo Usamos Tu Información
          </h2>
          <p>
            Utilizamos la información que recopilamos para diversos fines, tales
            como:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Proveer, operar y mantener nuestros Servicios.</li>
            <li>Mejorar, personalizar y expandir nuestros Servicios.</li>
            <li>Entender y analizar cómo utilizas nuestros Servicios.</li>
            <li>
              Desarrollar nuevos productos, servicios, características y
              funcionalidades.
            </li>
            <li>
              Comunicarnos contigo, ya sea directamente o a través de uno de
              nuestros socios, incluso para servicio al cliente, para
              proporcionarte actualizaciones y otra información relacionada con
              el Servicio, y con fines de marketing y promoción.
            </li>
            <li>Procesar tus transacciones.</li>
            <li>Enviarte correos electrónicos.</li>
            <li>Encontrar y prevenir fraudes.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground">
            3. Compartir Tu Información
          </h2>
          <p>
            Podemos compartir la información que recopilamos de varias maneras,
            incluyendo las siguientes:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Con proveedores de servicios: Podemos compartir tu información con
              proveedores externos que realizan servicios en nuestro nombre.
            </li>
            <li>
              Para transacciones: Si realizas una compra o venta, compartiremos
              información necesaria (como dirección de envío) entre el comprador
              y el vendedor.
            </li>
            <li>
              Por razones legales: Podemos divulgar tu información si así lo
              requiere la ley o en respuesta a solicitudes válidas de
              autoridades públicas.
            </li>
            {/* Add more sharing contexts if applicable */}
          </ul>

          <h2 className="text-xl font-semibold text-foreground">
            4. Seguridad de Tus Datos
          </h2>
          <p>
            La seguridad de tus datos es importante para nosotros, pero recuerda
            que ningún método de transmisión por Internet o método de
            almacenamiento electrónico es 100% seguro. Si bien nos esforzamos
            por utilizar medios comercialmente aceptables para proteger tu
            Información Personal, no podemos garantizar su seguridad absoluta.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            5. Tus Derechos de Privacidad
          </h2>
          <p>
            Dependiendo de tu ubicación, puedes tener ciertos derechos con
            respecto a tu información personal, como el derecho a acceder,
            corregir o eliminar tus datos. Contacta con nosotros para ejercer
            tus derechos.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            6. Cookies y Tecnologías Similares
          </h2>
          <p>
            Utilizamos cookies y tecnologías de seguimiento similares para
            rastrear la actividad en nuestro Servicio y mantener cierta
            información. Puedes instruir a tu navegador para que rechace todas
            las cookies o para que indique cuándo se envía una cookie.
          </p>

          <h2 className="text-xl font-semibold text-foreground">
            7. Cambios a Esta Política de Privacidad
          </h2>
          <p>
            Podemos actualizar nuestra Política de Privacidad de vez en cuando.
            Te notificaremos cualquier cambio publicando la nueva Política de
            Privacidad en esta página. Se te aconseja revisar esta Política de
            Privacidad periódicamente para cualquier cambio.
          </p>

          <h2 className="text-xl font-semibold text-foreground">8. Contacto</h2>
          <p>
            Si tienes alguna pregunta sobre esta Política de Privacidad, por
            favor contáctanos en [Tu Email de Contacto].
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
