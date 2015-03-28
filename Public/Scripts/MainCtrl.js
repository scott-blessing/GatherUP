function MainCtrl($scope) {

  //An "enum" of the current page
  $scope.pageType = {
    HOME: 0,
    EVENTLIST: 1,
    EVENT: 2
  }

  //Determines the current page that the user sees
  $scope.curPageType = $scope.pageType.HOME;

  //Data collected by the sign in form
  $scope.signinData = {
    username: "",
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

  //All of the events that should be displayed on the event list screen
  $scope.events = {
    hostedEvents: [{
      ID: 0,
      name: "BBQ Gala",
      date: "5/18/2015",
      loc: "507 Abc Street, Urbana IL"
    },
    {
      ID: 1,
      name: "CS 461 Presentation",
      date: "4/5/2015",
      loc: "Siebel Center"
    },
    {
      ID: 2,
      name: "Dhruv's Death",
      date: "3/28/2015",
      loc: "1517 Thornwood Dr, Downers Grove IL"
    }],
    attendEvents: [{
      ID: 3,
      name: "Chris B-day",
      date: "4/22/2015",
      loc: "507 Defg Street, Urbana IL"
    },
    {
      ID: 4,
      name: "CS 411 Procrastination",
      date: "6/6/2015",
      loc: "Cocomero"
    }],
    inviteEvents: [
      {
        ID: 6,
        name: "Dhruv's Funeral",
        date: "3/29/2015",
        loc: "5830 Kirby Ave, Champaign IL"
      }
    ],
    localEvents: [{
      ID: 5,
      name: "Sewing Club 17th annual Make-Your-Own-Sleepingbag Sleepover Extravaganza",
      date: "12/26/2015",
      loc: "Daddy's O Pub"
    }]
  };

/********************************************NAVBAR***************************************************************/

  //Called when the user chooses log out
  $scope.logOut = function () {
    $scope.curPageType = $scope.pageType.HOME;
    $scope.user = null;
  }


/********************************************HOME***************************************************************/

  //Called when the user presses the login button
  $scope.logIn = function () {
    //TODO: Validate $scope.signin against DB
    //If valid set $scope.user with DB info

    $scope.curPageType = $scope.pageType.EVENTLIST;
    $scope.user = {
      name: $scope.signinData.username
    };

    $scope.signinData = {
      username: "",
      password: ""
    };
  };

  //Called when the user presses the register button
  $scope.register = function () {
    //TODO: Validate, check for collisions, and create in DB

    if ($scope.registerData.password1 === $scope.registerData.password2) {
      $scope.curPageType = $scope.pageType.EVENTLIST;
      $scope.user = { name: $scope.register.username };
    }

    $scope.registerData = {
      username: "",
      password1: "",
      password2: "",
      email: "",
      address: ""
    };
  };

  /********************************************EVENT LIST***************************************************************/

  //Deletes the event with the given ID from the database
  $scope.deleteEvent = function (angEvent, eventID) {
    angEvent.preventDefault();
    angEvent.stopPropagation();

    //TODO: this
    alert("Not Implemented - DeleteEvent(" + eventID + ")");
  };

  //Causes the current user to no longer be attending the given event
  $scope.unattendEvent = function (angEvent, eventID) {
    angEvent.preventDefault();
    angEvent.stopPropagation();

    //TODO: this
    alert("Not Implemented - UnattendEvent(" + eventID + ")");
  };

  //Triggers an event creation dialog for the user
  $scope.createNewEvent = function () {
    //TODO: Trigger a dialog/model/div to create a new event
    alert("Not Implemented - CreateNewEvent()");
  };

  //Signs the user up as a guest to the given event
  $scope.attendEvent = function (angEvent, eventID) {
    angEvent.preventDefault();
    angEvent.stopPropagation();

    //TODO: this
    alert("Not Implemented - AttendEvent(" + eventID + ")");
  };

  //Sends the user to the event page of the given event
  $scope.openEventPage = function (eventID) {
    //TODO: this
    alert("Not Implemented - OpenEventPage(" + eventID + ")");
  };

  /********************************************EVENT***************************************************************/



}