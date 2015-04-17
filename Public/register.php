<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name
$tbl_name = "User"; //Table name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server ");
$data = array();
$data['success']=false;
$data['error']="Invalid email";
if ($_POST['email'] && $_POST['password1'])
	{
		$username = mysqli_real_escape_string($conn, $_POST['username']);
		$password1 = mysqli_real_escape_string($conn, hash("sha512", $_POST['password1']));
		$password2 = mysqli_real_escape_string($conn, hash("sha512", $_POST['password2']));
		$email = mysqli_real_escape_string($conn, $_POST['email']);
		$address = mysqli_real_escape_string($conn, $_POST['address']);
		$url = urlencode($address);
		$request_url = "http://maps.googleapis.com/maps/api/geocode/xml?address=".$url."&sensor=true";
		$xml = simplexml_load_file($request_url) or die("url not loading");
		$status = $xml->status;
		$Lat = 0.0;
		$Lon = 0.0;
		if ($status=="OK") {
			$Lat = $xml->result->geometry->location->lat;
			$Lon = $xml->result->geometry->location->lng;
		}
		
		$check = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `User` WHERE Email='".$email."'"));
		if ($check != null){
			$data['success'] = false;
			$data['error'] = "Email already exists.";
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
		else
		if($password1 != $password2){
			$data['success'] = false;
			$data['error'] = "Passwords do not match.";
		}
		else{
			mysqli_query($conn, "INSERT INTO `User` (`Email`, `Password`, `Address`, `Username`, `lat`, `long`) VALUES ('".$email."','".$password1."','".$address."','".$username."', ".strval($Lat).", ".strval($Lon).")");
			$data['success']=true;
			$data['email']=$email;
			$data['error'] = "INSERT INTO 'User' ('Email', 'Password', 'Address', 'Username', 'lat', 'long') VALUES ('".$email."','".$password1."','".$address."','".$username."', ".strval($Lat).", ".strval($Lon).")";
		}
	}
mysqli_close($conn);	
echo(json_encode($data));
?>