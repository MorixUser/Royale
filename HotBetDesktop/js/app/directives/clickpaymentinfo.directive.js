var app = angular.module('betApp');
app.directive('clickPaymentinfo', function ($document,$state) {
    return {
        restrict: 'A',
        scope: {
            page: "=piPage",
        },
        link: function ($scope,$element, $attributes) {
            
            $element.on("click",
                function (event) {
                    $state.go($scope.page);
                }
            );
        }
    };
});