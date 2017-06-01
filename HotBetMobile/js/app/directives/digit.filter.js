(function(){
	'use strict';
	angular
	.module('betApp')
	.filter('digitFilter', digitFilter);

	function digitFilter($filter) {

		return function(input) {
			if(!input)
				input='0';
			
			if((typeof input)!='number')
			{
				input=input.replace('.','');
				input=input.replace(',','.');
			}
			input = $filter('number')(input, 2);
			input = input.replace(',','');
			return input;
		}
	}
})();