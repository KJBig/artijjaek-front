// src/services/api.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const jsonHeaders = { "Content-Type": "application/json" };

export interface Company {
  id: number;
  image: string;
  nameKr: string;
  nameEn: string;
  blogUrl?: string;
}

export type CompanySortOption = "POPULARITY";

export interface PagedCompanies {
  items: Company[];
  hasMore: boolean;
  nextPage: number | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * 회사 목록을 페이지 단위로 가져오는 함수
 */
export async function fetchCompaniesPage(
  page: number,
  size: number,
  sortOption?: CompanySortOption
): Promise<PagedCompanies> {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  qs.set("size", String(size));
  if (sortOption) qs.set("sort_option", sortOption);

  try {
    const res = await fetch(`${BASE_URL}/api/v1/company/list?${qs.toString()}`, {
      method: "GET",
      headers: jsonHeaders
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const payload = data?.data ?? {};
    const rawItems = Array.isArray(payload?.content) ? payload.content : [];

    const items: Company[] = rawItems.map((company: any) => ({
      id: company.companyId ?? company.id,
      image: company.companyImageUrl ?? company.image ?? "",
      nameKr: company.companyNameKr ?? company.nameKr ?? "",
      nameEn: company.companyNameEn ?? company.nameEn ?? "",
      blogUrl: company.companyBlogUrl ?? company.blogUrl ?? ""
    }));

    const currentPage = typeof payload?.number === "number" ? payload.number : page;
    const pageSize = typeof payload?.size === "number" ? payload.size : size;
    const totalPages = typeof payload?.totalPages === "number" ? payload.totalPages : 0;
    const totalElements = typeof payload?.totalElements === "number" ? payload.totalElements : 0;

    let hasMore: boolean;
    if (typeof payload?.last === "boolean") {
      hasMore = !payload.last;
    } else if (typeof totalPages === "number" && totalPages > 0) {
      hasMore = currentPage + 1 < totalPages;
    } else {
      hasMore = items.length === pageSize;
    }

    const isFirst = typeof payload?.first === "boolean" ? payload.first : currentPage === 0;
    const isLast = typeof payload?.last === "boolean" ? payload.last : !hasMore;

    return {
      items,
      hasMore,
      nextPage: hasMore ? currentPage + 1 : null,
      page: currentPage,
      size: pageSize,
      totalPages: totalPages > 0 ? totalPages : hasMore ? currentPage + 2 : currentPage + 1,
      totalElements,
      isFirst,
      isLast,
    };
  } catch (err) {
    console.error("[fetchCompaniesPage] Error:", err);
    return {
      items: [],
      hasMore: false,
      nextPage: null,
      page,
      size,
      totalPages: 0,
      totalElements: 0,
      isFirst: page === 0,
      isLast: true,
    };
  }
}

/**
 * 전체 회사 목록을 모두 불러오는 함수 (전체선택용)
 */
export async function fetchAllCompanies(
  size = 100,
  sortOption?: CompanySortOption
): Promise<Company[]> {
  const all: Company[] = [];
  let page = 0;
  while (true) {
    const { items, hasMore, nextPage } = await fetchCompaniesPage(page, size, sortOption);
    if (items.length) all.push(...items);
    if (!hasMore || nextPage == null) break;
    page = nextPage;
  }
  return all;
}

export async function fetchCompanyCount(): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/company/count`, {
      method: "GET",
      headers: jsonHeaders
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const raw = data?.data;

    if (typeof raw === "number") return raw;
    if (raw && typeof raw === "object") {
      if (typeof raw.count === "number") return raw.count;
      if (typeof raw.totalCount === "number") return raw.totalCount;
    }
    return null;
  } catch (err) {
    console.error("[fetchCompanyCount] Error:", err);
    return null;
  }
}
