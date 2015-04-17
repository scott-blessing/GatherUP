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
if ($_POST['password1'] && $_POST['password2'])
	{
		$password1 = mysqli_real_escape_string($conn, hash("sha512", $_POST['password1']));
		$password2 = mysqli_real_escape_string($conn, hash("sha512", $_POST['password2']));
		$email = mysqli_real_escape_string($conn, $_POST['email']);
		
		
		if ($password1 != $password2){
			$data['success'] = false;
			$data['error'] = "Passwords do not match.";
		}
		else{
			mysqli_query($conn, "UPDATE `User` SET Password='".$password1."' WHERE Email='".$email."'");
			$data['success']=true;
		}
		
	}
	
echo(json_encode($data));
?>