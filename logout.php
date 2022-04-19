<?php

$conn = new mysqli("localhost", "wustl_inst", "wustl_pass", "module");

if ($conn->connect_error) {
	# code...
	die("Could not connect");
}
session_start();
session_unset();
session_destroy();

?>