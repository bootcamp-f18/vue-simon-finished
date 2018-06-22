Vue.component('timer', {

	template: `<div id="status">
		<p>{{ message }}{{ remaining }}</p>
	</div>`,

	data() {
		return {
			message: 'Click the Start button to begin!',
			remaining: '',
			intervalId: null
		}
	},

	created() {

		var self = this;

		this.$parent.$on('stateChange', function($event) {

			switch($event) {
			
				case 'capturing': 
					self.startTimer();
					break;
			
				default:
					console.log("Timer: state changed to [" + $event + "]");
			
			}
			
		});
	},

	methods: {

		startTimer: function() {
			if (this.intervalId === null) {
				this.remaining = 10;
				this.message = '';
				this.intervalId = window.setInterval(this.tick, 1000);
			}
		},

		stopTimer: function(text) {
			window.clearInterval(this.intervalId);
			this.message = text;
			this.remaining = '';
		},

		tick: function() {
			console.log('Tick!');
			this.remaining--;
			if (this.remaining === 0) {
				this.stopTimer('Time expired!');
			} 
		}

	}

});

var simon = new Vue({

	el: '#app',

	data: {
		longest: 0,
		current: 0
	},

	methods: {

		start: function() {

			this.$emit('stateChange', 'capturing');

		}

	}


});