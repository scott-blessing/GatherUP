function MainCtrl($scope, $http) {

  var SQL_MAX_INT = 2147483647;

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
    initName: "Chips",
    quantities: [{
      min: 0,
      max: 6,
      quantity: "1 bag",
      initMin: 0
    },
    {
      min: 7,
      max: SQL_MAX_INT,
      quantity: "2 bags",
      initMin: 7
    }]
  },
  {
    name: "Salsa",
    initName: "Salsa",
    quantities: [{
      min: 0,
      max: SQL_MAX_INT,
      quantity: "1 gallon",
      initMin: 0
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

    //Invited and Attending Events
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

			$scope.curPageType = $scope.pageType.EVENTVIEW;
			$scope.editCurEvent();
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
  $scope.radiusOptions = [{ val: 1, text: "1 mile" },
                          { val: 5, text: "5 miles" },
                          { val: 10, text: "10 miles" },
                          { val: 25, text: "25 miles" },
                          { val: 50, text: "50 miles" },
                          { val: 100, text: "100 miles" },
                          { val: 200, text: "200 miles" },
                          { val: 500, text: "500 miles" },
                          { val: 1000, text: "1,000 miles" },
                          { val: 10000, text: "10,000 miles" }];

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

      //Load values into curEvent
			$scope.curEvent.ID = data['ID'];
			$scope.curEvent.name = data['Name'];
			$scope.curEvent.loc = data['Location'];
			$scope.curEvent.startTime = formatDate(data['StartTime']);
			$scope.curEvent.endTime = formatDate(data['EndTime']);
			$scope.curEvent.desc = data['Description'];
			$scope.curEvent.hostName = data['hostName'];
			$scope.curEvent.isPublic = Boolean(Number(data['isPublic']));
			$scope.curEvent.isCarpooling = Boolean(Number(data['isCarpooling']));
			$scope.curEvent.numOpenSeats = data['numOpenSeats'];

			var index;
			var guests = data['guests'];
			var comments = data['comments'];

      //Reset curEvent arrays
			$scope.curEvent.guests = [];
			$scope.curEvent.supplies = [];
			$scope.curEvent.comments = [];

      //Load in guests
			for	(index = 0; index < guests.length; index++) {
				var stat = guests[index]['Status'];
				if(stat == 2)
					stat = 0;
				var guest = {email: guests[index]['Email'], name: guests[index]['Username'], isGuest: stat};
				$scope.curEvent.guests.push(guest);
			}

      //Load in comments
			for (index = 0; index < comments.length; index++) {
				var comment = {ID: comments[index]['ID'], email: comments[index]['Email'], username: comments[index]['Username'], text: comments[index]['Text'], date: formatDate(comments[index]['Time'])}
				$scope.curEvent.comments.push(comment);
			}

      $http({
        method: 'POST',
        url: 'supplyList.php',
        data: $.param({eventid:eventID}),  // pass in data as strings
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      }).success(function (data){
        console.log(data);

        //Load in supplies
        var supplies = data['supplies'];
        if (supplies == null)
          supplies = [];

        for(var i = 0; i < supplies.length; i++)
        {
          var supply = {
            name: supplies[i]['SupplyName'], 
            quantity: supplies[i]['Quantity'], 
            userEmail: supplies[i]['UserEmail'], 
            username: supplies[i]['Username']
          };
          $scope.curEvent.supplies.push(supply);
        }

        //Switch page to eventview
        $scope.curPageType = $scope.pageType.EVENTVIEW;
        $scope.curEventStatus = status;
        $scope.inviteGuestEmail = "";
        initializeMap(); //Displays Google Map.
      });
	});
  };

  //Loads all supplies data from DB and sends user to edit page
  $scope.editCurEvent = function () {
    //: Load complete supplies data into 'fullSupplies'
    // *** each 'quantities' array needs to sorted by 'min' ascending ***
    //Since all of the supplies are being loaded from the DB, set 'init's as well

    $scope.fullSupplies = [];

    $http({
        method: 'POST',
        url: 'supplyListComplete.php',
        data: $.param({eventid: $scope.curEvent.ID}),  // pass in data as strings
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      }).success(function (data){
        console.log(data);

        var supplies = data['supplies']; //1D array ordered by name, min (Name, Quantity, MinGuests, MaxGuests)
        if (supplies == null)
          supplies = [];         

        if (supplies.length > 0) {
          var curName = "";
          var curSupply = null;
          for (var i = 0; i < supplies.length; i++) {
            var s = supplies[i];
            var sName = s.Name;
            if (curName === "") {
              curName = sName;
              curSupply = { name: curName, initName: curName, quantities: [] };
            }
            if (curName === sName) {
              curSupply.quantities.push({
                min: Number(s.MinGuests), initMin: Number(s.MinGuests),
                max: Number(s.MaxGuests), quantity: s.Quantity
              });
            }
            else {
              $scope.fullSupplies.push(curSupply);
              curName = sName;
              curSupply = {
                name: curName, initName: curName,
                quantities: [{
                  min: Number(s.MinGuests), initMin: Number(s.MinGuests),
                  max: Number(s.MaxGuests), quantity: s.Quantity
                }]
              };
            }
          }
          $scope.fullSupplies.push(curSupply);
        }

        //Reset tracker arrays
        removedSupplies = [];
        removedQuantities = [];

        $scope.curEventStatus = $scope.eventStatus.HOSTEDIT;
    });
  };

  $scope.showComments = true;

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

	  $scope.curEventStatus = $scope.eventStatus.HOST;
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

    supply.userEmail = $scope.user.email;
    supply.username = $scope.user.name;
  };

  //Set user as no longer bringing supply
  $scope.bailOnSupply = function (supply) {
    //Note: supply = {name, quantity, userEmail, username}

    $http({
            method: 'POST',
            url: 'bailOnSupply.php',
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
    console.log("Update Carpool: " + $scope.curEvent.isCarpooling + ", " + $scope.curEvent.numOpenSeats);
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

  //Determine carpooling directions to event.
  $scope.getDirections = function () {
    var locations = []; //Array of locations for driver's trip ([0] is their house, [last] is event location, everything in between is pickups. 

	if (!$scope.curEvent.isCarpooling) { //If driver is not carpooling, just return directions from his/her house to event.
		//Get logged in user's address. 
		$http({
			method: 'POST',
			url: 'getUserAddress.php',
			data: $.param({email:$scope.user.email}),  // pass in data as strings
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
		}).success(function (data) {
			console.log(data);
			var userAddress = data['userAddress']; 
			var eventAddress = $scope.curEvent.loc; 
			locations.push(userAddress); //Driver's address - Origin.
			locations.push(eventAddress); //Event's address - Destination. 
			calcRoute(locations); //Calculates and displays the route.
		});
	}
	else //Else, if person is carpooling, then have figure out carpooling calculations. 
	{	
		//TODO: Do carpooling calculation.
		//Determine if curUser is a driver or not.
		//If not driver, return user who is going to pick you up.
		
		$http({
			method: 'POST',
			url: 'Carpool.php',
			data: $.param({email: $scope.user.email, id: $scope.curEvent.ID}),  // pass in data as strings
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
		}).success(function (data) {
			console.log(data);
			for(index = 0; index < data['addresses'].length; index++) 
			{
				locations.push(data['addresses'][index]); //Push the next address. 
			}
			
			calcRoute(locations); //Calculates and displays the route.
		});
	}
	
    $scope.showMap = true;

  };

  /********************************************SUPPLIES EDITOR*******************************************************/

  //An array of supplies the user has chosen to remove from the event
  var removedSupplies = [];

  //An array of quantities the user has chosen to remove from the event
  var removedQuantities = [];

  //Called when a quantity's max value is changed
  $scope.quantityMaxUpdated = function (supply, index) {
    var quan = supply.quantities[index];

    //Force integer >= min
    if (quan.max == null)
      quan.max = quan.min;
    quan.max = Math.floor(quan.max);
    if (quan.max < quan.min) {
      quan.max = quan.min;
    } 

    //Cause next quantity to have min = max+1
    var len = supply.quantities.length;
    if (index < len - 1) {
      supply.quantities[index + 1].min = quan.max + 1;
      $scope.quantityMinUpdated(supply, index + 1);
    }
  };

  //Called when a quantity's min value is changed
  $scope.quantityMinUpdated = function (supply, index) {
    var quan = supply.quantities[index];
    if (quan.max < quan.min) {
      quan.max = quan.min;
      $scope.quantityMaxUpdated(supply, index);
    }
      
  };

  //Add a quantity to the given supply
  $scope.addQuantity = function (supply) {
    var len = supply.quantities.length;
    var prevQuan = supply.quantities[len - 1];

    supply.quantities.push({
      min: prevQuan.min + 1,
      max: SQL_MAX_INT,
      quantity: "",
      initMax: null,
      initMin: null,
      initQuantity: null
    });

    prevQuan.max = prevQuan.min;
  };

  //Removes the last quantity from the given supply
  $scope.removeQuantity = function (supply) {
    if (supply.quantities.length <= 1)
      return;

    var len = supply.quantities.length;
    var remQuan = supply.quantities[len - 1];
    var prevQuan = supply.quantities[len - 2];

    supply.quantities.splice(len - 1, 1);
    prevQuan.max = SQL_MAX_INT;

    //Add to 'removedQuantities' if from database
    if (remQuan.initMin !== null) {
      removedQuantities.push({
        name: supply.initName,
        min: remQuan.initMin
      });
    }
  };

  //Adds a new supply to the event
  $scope.addSupply = function () {
    $scope.fullSupplies.push({
      name: "",
      initName: null,
      quantities: [{
        min: 0,
        max: SQL_MAX_INT,
        quantity: "",
        initMin: null,
        initMax: null,
        initQuantity: null
      }]
    });
  };

  //Removes a supply and all its quantities from curEvent
  $scope.removeSupply = function () {
    var len = $scope.fullSupplies.length;
    if (len <= 0) return;

    var sup = $scope.fullSupplies[len - 1];

    //Remove supply from array
    $scope.fullSupplies.splice(len - 1, 1);

    //Add supply and quantities to 'removed' arrays
    if (sup.initName != null) {
      removedSupplies.push(sup.initName);
    }
  };

  //Saves the changes made to fullSupplies
  $scope.saveSupplyChanges = function () {
    //Validate all inputs filled in
    var allFilledIn = true;
    for (var i = 0; i < $scope.fullSupplies.length; i++) {
      var sup = $scope.fullSupplies[i];
      if (sup.name == null || sup.name == "") {
        allFilledIn = false;
        break;
      }
      for (var j = 0; j < sup.quantities.length; j++) {
        var quan = sup.quantities[j];
        if (quan.quantity == null || quan.quantity == "") {
          allFilledIn = false;
          break;
        }
        if (quan.max == null) {
          allFilledIn = false;
          break;
        }
      }
    }
	
	  if(!allFilledIn){
		  alert("You must fill in all fields");
		  return;
	  }

    //TODO: TEST Input changes into database

    //Update/Add everything in fullSupplies
    //  (initName = null && initMin = null) - Create new SupplyCount entry (name, min, max, quantity, $scope.curEvent.ID)
    //  (initName != null && initMin = null) - Update (initName, initMin, eventID) to (newName, initMin, max, quantity, eventID)
    //  (initName = null && initMin != null) - Can't happen
    //  (initName != null && initMin != null) - Update (initName, initMin, max, quantity, eventID)

    //Delete everything in removedQuantities (all guaranteed originally from database) {name, min}
    //  Delete anything in SupplyCount with (name, min, $scope.curEvent.ID)

    //Delete everything in removedSupplies (all guaranteed originally from database) [just an array of strings (name)]
    //  Delete anything in SupplyCount with (name, $scope.cureEvent.ID)

    //IN THAT ORDER
    $http({
      method: 'POST',
      url: 'updateSupplyList.php',
      data: $.param({supplies:$scope.fullSupplies, removedQuants: removedQuantities,  removedSupps: removedSupplies}),  // pass in data as strings
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success(function (data) {
      console.log(data);
    });

    $scope.curEventStatus = $scope.eventStatus.HOST; 
  };


  /********************************************GOOGLE MAPS***********************************************************/

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
    //Not sure what 3 lines below this do - seem useless. 
    //var control = document.getElementById('control');
    //control.style.display = 'block';
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  }

  //Calculate a route from locations[0] to locations[last] stopping at all intermediate locations and display it on map and direction panel.
  function calcRoute(locations) {
    var len = locations.length; //# of stops in total including destination and driver home. 
	
    var waypts = locations.slice(1, len - 1); //Array of all the intermediate stops i.e. the people that the driver will pick up. 
    var waypts2 = []; //Array containing waypoint objects that Google Maps API will use. 
	
	//Fill waypts2 array, which contains waypoint objects that Google Maps API will use. 
    for (var i = 0; i < waypts.length; i++) {
      waypts2.push({
        location: waypts[i],
        stopover: true
      });
    }
	
	console.log(locations);
    //Specifics of the route request to be sent to Google Maps API. 
    var request = {
      origin: locations[0],
      destination: locations[len - 1],
      waypoints: waypts2,
	  optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };

    //Call route() function with request and callback function to actual get the route. 
    directionsService.route(request,
    function (response, status) {
      if (status == google.maps.DirectionsStatus.OK)  {
        directionsDisplay.setDirections(response);
      }
    } //End of callback function. 
    ); //End of route() request.
  } //End of calcRoute()

  /********************************************PROFILE***************************************************************/

  //Switches the page to profile and loads in userData
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