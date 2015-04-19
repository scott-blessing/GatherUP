<?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server ");
$data = array();

$commentID = $_POST['commentID'];
$sql = "DELETE FROM `Comment` WHERE ID = $commentID";
$result = mysqli_query($conn, $sql); //Querying the database.

//Random shit below.
/*
 $sql = "SELECT UserEmail FROM Comment WHERE ";
 $result = mysqli_query($conn, $sql); //Querying the database.

 $emailOfCommenter =
 $commentID = $_POST['commentID'];

 if ($_POST['email'] != $emailOfCommenter) //If the host is the one deleting the email.
 {

 }
 else
 {

 }
*/
?>