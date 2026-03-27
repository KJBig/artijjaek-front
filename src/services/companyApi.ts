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

    const currentPage =
      typeof payload?.pageNumber === "number"
        ? payload.pageNumber
        : typeof payload?.number === "number"
          ? payload.number
          : page;
    const pageSize =
      typeof payload?.pageSize === "number"
        ? payload.pageSize
        : typeof payload?.size === "number"
          ? payload.size
          : size;
    const totalPages =
      typeof payload?.totalPage === "number"
        ? payload.totalPage
        : typeof payload?.totalPages === "number"
          ? payload.totalPages
          : 0;
    const totalElements =
      typeof payload?.totalCount === "number"
        ? payload.totalCount
        : typeof payload?.totalElements === "number"
          ? payload.totalElements
          : 0;

    let hasMore: boolean;
    if (typeof payload?.hasNext === "boolean") {
      hasMore = payload.hasNext;
    } else if (typeof payload?.last === "boolean") {
      hasMore = !payload.last;
    } else if (typeof totalPages === "number" && totalPages > 0) {
      hasMore = currentPage + 1 < totalPages;
    } else {
      hasMore = items.length === pageSize;
    }

    const isFirst = typeof payload?.first === "boolean" ? payload.first : currentPage === 0;
    const isLast =
      typeof payload?.hasNext === "boolean"
        ? !payload.hasNext
        : typeof payload?.last === "boolean"
          ? payload.last
          : !hasMore;

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
  sortOption?: CompanySortOption
): Promise<Company[]> {
  const count = await fetchCompanyCount();

  if (typeof count === "number" && count > 0) {
    const response = await fetchCompaniesPage(0, count, sortOption);
    return dedupeCompanies(response.items);
  }

  const direct = await fetchAllCompaniesDirect(sortOption);
  if (direct) return direct;

  return fetchAllCompaniesViaPaging(100, sortOption);
}

function dedupeCompanies(items: Company[]): Company[] {
  const companyMap = new Map<number, Company>();
  for (const item of items) companyMap.set(item.id, item);
  return Array.from(companyMap.values());
}

async function fetchAllCompaniesDirect(
  sortOption?: CompanySortOption
): Promise<Company[] | null> {
  const qs = new URLSearchParams();
  if (sortOption) qs.set("sort_option", sortOption);
  const query = qs.toString();
  const url = `${BASE_URL}/api/v1/company/list${query ? `?${query}` : ""}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: jsonHeaders
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const payload = data?.data;

    if (Array.isArray(payload)) {
      return dedupeCompanies(payload.map(toCompany));
    }

    const rawItems = Array.isArray(payload?.content) ? payload.content : null;
    if (!rawItems) return null;

    const items = dedupeCompanies(rawItems.map(toCompany));
    const totalElements =
      typeof payload?.totalCount === "number"
        ? payload.totalCount
        : typeof payload?.totalElements === "number"
          ? payload.totalElements
          : null;
    const isLastPage =
      typeof payload?.hasNext === "boolean"
        ? !payload.hasNext
        : typeof payload?.last === "boolean"
          ? payload.last
          : null;

    if (totalElements != null && totalElements > items.length) return null;
    if (isLastPage === false) return null;

    return items;
  } catch (err) {
    console.error("[fetchAllCompaniesDirect] Error:", err);
    return null;
  }
}

async function fetchAllCompaniesViaPaging(
  size = 100,
  sortOption?: CompanySortOption
): Promise<Company[]> {
  const all: Company[] = [];
  let page = 0;

  while (true) {
    const response = await fetchCompaniesPage(page, size, sortOption);
    if (response.items.length) all.push(...response.items);
    if (!response.hasMore || response.nextPage == null) break;
    page = response.nextPage;
  }

  return dedupeCompanies(all);
}

function toCompany(company: any): Company {
  return {
    id: company.companyId ?? company.id,
    image: company.companyImageUrl ?? company.image ?? "",
    nameKr: company.companyNameKr ?? company.nameKr ?? "",
    nameEn: company.companyNameEn ?? company.nameEn ?? "",
    blogUrl: company.companyBlogUrl ?? company.blogUrl ?? ""
  };
}

export async function fetchCompanyCount(): Promise<number | null> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${BASE_URL}/api/v1/company/count`, {
      method: "GET",
      headers: jsonHeaders,
      signal: controller.signal,
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
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error("[fetchCompanyCount] Timeout");
      return 0;
    }
    console.error("[fetchCompanyCount] Error:", err);
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
