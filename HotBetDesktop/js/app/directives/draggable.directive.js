var app = angular.module('betApp');
app.directive('draggable', function ($document) {
    return function (scope, element, attr) {
        var startX = -165, startY = 176, x = -165, y = 260;
        element.css({
            position: 'relative',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'block',
            width: '800',
            top: '120',
            left: '120'
        });
        element.on('mousedown', function (event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            startX = event.screenX - x;
            startY = event.screenY - y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
            y = event.screenY - startY;
            x = event.screenX - startX;
            element.css({
                top: y + 'px',
                left: x + 'px'
            });
        }

        function mouseup() {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
        }
    };
});