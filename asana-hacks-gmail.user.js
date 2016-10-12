// ==UserScript==
// @name         Asana Haks for Gmail
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  
// @author       You
// @match        https://mail.google.com/mail/u/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	setInterval(function() {

		/* remove signature on asana reply */
		var $from = document.querySelectorAll('h3.iw span.gD');
		if($from.length > 0) {
			$from = $from[0].getAttribute('email');
			if( /reply-.+@asana.com/.test($from) ) {
				var $dots = document.querySelectorAll('.aH1');
				if( $dots.length > 0 ) {
					$dots[0].parentNode.click();
					document.getElementsByClassName('editable')[0].innerHTML = '';
				}
			}
		}
		
	},500);
})();