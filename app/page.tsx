import type { Metadata } from "next";
import Experience from "./Experience";

export const metadata: Metadata = {
  title: "Rayuela para entender el mundo",
  description: "Ensayo interactivo sobre las matemáticas, Rayuela de Julio Cortázar y María de Jorge Isaacs.",
};

export default function Home() {
  return <Experience />;
}
