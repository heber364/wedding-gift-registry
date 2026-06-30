import type { Gift } from "@/hooks/useGifts";

type SortOption = "default" | "price-asc" | "price-desc";

export function sortGifts(gifts: Gift[], sortOption: SortOption): Gift[] {
  return [...gifts].sort((a, b) => {
    const aUnavailable = a.isReserved || a.isPurchased;
    const bUnavailable = b.isReserved || b.isPurchased;
    
    if (aUnavailable !== bUnavailable) {
      return aUnavailable ? 1 : -1;
    }

    if (sortOption === "price-asc") {
      return a.price - b.price;
    }
    
    // Default and price-desc
    return b.price - a.price;
  });
}
