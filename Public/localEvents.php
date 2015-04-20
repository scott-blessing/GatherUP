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
/*
//Getting list of all local events. 
$sql = "SELECT lat FROM `Event` WHERE isPublic = 1";
$result = mysqli_query($conn, $sql);
$listOfPublicLat = mysqli_fetch_array($result); 

$sql = "SELECT lon FROM `Event` WHERE isPublic = 1";
$result = mysqli_query($conn, $sql);
$listOfPublicLon = mysqli_fetch_array($result);
*/
$r = 3963.1676; //Radius of the earth in miles.
$rad = 50; //Radius (in miles) within we'll search for public events.  
$sql = "SELECT * FROM `Event` WHERE acos(sin(radians($lat))*sin(radians(lat)) + 
cos(radians($lat))*cos(radians(lat))*cos(radians(lon)-radians($lon))) * $r < $rad"; //Selecting event IDs of public events near you.
$result = mysqli_query($conn, $sql);
$nearbyEvent = mysqli_fetch_array($result);

while($nearbyEvent != NULL){
	array_push($data, $nearbyEvent);
	$nearbyEvent = mysqli_fetch_array($result);
}



mysqli_close($conn);
echo(json_encode($data));
?>