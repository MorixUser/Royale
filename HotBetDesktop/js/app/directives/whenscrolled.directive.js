var app = angular.module('betApp');
app.directive('whenScrolled', ['$window', function ($window) {
    return function (scope, elm, attr) {
        var raw = elm[0];
        angular.element($window).bind('scroll', function () {
            scope.$apply(attr.whenScrolled);
            var offset = $(raw).offset();
            var posY = $(raw).height() - offset.top - $(window).scrollTop();
            scope.checkPosition(posY);
        });
    };
}]);


app.directive('emHeightSource', function () {

    return {
        link: function (scope, elem, attrs) {
        }
    }

});