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

if ($_POST['ID'] && $_POST['email'])
	{
		$email = mysqli_real_escape_string($conn, $_POST['email']);
		$eventid = mysqli_real_escape_string($conn, $_POST['ID']);

		$check = mysqli_query($conn, "SELECT FROM User WHERE email = '$email'");

		if($check==null)
		{
			$data['success'] = false;
			$data['error'] = "Email does not exist.";
		}
		else
		{
			mysqli_query($conn, "INSERT INTO 'Attends' ('EventId','Email','Status') VALUES ('$eventid','$email','-2')");
			$data['success'] = true;
		}
		
	}
mysqli_close($conn);
echo(json_encode($data));
?>