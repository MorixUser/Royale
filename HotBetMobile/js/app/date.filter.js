var app = angular.module('betApp');
app.filter('dateFilter', ['$filter', function ($filter) {


    return function (input) {
        if (input == null) { return ""; }
        var _date = moment(input).format('ddd DD.MM HH:mm');

        return _date.toUpperCase();
    }

}]);
app.filter('ticketDateFilter', ['$filter', function ($filter) {


    return function (input) {
        if (input == null) { return ""; }
        var _date = moment(input).format('DD.MM. HH:mm');

        return _date.toUpperCase();
    }

}]);

app.filter('matchDateFilter', ['$filter', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }
        return moment(input).format('DD.MM.')

    };
}]);

app.filter('matchTimeFilter', ['$filter', function ($filter) {
    return function (input) {
        if (input == null) { return ""; }
        return moment(input).format('HH:mm')
    };
}]);

var app = angular.module('betApp');
app.filter('slipDateFilter', ['$filter', function ($filter) {


    return function (input) {
        if (input == null) { return ""; }
        var _date = $filter('date')(new Date(input), 'dd.MM.yyyy');
        var toDate = moment().add(7, 'days').format('DD.MM.YYYY');
        var fromDate = moment().format('DD.MM.YYYY');

        //if (_date >= fromDate || _date <= toDate) {
        //    return moment(input, 'YYYY-MM-DDTHH:mm:ssZ').format('ddd HH:mm');
        //} else {
            return moment(input).format('DD.MM. HH:mm')
        //}
    };


}]);
