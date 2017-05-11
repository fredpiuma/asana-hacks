// ==UserScript==
// @name         Asana hacks
// @namespace    https://github.com/fredpiuma/asana-hacks
// @version      2.1
// @description  Asana hacks user script.
// @author       Frederico de Castro - http://www.fredericodecastro.com.br
// @match        https://app.asana.com/*
// @grant        none
// ==/UserScript==

(function(w) {
	'use strict';

	/* configure as you wish */
	var config = {
		aways_show_remove_buttom : true,
		auto_clean_tasks : true,
		format_dates_to_number : true
	};

	/**
	 * This option make remove buttom aways visible, even without mousehover.
	 */
	if( config.aways_show_remove_buttom ) {
		var style = document.createElement('style');
		style.innerHTML = '.small-feed-story-group .feed-story .delete, .FeedMiniStory-deleteButton {visibility: visible;}';
		document.body.appendChild(style);
	}

	setInterval(function() {

		/**
		 * This option make a cleanup on history of changes every 500ms
		 */
		if( config.auto_clean_tasks ) {
			var deletes = document.querySelectorAll('.delete.click-target, .FeedMiniStory-deleteButton');
			if(deletes.length > 0) deletes[0].click();
		}

		/**
		 * This option format the dates on all Asana to DD/MM format.
		 * Works with dates like Yesterday, Tomorrow, Wednesday and DD MMM (12 Aug)
		 */
		if( config.format_dates_to_number ) {
			var datas = document.getElementsByClassName('grid_due_date');
			for(var i = 0; i < datas.length; i++) {
				if( !/[0-9]{2}\/[0-9]{2}/.test( datas[i].innerHTML ) ) {
					if( /([a-zA-Z]{3}) ([0-9]{1,2})/.test( datas[i].innerHTML ) ) {
						var date = /([a-zA-Z]{3}) ([0-9]{1,2})/.exec(datas[i].innerHTML);
						var month = { Jan : '01', Feb : '02', Mar : '03', Apr : '04', May : '05', Jun : '06', Jul : '07', Aug : '08', Sep : '09', Oct : '10', Nov : '11', Dec : '12' };
						datas[i].innerHTML = (date[2].length==1 ? '0' : '') + date[2] + "/" + month[date[1]];
					} else {
						var date = new Date();
						var addDays = 0;
						var weekDay = 0;
						if(datas[i].innerHTML == 'Yesterday') addDays = -1;
						if(datas[i].innerHTML == 'Today') addDays = 0;
						else if(datas[i].innerHTML == 'Tomorrow') addDays = 1;
						else {
							switch(datas[i].innerHTML) {
								case 'Sunday': case 'Monday': case 'Tuesday': case 'Wednesday': case 'Thursday': case 'Friday': case 'Saturday':
								addDays = date.getDay();
								switch(datas[i].innerHTML) {
									case 'Sunday': weekDay = 0; break;
									case 'Monday': weekDay = 1; break;
									case 'Tuesday': weekDay = 2; break;
									case 'Wednesday': weekDay = 3; break;
									case 'Thursday': weekDay = 4; break;
									case 'Friday': weekDay = 5; break;
									case 'Saturday': weekDay = 6; break;
								}
								if(weekDay < addDays) { weekDay += 7; }
								addDays = weekDay - addDays;
							}
						}
						date.setDate( date.getDate() + addDays );
						datas[i].innerHTML = ( date.getDate() < 10 ? '0' : '' ) + date.getDate() + "/" + ( (date.getMonth() + 1) < 10 ? '0' : '' ) + (date.getMonth() + 1);
					}
				}
			}
		}

	},500);

	setInterval(function() {},2000);

})(window);
