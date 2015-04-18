<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "gatherup_user"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "gatherup_vajpeyi2_gatherup"; //Database name
$tbl_name = "User"; //Table name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server ");
$data = array();
$data['success']=false;
if ($_POST['name'] && $_POST['addr'])
	{
		$username = mysqli_real_escape_string($conn, $_POST['name']);
		$email = mysqli_real_escape_string($conn, $_POST['email']);
		$address = mysqli_real_escape_string($conn, $_POST['addr']);
		$url = urlencode($address);
		$request_url = "http://maps.googleapis.com/maps/api/geocode/xml?address=".$url."&sensor=true";
		$xml = simplexml_load_file($request_url) or die("url not loading");
		$status = $xml->status;
		if ($status != "OK")
		{
			//Output to the user that they inputted an invalid address.
			$data['success'] = false;
			$data['error'] = "Invalid address.";
		}
		else
		if (!ctype_alnum($username)){
			$data['success'] = false;
			$data['error'] = "Username contains invalid characters. Only use numbers and letters please.";
		}
		else
		if (strlen($username) > 20){
			$data['success'] = false;
			$data['error'] = "Username must be less than 20 characters long.";
		}
		else{
			$Lat = $xml->result->geometry->location->lat;
			$Lon = $xml->result->geometry->location->lng;
			mysqli_query($conn, "UPDATE `User` SET Address='".$address."' WHERE Email='".$email."'");
			mysqli_query($conn, "UPDATE `User` SET Username='".$username."' WHERE Email='".$email."'");
			mysqli_query($conn, "UPDATE `User` SET lat=".strval($Lat)." WHERE Email='".$email."'");
			mysqli_query($conn, "UPDATE `User` SET `long`=".strval($Lon)." WHERE Email='".$email."'");
			$data['success']=true;
		}
		
	}
	
echo(json_encode($data));
?>