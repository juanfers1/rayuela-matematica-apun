import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = new URL(`${protocol}://${host}`);
  const title = "Rayuela para entender el mundo";
  const description = "Una rayuela matemática y literaria para explorar patrones, escalas, modelos e incertidumbres.";
  const image = new URL("/og.png", origin);

  return {
    metadataBase: origin,
    title: { default: title, template: "%s · Cátedra APUN" },
    description,
    openGraph: {
      type: "website",
      locale: "es_CO",
      title,
      description,
      images: [{ url: image, width: 1730, height: 909, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
