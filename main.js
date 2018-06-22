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

				case 'processing':
					self.stopTimer('Yikes! You tapped a light!');
					self.startTimer();
					break;
			
				case 'playing':
					self.stopTimer('Watch closely!');
					break;

				case 'goodjob':
					self.stopTimer('Good job! Adding another light....');
					break;

				case 'gameover':
					self.stopTimer('Oops, game over! Click Start to begin a new game!');
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
			this.intervalId = null;
		},

		tick: function() {
			console.log('Tick!');
			this.remaining--;
			if (this.remaining === 0) {
				this.stopTimer('Time expired! Click Start to begin a new game!');
				this.$emit('expired');
			} 
		}

	}

});

var simon = new Vue({

	el: '#app',

	data: {
		longest: 0,
		current: 0,
		isTimerActive: false,
		sequence: [],
		taps: [],
		playSequenceId: null,
		currentButton: '',
		playSequenceCounter: 0,
		lights: [ 'red', 'green', 'yellow', 'blue' ]
	},

	created() {

		this.$on('expired', function($event) {
			this.gameOver();
			this.taps = [];
		
			// TODO: update longest

		});

	},

	methods: {

		start: function() {
			this.sequence = [];
			this.isTimerActive = true;
			this.playSequence();
			this.current = 0;
		},

		captureTap: function(color) {

			if (this.isTimerActive) {

				// Yay! Process this tap!
				this.$emit('stateChange', 'processing');

				// light up the button
				this.currentButton = color;
				var self = this;
				setTimeout(function() {
					self.currentButton = '';
				}, 300);

				// Compare taps
				var last_index = this.taps.length;
				this.taps.push(color);
				if (color === this.sequence[last_index]) {
					
					if (this.taps.length === this.sequence.length) {
						this.taps = [];
						this.$emit('stateChange', 'goodjob');
						this.current = this.sequence.length;
						if (this.longest < this.sequence.length) {
							this.longest = this.sequence.length;
						}
						setTimeout(function() {
							self.playSequence();
						}, 1000);
					}

				}
				else {
					this.gameOver();
				}

			}
			else {
				// Not waiting for user input
				// Ignore the tap
			}

		},

		addToSequence: function() {
			var index = Math.floor(Math.random() * 4);
			this.sequence.push(this.lights[index]);
		},

		playSequence: function() {
			var self = this;
			self.addToSequence();
			self.$emit('stateChange', 'playing');
			self.playSequenceId = window.setInterval(function() {
				self.currentButton = self.sequence[self.playSequenceCounter];
				setTimeout(function() {
					self.currentButton = '';
					self.playSequenceCounter++;
					if (self.playSequenceCounter === self.sequence.length) {

						// Turn off the repeat
						console.log("Ran out of sequence to display");
						window.clearInterval(self.playSequenceId);
						self.playSequenceCounter = 0;
						self.$emit('stateChange', 'capturing');

					}
				}, 300);
			}, 600);
		},

		gameOver: function() {

			console.log("Sorry, game over!");
			this.$emit('stateChange', 'gameover');

		}

	}


});