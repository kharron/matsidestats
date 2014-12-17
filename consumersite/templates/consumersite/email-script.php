<?php

if(@isset($_POST['name'])) {
	
	if($_POST['name'] == '' || $_POST['email'] == '' || $_POST['message'] == '')
	{
			die(header('Location: contact.php?email-send=fillall'));
	}

	$to = "you@you.com"; // Your email
	$subject = "Message from Gamma!"; // Default Subject
	
	$name_field = $_POST['name'];
	$email_field = $_POST['email'];
	$subject_field = $_POST['subject'];
	$message = $_POST['message'];
	
	if($subject_field != "") $subject = $subject_field;
	 
	$body = "From: $name_field\n E-Mail: $email_field\n Message:\n $message";
	$headers = "From:" . $name_field;
	
	if(@mail($to, $subject, $body, $headers)) header('Location: contact.php?email-send=success');
	else header('Location: contact.php?email-send=error');

} else {

	header('Location: contact.php');

}
?>