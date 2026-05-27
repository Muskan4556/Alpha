import { getSession } from "@/lib/session-server";
import { redirect } from "next/navigation";
import { ProductsView } from "@/components/products/productsView";

export default async function ProductsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <ProductsView role={session.role} />;
}
