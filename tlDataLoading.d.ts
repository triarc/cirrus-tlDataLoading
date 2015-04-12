declare module Triarc.Data {
    class LazyDataLoader<T> {
        private fetchFn;
        private $translate;
        private preLoadBy;
        private initialOrderBy;
        private _hasMoreResults;
        private _isSearching;
        private _isLoadingMore;
        private _disableLoadMore;
        private _hasData;
        private _preLoadBy;
        private _alreadyPreLoadedBy;
        private _top;
        private _skip;
        private _orderByValue;
        private _orderByDirectionValue;
        private _data;
        private initialised;
        private initialOderByDirection;
        constructor(fetchFn: (skip: number, top: number) => ng.IPromise<Triarc.Data.DataResponse<T[]>>, $translate?: ng.translate.ITranslateService, preLoadBy?: number, initialOrderBy?: string);
        reset(): void;
        data: any[];
        hasMoreResults: boolean;
        top: number;
        skip: number;
        orderByValue: string;
        orderBy: string;
        orderByDirectionValue: Triarc.Data.OrderByDirection;
        isSearching: boolean;
        isLoadingMore: boolean;
        hasData: boolean;
        fetchAndOrderBy(column: string): void;
        load(): void;
        disableLoadMore(value: boolean): void;
        canLoadMore(): boolean;
        loadMore(): void;
    }
    enum OrderByDirection {
        ASC = 0,
        DESC = 1,
    }
}
declare module Triarc {
}
