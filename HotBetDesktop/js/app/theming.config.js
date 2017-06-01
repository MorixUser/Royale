(function () {
    'use strict';
    angular
        .module('betApp')
.config(function ($mdThemingProvider) {

    $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('red');


});
})();