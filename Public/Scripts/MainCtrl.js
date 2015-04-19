﻿function MainCtrl($scope, $http) {

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

	$scope.loadEventListPage = function () {
    
    //TODO: Populate $scope.events from DB using $scope.user.email

    $scope.events.hostedEvents = [];
    $scope.events.attendEvents = []; 
    $scope.events.inviteEvents = [];
    $scope.events.localEvents = [];
    //event {ID, name, date, loc, status}
    //Date should be a javascript date object - I need to fix this above and in the HTML
	$http({
		method: 'POST',
		url: 'hostList.php',
		data: $.param($scope.user),  // pass in data as strings
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
		console.log(data);
		var index;
		for	(index = 0; index < data.length; index++) {
			var event = {ID: data[index]['ID'], name: data[index]['Name'], date: data[index]['StartTime'], loc: data[index]['Location'], status: 3};
			$scope.events.hostedEvents.push(event);
		}
    });
	$http({
		method: 'POST',
		url: 'attendList.php',
		data: $.param($scope.user),  // pass in data as strings
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
		console.log(data);
		var index;
		for	(index = 0; index < data.length; index++) {
			var event = {ID: data[index]['ID'], name: data[index]['Name'], date: data[index]['StartTime'], loc: data[index]['Location'], status: data[index]['Status']};
			if (event.status == 1 || event.status == 2)
				$scope.events.attendEvents.push(event);
			else 
			if (event.status == -1 || event.status == -2){
				event.status = 0;
				$scope.events.inviteEvents.push(event);
			}
		}
    });
    $scope.curPageType = $scope.pageType.EVENTLIST;
  };

  //Deletes the event with the given ID from the database
  $scope.deleteEvent = function (angEvent, eventID) {
    angEvent.preventDefault();
    angEvent.stopPropagation();

    console.log("Delete event");
    $http({
      method: 'POST',
      url: 'deleteEvent.php',
      data: $.param({ID:eventID}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data){
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

  /********************************************EVENT VIEW***************************************************************/

  //Sends the user to the event page of the given event
  $scope.openEventPage = function (status, eventID) {
    //TODO: this
    console.log("Open event page");
	$http({
      method: 'POST',
      url: 'openEvent.php',
      data: $.param({ID:eventID, email:$scope.user.email}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data){
			console.log(data);
			$scope.curEventStatus = $scope.eventStatus.HOSTEDIT;
			$scope.curPageType = $scope.pageType.EVENTVIEW;
		});

    $scope.curPageType = $scope.pageType.EVENTVIEW;
    $scope.curEventStatus = status;
    initializeMap();
  };

  //Propts the user for comment text, then creates the comment
  $scope.createComment = function () {
    //TODO: Create comment in DB - get ID from DB
    alert("Not Implemented Fully - CreateComment()");

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
    alert("Not Implemented Fully - DeleteComment(" + commentID + ")");

    var comments = $scope.curEvent.comments;
    for (var i = 0; i < comments.length; i++) {
      if (comments[i].ID === commentID) {
        if (comments[i].email !== $scope.user.email) {
          comments[i].text = "[Removed by Host]";
        } else {
          comments.splice(i, 1);
          //TODO: Remove comment from DB as well
        }
        break;
      }
    }
  };

  //Saves any changes made to curEvent back to the database
  $scope.saveEventChanges = function () {
    //TODO: This
    alert("Not Implemented - saveEventChanges()");
  };

  //Deletes the curEvent from the DB and sends the user back to eventList
  $scope.deleteCurEvent = function () {
    //TODO: This
    alert("Not Implemented - deleteCurEvent()");
  };

  $scope.todayDate = new Date();

  //Removes the guest from the event
  $scope.removeGuest = function (email) {
    alert("NOT IMPLEMENTED - removeGuest(" + email + ")")
    //TODO: This
    $http({
      method: 'POST',
      url: 'removeGuest.php',
      data: $.param(eventID,scope.user.email,scope.curEvent),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    });
  };

  //Invite guest input model
  $scope.inviteGuestEmail = "";

  //Invite a guest as specified by inviteGuestEmail and set as Admin
  $scope.inviteAsAdmin = function () {
    alert("NOT IMPLEMENTED - inviteAsAdmin(" + inviteGuestEmail + ")");
    //TODO: This

    alert("Invite sent");
    $scope.inviteGuestEmail = "";
  };

  //Invite inviteGuestEmail to the event as a Guest
  $scope.inviteAsGuest = function () {
    alert("NOT IMPLEMENTED - inviteAsGuest(" + inviteGuestEmail + ")");
    //TODO: This

    alert("Invite sent");
    $scope.inviteGuestEmail = "";
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
    var control = document.getElementById('control');
    control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  }

  //Calculate a route from locations[0] to locations[last] stopping at all intermediate locs
  function calcRoute(locations) {

    var len = locations.length();
    var waypnts = locations.slice(1, len - 1);

    //Specifics of the route request. 
    var request = {
      origin: locations[0],
      destination: locations[len - 1],
      waypoints: waypnts,
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
};