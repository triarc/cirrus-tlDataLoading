var Triarc;
(function (Triarc) {
    var Data;
    (function (Data) {
        var LazyDataLoader = (function () {
            function LazyDataLoader(fetchFn, $translate, preLoadBy, initialOrderBy) {
                if (preLoadBy === void 0) { preLoadBy = 1; }
                this.fetchFn = fetchFn;
                this.$translate = $translate;
                this.preLoadBy = preLoadBy;
                this.initialOrderBy = initialOrderBy;
                this._isSearching = false;
                this._isLoadingMore = false;
                this._disableLoadMore = true;
                this._hasData = true; // defaults to true until we have attempted to load
                if (!angular.isFunction(fetchFn))
                    throw "Cannot construct a LazyDataLoader without a real fetch function: fetchFn: (skip: number, take: number)!";
                this.reset();
                this.initialised = false;
                this._preLoadBy = preLoadBy;
                this.initialOderByDirection = 0 /* ASC */;
            }
            LazyDataLoader.prototype.reset = function () {
                this._data = [];
                this._hasMoreResults = false;
                this._top = 10;
                this._skip = 0;
                this._alreadyPreLoadedBy = 0;
                this._hasData = true; // defaults to true until we have attempted to load
            };
            Object.defineProperty(LazyDataLoader.prototype, "data", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "hasMoreResults", {
                get: function () {
                    return this._hasMoreResults;
                },
                set: function (value) {
                    this._hasMoreResults = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "top", {
                get: function () {
                    return this._top;
                },
                set: function (value) {
                    this._top = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "skip", {
                get: function () {
                    return this._skip;
                },
                set: function (value) {
                    this._skip = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "orderByValue", {
                get: function () {
                    return this._orderByValue;
                },
                set: function (value) {
                    this._orderByValue = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "orderBy", {
                get: function () {
                    return this._orderByValue + (this._orderByDirectionValue == 0 /* ASC */ ? " asc" : " desc");
                    ;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "orderByDirectionValue", {
                get: function () {
                    return this._orderByDirectionValue;
                },
                set: function (value) {
                    this._orderByDirectionValue = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "isSearching", {
                get: function () {
                    return this._isSearching;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "isLoadingMore", {
                get: function () {
                    return this._isLoadingMore;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LazyDataLoader.prototype, "hasData", {
                get: function () {
                    return this._hasData;
                },
                enumerable: true,
                configurable: true
            });
            LazyDataLoader.prototype.fetchAndOrderBy = function (column) {
                // switching from ASC to DESC?
                if (this._orderByValue == column) {
                    this._orderByDirectionValue = this._orderByDirectionValue == 0 /* ASC */ ? 1 /* DESC */ : 0 /* ASC */;
                }
                else {
                    // different sort column
                    this._orderByValue = column;
                    this._orderByDirectionValue = 0 /* ASC */;
                }
                this.load();
            };
            LazyDataLoader.prototype.load = function () {
                if (!this.initialised) {
                    this._orderByValue = this.initialOrderBy;
                    this._orderByDirectionValue = this.initialOderByDirection;
                    this.initialised = true;
                }
                if (Triarc.hasNoValue(this.$translate)) {
                    toastr.clear();
                    toastr.info(this.$translate.instant("_searching"));
                }
                this.reset();
                this._disableLoadMore = false;
                this.loadMore();
            };
            LazyDataLoader.prototype.disableLoadMore = function (value) {
                this._disableLoadMore = value;
            };
            LazyDataLoader.prototype.canLoadMore = function () {
                return !this._isSearching && !this._disableLoadMore;
            };
            LazyDataLoader.prototype.loadMore = function () {
                var _this = this;
                if (!this.canLoadMore) {
                    return;
                }
                if (this.isLoadingMore) {
                    return;
                }
                this._isLoadingMore = true;
                this.hasMoreResults = false; // just to prevent duplicate calls going through!
                this._isSearching = true;
                this.fetchFn(this._skip, this._top).then(function (dataResponse) {
                    //  this.$waitDialog.hide();
                    var data = dataResponse.data;
                    _this.skip = _this._skip + _this._top;
                    // have vales and still have more results
                    if (Triarc.arrayHasValues(data)) {
                        _this._hasData = true;
                        _this._data.addRange(data);
                        if (_this._alreadyPreLoadedBy < _this._preLoadBy) {
                            _this._alreadyPreLoadedBy++;
                            _this._isLoadingMore = false;
                            var interval = setInterval(function () {
                                clearInterval(interval);
                                _this.loadMore();
                            }, 800);
                        }
                    }
                    else if (!Triarc.arrayHasValues(data) && _this.hasMoreResults) {
                        _this.hasMoreResults = false;
                    }
                    _this._hasData = Triarc.arrayHasValues(_this._data);
                    _this.hasMoreResults = Triarc.arrayHasValues(data);
                    _this._isLoadingMore = false;
                    _this._isSearching = false;
                }, function (err) {
                    _this.hasMoreResults = false;
                    _this._isSearching = false;
                    _this._hasData = false;
                });
            };
            return LazyDataLoader;
        })();
        Data.LazyDataLoader = LazyDataLoader;
        (function (OrderByDirection) {
            OrderByDirection[OrderByDirection["ASC"] = 0] = "ASC";
            OrderByDirection[OrderByDirection["DESC"] = 1] = "DESC";
        })(Data.OrderByDirection || (Data.OrderByDirection = {}));
        var OrderByDirection = Data.OrderByDirection;
    })(Data = Triarc.Data || (Triarc.Data = {}));
})(Triarc || (Triarc = {}));
/// <reference path="lazydataloader.ts" />
var Triarc;
(function (Triarc) {
    var mod = angular.module('tlDataLoading', []);
    mod.directive('tlInfiniteScroll', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                link: function (scope, elem, attrs) {
                    var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                    $window = angular.element($window);
                    scrollDistance = 0;
                    if (attrs.tlInfiniteScrollDisabled != null) {
                        scope.$watch(attrs.tlInfiniteScrollDistance, function (value) { return scrollDistance = parseInt(value, 10); });
                    }
                    scrollEnabled = true;
                    checkWhenEnabled = false;
                    if (attrs.tlInfiniteScrollDisabled != null) {
                        scope.$watch(attrs.tlInfiniteScrollDisabled, function (value) {
                            scrollEnabled = !value;
                            if (scrollEnabled && checkWhenEnabled) {
                                checkWhenEnabled = false;
                                return handler();
                            }
                        });
                    }
                    handler = $(window).scroll(function () {
                        if ($(window).scrollTop() + $(window).height() > $(document).height() - 10) {
                            if ($rootScope.$$phase) {
                                return scope.$eval(attrs.tlInfiniteScroll);
                            }
                            else {
                                return scope.$apply(attrs.tlInfiniteScroll);
                            }
                        }
                    });
                    handler = function () {
                        var shouldScroll = ($(window).scrollTop() + $(window).height() > $(document).height() - 50);
                    };
                    $window.on('scroll', handler);
                    scope.$on('$destroy', function () { return $window.off('scroll', handler); });
                    return $timeout((function () {
                        if (attrs.tlInfiniteScrollImmediateCheck) {
                            if (scope.$eval(attrs.tlInfiniteScrollImmediateCheck)) {
                                return handler();
                            }
                        }
                        else {
                            return handler();
                        }
                    }), 0);
                }
            };
        }
    ]);
})(Triarc || (Triarc = {}));

