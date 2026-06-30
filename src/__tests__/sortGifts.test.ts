import test from "node:test";
import assert from "node:assert";
import { sortGifts } from "@/lib/sortGifts";
import type { Gift } from "@/hooks/useGifts";

// Mock Gift type for testing
const makeGift = (price: number, isReserved: boolean, isPurchased: boolean): Gift => ({
  id: Math.random(),
  name: "Test",
  description: null,
  imageUrl: null,
  price,
  productLink: null,
  category: null,
  isReserved,
  isPurchased,
  reservedBy: null,
  reservedByPhone: null,
  reservedAt: null,
  isActive: true,
  createdAt: new Date().toISOString(),
});

test("sortGifts - default sorting", () => {
  const gifts = [
    makeGift(100, true, false), // reserved, 100
    makeGift(50, false, false), // available, 50
    makeGift(200, false, false), // available, 200
    makeGift(150, false, true), // purchased, 150
  ];

  const sorted = sortGifts(gifts, "default");
  
  // Available first (200, then 50 because desc by default)
  // Unavailable last (150, then 100 because desc by default)
  assert.strictEqual(sorted[0].price, 200);
  assert.strictEqual(sorted[1].price, 50);
  assert.strictEqual(sorted[2].price, 150);
  assert.strictEqual(sorted[3].price, 100);
});

test("sortGifts - price-asc sorting", () => {
  const gifts = [
    makeGift(200, false, false), 
    makeGift(50, false, false), 
    makeGift(100, true, false), 
  ];

  const sorted = sortGifts(gifts, "price-asc");
  
  // Available first, but ascending: 50, then 200
  // Unavailable last: 100
  assert.strictEqual(sorted[0].price, 50);
  assert.strictEqual(sorted[1].price, 200);
  assert.strictEqual(sorted[2].price, 100);
});
