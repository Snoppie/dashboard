var refresh_rate = 1000; // refresh rate in ms
var camera_url = "http://ec2-54-93-71-88.eu-central-1.compute.amazonaws.com/"
var max_datapoints = 100;

var liveChart
var initData
var canvas
var ctx

function draw_data(){
	$.getJSON( camera_url + "cameras", function( json ) {

		timestamps = [];
		bpm = [];
		is_there = [];
		$.each(json[0], function(index, element) {
			timestamps.push(element.time);
			bpm.push(element.data.bpm);
			is_there.push(element.data.face);
		});

		$.each([timestamps, bpm, is_there], function(index, theArray) {
			if (theArray.length > max_datapoints) 
				theArray.splice(0, theArray.length - max_datapoints);
		});

		// if (timestamps.length > 10) timestamps.length = timestamps.slice(timestamps.length - max_datapoints, max_datapoints);
		// if (timestamps.length > 10) bpm.length = bpm.slice(bpm.length - max_datapoints, max_datapoints);
		// if (timestamps.length > 10) is_there.length = is_there.slice(is_there.length - max_datapoints, max_datapoints);

		initData = {
			labels: timestamps,
			datasets: [
				{
					label: "bpm",
					data: bpm,
					backgroundColor: [
						'rgba(194, 237, 203, 0.5)',
					],
					borderColor: [
						'rgba(61, 175, 85,1)',
					],
					borderWidth: 1
				}
			]
		};

		liveChart = new Chart(ctx , {
			type: "line",
			data: initData, 
			options: {
				animationSteps: 15,
				scales: {
					yAxes: [{
						display: true,
						ticks: {
							min: 40,
							max: 140,
            			}
      				}],
					// xAxes: [{
					// 	type: "time"
					// }]
    			}
			}
		});

		update_chart();
	});
}


function update_chart(){
	setInterval(function(){

		$.getJSON( camera_url + "camera/0/latest", function( json ) {
			new_bpm = json.data.bpm;
			new_time = json.time;
		

			labels = liveChart.data.labels
			data = liveChart.data.datasets[0].data

			

			console.log(json.data.face);

			if (json.data.face){
				data.push(new_bpm);
				labels.push(new_time);
				if (data.length > max_datapoints){
					data.shift();
					labels.shift();
				};
				liveChart.data.datasets[0].backgroundColor = ['rgba(194, 237, 203, 0.5)',];
				liveChart.update();
			} else {
				liveChart.data.datasets[0].backgroundColor = ['rgba(10, 10, 10, 0.1)',];
				liveChart.update();	
			};

			
		});

	}, refresh_rate);
}



// excecuted at website load
$(document).ready(function(){
	canvas = document.getElementById('myChart');
	ctx = canvas.getContext('2d');

	// start drawing
	draw_data();
});