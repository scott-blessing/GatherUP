
<?php
/*******************************************************Helper functions**********************************************************/

function findDriver($email, $peopleCarpooling)
{
	if ($peopleCarpooling[$email]['child'] == null)
		return $email;
	else 
		return findDriver($peopleCarpooling[$email]['child'], $peopleCarpooling);
}

function tree($tree, $leaves, &$peopleCarpooling, $event)
{
	$minval = 1000000;
	$leafEmail;
	$parentEmail;
	$newEmail;
	foreach((array)$leaves as $email=>$useless){
		foreach((array)$peopleCarpooling[$email]['dists'] as $adj => $dist){
			if($email!=$adj && $dist < $minval && $peopleCarpooling[$adj]['seats'] > $peopleCarpooling[$email]['height'] && !in_array($adj, $tree)){
				$minval = $dist;
				$leafEmail = $adj;
				$parentEmail = $email;
			}
		}
	}
	foreach((array)$event['dists'] as $adj=>$dist){
		if($dist < $minval && !in_array($adj, $tree)){
				$minval = $dist;
				$leafEmail = $adj;
				$parentEmail = null;
			}
	}
	if($minval==1000000)
		return;
	if($parentEmail != null){
		$peopleCarpooling[$leafEmail]['height'] = $peopleCarpooling[$parentEmail]['height']+1;
		$peopleCarpooling[$leafEmail]['parent'] = $parentEmail;
		$peopleCarpooling[$parentEmail]['child'] = $leafEmail;
		unset($leaves[$parentEmail]);
	}
	$leaves[$leafEmail] = null;
	array_push($tree, $leafEmail);
	tree($tree, $leaves, $peopleCarpooling, $event);
}

 
function distance($node1, $node2) 
{
	$r = 3963.1676; //Radius of the earth in miles.
	$lat1 = deg2rad($node1['lat']);
	$lon1 = deg2rad($node1['lon']);
	$lat2 = deg2rad($node2['lat']);
	$lon2 = deg2rad($node2['lon']);
	
	$distance = acos(sin($lat1)*sin($lat2) +
	cos($lat1)*cos($lat2)*cos($lon2-$lon1)) * $r;
	
	return $distance; 
}

//Variables to be used to connect to MySQL database.
$host = "engr-cpanel-mysql.engr.illinois.edu"; //Host name
$username = "vajpeyi2_dhruv"; //Mysql username
$password = "pass(1234)"; //Mysql password
$db_name = "vajpeyi2_gatherup"; //Database name

//Connect to server and select database.
$conn = mysqli_connect($host, $username, $password, $db_name) or die("cannot connect server ");
$data = array();

$email = $_POST['email']; //Email of user who is asking for directions calculation. 
$ID = $_POST['id']; //ID of event that we are figuring out carpooling calculation for. 

//SQL to get all the carpoolers of an event. 
$sql = "SELECT Email, Seats, Address, lat, lon, Username FROM Attends LEFT JOIN User ON UserEmail = Email WHERE EventId = $ID AND Carpool = 1";
$result = mysqli_query($conn, $sql);

$result2 = mysqli_fetch_array($result); //Tuple of someone who is carpooling.

$peopleCarpooling = array(); //Array of people who are carpooling.
while ($result2 != NULL) 
{
	$peopleCarpooling[$result2['Email']] = array('name'=>$result2['Username'],'seats'=>$result2['Seats'], 'height'=>0, 'lat'=>$result2['lat'], 'lon'=>$result2['lon'], 'address'=>$result2['Address'], 'child'=>null, 'parent'=>null, 'dists'=>array()); //Add this carpooler to the list of people carpooling.
	$result2 = mysqli_fetch_array($result); //Next tuple of someone carpooling.
}

//Get lat, lon, and address of event. 
$sql = "SELECT Location, lat, lon FROM Event WHERE id = $ID"; 
$data['sql']=$sql;
$result = mysqli_query($conn, $sql);
$result = mysqli_fetch_array($result);
$addressEvent = $result['Location']; 
$latEvent = $result['lat'];
$lonEvent = $result['lon'];
$event = array('address'=>$addressEvent, 'lat'=>$latEvent, 'lon'=>$lonEvent, 'dists'=>array());

//Loop through all the carpoolers, and set their distances to all the other carpoolers. 
foreach((array)$peopleCarpooling as $email1 => $carpooler1)
{
	foreach((array)$peopleCarpooling as $email2 => $carpooler2)
	{
		$distance = distance($carpooler1, $carpooler2);
		$peopleCarpooling[$email1]['dists'][$email2] = $distance;
	}	
	$distance = distance($carpooler1, $event);
	$event['dists'][$email1] = $distance;
}


$leaves = array();
$tree = array(); 
tree($tree, $leaves, $peopleCarpooling, $event);
$data['users'] = $peopleCarpooling;
$data['event'] = $event;


$child = $peopleCarpooling[$email]['child'];
$arrayOfAddresses = array();   

if ($child != null)
{
	$driverEmail = findDriver($child, $peopleCarpooling);
	$data['driver'] = $peopleCarpooling[$driverEmail]['name'];
}
else //Querying Carpooler is a driver, so have to return his route. 
{
	$currAddr = $peopleCarpooling[$email]['address'];
	array_push($arrayOfAddresses, $currAddr);

	$nextEmail = $peopleCarpooling[$email]['parent']; 
	while ($nextEmail != null)
	{	
		$currAddr = $peopleCarpooling[$nextEmail]['address'];
		array_push($arrayOfAddresses, $currAddr);
		$nextEmail = $peopleCarpooling[$nextEmail]['parent'];
	}
	array_push($arrayOfAddresses, $addressEvent);
}
$data['addresses'] = $arrayOfAddresses;
mysqli_close($conn);
echo(json_encode($data)); 





 
?>