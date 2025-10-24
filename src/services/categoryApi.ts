// src/services/api.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const jsonHeaders = { "Content-Type": "application/json" };

export interface Category {
  id: number;
  name: string;
}

export interface PagedCategories {
  items: Category[];
  hasMore: boolean;
  nextPage: number | null;
}

/**
 * 회사 목록을 페이지 단위로 가져오는 함수
 */
export async function fetchCategoriesPage(
  page: number,
  size: number
): Promise<PagedCategories> {
  const qs = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  try {
    const res = await fetch(`${BASE_URL}/api/v1/category/list?${qs.toString()}`, {
      method: "GET",
      headers: jsonHeaders
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const rawItems = data?.data.content;

    const items: Category[] = rawItems.map((category: any) => ({
      id: category.categoryId,
      name: category.categoryName,
    }));

    let hasMore: boolean;
    if (typeof data?.hasMore === "boolean") {
      hasMore = data.hasMore;
    } else if (typeof data?.totalPages === "number") {
      hasMore = page + 1 < data.totalPages;
    } else {
      hasMore = items.length === size;
    }

    return { items, hasMore, nextPage: hasMore ? page + 1 : null };
  } catch (err) {
    console.error("[fetchCategoriesPage] Error:", err);
    return { items: [], hasMore: false, nextPage: null };
  }
}

/**
 * 전체 회사 목록을 모두 불러오는 함수 (전체선택용)
 */
export async function fetchAllCategories(size = 100): Promise<Category[]> {
  const all: Category[] = [];
  let page = 0;
  while (true) {
    const { items, hasMore, nextPage } = await fetchCategoriesPage(page, size);
    if (items.length) all.push(...items);
    if (!hasMore || nextPage == null) break;
    page = nextPage;
  }
  return all;
}
