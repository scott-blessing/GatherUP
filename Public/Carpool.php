
<?php
/*******************************************************Helper functions**********************************************************/

function findDriver($child)
{
	if ($child->child == null)
		return $child;
	else 
		return findDriver($child->child);
}

function tree($tree, $leaves, $data)
{
	$minval = 1000000;
	$newLeaf;
	$index;
	$newEmail;
	$data['tree']=true;
	for($i=0; $i<sizeof($leaves); $i++){
		$leaf = $leaves[i];
		foreach((array)$leaf->otherCarpoolers as $email => $carpooler){
			if($carpooler[1] < $minval && $carpooler[0]->myNumOfSeats > $leaf->height && !in_array($email, $tree)){
				$minval = $carpooler[1];
				$newLeaf = $carpooler[0];
				$index = $i;
				$newEmail = $email;
				$data['found']=true;
			}
		}	
	}
	if($minval==1000000)
		return;
	$newLeaf->height = $leaves[$index]->height+1;
	$newLeaf->parent = $leaves[$index];
	$leaves[$index]->child = $newLeaf; 
	if($index!=0)
		unset($leaves[$index]);
	array_push($leaves, $newLeaf);
	array_push($tree, $newEmail);
	tree($tree, $leaves, $data);
}

 
function distance($node1, $node2) 
{
	$r = 3963.1676; //Radius of the earth in miles.
	$lat1 = deg2rad($node1->myLat);
	$lon1 = deg2rad($node1->myLon);
	$lat2 = deg2rad($node2->myLat);
	$lon2 = deg2rad($node2->myLon);
	
	$distance = acos(sin($lat1)*sin($lat2) +
	cos($lat1)*cos($lat2)*cos($lon2-$lon1)) * $r;
	
	return $distance; 
}


/*********************************************************Classes************************************************************/
class Node
{
	//Array of other carpoolers. 
	public $otherCarpoolers = array();
	
	public $myUsername; 
	public $myLat; 
	public $myLon;
	public $myNumOfSeats;
	public $myAddress; 
	public $height; 
	public $parent; 
	public $child; 
	

	public function init($username, $numOfSeats, $height, $lat, $lon, $address)
	{
		$this->myUsername = $username; 
		$this->myLat = $lat; 
		$this->myLon = $lon;
		$this->myNumOfSeats = $numOfSeats;
		$this->height = $height;
		$this->myAddress = $address; 
		$this->parent = null;
		$this->child = null;      
	}

	//Adds a carpooler. 
	public function addCarpooler($key, $value) 
	{
		$this->otherCarpoolers[$key] = $value;
	}
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
$sql = "SELECT Email, Seats, Address, lat, lon FROM Attends LEFT JOIN User ON UserEmail = Email WHERE EventId = $ID AND Carpool = 1";
$result = mysqli_query($conn, $sql);

$result2 = mysqli_fetch_array($result); //Tuple of someone who is carpooling.

$peopleCarpooling = array(); //Array of people who are carpooling.
while ($result2 != NULL) 
{
	$node = new Node(); 
	$node->init($result2['Email'], $result2['Seats'], 0, $result2['lat'], $result2['lon'], $result2['Address']);
	$peopleCarpooling[$result2['Email']] = $node; //Add this carpooler to the list of people carpooling.
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


//Loop through all the carpoolers, and set their distances to all the other carpoolers. 
for ($i = 0; $i < sizeof($peopleCarpooling); $i++) 
{
	for ($j = 0; $j < sizeof($peopleCarpooling); $j++)
	{
		if ($j == $i) //Don't figure out distance to ourselves. 
			continue; 
		$distance = distance($peopleCarpooling[$i], $peopleCarpooling[$j]);
		$peopleCarpooling[$i]->addCarpooler($peopleCarpooling[$j]->myUsername, [$peopleCarpooling[$j], $distance]); 
	}	
}

//Create node for the event
$eventNode = new Node();
$eventNode->init("Event", -1, -1, $latEvent, $lonEvent, $addressEvent); 

//Get everyone's distance to the event. 
for ($i = 0; $i < sizeof($peopleCarpooling); $i++)
{
	$distanceToEvent = distance($peopleCarpooling[$i], $eventNode);
	$eventNode->addCarpooler($peopleCarpooling[$i]->myUsername, [$peopleCarpooling[$i], $distanceToEvent]);
}


$leaves = array(); 
array_push($leaves, $eventNode);

$tree = array(); 

tree($tree, $leaves, $data);

$queryingCarpooler = $peopleCarpooling[$email]; //Dude who asked for directions.
$data['Searcher'] = $queryingCarpooler;
$child = $queryingCarpooler->child; 
$isDriver = true;
$arrayOfAddresses = array();   

if ($child != null)
{
	$driver = findDriver($child);
	$driverEmail = $driver->myUsername;
	$isDriver = false; //We are not a driver 
}
else //Querying Carpooler is a driver, so have to return his route. 
{
	$currAddr = $queryingCarpooler->myAddress;
	array_push($arrayOfAddresses, $currAddr);

	$nextNode = $queryingCarpooler->parent; 
	while ($nextNode != null)
	{	
		$currAddr = $nextNode->myAddress;
		array_push($arrayOfAddresses, $currAddr);
		$nextNode = $nextNode->parent; 
	}
}

$data['addresses'] = $arrayOfAddresses;
mysqli_close($conn);
echo(json_encode($data)); 





 
?>