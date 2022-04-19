<?php

$host = "localhost";
$user = "wustl_inst";
$password = "wustl_pass";
$dbname = "module";

$con = mysqli_connect($host, $user, $password, $dbname);

if (!$con) {
    die("Connection failed: ". mysqli_connect_error());
}
?>