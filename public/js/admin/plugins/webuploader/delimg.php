<?php
$fileName = $_REQUEST["name"];
$dirpath = '/static/admin/upload/';
$a=unlink("../../../upload/" . $fileName);
var_dump($a);die;
?>