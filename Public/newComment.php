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
$data['error']=$_POST['id'];
if ($_POST['email'] && $_POST['id'])
	{
		$email = mysqli_real_escape_string($conn, $_POST['email']);
		$eventid = mysqli_real_escape_string($conn, $_POST['id']);
		$time = date('Y-m-d H:i:s', time());
		$text = mysqli_real_escape_string($conn, $_POST['text']);
		$result = mysqli_fetch_array(mysqli_query($conn, "SELECT Max(`ID`) AS `maxId` FROM `Comment`"));
		$id=1;
		if($result['maxId']!=NULL)
			$id = $result['maxId']+1;
		mysqli_query($conn, "INSERT INTO Comment (`ID`, `Text`, `Time`, `EventId`, `UserEmail`) VALUES ($id, '$text', '$time', $eventid, '$email')");
		$data['error']="INSERT INTO Comment (`ID`, `Text`, `Time`, `EventId`, `UserEmail`) VALUES ($id, '$text', '$time', $eventid, '$email')";
		$data['id'] = $id;
	}
mysqli_close($conn);	
echo(json_encode($data));
?>