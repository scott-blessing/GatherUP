<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
$data = array();
$data['log'] = "Invalid POST";
//TODO: get email from user in JS
if ($_POST['ID'] && $_POST['email'])
	{
		$id=mysqli_real_escape_string($conn, $_POST['ID']);
		$email=mysqli_real_escape_string($conn, $_POST['email']);
		mysqli_query($conn, "DELETE FROM Attends WHERE UserEmail = '".$email."' AND EventID = '".$id."'");
		$data['log'] = "DELETE FROM Attends WHERE UserEmail = '".$_POST['email']."' AND EventID = '".$_POST['ID']."'";
	}
mysqli_close($conn);	
echo(json_encode($data));
?>