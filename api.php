<?php
$conn = new mysqli("localhost", "wustl_inst", "wustl_pass", "module");


if ($conn->connect_error) {
	# code...
	die("Could not connect");
}
$res = array('error' => false);
$action = 'read';

session_start();
if (isset($_SESSION['loggedin'])) { }


if (isset($_GET['action'])) {
	# code...
	$action = $_GET['action'];
}

if ($action == 'read') {
	# code...
	$usernum = $_SESSION['loggedin'];
	$result = $conn->query("SELECT * FROM book where usernum = $usernum");
	$books = array();
	while ($row = $result->fetch_assoc()) {
		# code...
		array_push($books, $row);
	}
	$res['books'] = $books;
}

if ($action == 'readList') {
	$usernum = $_SESSION['loggedin'];
	$booknum = $_SESSION['booknum'];
	$result = $conn->query("SELECT * FROM list where booknum = $booknum");
	$listings = array();
	while ($row = $result->fetch_assoc()) {
		# code...
		array_push($listings, $row);
	}
	$res['listings'] = $listings;
}



if ($action == 'create') {
	# code...
	$username = $_POST['username'];
	$email = $_POST['email'];
	$password = $_POST['password'];
	$password = password_hash($password, PASSWORD_DEFAULT);
	$result = $conn->query("INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password')");
	if ($result) {
		# code...
		$res['message'] = "Registered!";
	} else {
		$res['error'] = true;
		$res['message'] = "Failed to register";
	}
}

if ($action == 'log_in') {

	$username = $_POST['username'];
	$password = $_POST['password'];
	// $result = $conn->query("SELECT users (username, password) VALUES ('$username')");
	$stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username=?");

	if (!$stmt) {
		$res['error'] = true;
		$res['message'] = "connection error";
	}
	// Bind the parameter
	$stmt->bind_param('s', $username);
	$stmt->execute();

	// Bind the results
	$stmt->bind_result($usernum, $user_id, $pwd_hash);
	$stmt->fetch();
	// check whether the account has been verified

	// Compare the submitted password to the actual password hash
	if (password_verify($password, $pwd_hash)) {
		// Login succeeded!
		$res['message'] = "loggedin! - the list of money books are shown below";
		$_SESSION['loggedin'] = $usernum;
	} else {
		$res['error'] = true;
		$res['message'] = "login failed";
	}
}


if ($action == 'addBook') {
	$usernum = $_SESSION['loggedin'];
	$title = $_POST['title'];
	$result = $conn->query("INSERT INTO book (usernum, title) VALUES ('$usernum', '$title')");

	if ($result) {
		# code...
		$res['message'] = "book added!";
	} else {
		$res['error'] = true;
		$res['message'] = "Failed to add";
	}
}

if ($action == 'editBook') {
	//클릭한 책의 북넘버.. 
	$booknum = $_POST['booknum'];
	$title = $_POST['title'];
	$result = $conn->query("UPDATE book SET title = '$title' WHERE booknum = '$booknum' ");
	if ($result) {
		$res['message'] = "Edited Successfully";
	} else {
		$res['error'] = true;
		$res['message'] = "failed to edit";
	}
}

if ($action == 'view_book') {
	$listings = array();
	$booknum = $_POST['booknum'];
	$_SESSION['booknum'] = $_POST['booknum'];
	$result = $conn->query("SELECT * FROM list where booknum = $booknum");
	while ($row = $result->fetch_assoc()) {
		# code...
		array_push($listings, $row);
	}
	$res['listings'] = $listings;
	if ($result) {
		$res['message'] = "the list of months of this money book";
	} else {
		$res['error'] = true;
		$res['message'] = "failed to call book";
	}
}

if ($action == 'addMonth') {
	$booknum = $_SESSION['booknum'];
	$year = $_POST['year'];
	$month = $_POST['month'];
	$result = $conn->query("INSERT INTO list (booknum, year, month) VALUES ('$booknum','$year', '$month')");
	
	if ($result) {
		# code...
		$res['message'] = "month added!";
	} else {
		$res['error'] = true;
		$res['message'] = "Failed to add";
	}
}

if ($action == 'editList') {
	$listnum = $_POST['listnum'];
	$year = $_POST['year'];
	$month = $_POST['month'];
	$result = $conn->query("UPDATE list SET year = '$year', month = '$month' WHERE listnum = '$listnum' ");
	if ($result) {
		$res['message'] = "Edited Successfully";
	} else {
		$res['error'] = true;
		$res['message'] = "failed to edit";
	}
}


if ($action == 'view_list') {
	$listings = array();
	$booknum = $_POST['booknum'];
	$_SESSION['booknum'] = $_POST['booknum'];
	$result = $conn->query("SELECT * FROM list where booknum = $booknum");
	while ($row = $result->fetch_assoc()) {
		# code...
		array_push($listings, $row);
	}
	$res['listings'] = $listings;
	if ($result) {
		$res['message'] = "the list of months of this money book";
	} else {
		$res['error'] = true;
		$res['message'] = "failed to call book";
	}
}



$conn->close();
header("Content-type: application/json");
echo json_encode($res);
