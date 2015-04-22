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

		$result = mysqli_query($conn, "SELECT SupplyName AS Name, Quantity, MinAttendeesToNecessetate AS MinGuests, MaxAttendeesToNecessetate AS MaxGuests FROM SupplyCount WHERE EventID = $eventid ORDER BY SupplyName, MinAttendeesToNecessetate");
		$supply = mysqli_fetch_array($result);
		while ($supply != NULL) {
			array_push($data['supplies'], $supply);
			$supply = mysqli_fetch_array($result);
		}

		$data['success'] = true;
		$data['error'] = "";
		
	}
mysqli_close($conn);	
echo(json_encode($data));
?>