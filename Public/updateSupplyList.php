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

if ($_POST['eventid'])
	{

		$data['error'] = "start\n";
		$eventid = mysqli_real_escape_string($conn, $_POST['eventid']);

		$supplies = $_POST['supplies'];

		// UPDATE or CREATE any nessesary supplies
		for($i=0;$i<count($supplies);$i++)
		{
			$data['error'] += "Got supply\n";
			$supply = $supplies[$i];
			$supply_name = "";

			if($supply['initName'] == null)
			{	
				$data['error'] += "initName null\n";
				$supply_name = $supply['name'];
			}
			else
			{
				$data['error'] += "initName not null\n";
				$old_name = $supply['initName'];
				$supply_name = $supply['name'];

				// Update Bringing and SupplyCounts
				mysqli_query($conn, "UPDATE SupplyCount SET SupplyName='$supply_name' WHERE EventID = $eventid AND SupplyName = '$old_name'");
				mysqli_query($conn, "UPDATE Bringing SET SuppliesName='$supply_name' WHERE EventID = $eventid AND SuppliesName = '$old_name'");
			}
			$data['error'] += "get quantities\n";
			$quantities = $supply['quantities'];
			
			// UPDATE or CREATE Supply Counts
			for($j=0;$j<count($quantities);$j++)
			{
				$data['error'] += "got a quant\n";
				$quantity = $quantities[$j];

				if($quantity['initMin'] == null)
				{
					$data['error'] += "new quant\n";
					// Create the new quantity
					$query = "INSERT INTO SupplyCount (SupplyName, EventID, Quantity, MinAttendeesToNecessetate, MaxAttendeesToNecessetate) VALUES ('$supply_name', $eventid, ".$quantity['quantity'].", ".$quantity['min'].",".$quantity['max'].")";
					$result = mysqli_query($conn, $query);
					$data['query'] = $query;
					if($result == false)
					{
						$data['error'] += "sql error\n";
						$data['success'] = false;
						//$data['error'] = "Bad supply count insert";
						break;
					}

				}
				else
				{
					$data['error'] += "update quant\n";
					$query = "UPDATE SupplyCount SET SupplyName = '$supply_name',
						EventID = $eventid,
						Quantity = ".$quantity['quantity'].",
						MinAttendeesToNecessetate = ".$quantity['min'].",
						MaxAttendeesToNecessetate = ".$quantity['max']." WHERE EventID = $eventid AND SupplyName = '$supply_name'
							AND MinAttendeesToNecessetate = ".$quantity['initMin']."";
					// Update the quantity
					mysqli_query($conn, $query);
					$data['query'] = $query;
				}
			}
		}

		$removedQuantities = $_POST['removedQuants'];
		for($i=0;$i<count($removedQuantities);$i++)
		{
			$rq = $removedQuantities[$i];
			mysqli_query($conn, "DELETE FROM SupplyCount WHERE SupplyName='".$rq['name']."' AND MinAttendeesToNecessetate=".$rq['min']." AND EventID=$eventid");
		}
		$removedSupplies = $_POST['removedSupps'];
		for($i=0;$i<count($removedSupplies);$i++)
		{
			$rq = $removedSupplies[$i];
			$query = "DELETE FROM SupplyCount WHERE SupplyName='$rq' AND EventID=$eventid";
			mysqli_query($conn, $query);
			$data['query'] = $query;
		}


		$data['success'] = true;
		//$data['error'] = "";
		
	}
	else
	{
		$data['success'] = false;
		$data['error'] = "Wrong parameters";
	}
	
mysqli_close($conn);	
echo(json_encode($data));
?>