<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "gatherup_user"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "gatherup_vajpeyi2_gatherup"; //Database name
$tbl_name = "User"; //Table name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server ");

if ($_POST['email'])
	{
		mysqli_query($conn, "DELETE FROM User WHERE Email='".$_POST['email']."'");
		mysqli_query($conn, "DELETE FROM Event WHERE HostEmail='".$_POST['email']."'");
	}
?>