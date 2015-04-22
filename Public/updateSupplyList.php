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

if ($_POST['eventid'] && $_POST['removedSupps'] && $_POST['removedQuants'] && $_POST['supplies'])
	{
		$eventid = mysqli_real_escape_string($conn, $_POST['eventid']);

		$supplies = $_POST['supplies'];

		// UPDATE or CREATE any nessesary supplies
		for($i=0;$i<count($supplies);$i++)
		{
			$supply = $supplies[$i];
			$supply_name = "";

			if($supply['initName'] == null)
			{	
				$supply_name = $supply['name'];
			}
			else if($supply['initName'] == $supply['name'])
			{
				$old_name = $supply['initName'];
				$supply_name = $supply['name'];

				// Update Bringing and SupplyCounts
				mysqli_query($conn, "UPDATE SupplyCount SET SupplyName=$supply_name WHERE EventID = $eventid AND SupplyName = $old_name");
				mysqli_query($conn, "UPDATE Bringing SET SuppliesName=$supply_name WHERE EventID = $eventid AND SuppliesName = $old_name");
			}
			
			$quantities = $supply['quantities'];
			
			// UPDATE or CREATE Supply Counts
			for($j=0;$j<count($quantities);$j++)
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

		$removedQuantities = $_POST['removedQuants'];
		for($i=0;$i<count($removedQuantities);$i++)
		{
			$rq = $removedQuantities[$i];
			mysqli_query($conn, "DELETE FROM SupplyCount WHERE 
								SupplyName=".$rq['name']." AND
								MinAttendeesToNecessetate=".$rq['min']." AND
								EventID=$eventid");
		}
		$removedSupplies = $_POST['removedSupps'];
		for($i=0;$i<count($removedSupplies);$i++)
		{
			$rq = $removedSupplies[i];
			mysqli_query($conn, "DELETE FROM SupplyCount WHERE 
								SupplyName=".$rq['name']." AND
								EventID=$eventid");
		}


		$data['success'] = true;
		$data['error'] = "";
		
	}
	else
	{
		$data['success'] = false;
		$data['error'] = "Wrong parameters";
	}
	
mysqli_close($conn);	
echo(json_encode($result));
?>