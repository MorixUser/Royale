var app = angular.module('betApp');
app.filter('currencyFilter', ['$filter', function ($filter) {


    return function(input) {
       
        switch (input) {
            case "EUR":
                input = "€";
                break;
            case "TRY":
                input = "t";
                break;
        }

      return input;
    };


}]);

