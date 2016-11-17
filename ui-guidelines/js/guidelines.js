$(document).ready(function() {
	//STICKY right side bar
	$('#navigation').affix({
    	offset: {
        	top: 260
      	}
	});

	//COPY TO CLIPBOARD feature
	// Tooltip
	$('button').tooltip({
	  trigger: 'click',
	  placement: 'bottom'
	});

	function setTooltip(btn, message) {
	  $(btn).tooltip('hide')
	    .attr('data-original-title', message)
	    .tooltip('show');
	}

	function hideTooltip(btn) {
	  setTimeout(function() {
	    $(btn).tooltip('hide');
	  }, 1250);
	}

	// Clipboard
	var clipboard = new Clipboard('button');

	clipboard.on('success', function(e) {
	  setTooltip(e.trigger, 'copied!');
	  hideTooltip(e.trigger);
	});

	clipboard.on('error', function(e) {
	  setTooltip(e.trigger, 'Failed!');
	  hideTooltip(e.trigger);
	});

});