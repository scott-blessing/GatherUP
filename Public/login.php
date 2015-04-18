<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
$data = array();

if ($_POST['email'] && $_POST['password'])
	{
		$email = mysqli_real_escape_string($conn, $_POST['email']); 
		$password = mysqli_real_escape_string($conn, hash("sha512", $_POST['password']));
		$user = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `User` WHERE Email='".$email."'"));
		
		if ($user == null){
                        $data['success']=false;
                        $data['error']="Email does not exist";
                }
		else
		if ($user['Password'] != $password){
                        $data['success']=false;
                        $data['error']="Wrong password";
                }
		else{
			$email = $user['Email'];
               		$data['success']=true;
               		$data['email']=$email;
               		$data['username']=$user['Username'];
		}

	}
	
echo(json_encode($data));
mysqli_close($conn);
?>