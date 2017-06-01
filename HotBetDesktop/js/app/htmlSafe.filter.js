var app = angular.module('betApp');
app.filter("htmlSafe", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
}]);