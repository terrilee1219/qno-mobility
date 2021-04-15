// bus stops near me are:
// - Waterfront
// - Granger Bay
// - Breakwater
// - Nobel Square
// - Aquarium
// - Marina
// - Clock Tower
// - Waterfront Silo
// - Portswood
// query to the databse the above stops and adderely and get the next 5 bus times for each of the bus stops
// return addereley arrival times
// return adderley boarding times for the line 106
// return Upper long arrival time
// map the corressponding times by use of the index

// fetch entire bus stop object
// find my current time and find the next 5 times from the object

function loadFirstPage(){
	// navigate to new page

/*
	// if already on the firstPage, don't run this code
	// code not work need debugging
	if (location !== "./firstPage.html"){
		location.replace("./firstPage.html");
	}
*/
	console.log("code inside the loadFirstPage is working")



	// get current time
	var d = new Date(); // for now
	var currentHour = d.getHours(); // => 9
	var currentMinute = d.getMinutes(); // =>  30
	var currentSecond = d.getSeconds(); // => 51
	//console.log(currentHour);
	//console.log(currentMinute);
/*
	// simulate constant time for writing code at night
	var d = new Date(); // for now
	var currentHour = 9; // => 9
	var currentMinute = 15; // =>  30
*/



	// array of bus stops in waterfront
	// in later versions, this array will be populated by a gps feature identifying the bus stops near me
	var stopsNearMe = ['Waterfront', 'Breakwater', 'Nobel Square', 'Aquarium', 'Marina', 'Clock Tower', 'Waterfront Silo'];

	// sample time object array
	// conflict in the identifier name
	/*
	var timeArrayTEST = [{1:'06:00',2:'06:15',3:'06:45'},{1:'06:00',2:'06:15',3:'06:45'},{1:'06:00',2:'06:15',3:'06:45'},{1:'06:00',2:'06:15',3:'06:45'},{1:'06:00',2:'06:15',3:'06:45'},{1:'06:00',2:'06:15',3:'06:45'},{1:'06:00',2:'06:15',3:'06:45'},{1:'06:00',2:'06:15',3:'06:45'}]
	console.log(timeArrayTEST);
	*/

	// get all bus line data from line 104 and store in oneZeroFour
	// just do 104 for now
	var oneZeroFour = {}
	var oneZeroFour = db.collection('Bus Lines').doc('104').get()
	.then((snapshot) => {
		//console.log(snapshot.data())
		data = snapshot.data();



		// DESCRIPTION: this is an array of time objects. The stopsNearMe will be used to access the data from the database and the time objects will be sotreed here
		var busStopDataArray = []

		// test for one bus stop
		// IT WORKS
		/*
		console.log(data['Bus Stops']['Waterfront']['Mondays to Fridays'])
		busStopDataArray.push(data['Bus Stops']['Waterfront']['Mondays to Fridays'])
		*/

		for (stops in stopsNearMe){
			// test what the for in does to the array
			// console.log(stops)
			// RESULT: returns the index of the items in the array
			// SOLUTION: stopsNearMe[stops]
			// IT WORKS
			//console.log(stopsNearMe[stops])

			// PROBLEM: type error with the stopsNearMe[stops] 
			// SOLUTION_1: use the primitive value of the bus stop name
			// var busStop = stopsNearMe[stops].valueOf();
			// DOESN'T WORK: type error

			var busStop = stopsNearMe[stops];

			// BUG REPORT: var busTimes = data['Bus Stops'][busStop]['Mondays to Fridays']; resulting in error
			// TEST_1: what is the data type of busStop
			// RESULT: data type is string. type is not the issue
			/*
			console.log(busStop);
			console.log(typeof busStop);
			*/

			// TEST_2: test if the code runs for a double nest instead of triple
			// RESULT: yes it does run
			// COMMENT: the issue may be due to the tripling of the nest
			/*
			var test2_1 = data['Bus Stops'][busStop];
			console.log(test2_1) 
			*/

			// TEST_3: test if the code runs for the original triple nest to confirm the triple nest is the issue
			// RESULT: error. but noticing that the first iteration does output correctly
			// COMMENT: create another buffer variable. This is a syntax issue
			/*
			var test3_1 = data['Bus Stops'][busStop]['Mondays to Fridays'];
			console.log(test3_1);
			*/

			// TEST_4: create a buffer var
			// SOLUTION: the code is perfectly fine. The stopsNearMe array has an item that is not in our 104 database. The issue was somewhere different
			/*
			var test4_1 = data['Bus Stops'][busStop];
			var test4_2 = test4_1['Mondays to Fridays'];

			console.log(test4_2);
			*/

			// insert the stopsNearMe to the busStopDataArray which is an array of the bus time objects for the bus stops in the bus line
			// the stopsNearMe array may contain a stop that is not in the 104 line. Create a try and catch block
			try{
				var busTimes = data['Bus Stops'][busStop]['Mondays to Fridays'];
				busStopDataArray.push(busTimes);
			}
			catch (err) {
				console.log('ERROR: One or more bus stops near me is not in this line');
			}
		}
		// check the array
		//console.log(busStopDataArray)


		// DESCRIPTION: block below tries to find what time data to render by finding what index corresponds to current time 
		// CODE STATE: COMPELTE
		// for loop through waterfront bus times and find at what index (called order in the database) my current time is at. the other stops will also have the same index
		// Waterfront is chosen because the current index for the waterfront will apply to the other stops which are at least 3 min ahead of waterfront
		// 0th element in the busStopDataArray is Waterfront
		busTimes = busStopDataArray[0];
		//console.log(busTimes)
		// DESCRIPTION: for looping through Waterfront time object
		for (data in busTimes){
			//console.log(busTimes[data])
			// compare the data with the current hour and minute
			// split hour and minute
			timeArray = busTimes[data].split(":")
			//console.log("hour is: "+timeArray[0])
			//console.log("minute is: "+timeArray[1])
			//console.log("current hour is: "+currentHour)
			//console.log("current minute is: "+currentMinute)
			// convert string to number 
			var hour = parseInt(timeArray[0])
			var minute = parseInt(timeArray[1])

			//console.log("current hour minue bus hour is: "+(currentHour-hour))

			// if hour-currentHour is zero and if minute-currentMinute is greater than zero then good
			// if hour-currentHour is greater than zero, then good

			var subtractHour = hour-currentHour
			var subtractMinute = minute-currentMinute

			// DESCRIPTION: currentIndex is the index (called order) of the first of the five bus times
			// this is needed to return the next five bus times
			var currentIndex = '';


			// BUG: hour and minute is 9:42 and current is 9:15 and it did not flag that I could take this bus
			// DIAGNOSIS: the if statements are falsely nested
			// PROPOSED SOLUTION: un-nest it
			// VERDICT: fixed

			// AIM: currentIndes needs to be the first index that satisfies the if condition
			// TEST_1: use break command. The current index should be 8. the second for loop will be executed (current: 9:15)
			// RESULT: works. the for loop is terminated

			if (subtractHour > 0){
			    //console.log("you can take this bus at: "+(busTimes[data]))
			    //console.log("the order/index of the bus is: "+(data))
			    currentIndex = data;
			    break;
			}
			if (subtractHour == 0 && subtractMinute >= 0){
			    //console.log("you can take this bus: "+(busTimes[data]))
			    //console.log("the order/index of the bus is: "+(data))
			    currentIndex = data;
			    break; // not sure if this will break through the nested if
			}
		}
		//console.log(currentIndex);





		// DESCRIPTION: code below create a new array with the relevent times using the currentIndex
		// INFO: The busStopDataArray contains all the bus times for the stops near me. Cut the above array so that the first time is at the currentIndex

		var currentBusStopDataArray = [];
		// for each of the elements in the array, cut the object
		for (element in busStopDataArray){
			// busStopDataArray[element] is the time object for each stop
			//console.log(busStopDataArray[element]);

			// TASK: create a shortened object
			// STRATEGY: loop through the original object 5 times (5 data starting from the current index) and assign the key and value to a new object
			var newObject = {};
			for (var i =0; i<5; i++){
				// TEST_1: test for loop
				// RESULT: good. runs 5 times 
				//console.log(i);

				// TEST_1: test if currentIndex is a number and can be added to the i to increment the index
				// RESULT: currentIndex is not a number, it is a string.
				// SOLUTION: convert currentIndex into a string
				/*
				console.log('This is currentIndex: '+currentIndex);
				console.log('This is currentIndex plus 1: '+(currentIndex+1));
				*/

				// TEST_2: convert currentIndex into a number using the pareseInt() method
				// REUSLT: it works. The parseInt(currentIndex) is number
				//console.log('This is currentIndex: '+parseInt(currentIndex));
				//console.log('This is currentIndex plus 1: '+(parseInt(currentIndex)+1));

				currentIndex = parseInt(currentIndex)

				// TEST_1
				// RESULT: it works. the newObject is an object of the times starting from the currentIndex
				newObject[currentIndex+i] = busStopDataArray[element][currentIndex+i];
			}
			//console.log(newObject);

			// TASK: write the newObject to the currentBusStopDataArray
			currentBusStopDataArray.push(newObject);
		}
		// TEST_1: test is array looks good
		// RESULT: it works. the array contains the time array that starts fromt he current index
		//console.log(currentBusStopDataArray);





		// DESCRIPTION: code below is a function that renders the bus stops array and the corresponding time object array to the html file with the li tag with id = bus-stop-list
		// CODE STATE: COMPLETE. The render to the html file is working
		const cafeList = document.querySelector('#bus-stop-list');

		function renderStops(doc, timeObject){
		    let li = document.createElement('li');
		    let name = document.createElement('span');
		    let time = document.createElement('div');

		    li.setAttribute('data-id', doc.id);
		    name.textContent = doc;

		    for (times in timeObject){
		        time.textContent = time.textContent + '\n' + timeObject[times];
		    }


		    li.appendChild(name);
		    li.appendChild(time);
		    //li.appendChild(cross);

		    cafeList.appendChild(li);
		};

		/* code under inspection
		// call the render function
		// for loop the render funciton for each of the list items
	    for (stops in stopsNearMe){
	        // what does stops look like
	        // prints: Waterfront, Granger Bay, ...
	        //console.log(stopsNearMe[stops]);

	        // pass in the stop names into a modified render function
	        renderStops(stopsNearMe[stops], busStopDataArray[stops]);

	        // TEST_1: what does timeArray[stops] look like
	        // RESULT: return an object like i wanted
	        //console.log(busStopDataArray[stops]);
	    }
		*/


	    // for loop render function
	    for (stops in stopsNearMe){
	        renderStops(stopsNearMe[stops], currentBusStopDataArray[stops]);
	    }

	}) // end of then
	.catch((err) => {
	  console.log(err);
	})


};

// call the loadFirstPage() function so that it runs when the firstPage is refreshed
loadFirstPage();