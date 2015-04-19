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
		if($isPublic){
			$isPublic = 1;
		}
		else
			$isPublic = 0;
		$url = urlencode($loc);
		$request_url = "http://maps.googleapis.com/maps/api/geocode/xml?address=".$url."&sensor=true";
		$xml = simplexml_load_file($request_url) or die("url not loading");
		$status = $xml->status;
		if ($status == "OK")
		{
			//Output to the user that they inputted an invalid address. 
			$data['success'] = false;
			$data['error'] = "Invalid address.";
			$lat = $xml->result->geometry->location->lat;
			$lon = $xml->result->geometry->location->lng;
			mysqli_query($conn, "UPDATE Event SET Name = '$name',  Location = '$loc', StartTime = '$startTime', EndTime = '$endTime', Description = '$desc', isPublic = $isPublic, Lat = $lat, Lon = $lon WHERE ID = $id");
		}
	}
mysqli_close($conn);	
echo(json_encode($data));
?>