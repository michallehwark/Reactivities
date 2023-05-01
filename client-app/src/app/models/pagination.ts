export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    data: T;
    pagination: Pagination;
    // becasue this's a class we need to give some init values

    constructor(data: T, pagination: Pagination) {
        this.data = data;
        this.pagination = pagination;
    }
    // now we need to get all the data properites form a header that we send, we do it through axios interceptor, we do taht in Agent.ts in 'axios.interceptors.response'
}

export class PagingParams {
    pageNumber;
    pageSize;

    constructor(pageNumber = 1, pageSize = 2) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}