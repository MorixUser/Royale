var app = angular.module('betApp');
app.filter('oddFilter', ['$filter', function ($filter) {


    return function(input) {
   if (input < 10) { 
    input = $filter('number')(input, 2);
  }
  else if (input >= 10 && input < 100) {
    input = $filter('number')(input, 1);
  }
  else if (input >= 100) {
    input = $filter('number')(input, 0);
  }
  return input;
};


}]);




app.filter('decimalFilter', ['$filter', function ($filter) {


    return function (input) {
        input = $filter('number')(input, 2);
        var s = "" + input;
        s = s.replace(',', '').replace('.', ',');
        return s;
    };

}]);