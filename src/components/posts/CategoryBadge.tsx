import { Badge } from "@/components/ui/Badge";

const categoryVariants: Record<string, "info" | "success" | "warning" | "neutral" | "danger"> = {
  Engineering: "info",
  Design: "success",
  Productivity: "warning",
  Product: "neutral",
};

export function CategoryBadge({ category }: { category: string | undefined }) {
  const variant = (category && categoryVariants[category]) || "info";
  return <Badge variant={variant}>{category}</Badge>;
}
