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
if ($_POST['name'] || $_POST['password1'])
	{
		$username = mysqli_real_escape_string($conn, $_POST['name']);
		$password1 = mysqli_real_escape_string($conn, hash("sha512", $_POST['password1']));
		$password2 = mysqli_real_escape_string($conn, hash("sha512", $_POST['password2']));
		$email = mysqli_real_escape_string($conn, $_POST['email']);
		$address = mysqli_real_escape_string($conn, $_POST['addr']);
		
		
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
			mysqli_query($conn, "UPDATE `User` SET Password='".$password1."' WHERE Email='".$email."'");
			mysqli_query($conn, "UPDATE `User` SET Address='".$address."' WHERE Email='".$email."'");
			mysqli_query($conn, "UPDATE `User` SET Username='".$username."' WHERE Email='".$email."'");
			$data['success']=true;
		}
		
	}
	
echo(json_encode($data));
?>