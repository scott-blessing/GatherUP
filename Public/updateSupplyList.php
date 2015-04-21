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
$data['error']="Invalid parameters";
$data['supplies'] = array();

function name_exist($supply_name, $eventid)
{
	$result = mysqli_query($conn, "SELECT Name FROM Supplies WHERE EventID = $eventid AND Name = $supply_name");

	$r = mysqli_fetch_array($result);
	return $r == null;
}
fun

if ($_POST['eventid'] && $_POST['supplies'])
	{
		$eventid = mysqli_real_escape_string($conn, $_POST['eventid']);

		$supplies = $_POST['supplies'];

		// UPDATE or CREATE any nessesary supplies
		for($i=0;i<count($supplies);$i++)
		{
			$supply = $supplies[$i];
			$supply_name = "";

			if($supply['initName'] == null)
			{	
				// Check if name already exist
				if(!name_exist($supply['name'], $eventid))
				{
					$supply_name = $supply['name'];
					
					// Create the supply
					mysqli_query($conn, "INSERT INTO Supplies (Name, EventID) VALUES ($supply_name, $eventid");
				}
				else
				{
					// ERROR
				}
			}
			else if($supply['initName'] == $supply['name'])
			{
				// Check if name already exist
				if(!name_exist($supply['name'], $eventid))
				{
					$old_name = $supply['initName'];
					$supply_name = $supply['name'];

					// Update the supply
					mysqli_query($conn, "UPDATE Supplies SET Name=$supply_name WHERE EventID = $eventid AND Name = $old_name");

					// Update Bringing and SupplyCounts
					mysqli_query($conn, "UPDATE SupplyCounts SET Name=$supply_name WHERE EventID = $eventid AND Name = $old_name");
					mysqli_query($conn, "UPDATE Bringing SET Name=$supply_name WHERE EventID = $eventid AND Name = $old_name");

				}
				else
				{
					// ERROR
				}
			}
			
			$quantities = $supply['quantities'];
			
			// UPDATE or CREATE Supply Counts
			for($j=0;$j<count($quantities);j++)
			{
				$quatity = $quantities[$j];

				if($quantities['initMin'] == null)
				{
					// Create the new quantity
					mysqli_query($conn, "INSERT INTO SupplyCount (SupplyName, EventID, Quantity, MinAttendeesToNecessetate, MaxAttendeesToNecessetate) VALUES ($supply_name, $eventid, ".$quantities['quatity'].", ".$quantities['min'].",".$quantities['max'].")");

				}
				else if($quantities['initMin'] == $quantities['min'])
				{
					// Update the quantity
					mysqli_query($conn, "UPDATE SupplyCount SET SupplyName = $supply_name,
						EventID = $eventid,
						Quantity = ".$quantities['quatity'].",
						MinAttendeesToNecessetate = ".$quantities['min'].",
						MaxAttendeesToNecessetate = ".$quantities['max']."");
				}
			}
		}

		$attendeesQuery = mysqli_query($conn, "SELECT COUNT(UserEmail) AS numAttendees FROM Attends WHERE EventID = $eventid");

		$data['success'] = true;
		$data['error'] = "";
		
	}
	else
	{
		$data['success'] = false;
		$data['error'] = "";
	}
	
mysqli_close($conn);	
echo(json_encode($result));
?>