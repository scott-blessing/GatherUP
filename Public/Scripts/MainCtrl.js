function MainCtrl($scope) {

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
    HOST: 3,    //Able to remove comments
    HOSTEDIT: 4 //Edit event details
  };

  //Determines the current page that the user sees
  $scope.curPageType = $scope.pageType.HOME;

  //Determines how the event page appears
  $scope.curEventStatus = $scope.eventStatus.GUEST;

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
      date: "5/18/2015",
      loc: "507 Abc Street, Urbana IL",
      status: $scope.eventStatus.HOST
    },
    {
      ID: 1,
      name: "CS 461 Presentation",
      date: "4/5/2015",
      loc: "Siebel Center",
      status: $scope.eventStatus.HOST
    },
    {
      ID: 2,
      name: "Dhruv's Death",
      date: "3/28/2015",
      loc: "1517 Thornwood Dr, Downers Grove IL",
      status: $scope.eventStatus.HOST
    }],
    attendEvents: [{
      ID: 3,
      name: "Chris B-day",
      date: "4/22/2015",
      loc: "507 Defg Street, Urbana IL",
      status: $scope.eventStatus.ADMIN
    },
    {
      ID: 4,
      name: "CS 411 Procrastination",
      date: "6/6/2015",
      loc: "Cocomero",
      status: $scope.eventStatus.GUEST
    }],
    inviteEvents: [
      {
        ID: 6,
        name: "Dhruv's Funeral",
        date: "3/29/2015",
        loc: "5830 Kirby Ave, Champaign IL",
        status: $scope.eventStatus.VIEWER
      }
    ],
    localEvents: [{
      ID: 5,
      name: "Sewing Club 17th annual Make-Your-Own-Sleepingbag Sleepover Extravaganza",
      date: "12/26/2015",
      loc: "Daddy's O Pub",
      status: $scope.eventStatus.VIEWER
    }]
  };

  //Data of the currently selected event (this must be populated from the DB)
  $scope.curEvent = {
    ID: 0,
    name: "BBQ Gala",
    loc: "507 Abc Street, Urbana IL",
    startTime: new Date("May 18, 2015 17:00:00"),
    endTime: new Date("May 18, 2015 23:00:00"),
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt, erat nec tempus dictum, arcu est pulvinar arcu, id gravida ipsum nisl eu metus. Proin mauris enim, luctus id ante vitae, blandit ultricies orci. In non metus non sem ultrices pharetra. Suspendisse faucibus eu augue id efficitur. Aliquam eget nunc ut eros posuere semper. Proin scelerisque libero urna, sit amet maximus diam congue non. Cras efficitur augue in orci tempus ultricies in et metus. Donec non posuere nisl, vel commodo augue. Nulla massa odio, fringilla et consectetur at, ultrices nec leo. Nullam turpis felis, interdum at volutpat ut, eleifend in lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris quis volutpat lorem, ullamcorper rutrum ipsum.  Praesent condimentum maximus tempus. Cras maximus odio in mauris suscipit ullamcorper. Morbi quis fringilla turpis. Nullam accumsan at metus et rhoncus. Morbi dictum neque sagittis lacus tempor, vel condimentum eros luctus. Sed molestie pharetra porta. Etiam tincidunt felis quis erat condimentum sodales. Vivamus dictum, est at vestibulum accumsan, odio magna convallis lorem, eu rhoncus ipsum felis et ante. Aliquam ultrices risus ut dolor dignissim, ac aliquet mi egestas. Mauris eget tellus venenatis, placerat eros nec, suscipit urna. Curabitur imperdiet vehicula tellus, eget placerat turpis tempor blandit. Cras at lectus tortor.  Fusce convallis pulvinar vehicula. Vivamus fringilla dui ac velit eleifend malesuada. Nunc pellentesque tempor turpis. In metus dui, ultricies ut ipsum at, porta semper turpis. Donec eget risus ut urna placerat commodo. Suspendisse sed est dui. Nunc euismod dolor malesuada ornare feugiat. Phasellus at semper nunc. Maecenas urna ex, rhoncus vel auctor quis, efficitur vitae magna. Cras eleifend tempus magna, eu laoreet lectus mattis quis. Praesent tempus nisi nec justo molestie vestibulum. Cras id pretium mauris, a interdum augue. Suspendisse eros arcu, tincidunt vitae nibh et, dictum accumsan eros. Sed laoreet felis venenatis, maximus sapien nec, facilisis felis. Cras ac aliquam arcu, vel mattis tellus.",
    hostName: "Jill Vance",
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
  }


/********************************************HOME***************************************************************/

  //Called when the user presses the login button
  $scope.logIn = function () {
    //TODO: Validate $scope.signin against DB
    //If valid set $scope.user with DB info

    $scope.curPageType = $scope.pageType.EVENTLIST;
    $scope.user = {
      name: $scope.signinData.username,
      email: "example@dummydata.net"
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
      $scope.user = {
        name: $scope.registerData.username,
        email: $scope.registerData.email
      };
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
  $scope.openEventPage = function (status, eventID) {
    //TODO: this
    alert("Not Implemented - OpenEventPage(" + status + "," + eventID + ")");

    $scope.curPageType = $scope.pageType.EVENTVIEW;
    $scope.curEventStatus = status;
  };

  /********************************************EVENT VIEW***************************************************************/

  //Propts the user for comment text, then creates the comment
  $scope.createComment = function () {
    //TODO: this
    alert("Not Implemented - CreateComment()");
  };

  //Delete the given comment - if the comment's user email doesn't match user.email, don't delete but replace text with "[removed by host]"
  $scope.deleteComment = function (commentID) {
    //TODO: This
    alert("Not Implemented - DeleteComment(" + commentID + ")");
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

  /********************************************PROFILE***************************************************************/

  //Swithches the page to profile and loads in userData
  $scope.loadProfilePage = function () {

    //TODO: Define this from database
    $scope.userData = {
      name: $scope.user.name,
      email: $scope.user.email,
      password1: "",
      password2: "",
      addr: ""
    };

    $scope.curPageType = $scope.pageType.PROFILE;
  };

  //Save changes to profile as indicated by $scope.userData
  $scope.saveProfileChanges = function () {
    //TODO: This
    alert("Not Implemented - SaveProfileChanges()");
  };
}