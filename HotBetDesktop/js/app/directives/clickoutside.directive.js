var app = angular.module('betApp');
app.directive('clickOutside', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr, ctrl) {
            var elemClickHandler = function (e) {
                e.stopPropagation();
            };
            var docClickHandler = function (e) {
                var dontClose = false;
                if ($(e.toElement).parents('.steady').length) {
                    dontClose = true;
                }else if ($(e.toElement).parents('.md-autocomplete-suggestions-container').length) {
                    dontClose = true;
                }
                if (dontClose) return;
                scope.$apply(attr.clickOutside);
            };

            elem.on('click', elemClickHandler);
            $document.on('click', docClickHandler);

            scope.$on('$destroy', function () { 
                elem.off('click', elemClickHandler);
                $document.off('click', docClickHandler);
            });
        }
    };
});