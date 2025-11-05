// src/services/api.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const jsonHeaders = { "Content-Type": "application/json" };

export interface Company {
  id: number;
  image: string;
  nameKr: string;
  nameEn: string;
}

export interface PagedCompanies {
  items: Company[];
  hasMore: boolean;
  nextPage: number | null;
}

/**
 * 회사 목록을 페이지 단위로 가져오는 함수
 */
export async function fetchCompaniesPage(
  page: number,
  size: number
): Promise<PagedCompanies> {
  const qs = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  try {
    const res = await fetch(`${BASE_URL}/api/v1/company/list?${qs.toString()}`, {
      method: "GET",
      headers: jsonHeaders
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const rawItems = data?.data.content;

    const items: Company[] = rawItems.map((conpany: any) => ({
      id: conpany.companyId,
      image: conpany.companyImageUrl,
      nameKr: conpany.companyNameKr,
      nameEn: conpany.companyNameEn
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
    console.error("[fetchCompaniesPage] Error:", err);
    return { items: [], hasMore: false, nextPage: null };
  }
}

/**
 * 전체 회사 목록을 모두 불러오는 함수 (전체선택용)
 */
export async function fetchAllCompanies(size = 100): Promise<Company[]> {
  const all: Company[] = [];
  let page = 0;
  while (true) {
    const { items, hasMore, nextPage } = await fetchCompaniesPage(page, size);
    if (items.length) all.push(...items);
    if (!hasMore || nextPage == null) break;
    page = nextPage;
  }
  return all;
}
