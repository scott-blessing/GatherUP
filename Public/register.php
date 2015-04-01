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
if ($_POST['username'] && $_POST['password1'])
	{
		$username = mysqli_real_escape_string($conn, $_POST['username']);
		$password1 = mysqli_real_escape_string($conn, hash("sha512", $_POST['password1']));
		$password2 = mysqli_real_escape_string($conn, hash("sha512", $_POST['password2']));
		$email = mysqli_real_escape_string($conn, $_POST['email']);
		$address = mysqli_real_escape_string($conn, $_POST['address']);
		
		
		$check = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `User` WHERE Username='".$username."'"));
		if ($check != null){
			$data['success'] = false;
			$data['error'] = "Username already exists.";
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
			mysqli_query($conn, "INSERT INTO User (Email, Password, Address, Username) VALUES ('".$email."','".$password1."','".$address."','".$username."')");
			$data['success']=true;
			$data['email']=$email;
		}
	}
mysqli_close($conn);	
echo(json_encode($data));
?>