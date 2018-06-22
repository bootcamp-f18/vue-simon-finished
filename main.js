Vue.component('timer', {

	template: `<p>Timer goes here!</p>`

});

var simon = new Vue({

	el: '#app',

	data: {
		longest: 0,
		current: 0
	}


});