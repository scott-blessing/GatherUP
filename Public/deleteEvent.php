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
if ($_POST['ID'])
	{
		$id = mysqli_real_escape_string($conn, $_POST['ID']);
		mysqli_query($conn, "DELETE FROM Event WHERE ID=".$id);
		$data['log'] = "DELETE FROM Event WHERE ID=".$id;
	}
mysqli_close($conn);	
echo(json_encode($data));
?>