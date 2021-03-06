<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
$data = array();
$data['success']=false;
$data['error']="Invalid parameters";
$data['supplies'] = array();

if ($_POST['eventid'])
	{
		$eventid = mysqli_real_escape_string($conn, $_POST['eventid']);
		$attendeesQuery = mysqli_query($conn, "SELECT COUNT(UserEmail) AS numAttendees FROM Attends WHERE EventID = $eventid");
		$numAttendees = mysqli_fetch_array($attendeesQuery);
		$numAttendees = $numAttendees['numAttendees'];

		$result = mysqli_query($conn, "SELECT SupplyName, Quantity, UserEmail, Username FROM SupplyCount S 
				LEFT JOIN Bringing B ON S.EventID = B.EventID AND SupplyName = SuppliesName
				LEFT JOIN User ON UserEmail = Email 
				WHERE S.EventID=$eventid AND MinAttendeesToNecessetate <= $numAttendees AND MaxAttendeesToNecessetate >= $numAttendees");
		$supplies = mysqli_fetch_array($result);
		while ($supplies != NULL) {
			array_push($data['supplies'], $supplies);
			$supplies = mysqli_fetch_array($result);
		}

		$data['success'] = true;
		$data['error'] = "";
		
	}
mysqli_close($conn);	
echo(json_encode($data));
?>