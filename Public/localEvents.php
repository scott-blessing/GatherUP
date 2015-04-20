<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server ");
$data = array();

$userEmail = mysqli_escape_string($conn, $_POST['email']);
$rad = $_POST['radius']; //Radius (in miles) within we'll search for public events.

//Getting latitude of the user looking for local events. 
$sql = "SELECT lat FROM `User` WHERE `Email` = '$userEmail'";
$result = mysqli_query($conn, $sql);
$lat = mysqli_fetch_array($result);
$lat = $lat['lat'];

//Getting longitude of the user looking for local events. 
$sql = "SELECT lon FROM `User` WHERE `Email` = '$userEmail'";  
$result = mysqli_query($conn, $sql);
$lon = mysqli_fetch_array($result);
$lon = $lon['lon'];



$r = 3963.1676; //Radius of the earth in miles.  
$sql = "SELECT * FROM `Event` WHERE acos(sin(radians($lat))*sin(radians(lat)) + 
cos(radians($lat))*cos(radians(lat))*cos(radians(lon)-radians($lon))) * $r < $rad"; //Selecting event IDs of public events near you.
$result = mysqli_query($conn, $sql);
$nearbyEvent = mysqli_fetch_array($result);

while($nearbyEvent != NULL){
	//If the found nearby event is hosted by the user or if the user is already attending it, or if it's already over. 
	if (strcmp($nearbyEvent['HostEmail'], $userEmail) != 0)
	{
		$nearbyEventID = $nearbyEvent['ID'];
		$sql = "SELECT * FROM `Attends` WHERE `EventId` = $nearbyEventId AND `UserEmail` = '$userEmail'";
		$result = mysqli_query($conn, $sql);
		$userAlreadyAttendingFlag = mysqli_fetch_array($result);
		if (userAlreadyAttendingFlag == NULL)
		{
			$endTimeOfNearbyEvent = $nearbyEvent['EndTime'];
			$currTime = date('Y-m-d H:i:s', time());
			if ($endTimeOfNearbyEvent > $currTime)
			{
				array_push($data, $nearbyEvent); //Display the event.
			}
		}	
		
	}
	$nearbyEvent = mysqli_fetch_array($result); //Get next nearby event.

	
}



mysqli_close($conn);
echo(json_encode($data));

/*
 //Getting list of all local events.
 $sql = "SELECT lat FROM `Event` WHERE isPublic = 1";
 $result = mysqli_query($conn, $sql);
 $listOfPublicLat = mysqli_fetch_array($result);

 $sql = "SELECT lon FROM `Event` WHERE isPublic = 1";
 $result = mysqli_query($conn, $sql);
 $listOfPublicLon = mysqli_fetch_array($result);
 */
?>