<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
$data = array();


$username = mysqli_real_escape_string($conn, $_POST['name']); 
$email = mysqli_real_escape_string($conn, $_POST['email']); 
$result = mysqli_query($conn, "SELECT * FROM `Event` WHERE HostEmail='".$email."'");
$event = mysqli_fetch_array($result);
while($event != NULL){
	array_push($data, $event);
	$event = mysqli_fetch_array($result);
}

mysqli_close($conn);
echo(json_encode($data));
	
	
	
	


?>