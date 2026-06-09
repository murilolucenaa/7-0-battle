import { redirect } from "next/navigation";

// Root redirects to lobby — entry point of the SALA → DRAFT → BATALHA loop
export default function Home() {
  redirect("/lobby");
}
