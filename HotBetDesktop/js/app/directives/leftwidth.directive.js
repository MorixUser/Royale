angular
	.module('betApp')
	.directive('whenScroll', function() {
		return function(scope,elm,attr) 
		{
			var el = elm[0];
			elm.bind("scroll", function() {
				//console.log(elm.scrollLeft() + " "+ elm.scrollRight());
			    if (elm.scrollLeft() - scope.casinoContainer.width < 5) {
						scope.loadMore('right');
				}
				if (elm.scrollLeft() < 20) {
						scope.loadMore('left');
				}
			});
			
		}
	});