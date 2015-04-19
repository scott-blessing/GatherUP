<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 

if ($_POST['email'] && $_POST['id'])
	{
		// deletes an attends entry where for a user and an event
		mysqli_query($conn, "DELETE FROM Attends WHERE eventid = '".$_POST['ID']"' AND email = '".$_POST['email']"'" );
	}

?>