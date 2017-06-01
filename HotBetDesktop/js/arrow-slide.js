
$(document).ready(function() {
	var amount = $('#amount-menu');
	var send = $('.send');
send.on("click", function(e) {
	 e.preventDefault();
	$(this).next().slideToggle('');
});
});

function scrollMiniLobby(name) {
       var currentElement = $('.mini-lobby-content');
  switch (name) {
    case 'right':
      currentElement.animate({scrollLeft: currentElement.scrollLeft() + 170}, 500);
      return false;
    break;
    case 'left':
      currentElement.animate({scrollLeft: currentElement.scrollLeft() - 170}, 500);
      return false;
    break;

  }
     
}
function PopupCenter(url, title, w, h, full) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
	
    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = '';
    if (full)
	{
		w=screen.width;
		h=screen.height-100;
		newWindow = window.open(url, '', 'type=fullWindow,fullscreen,scrollbars=no,location=no, titlebar=no,menubar=no,width=' + w + ', height=' + h + ',top=0, left=0');
		}
    else {

      newWindow = window.open(url, '', 'scrollbars=no,location=no, titlebar=no,menubar=no,width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
   
      }
if (newWindow == undefined)
   alert('Please disable your popup blocker');

    /* if (window.focus) {
        newWindow.focus();
    } */
}
