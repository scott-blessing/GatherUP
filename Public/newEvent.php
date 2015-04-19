<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
$data = array();
if($_POST['email']){
	$email = mysqli_real_escape_string($conn, $_POST['email']);
	$id=1;
	$result = mysqli_fetch_array(mysqli_query($conn, "SELECT Max(`ID`) AS `maxId` FROM `Event`"));
	if($result['maxId']!=NULL)
		$id = $result['maxId']+1;
	mysqli_query($conn, "INSERT INTO Event (ID, HostEmail)  VALUES ($id, '$email')");
	$data['id'] = $id;
}

mysqli_close($conn);
echo(json_encode($data));
	
	
	
	


?>