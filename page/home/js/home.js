var  webview = document.querySelector('webview')
webview.addEventListener('ipc-message', function (event){
	window.location.href = event.channel
});

(function($, win) {
	var $main = $('#main'),
		$pageAnimation = $('#page_animation'),
		$webview = $pageAnimation.find('webview'),
		$linkBtn = $('.link-btn');
	
	var timmer = null;
	$main.on('click','li',function() {
		var animationFile = $(this).attr('data-animation-file');
		$main.hide();
		if(window.nodeRequire) {
			$pageAnimation.show();
			$webview.removeClass('hide').attr('src',animationFile);
		} else {
			window.location.href = animationFile;
		}
		
	});
	
})(jQuery, window)
