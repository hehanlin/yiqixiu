<?php
header("Content-type: text/html; charset=utf-8");
date_default_timezone_set('PRC');
ini_set("display_errors", 0);
error_reporting(E_ALL ^ E_NOTICE ^ E_STRICT);
//error_reporting(E_ALL);

//修正部份计算机 DOCUMENT_ROOT 无值的问题
if(empty($_SERVER['DOCUMENT_ROOT']) && !empty($_SERVER['SCRIPT_FILENAME'])) {
if(PATH_SEPARATOR==':') $_SERVER['DOCUMENT_ROOT'] = str_replace( '\\', '/', substr($_SERVER['SCRIPT_FILENAME'], 0, 0 - strlen($_SERVER['PHP_SELF'])));
else $_SERVER['DOCUMENT_ROOT'] = substr($_SERVER['SCRIPT_FILENAME'], 0, 0 - strlen($_SERVER['PHP_SELF']));
}else if(empty($_SERVER['DOCUMENT_ROOT']) && !empty($_SERVER['PATH_TRANSLATED'])) {
    if(PATH_SEPARATOR==':') $_SERVER['DOCUMENT_ROOT'] = str_replace( '\\', '/', substr(str_replace('\\\\', '\\', $_SERVER['PATH_TRANSLATED']), 0, 0 - strlen($_SERVER['PHP_SELF'])));
    else $_SERVER['DOCUMENT_ROOT'] = substr(str_replace('\\\\', '\\', $_SERVER['PATH_TRANSLATED']), 0, 0 - strlen($_SERVER['PHP_SELF']));
}
header("Content-type: text/html; charset=utf-8");
if (get_magic_quotes_gpc()) {
	function stripslashes_deep($value){
		$value = is_array($value) ? array_map('stripslashes_deep', $value) : stripslashes($value); 
		return $value; 
	}
	$_POST = array_map('stripslashes_deep', $_POST);
	$_GET = array_map('stripslashes_deep', $_GET);
	$_COOKIE = array_map('stripslashes_deep', $_COOKIE); 
}
define('APP_DEBUG',1);
define('APP_NAME', 'cms');
define('CONF_PATH','./Conf/');
define('RUNTIME_PATH','./Conf/logs/');
define('TMPL_PATH','./tpl/');
// define('HTML_PATH','./WesamboData/html/');
define('APP_PATH','./Wesambo/');
define('CORE','./Wesambo/_Core');
require(CORE.'/Wesambo.php');
?>