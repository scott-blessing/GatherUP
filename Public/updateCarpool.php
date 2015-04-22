<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server ");

$data = array();
$data['success'] = false;
$data['error'] = "Invalid parameters";

if ($_POST['email'] && $_POST['eventid'] && $_POST['isCarpooling'] && $_POST['numOpenSeats'])
{
	$email = mysqli_real_escape_string($conn, $_POST['email']);
	$eventid = mysqli_real_escape_string($conn, $_POST['eventid']);
	$isCarpooling = mysqli_real_escape_string($conn, $_POST['isCarpooling']);
	$numOpenSeats = mysqli_real_escape_string($conn, $_POST['numOpenSeats']);

	mysqli_query($conn, "UPDATE Attends SET Carpool = $isCarpooling, Seats = $numOpenSeats WHERE UserEmail = '$email' AND EventID = $eventid");
	
	$data['success'] = true;
	$data['error'] = "";
}


mysqli_close($conn);
echo(json_encode($data));
?>