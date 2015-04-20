<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
if ($_POST['ID'] && $_POST['email'])
	{
		// Create an Attends entry with the email and eventid. Add user as Guest
		$email=mysqli_real_escape_string($conn, $_POST['email']);
		$id=mysqli_real_escape_string($conn, $_POST['ID']);
		$check = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `Attends` WHERE UserEmail='$email' AND EventId=$id"));
		if($check != NULL)
			mysqli_query($conn, "UPDATE Attends SET Status = Status*-1 WHERE EventId=$id AND UserEmail='$email'");
		else
			mysqli_query($conn, "INSERT INTO Attends (UserEmail, EventId, Carpool, Seats, Status) VALUES ('$email', $id, 0, 0, 1)");
	}
mysqli_close($conn);	
?>
