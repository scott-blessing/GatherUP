<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "gatherup_user"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "gatherup_vajpeyi2_gatherup"; //Database name
$tbl_name = "User"; //Table name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
$data = array();


	$username = mysqli_real_escape_string($conn, $_POST['name']); 
	$email = mysqli_real_escape_string($conn, $_POST['email']); 
	
	$user = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `User` WHERE username='".$username."'"));
	
	$password = $user['Password'];
	$address = $user['Address'];
	
	$data['address'] = $address;
	
	
	mysqli_close($conn);
	echo(json_encode($data));
	
	
	
	


?>