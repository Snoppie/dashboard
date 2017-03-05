var refresh_rate = 1000; // refresh rate in ms
var camera_url = "http://ec2-54-93-71-88.eu-central-1.compute.amazonaws.com/"
var max_datapoints = 30;

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

			// data.push(Math.random() * 100);
			data.push(new_bpm);

			labels.push(new_time);
			if (data.length > max_datapoints){
				data.shift();
				labels.shift();
			};

			liveChart.update();
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