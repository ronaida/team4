<?php
$conn = mysqli_connect("localhost","root","","Instructor");

if(!$conn)
{
    die("Connection failed: " . mysqli_connect_error());
}
echo "";
echo "<script type='text/javascript'> document.writeln(inputVal);</script> 
<sdocument.writeln(inputVal);</script>;
<script>document.writeln(inputVal);<</script>"; 
$name="";
$givenName=
$familyName=;

$sql = "INSERT INTO register (username,givenName,familyName) VALUES ('$name','$givenName','$familyName')";

if ($conn->query($sql) === TRUE) {
  echo "done";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
