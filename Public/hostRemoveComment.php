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
		
		mysqli_query($conn, "UPDATE Comment SET Text = '[Removed By Host]' WHERE ID = $id");
		$data['log'] = $id;
	}
mysqli_close($conn);	
echo(json_encode($data));
?>