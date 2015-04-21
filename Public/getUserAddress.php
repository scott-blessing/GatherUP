<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server ");

$data = array();

$userEmail = $_POST['email']; 

$sql = "SELECT Address FROM `User` WHERE email = '$userEmail'";
$result = mysqli_query($conn, $sql);

$userAddress = mysqli_fetch_array($result); 
$userAddress =  $userAddress['Address']; 

$data['userAddress'] = $userAddress;

mysqli_close($conn);
echo(json_encode($data));
?>