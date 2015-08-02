<?php

@session_start();
require("config.php");
function MD5_16($s){
return substr(md5($s),8,16);
}
function TrimGet($p){
if (isset($_GET[$p])){
return trim($_GET[$p]);
}else{
return "";
}
}
function GetSAPIvalue($s_SessionKey, $s_ParamName){
$p="eWebEditor_" . $s_SessionKey . "_" . $s_ParamName;
if (isset($_SESSION[$p])){
return trim($_SESSION[$p]);
}else{
return "";
}
}
function IsInt($str){
if ($str==""){
return false;
}
if (preg_match("/[^0-9]+/",$str)){
return false;
}else{
return true;
}
}
function IsOkSParams($s_SParams, $s_EncryptKey){
if ($s_SParams == ""){return false;}
$n = strpos($s_SParams, "|");
if ($n === false) {return false;}
$s1 = substr($s_SParams, 0, $n);
$s2 = substr($s_SParams, $n + 1);
if (MD5_16($s_EncryptKey.$s2) != $s1){return false;}
return true;
}
function Syscode2Pagecode($str, $b){
$s_SysCode = "gb2312";
$s_PageCode = "utf-8";
if (($s_SysCode!=$s_PageCode) && (function_exists("iconv"))){
if ($b){
return iconv($s_SysCode, $s_PageCode, $str);
}else{
return iconv($s_PageCode, $s_SysCode, $str);
}
}else{
return $str;
}
}
function UTF8_to_Pagecode($str, $b){
$s_UTF8 = "utf-"."8";
$s_PageCode = "gb2312";
if (($s_UTF8!=$s_PageCode) && (function_exists("iconv"))){
if ($b){
return iconv($s_UTF8, $s_PageCode, $str);
}else{
return iconv($s_PageCode, $s_UTF8, $str);
}
}else{
return $str;
}	
}


?>