<?php
$db = mysqli_connect("localhost","root","","Instructor");
echo"success";
if(!$db)
{
    die("Connection failed: " . mysqli_connect_error());
}
$name={{fullName}};
$belt=$_POST['challengeName'];
$sql = "INSERT INTO Requests (userName,beltName) VALUES ($name,$belt)";

if ($conn->query($sql) === TRUE) {
  echo "Request Sent";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>