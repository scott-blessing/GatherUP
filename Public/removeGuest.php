<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 


//Deletes an attends entry where for a user and an event.
$eventID = mysqli_real_escape_string($conn, $_POST['eventID'];
$attendeeEmail = mysqli_real_escape_string($conn, $_POST['attendeeEmail']; 

$sql = "DELETE FROM `Attends` WHERE `EventID` =  $eventID AND `UserEmail` = $attendeeEmail";
mysqli_query($conn, $sql);


//STUFF - '".$_POST['ID']"' AND email = '".$_POST['email']"'"


mysqli_close($conn);	
echo(json_encode($data));
?>