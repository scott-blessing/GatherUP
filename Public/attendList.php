<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "gatherup_user"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "gatherup_vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
$data = array();


$username = mysqli_real_escape_string($conn, $_POST['name']); 
$email = mysqli_real_escape_string($conn, $_POST['email']); 
$result = mysqli_query($conn, "SELECT ID, Name, Date, Location, Status FROM Attends LEFT JOIN Events ON EventId = ID WHERE UserEmail='".$email."'");
$event = mysqli_fetch_array($result);
while($event != NULL){
	array_push($data, $event);
	$event = mysqli_fetch_array($result);
}

mysqli_close($conn);
echo(json_encode($data));
	
	
	
	


?>