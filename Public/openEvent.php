 <?php
//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name
$data = array();
//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server "); 
if ($_POST['ID'] && $_POST['email'])
	{
		// Create an Attends entry with the email and eventid. Add user as Guest
		$email = mysqli_real_escape_string($conn, $_POST['email']);
		$id = mysqli_real_escape_string($conn, $_POST['ID']);
		$data = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM Event WHERE ID = $id"));
		$hostEmail = $data['HostEmail']; 
		$host = mysqli_fetch_array(mysqli_query($conn, "SELECT Username FROM User WHERE Email = '$hostEmail'"));
		$data['hostName'] = $host['Username'];
		if($data['HostEmail'] != $email){
			$attend = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM Attends WHERE EventId = $id AND UserEmail = '$email'"));
			$data['isCarpooling'] = $attend['Carpool'];
			$data['numOpenSeats'] = $attend['Seats'];
			$data['status'] = max(0, $data['Status']);
		}
		else{
			$data['isCarpooling'] = 0;
			$data['numOpenSeats'] = 0;
			$data['status'] = 3;
		}
		mysqli_query($conn, "SELECT Email, Username, Status FROM Attends LEFT JOIN User ON Attends.UserEmail = User.Email WHERE Attends.EventID = $id");
	}
mysqli_close($conn);	
echo(json_encode($data));
?>
