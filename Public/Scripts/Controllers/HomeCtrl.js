function HomeCtrl($scope) {

  $scope.pageType = {
    HOME: 0,
    EVENTLIST: 1,
    EVENT: 2
  }

  $scope.curPageType = $scope.pageType.HOME;

  $scope.user = null;

  $scope.events = {
    hostedEvents: [{
      name: "BBQ Gala",
      date: "5/18/2015",
      loc: "507 Abc Street, Urbana IL"
    },
    {
      name: "CS 461 Presentation",
      date: "4/5/2015",
      loc: "Siebel Center"
    },
    {
      name: "Dhruv's Death",
      date: "3/28/2015",
      loc: "1517 Thornwood Dr, Downers Grove IL"
    }],
    attendEvents: [{
      name: "Chris B-day",
      date: "4/22/2015",
      loc: "507 Defg Street, Urbana IL"
    },
    {
      name: "CS 411 Procrastination",
      date: "6/6/2015",
      loc: "Cocomero"
    }],
    localEvents: []/*[{
      name: "SigGraph PicNic",
      date: "4/22/2015",
      loc: "507 Hijk Street, Urbana IL"
    },
    {
      name: "CS 411 Beer Speech",
      date: "3/31/2015",
      loc: "Siebel Center"
    }]*/
  };





  $scope.logOut = function () {
    $scope.curPageType = $scope.pageType.HOME;
    $scope.user = null;
  }
}