<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Contact Form</title>
</head>
<body>
    <h1>Thank You</h1>
    <p>Here is the information you have submitted:</p>



<?php
#echo 'I am here';
	$servername = "localhost";
        $username = "da_admin";
        $password = "Lw5natZQ4m";
        $dbname = "signup_db";
                     
        $conn = new mysqli($servername, $username, $password, $dbname);
        if($conn->connect_error)
        {
  	      die("Connection Failed: ".$conn->connect_error);	
	}
	else
	{
	#	echo 'DB Connected';
	}
	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
	#	echo 'I am there';
	#	if( filter_has_var( INPUT_POST, 'submit' ))
		#
		#	{
	/////////////////////////////////////////////////Testing the Code/////////////////////////////////////////////////////
	/*
		$filename = 'add_email.sh';
		if (is_readable($filename) && is_writable($filename))
		{
    			echo "File has read and write permissions.";
		}
		else
		{
			echo "<br>";
			echo "Set file permissions";
			echo "<br>";
			echo exec('whoami');
			echo "<br>";
		}
	 */
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
			$fname = strip_tags(trim($_POST['firstname']));
			$lname = strip_tags(trim($_POST['lastname']));
			$username = $lname.".".$fname;
			$domain = "kugeza.com";
			$pass = strip_tags(trim($_POST['password']));
			$pass_type = 1;
			$quota = 52428800;
			exec ( '/var/www/html/webmail/modules/StandardLoginFormWebclient/templates/add_email.sh "' . $username .'" "'. $domain .'" "'. $pass .'" "'. $pass_type .'" "'. $quota .'" ', $output, $return_var );
			exec ( '/var/www/html/webmail/modules/StandardLoginFormWebclient/templates/add_email.sh 2>&1',$output, $return_var );
			if($return_var !== 0){ // exec is successful only if the $return_var was set to 0. !== means equal and identical, that is it is an integer and it also is zero.
				
				echo "<br>";
				echo "Email not created";
				#echo "<br>";
				#print_r ($output);
				#echo "<br>";
			}
			else{
			
  				echo "New Email created successfully as ".$lname.".".$fname."@kugeza.com";
			}

			#Email is created as lastname.firstname@domain.com
			$sql = "INSERT INTO RegEmail (firstname, lastname, email)
				VALUES('$fname', '$lname','$lname.$fname')";

/*			if ($conn->query($sql) === TRUE) 
			{
  				echo "New Email created successfully as ".$lname.".".$fname."@kugeza.com";
			} 
			else 
			{
				 echo "Error: " . $sql . "<br>" . $conn->error;
			}
 */
	}
		else
		{
			echo 'form not filled';
		}
	
?>

</body>
</html>
