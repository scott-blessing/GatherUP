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
$data['error']=$_POST['ID'];
if ($_POST['ID'])
	{
		$id = mysqli_real_escape_string($conn, $_POST['ID']);
		$name = mysqli_real_escape_string($conn, $_POST['name']);
		$loc = mysqli_real_escape_string($conn, $_POST['loc']);
		$startTime = mysqli_real_escape_string($conn, $_POST['start']);
		$endTime = mysqli_real_escape_string($conn, $_POST['end']);
		$desc = mysqli_real_escape_string($conn, $_POST['desc']);
		$isPublic = mysqli_real_escape_string($conn, $_POST['isPublic']);
		mysqli_query($conn, "UPDATE Event SET Name = '$name',  Location = '$loc', StartTime = '$startTime', EndTime = '$endTime', Description = '$desc', isPublic = $isPublic");
	}
mysqli_close($conn);	
echo(json_encode($data));
?>