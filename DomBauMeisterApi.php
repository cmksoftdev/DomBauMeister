<?php 
header("Access-Control-Allow-Origin: *");
$username = str_replace('\'', '\'\'', htmlspecialchars($_GET["username"]));
$password = htmlspecialchars($_GET["password"]);
$command = htmlspecialchars($_GET["command"]);
$token = htmlspecialchars($_GET["token"]);
$ip = $_SERVER['REMOTE_ADDR'];

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

if($command === "handshake") {
	echo generateRandomString();
}
else 
{
	$dbLink = mysqli_connect("localhost", "dbname", "pw","dbname") or die (mysql_error());
	$dbpw = mysqli_query($dbLink,"
		SELECT `password`, `level` FROM `users` WHERE `name` = '".$username."';");
	$rows1=mysqli_fetch_assoc($dbpw);
	$pw = $rows1['password'];
	$lvl = $rows1['level'];
	if (!empty($token) && !empty($pw) && strlen($token) === 10 && $password === hash('sha256', $pw . $token)) 
	{
		if ($command === "login")
		{
			$dbLink2 = mysqli_connect("localhost", "dbname", "pw","dbname") or die (mysql_error());
			$abf = mysqli_query($dbLink2,"
				SELECT 
				`backgroundimage` 
				FROM `usersettings` 
				WHERE `user_id` = (SELECT `id` FROM `users` WHERE `name` = '".$username."');");
			$rows=mysqli_fetch_assoc($abf);
			echo "
				{
					\"ip\":\"".$ip."\",
					\"backgroundimage\":\"".$rows['backgroundimage']."\"
				}
				";
		}
		else if ($command === "info")
		{
			$indicesServer = array('PHP_SELF', 
			'argv', 
			'argc', 
			'GATEWAY_INTERFACE', 
			'SERVER_ADDR', 
			'SERVER_NAME', 
			'SERVER_SOFTWARE', 
			'SERVER_PROTOCOL', 
			'REQUEST_METHOD', 
			'REQUEST_TIME', 
			'REQUEST_TIME_FLOAT', 
			'QUERY_STRING', 
			'DOCUMENT_ROOT', 
			'HTTP_ACCEPT', 
			'HTTP_ACCEPT_CHARSET', 
			'HTTP_ACCEPT_ENCODING', 
			'HTTP_ACCEPT_LANGUAGE', 
			'HTTP_CONNECTION', 
			'HTTP_HOST', 
			'HTTP_REFERER', 
			'HTTP_USER_AGENT', 
			'HTTPS', 
			'REMOTE_ADDR', 
			'REMOTE_HOST', 
			'REMOTE_PORT', 
			'REMOTE_USER', 
			'REDIRECT_REMOTE_USER', 
			'SCRIPT_FILENAME', 
			'SERVER_ADMIN', 
			'SERVER_PORT', 
			'SERVER_SIGNATURE', 
			'PATH_TRANSLATED', 
			'SCRIPT_NAME', 
			'REQUEST_URI', 
			'PHP_AUTH_DIGEST', 
			'PHP_AUTH_USER', 
			'PHP_AUTH_PW', 
			'AUTH_TYPE', 
			'PATH_INFO', 
			'ORIG_PATH_INFO') ; 

			echo '<table cellpadding="10">' ; 
			foreach ($indicesServer as $arg) { 
				if (isset($_SERVER[$arg])) { 
					echo '<tr><td>'.$arg.'</td><td>' . $_SERVER[$arg] . '</td></tr>' ; 
				} 
				else { 
					echo '<tr><td>'.$arg.'</td><td>-</td></tr>' ; 
				} 
			} 
			echo '</table>' ; 
		}
		else if ($command === "settings")
		{
			$json = file_get_contents('php://input');
			$jsonOpject = json_decode($json, true);
			$dbLink3 = mysqli_connect("localhost", "dbname", "pw","dbname") or die (mysql_error());
			$abf2 = mysqli_query($dbLink3,"
			UPDATE 
			`usersettings` 
			SET `backgroundimage`=N'url(''".str_replace('\'', '\'\'', $jsonOpject['backgroundimage'])."'')' 
			WHERE `user_id` = (SELECT `id` FROM `users` WHERE `name` = '".$username."');");
			//mysqli_fetch_assoc($abf2);
			echo $jsonOpject['backgroundimage'];
		}
		else if ($command === "sql" && $lvl == 2)
		{
			$input = file_get_contents('php://input');
			$con = new mysqli("localhost", "dbname", "pw","dbname");
			$res = $con->multi_query($input);
			if (!$res) {
				echo "Error executing query: (" . $con->errno . ") " . $con->error;
			}
			else
			{
				while ($result = $con->store_result()) 
				{
					if ($result != false)
					{
						while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC))
						{
							$keys = array_keys($row);
							foreach ($keys as $key)
								echo $key . ": " . htmlspecialchars($row[$key]) . '<br>';
								echo "<br>";
						}
					}
					$result = $con->next_result();
				}
			}
		}
		else
		{
			echo "no command level is " . $lvl . " " . $command;
		}
	}	
	else
	{
		echo hash('sha256', "test" . $token);
	}
}

 ?>