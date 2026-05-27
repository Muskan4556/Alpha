import { getSession } from "@/lib/session-server";
import { redirect } from "next/navigation";
import { ProductDetailView } from "@/components/products/ProductDetailView";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  return <ProductDetailView key={id} id={id} role={session.role} />;
}
