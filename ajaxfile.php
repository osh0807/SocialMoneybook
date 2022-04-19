<?php
include "config.php";

if (isset($_GET['listnum'])) {
    $listnum = $_GET['listnum'];
}
if (isset($_GET['order'])) {
    $orderT = $_GET['order'];
}

if (isset($_GET['viewOption1'])) {
    $option1 = $_GET['viewOption1'];
}

if (isset($_GET['viewOption2'])) {
    $option2 = $_GET['viewOption2'];
}

$res = array('error' => false);
$action = 'read';

if (isset($_GET['action'])) {
    $action = $_GET['action'];
}

if ($action == 'read') {

    $userData = mysqli_query($con, "select * from month WHERE listnum = $listnum " . $option1 . " order by $orderT");
    $history = array();

    while ($row = mysqli_fetch_assoc($userData)) {
        $history[] = $row;
    }
    $res['history'] = $history;
}



if ($action == 'categorize') {
    $userData = mysqli_query($con, "select * from month WHERE listnum = $listnum and category = '" . $option2 . "' order by $orderT");
    $history = array();

    while ($row = mysqli_fetch_assoc($userData)) {
        $history[] = $row;
    }

    $res['history'] = $history;
}

if ($action == 'create') {
   # code...
   $date = $_POST['date'];
   $type = $_POST['type'];
   $title = $_POST['title'];
   $amount = $_POST['amount'];
   $category = $_POST['category'];

   // $balanceData = mysqli_query($con, "SELECT balance from list where listnum = 1");
   // $oldBalance = mysqli_fetch($balanceData);

   // $res['oldBalance'] = $oldBalance;
   $result = $con->query("INSERT INTO month (date, type, title, amount, category, listnum) 
  VALUES ('$date', '$type', '$title', '$amount', '$category', '$listnum')");

   // $result2 = $con->query("UPDATE list SET balance = '$oldBalance' where listnum =?");

   if ($result) {
       # code...
       $res['message'] = "Entry added successfully";
   } else {
       $res['error'] = true;
       $res['message'] = "failed to insert (try exclude ' )";
   }
}

if ($action == 'update') {
    # code...
    $date = $_POST['date'];
    $type = $_POST['type'];
    $title = $_POST['title'];
    $amount = $_POST['amount'];
    $category = $_POST['category'];
    $entrynum = $_POST['entrynum'];

    $result = $con->query("UPDATE month SET date = '$date', type='$type', title='$title', amount='$amount', category='$category'
   where entrynum = $entrynum and listnum = $listnum");

    if ($result) {
        # code...
        $res['message'] = "updated successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not update user";
    }
}

if ($action == 'delete') {
    # code...
    $entrynum = $_POST['entrynum'];
    $result = $con->query("DELETE FROM month WHERE entrynum = $entrynum and listnum = $listnum");
    if ($result) {
        # code...
        $res['message'] = "User deleted successfully";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not delete user";
    }
}

if ($action == 'balancePlus') {

    $amount = $_POST['amount'];
    $type = $_POST['type'];
    $queryV = "";

    if ($type == 'income') {
        $queryV = "+ $amount";
    } else if ($type == 'expense') {
        $queryV = "- $amount";
    }

    $result = $con->query("UPDATE list SET balance = balance " . $queryV . " where listnum = $listnum");
    if ($result) {
        # code...
        $res['message'] = "Balance updated";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not update balance";
    }
}

if ($action == 'balanceMinus') {

    $amount = $_POST['amount'];
    $type = $_POST['type'];
    $queryV = "";

    if ($type == 'expense') {
        $queryV = "+ $amount";
    } else if ($type == 'income') {
        $queryV = "- $amount";
    }

    $result = $con->query("UPDATE list SET balance = balance " . $queryV . " where listnum = $listnum");
    if ($result) {
        # code...
        $res['message'] = "Balance updated";
    } else {
        $res['error'] = true;
        $res['message'] = "Could not update balance";
    }
}

if ($action == 'bringBalance') {
    $userData = mysqli_query($con, "select balance from list WHERE listnum = $listnum");
    $balanceData = mysqli_fetch_object($userData);
    $res['balance'] = $balanceData;
}



header("Content-type: application/json");
echo json_encode($res);
exit;
