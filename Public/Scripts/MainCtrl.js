function MainCtrl($scope, $http) {

  //An "enum" of the current page
  $scope.pageType = {
    HOME: 0,
    EVENTLIST: 1,
    EVENTVIEW: 2,
    PROFILE: 3
  };

  //An "enum" of event attendance status
  $scope.eventStatus = {
    VIEWER: 0,  //View only
    GUEST: 1,   //Can comment
    ADMIN: 2,   //Can apply for supplies
    HOST: 3,    //Able to remove comments, edit event, and edit supplies
    HOSTEDIT: 4 //Edit event details
  };

  //Determines the current page that the user sees
  $scope.curPageType = $scope.pageType.HOME;

  //Determines how the event page appears
  $scope.curEventStatus = $scope.eventStatus.GUEST;

  //Data collected by the sign in form
  $scope.signinData = {
    email: "",
    password: ""
  };

  //Data collected from the registration form
  $scope.registerData = {
    username: "",
    password1: "",
    password2: "",
    email: "",
    address: ""
  };

  //Data of the currently logged in user - null if not logged in
  $scope.user = null;

  //Data about the user to be manipulated on the profile page
  $scope.userData = {
    name: "",
    email: "",
    password1: "",
    password2: "",
    addr: ""
  }

  //All of the events that should be displayed on the event list screen
  $scope.events = {
    hostedEvents: [{
      ID: 0,
      name: "BBQ Gala",
      date: new Date("October 13, 2014 11:13:00"),
      loc: "507 Abc Street, Urbana IL",
      status: $scope.eventStatus.HOST
    }],
    attendEvents: [{
      ID: 3,
      name: "Chris B-day",
      date: new Date("October 23, 2015 11:13:00"),
      loc: "507 Defg Street, Urbana IL",
      status: $scope.eventStatus.ADMIN
    },
    {
      ID: 4,
      name: "CS 411 Procrastination",
      date: new Date("November 13, 2014 11:13:00"),
      loc: "Cocomero",
      status: $scope.eventStatus.GUEST
    }],
    inviteEvents: [
      {
        ID: 6,
        name: "Dhruv's Funeral",
        date: new Date("October 3, 2014 11:13:00"),
        loc: "5830 Kirby Ave, Champaign IL",
        status: $scope.eventStatus.VIEWER
      }
    ],
    localEvents: [{
      ID: 5,
      name: "Sewing Club 17th annual Make-Your-Own-Sleepingbag Sleepover Extravaganza",
      date: new Date("April 16, 2016 11:13:00"),
      loc: "Daddy's O Pub",
      status: $scope.eventStatus.VIEWER
    }]
  };

  //Data of the currently selected event (this must be populated from the DB)
  $scope.curEvent = {
    ID: 1,
    name: "BBQ Gala",
    loc: "507 Abc Street, Urbana IL",
    startTime: new Date("May 18, 2015 17:00:00"),
    endTime: new Date("May 18, 2015 23:00:00"),
    desc: "Come on down for some delicious Texas-style BBQ.  This event is happening May 18th to celebrate the end of the semester and the start of Summer.  Bring your swimtrunks to since there will be an outdoor pool as well.",
    hostName: "Jill Vance",
    isPublic: true,
    isCarpooling: false,
    numOpenSeats: 0,
    guests:
      [{
        email: "bob@bob.com",
        name: "Bob Vance",
        isGuest: true
      },
      {
        email: "example@dummydata.net",
        name: "Jill Vance",
        isGuest: false
      },
      {
        email: "example2@dummydata.net",
        name: "Jerry McCaffery",
        isGuest: true
      }],
    supplies:
      [{
        name: "Ribs",
        quantity: "5 lbs",
        userEmail: "bob@bob.com",
        username: "Bob Vance"
      },
      {
        name: "BBQ Sauce",
        quantity: "700 gallons",
        userEmail: null,
        username: null
      }],
    comments:
      [{
        ID: 0,
        email: "bob@bob.com",
        username: "Bob Vance",
        text: "This seems like it'll be a lot of fun",
        date: new Date("October 13, 2014 11:13:00")
      },
      {
        ID: 1,
        email: "example@dummydata.net",
        username: "Jill Vance",
        text: "This seems like it'll be no fun whatsoever",
        date: new Date("October 12, 2014 11:13:00")
      }]
  };

  //The full list of supplies for curEvent
  $scope.fullSupplies = [{
    name: "Chips",
    quantities: [{
      min: 0,
      max: 6,
      quantity: "1 bag"
    },
    {
      min: 7,
      max: Number.MAX_SAFE_INTEGER,
      quantity: "2 bags"
    }]
  },
  {
    name: "Salsa",
    quantities: [{
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      quantity: "1 gallon"
    }]
  }];


  /********************************************NAVBAR***************************************************************/

  //Called when the user chooses log out
  $scope.logOut = function () {
    $scope.curPageType = $scope.pageType.HOME;
    $scope.user = null;
  };


  /********************************************HOME***************************************************************/

  //Called when the user presses the login button
  $scope.logIn = function () {
    console.log("Login");
    $http({
      method: 'POST',
      url: 'login.php',
      data: $.param($scope.signinData),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      if (data.success) {
        $scope.user = {
          name: data.username,
          email: data.email
        };
        $scope.loadEventListPage();
      }
      else {
        alert(data.error);
      }
        
      $scope.signinData = {
        email: "",
        password: ""
      };
    });
  };

  //Called when the user presses the register button
  $scope.register = function () {
    console.log("Register");
    $http({
      method: 'POST',
      url: 'register.php',
      data: $.param($scope.registerData),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      if (data.success) {
        $scope.user = {
          name: $scope.registerData.username,
          email: data.email
        };
        $scope.loadEventListPage();
      }
      else {
        alert(data.error);
      }

      $scope.registerData = {
        username: "",
        password1: "",
        password2: "",
        email: "",
        address: ""
      };
    });
  };

  /********************************************EVENT LIST***************************************************************/

  //Populate the eventList page
	$scope.loadEventListPage = function () {

    //Clear JS arrays
    $scope.events.hostedEvents = [];
    $scope.events.attendEvents = []; 
    $scope.events.inviteEvents = [];
    $scope.events.localEvents = [];
    //event {ID, name, date, loc, status}
    //Date should be a javascript date object - I need to fix this above and in the HTML

    //Hosted Events
	  $http({
		  method: 'POST',
		  url: 'hostList.php',
		  data: $.param($scope.user),  // pass in data as strings
		  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
		  console.log(data);
		  var index;
		  for(index = 0; index < data.length; index++) {
			  var event = {ID: data[index]['ID'], name: data[index]['Name'], date: formatDate(data[index]['StartTime']), loc: data[index]['Location'], status: 3};
			  $scope.events.hostedEvents.push(event);
		  }
    });

    //Invited and Attnding Events
	  $http({
		  method: 'POST',
		  url: 'attendList.php',
		  data: $.param($scope.user),  // pass in data as strings
		  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
		  console.log(data);
		  var index;
		  for	(index = 0; index < data.length; index++) {
			  var event = {ID: data[index]['ID'], name: data[index]['Name'], date: formatDate(data[index]['StartTime']), loc: data[index]['Location'], status: data[index]['Status']};
			  if (event.status == 1 || event.status == 2)
				  $scope.events.attendEvents.push(event);
			  else 
			  if (event.status == -1 || event.status == -2){
				  event.status = 0;
				  $scope.events.inviteEvents.push(event);
			  }
		  }
    });

    //Local events
	  loadLocalEvents();

    $scope.curPageType = $scope.pageType.EVENTLIST;
	};

	function loadLocalEvents() {
	  $scope.events.localEvents = [];
	  var locEventStruct = {
	    email: $scope.user.email,
	    radius: $scope.radius
	  };
	  $http({
	    method: 'POST',
	    url: 'localEvents.php',
	    data: $.param(locEventStruct),  // pass in data as strings
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
	  }).success(function (data) {
	    console.log(data);
	    var index;
	    for (index = 0; index < data.length; index++) {
	      var localEvent = { ID: data[index]['ID'], name: data[index]['Name'], date: formatDate(data[index]['StartTime']), loc: data[index]['Location'], status: 0 };
	      $scope.events.localEvents.push(localEvent);
	    }
	  });
	};

  //Deletes the event with the given ID from the database
  $scope.deleteEvent = function (angEvent, eventID) {
    angEvent.preventDefault();
    angEvent.stopPropagation();

    deleteEvent(eventID);
  };

  function deleteEvent(eventID) {
    console.log("Delete event");
    $http({
      method: 'POST',
      url: 'deleteEvent.php',
      data: $.param({ ID: eventID }),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      $scope.loadEventListPage();
    });
  };

  //Causes the current user to no longer be attending the given event
  $scope.unattendEvent = function (angEvent, eventID) {
    angEvent.preventDefault();
    angEvent.stopPropagation();

    console.log("unattend event");
    $http({
      method: 'POST',
      url: 'unattendEvent.php',
      data: $.param({ID:eventID,email:$scope.user.email}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data){
			console.log(data);
			$scope.loadEventListPage();
		});
  };

  //Creates a blank event hosted by the user
  //Sends the user to that event's HOSTEDIT page
  $scope.createNewEvent = function () {
	  console.log("Create event");
    $http({
      method: 'POST',
      url: 'newEvent.php',
      data: $.param({email:$scope.user.email}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data){
			console.log(data);
			$scope.curEvent = {
				ID: data['id'],
				name: "My Event",
				loc: "",
				startTime: new Date(),
				endTime: new Date(),
				desc: "",
				hostName: $scope.user.name,
				isPublic: false,
				guests: [],
				supplies: [],
				comments: []
			};
			$scope.curEventStatus = $scope.eventStatus.HOSTEDIT;
			$scope.curPageType = $scope.pageType.EVENTVIEW;
		});
  };

  //Signs the user up as a guest to the given event
  $scope.attendEvent = function (angEvent, eventID) {
    angEvent.preventDefault();
    angEvent.stopPropagation();

    console.log("attend event");
    $http({
      method: 'POST',
      url: 'attendEvent.php',
      data: $.param({ID:eventID,email:$scope.user.email}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data){
			console.log(data);
			$scope.loadEventListPage();
	});;
  };

  $scope.radius = 50;
  $scope.radiusOptions = [{ val: 10, text: "10 miles" },
                          { val: 25, text: "25 miles" },
                          { val: 50, text: "50 miles" },
                          { val: 100, text: "100 miles" },
                          { val: 200, text: "200 miles" }];

  //When the radius DDL is changed
  $scope.radiusChanged = function () {
    loadLocalEvents();
  };

  /********************************************EVENT VIEW***************************************************************/

  //Sends the user to the event page of the given event
  $scope.openEventPage = function (status, eventID) {
    console.log("Open event page");
	  $http({
      method: 'POST',
      url: 'openEvent.php',
      data: $.param({ID:eventID, email:$scope.user.email}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data){
			console.log(data);
			$scope.curEvent.ID = data['ID'];
			$scope.curEvent.name = data['Name'];
			$scope.curEvent.loc = data['Location'];
			$scope.curEvent.startTime = formatDate(data['StartTime']);
			$scope.curEvent.endTime = formatDate(data['EndTime']);
			$scope.curEvent.desc = data['Description'];
			$scope.curEvent.hostName = data['hostName'];
			$scope.curEvent.isPublic = data['isPublic'];
			$scope.curEvent.isCarpooling = data['isCarpooling'];
			$scope.curEvent.numOpenSeats = data['numOpenSeats'];

			var index;
			var guests = data['guests'];
			var comments = data['comments'];

			$scope.curEvent.guests = [];
			$scope.curEvent.supplies = [];
			$scope.curEvent.comments = [];

			for	(index = 0; index < guests.length; index++) {
				var stat = guests[index]['Status'];
				if(stat == 2)
					stat = 0;
				var guest = {email: guests[index]['Email'], name: guests[index]['Username'], isGuest: stat};
				$scope.curEvent.guests.push(guest);
			}

			for (index = 0; index < comments.length; index++) {
				var comment = {ID: comments[index]['ID'], email: comments[index]['Email'], username: comments[index]['Username'], text: comments[index]['Text'], date: formatDate(comments[index]['Time'])}
				$scope.curEvent.comments.push(comment);
			}

      //TODO: Actually load in supplies
			$scope.curEvent.supplies.push({
			  name: "Ribs",
			  quantity: "5 lbs",
			  userEmail: "bob@bob.com",
			  username: "Bob Vance"
			});
			$scope.curEvent.supplies.push({
        name: "BBQ Sauce",
        quantity: "700 gallons",
        userEmail: null,
        username: null
      });


			$scope.curPageType = $scope.pageType.EVENTVIEW;
			$scope.curEventStatus = status;
			$scope.inviteGuestEmail = "";
			initializeMap();
		});
  };

  //Loads all supplies data from DB and sends user to edit page
  $scope.editCurEvent = function () {
    //TODO: Load complete supplies data into <tbd structure>

    $scope.curEventStatus = $scope.eventStatus.HOSTEDIT;
  };

  //Propts the user for comment text, then creates the comment
  $scope.createComment = function () {
    var commText = prompt("Comment");
    commText = commText.trim();
    if (commText != null && commText.length > 0) {
		  $scope.commentStruct = {
			  email: $scope.user.email,
			  id: $scope.curEvent.ID,
			  text: commText
		  }
		  $http({
		    method: 'POST',
		    url: 'newComment.php',
		    data: $.param($scope.commentStruct),  // pass in data as strings
		    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      }).success(function (data) {
		    console.log(data);
		    $scope.curEvent.comments.push({
          ID: data['id'],
          email: $scope.user.email,
          username: $scope.user.name,
          text: commText,
          date: new Date()
        });
      });   
    }
  };

  //Delete the given comment - if the comment's user email doesn't match user.email, don't delete but replace text with "[removed by host]"
  $scope.deleteComment = function (commentID) {
    var comments = $scope.curEvent.comments;
    for (var i = 0; i < comments.length; i++) {
      if (comments[i].ID === commentID) {
        if (comments[i].email !== $scope.user.email) {
          //Host removes comment
          var commentStruct = {
            ID: commentID
          };
          comments[i].text = "[Removed by Host]";
          $http({
            method: 'POST',
            url: 'hostRemoveComment.php',
            data: $.param(commentStruct),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
          });
          break;
        } else {
          //User remove comment
          comments.splice(i, 1);
          commentStruct = {
            commentID: commentID
          };
          $http({
            method: 'POST',
            url: 'deleteComment.php',
            data: $.param(commentStruct),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
          });
          break;      
        }
      }
    }
  };

  //Saves any changes made to curEvent back to the database
  $scope.saveEventChanges = function () {
    if ($scope.curEvent.endTime <= $scope.curEvent.startTime) {
      alert("Your event's end time must be after its start time");
      return;
    }

	  var newEvent = {
		  ID: $scope.curEvent.ID,
		  name: $scope.curEvent.name,
		  loc: $scope.curEvent.loc,
		  start: formatDateForSQL($scope.curEvent.startTime),
		  end: formatDateForSQL($scope.curEvent.endTime),
		  desc: $scope.curEvent.desc,
		  isPublic: $scope.curEvent.isPublic
	  };
    $http({
            method: 'POST',
            url: 'updateEvent.php',
            data: $.param(newEvent),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
          });
  };

  //Deletes the curEvent from the DB and sends the user back to eventList
  $scope.deleteCurEvent = function () {
    deleteEvent($scope.curEvent.eventID);
  };

  $scope.todayDate = new Date();

  //Removes the guest from the event
  $scope.removeGuest = function (email) {
    $http({
      method: 'POST',
      url: 'removeGuest.php',
      data: $.param({eventID: $scope.curEvent.ID ,attendeeEmail:email}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      for (var i = 0; i < $scope.curEvent.guests.length; i++) {
        if ($scope.curEvent.guests[i].email === email) {
          $scope.curEvent.guests.splice(i, 1);
          break;
        }
      }
    });
  };

  //Invite guest input model
  $scope.inviteGuestEmail = "";

  //Invite a guest as specified by inviteGuestEmail and set as Admin
  $scope.inviteAsAdmin = function () {
    $http({
      method: 'POST',
      url: 'inviteAsAdmin.php',
      data: $.param({email:$scope.inviteGuestEmail, ID:$scope.curEvent.ID}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      alert(data['error']);
    });
    
    $scope.inviteGuestEmail = "";
  };

  //Invite inviteGuestEmail to the event as a Guest
  $scope.inviteAsGuest = function () {
    $http({
      method: 'POST',
      url: 'inviteAsGuest.php',
      data: $.param({ email: $scope.inviteGuestEmail, ID: $scope.curEvent.ID }),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      alert(data['error']);
    });

    $scope.inviteGuestEmail = "";
  };

  //Set user as bringing the given supply
  $scope.bringSupply = function (supply) {
    //Note: supply = {name, quantity, userEmail, username}

    $http({
            method: 'POST',
            url: 'bringSupply.php',
            data: $.param({email:$scope.user.email, ID:$scope.curEvent.ID, name:supply.name}),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
          }).success(function (data) {
            console.log(data);
          });

    supply.userEmail = user.email;
    supply.username = user.name;
  };

  //Set user as no longer bringing supply
  $scope.bailOnSupply = function (supply) {
    //Note: supply = {name, quantity, userEmail, username}

    $http({
            method: 'POST',
            url: 'bringSupply.php',
            data: $.param({email:$scope.user.email, ID:$scope.curEvent.ID, name:supply.name}),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
          }).success(function (data) {
            console.log(data);
          });

    supply.userEmail = null;
    supply.username = null;
  };

  //Update the user's carpooling info (curEvent.isCarpooling and curEvent.numOpenSeats)
  $scope.updateCarpool = function () {
    $http({
            method: 'POST',
            url: 'updateCarpool.php',
            data: $.param({email:$scope.user.email, eventid:$scope.curEvent.ID, isCarpooling:$scope.curEvent.isCarpooling, numOpenSeats:$scope.curEvent.numOpenSeats}),  // pass in data as strings
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
          }).success(function (data) {
            console.log(data);
          });
  };

  $scope.showMap = false;

  //Determine carpooling directions to event
  $scope.getDirections = function () {
    //TODO: Generate carpooling setup
    //Determine if curUser is a driver or not
    //If driver/not carpooling, return directions
    //If not driver, return user who is

    var locations = []; //Array of locations for driver's trip ([0] is their house, [last] is event location, [mid] is pickups)

    locations.push("1517 Thornwood Dr, Downers Grove IL");
    locations.push("505 E Healey, Champaign IL");
    locations.push("992 Quiet Bay Circle, Cicero IN");

    calcRoute(locations);
    $scope.showMap = true;
  };

  /********************************************GOOGLE MAPS**************************************************************/

  var directionsDisplay; //Displays route on map after we call route() and get the resulting directions. 
  var directionsService = new google.maps.DirectionsService(); //Call route() function on this to get actual directions.

  //Initializes page once all the HTML elements are loaded.
  function initializeMap() {
    directionsDisplay = new google.maps.DirectionsRenderer();

    //Configuration of the original map before user types anything in.
    var mapOptions = {
      zoom: 7,
      center: new google.maps.LatLng(52.5167, 13.3833) //Initial center coordinates before user types anything in. 
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions); //Google map that will display the route.

    directionsDisplay.setMap(map); //Map
    directionsDisplay.setPanel(document.getElementById('directions-panel')); //Panel with step-by-step directions.

    //Not sure what 3 lines below this do. 
    //var control = document.getElementById('control');
    //control.style.display = 'block';
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  }

  //Calculate a route from locations[0] to locations[last] stopping at all intermediate locs
  function calcRoute(locations) {

    var len = locations.length;
    var waypnts = locations.slice(1, len - 1);
    var waypnts2 = [];
    for (var i = 0; i < waypnts.length; i++) {
      waypnts2.push({
        location: waypnts[i],
        stopover: true
      });
    }

    //Specifics of the route request. 
    var request = {
      origin: locations[0],
      destination: locations[len - 1],
      waypoints: waypnts2,
      travelMode: google.maps.TravelMode.DRIVING
    };

    //Call route() function with request and callback function to actual get the route. 
    directionsService.route(request,
    function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    }
    );
  }

  /********************************************PROFILE***************************************************************/

  //Swithches the page to profile and loads in userData
  $scope.loadProfilePage = function () {
    console.log("Profile");
    $http({
      method: 'POST',
      url: 'profile.php',
      data: $.param($scope.user),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      $scope.userData = {
        name: $scope.user.name,
        email: $scope.user.email,
        password1: "",
        password2: "",
        addr: data.address
      };
      $scope.curPageType = $scope.pageType.PROFILE;
    });
  };

  //Save changes to profile as indicated by $scope.userData
  $scope.saveProfileChanges = function () {
    console.log("Update");
    $http({
      method: 'POST',
      url: 'updateProfile.php',
      data: $.param($scope.userData),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      if (data.success) {
        $scope.user.name = $scope.userData.name;
        alert("Account Updated Successfully");
        $scope.loadEventListPage();
      }
      else
      	alert(data.error);
    });
  };

  //Save changed password
  $scope.updatePassword = function () {
    console.log("Password Update");
    $http({
      method: 'POST',
      url: 'updatePassword.php',
      data: $.param($scope.userData),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
      if (data.success) {
        alert("Account Updated Successfully");
        $scope.loadEventListPage();
      }
      else
      	alert(data.error);
    });
  };

  //Deletes the current account and sends the user back to the login screen
  $scope.deleteAccount = function () {
    console.log("Delete");
    $http({
      method: 'POST',
      url: 'deleteProfile.php',
      data: $.param($scope.userData),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
       $scope.logOut();
    });
  };

  /********************************************MISC******************************************************************/

  //Converts sql DateTime strings into JS date objects
  function formatDate(sqlString) {
    var dateParts = sqlString.split("-");
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2), dateParts[2].substr(3, 2),
                    dateParts[2].substr(6, 2), dateParts[2].substr(9, 2));
  };

  //Converts JS Date object to SQL DateTime string
  function formatDateForSQL(dateObj) {
    var year = dateObj.getFullYear();
    var mon = (dateObj.getMonth()+1) >= 10 ? (dateObj.getMonth()+1) : "0" + (dateObj.getMonth()+1);
    var day = dateObj.getDate() >= 10 ? dateObj.getDate() : "0" + dateObj.getDate();
    var hour = dateObj.getHours() >= 10 ? dateObj.getHours() : "0" + dateObj.getHours();
    var min = dateObj.getMinutes() >= 10 ? dateObj.getMinutes() : "0" + dateObj.getMinutes();
    var sec = dateObj.getSeconds() >= 10 ? dateObj.getSeconds() : "0" + dateObj.getSeconds();
    return year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
  };
};