<?php header("content-Type: text/html; charset=utf-8");

require("private.php");
if (isset($_GET["action"])){
$sAction = strtoupper($_GET["action"]);
}else{
$sAction = "";
}
InitUpload();
DoCreateNewDir();
switch ($sAction){
case "LOCAL":
DoLocal();
break;
case "REMOTE":
DoRemote();
break;
case "SAVE":
DoSave();
break;
case "MFU":
DoMFU();
break;
}
function DoSave(){
echo "<html><head><title>eWebEditor</title><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body>";
DoUpload();
$s_SmallImageFile = getSmallImageFile($GLOBALS["sSaveFileName"]);
$s_SmallImagePathFile = "";
$s_SmallImageScript = "";
if (makeImageSLT($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"], $s_SmallImageFile)){
switch($GLOBALS["nSLTMode"]){
case 1:
makeImageSY($GLOBALS["sUploadDir"], $s_SmallImageFile);
makeImageSY($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"]);
$s_SmallImagePathFile = $GLOBALS["sContentPath"].$s_SmallImageFile;
$s_SmallImageScript = "try{obj.addUploadFile('".$GLOBALS["sOriginalFileName"]."', '".$s_SmallImagePathFile."');} catch(e){} ";
$s_SmallImagePathFile = "";
break;
case 2:
makeImageSY($GLOBALS["sUploadDir"], $s_SmallImageFile);
DelFile($GLOBALS["sUploadDir"].$GLOBALS["sSaveFileName"]);
$GLOBALS["sSaveFileName"] = $s_SmallImageFile;
break;
default:
makeImageSY($GLOBALS["sUploadDir"], $s_SmallImageFile);
makeImageSY($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"]);
$s_SmallImagePathFile = $GLOBALS["sContentPath"].$s_SmallImageFile;
$s_SmallImageScript = "try{obj.addUploadFile('".$GLOBALS["sOriginalFileName"]."', '".$s_SmallImagePathFile."');} catch(e){} ";
break;
}
}else{
$s_SmallImageFile = "";
makeImageSY($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"]);
}
$GLOBALS["sPathFileName"] = $GLOBALS["sContentPath"].$GLOBALS["sSaveFileName"];
OutScript("var obj=parent.EWIN; try{obj.addUploadFile('".$GLOBALS["sOriginalFileName"]."', '".$GLOBALS["sPathFileName"]."');} catch(e){} ".$s_SmallImageScript." parent.UploadSaved('".$GLOBALS["sPathFileName"]."','".$s_SmallImagePathFile."');");
}
function DoLocal(){
DoUpload();
makeImageSY($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"]);
$GLOBALS["sPathFileName"] = $GLOBALS["sContentPath"].$GLOBALS["sSaveFileName"];
echo $GLOBALS["sPathFileName"];
}
function DoUpload(){
if(!isset($_FILES['uploadfile'])){
OutScript("parent.UploadError('file')");
exit;
}
if($_FILES['uploadfile']['error'] > 0){
switch((int)$_FILES['uploadfile']['error']){
case UPLOAD_ERR_NO_FILE:
OutScript("parent.UploadError('file')");
break;
case UPLOAD_ERR_FORM_SIZE: 
OutScript("parent.UploadError('size')");
break;
case UPLOAD_ERR_INI_SIZE:
OutScript("parent.UploadError('The uploaded file exceeds the upload_max_filesize directive (".ini_get("upload_max_filesize").") in php.ini!')");
break;
}
exit;
}
preg_match("/\.([a-zA-Z0-9]{2,4})$/",$_FILES['uploadfile']['name'],$exts);
if (!IsValidExt($exts[1])){
OutScript("parent.UploadError('ext')");
exit;
}
$GLOBALS["sOriginalFileName"] = $_FILES['uploadfile']['name'];
$GLOBALS["sSaveFileName"] = GetRndFileName(strtolower($exts[1]));
//$sFileName = str_replace('\\','\\\\',realpath($GLOBALS["sUploadDir"]))."/";
$s_MapFile = $GLOBALS["sUploadDir"].Syscode2Pagecode($GLOBALS["sSaveFileName"],false);
$s_TrueFile = MFU_GetSavePath($s_MapFile);
if(!move_uploaded_file($_FILES['uploadfile']['tmp_name'],$s_TrueFile)){
OutScript("parent.UploadError('move_uploaded_file')");
exit;
}
MFU_DoUploadAfter($s_MapFile);
}
function DoMFU(){
if ($GLOBALS["sParamBlockFlag"] == "cancel"){
if ($GLOBALS["sParamBlockFile"] != ""){
DelFile($GLOBALS["sUploadDir"].$GLOBALS["sParamBlockFile"].".tmp1");
}
echo "ok";
exit;
}
DoUpload();
if ($GLOBALS["sParamBlockFlag"] == "end"){
$s_SmallImageFile = getSmallImageFile($GLOBALS["sSaveFileName"]);
$s_SmallImagePathFile = "";
$s_SmallImageScript = "";
if (makeImageSLT($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"], $s_SmallImageFile)){
switch($GLOBALS["nSLTMode"]){
case 1:
makeImageSY($GLOBALS["sUploadDir"], $s_SmallImageFile);
makeImageSY($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"]);
$s_SmallImagePathFile = $GLOBALS["sContentPath"].$s_SmallImageFile;
$s_SmallImageScript = "try{obj.addUploadFile('".$GLOBALS["sOriginalFileName"]."', '".$s_SmallImagePathFile."');} catch(e){} ";
$s_SmallImagePathFile = "";
break;
case 2:
makeImageSY($GLOBALS["sUploadDir"], $s_SmallImageFile);
DelFile($GLOBALS["sUploadDir"].$GLOBALS["sSaveFileName"]);
$GLOBALS["sSaveFileName"] = $s_SmallImageFile;
break;
default:
makeImageSY($GLOBALS["sUploadDir"], $s_SmallImageFile);
makeImageSY($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"]);
$s_SmallImagePathFile = $GLOBALS["sContentPath"].$s_SmallImageFile;
$s_SmallImageScript = "try{obj.addUploadFile('".$GLOBALS["sOriginalFileName"]."', '".$s_SmallImagePathFile."');} catch(e){} ";
break;
}
}else{
$s_SmallImageFile = "";
makeImageSY($GLOBALS["sUploadDir"], $GLOBALS["sSaveFileName"]);
}
$GLOBALS["sPathFileName"] = $GLOBALS["sContentPath"].$GLOBALS["sSaveFileName"];
echo $GLOBALS["sPathFileName"]."::".$s_SmallImagePathFile;
}else{
$n = strrpos($GLOBALS["sSaveFileName"], ".");
echo substr($GLOBALS["sSaveFileName"], 0, $n);
}
}
function MFU_GetSavePath($s_Path){
if ($GLOBALS["sAction"] != "MFU"){
return $s_Path;
}
$s_Ret = "";
if ($GLOBALS["sParamBlockFile"] == ""){
//new
if ($GLOBALS["sParamBlockFlag"] == "end"){
$s_Ret = $s_Path;
}else{
$s_Ret = $s_Path . ".tmp1";
}
}else{
if (!file_exists($s_Path . ".tmp1")){
OutScript("file");
exit;
}
//append
$s_Ret = $s_Path . ".tmp2";
}
return $s_Ret;
}
function MFU_DoUploadAfter($s_Path){
if ($GLOBALS["sAction"] != "MFU"){
return;
}
if ($GLOBALS["sParamBlockFile"] != ""){
if ($GLOBALS["sMFUMode"] == "1"){
MFU_DoMergeFile_Adv($s_Path);
}else{
MFU_DoMergeFile_Normal($s_Path);
}
if ($GLOBALS["sParamBlockFlag"] == "end"){
//rename
rename($s_Path.".tmp1", $s_Path);
}
}
}
function MFU_DoMergeFile_Adv($s_File){
$mfu = new COM("eWebSoft.eWebEditorMFUServer") or die("Unable to instantiate MFU");
$b = $mfu->Merge($s_File);
$mfu = null;
//del tmp2
DelFile($s_File . ".tmp2");
}
function MFU_DoMergeFile_Normal($s_File){
$s_File1 = $s_File . ".tmp1";
$s_File2 = $s_File . ".tmp2";
$f1 = fopen($s_File1, "ab");
$f2 = fopen($s_File2, "rb");
fwrite($f1, fread($f2, filesize($s_File2)));
fclose($f2);
fclose($f1);
//del tmp2
DelFile($s_File2);
}
function makeImageSY($s_Path, $s_File){
if(($GLOBALS["nSYWZFlag"]==0)&&($GLOBALS["nSYTPFlag"]==0)){return false;}
if(!isValidSLTSYExt($s_File)){return false;}
switch($GLOBALS["nSLTSYObject"]){
case 0:
$groundImage = $s_Path.$s_File;
if(!file_exists($groundImage)){return false;}
        $ground_info = getimagesize($groundImage); 
        $ground_w = $ground_info[0];
        $ground_h = $ground_info[1];
        switch($ground_info[2]){
            case 1:
$ground_im = imagecreatefromgif($groundImage);
break; 
            case 2:
$ground_im = imagecreatefromjpeg($groundImage);
break;
            case 3:
$ground_im = imagecreatefrompng($groundImage);
break;
            default:
return false; 
        }
imagealphablending($ground_im, true);
if($GLOBALS["nSYWZFlag"]==1){
if(($ground_w<$GLOBALS["nSYWZMinWidth"])||($ground_h<$GLOBALS["nSYWZMinHeight"])){return false;}
$posX = getSYPosX($GLOBALS["nSYWZPosition"], $ground_w, $GLOBALS["nSYWZTextWidth"]+$GLOBALS["nSYShadowOffset"], $GLOBALS["nSYWZPaddingH"]);
$posY = getSYPosY($GLOBALS["nSYWZPosition"], $ground_h, $GLOBALS["nSYWZTextHeight"]+$GLOBALS["nSYShadowOffset"], $GLOBALS["nSYWZPaddingV"]);
if($GLOBALS["sSYFontName"]){
$s_SYText = UTF8_to_Pagecode($GLOBALS["sSYText"], false);
$fontSize = imagettfbbox($GLOBALS["nSYFontSize"], 0, $GLOBALS["sSYFontName"], $s_SYText);
$n_SYWidth = $fontSize[2] - $fontSize[0];
$n_SYHeight = $fontSize[1] - $fontSize[7];
}
if($GLOBALS["sSYShadowColor"]==""){
$GLOBALS["sSYShadowColor"] = "ffffff";
}
$R = hexdec(substr($GLOBALS["sSYShadowColor"],0,2));
$G = hexdec(substr($GLOBALS["sSYShadowColor"],2,2));
$B = hexdec(substr($GLOBALS["sSYShadowColor"],4));
$textcolor = imagecolorallocate($ground_im, $R, $G, $B);
if($GLOBALS["sSYFontName"]){
imagettftext($ground_im, $GLOBALS["nSYFontSize"], 0, $posX+$GLOBALS["nSYShadowOffset"], $posY+$n_SYHeight+$GLOBALS["nSYShadowOffset"], $textcolor, $GLOBALS["sSYFontName"],  $s_SYText);
}else{
imagestring($ground_im, $GLOBALS["nSYFontSize"], $posX+$GLOBALS["nSYShadowOffset"], $posY+$GLOBALS["nSYShadowOffset"], $GLOBALS["sSYText"], $textcolor);
}
if($GLOBALS["sSYFontColor"]==""){
$GLOBALS["sSYFontColor"] = "000000";
}
$R = hexdec(substr($GLOBALS["sSYFontColor"],0,2));
$G = hexdec(substr($GLOBALS["sSYFontColor"],2,2));
$B = hexdec(substr($GLOBALS["sSYFontColor"],4));
$textcolor = imagecolorallocate($ground_im, $R, $G, $B);
if($GLOBALS["sSYFontName"]){
imagettftext($ground_im, $GLOBALS["nSYFontSize"], 0, $posX, $posY+$n_SYHeight, $textcolor, $GLOBALS["sSYFontName"],  $s_SYText);
}else{
imagestring($ground_im, $GLOBALS["nSYFontSize"], $posX, $posY, $GLOBALS["sSYText"], $textcolor);
}
}
if($GLOBALS["nSYTPFlag"]==1){
$waterImage = $GLOBALS["sSYPicPath"];
if(!file_exists($waterImage)){return false;}
$water_info = getimagesize($waterImage); 
$water_w = $water_info[0];
$water_h = $water_info[1];
switch($water_info[2]){
case 1:
$water_im = imagecreatefromgif($waterImage);
break;
case 2:
$water_im = imagecreatefromjpeg($waterImage);
break;
case 3:
$water_im = imagecreatefrompng($waterImage);
break;
default:
return false;
}
//if(($ground_w<$water_w)||($ground_h<$water_h)){return false;}
if(($ground_w<$GLOBALS["nSYTPMinWidth"])||($ground_h<$GLOBALS["nSYTPMinHeight"])){return false;}
$posX = getSYPosX($GLOBALS["nSYTPPosition"], $ground_w, $GLOBALS["nSYTPImageWidth"], $GLOBALS["nSYTPPaddingH"]);
$posY = getSYPosY($GLOBALS["nSYTPPosition"], $ground_h, $GLOBALS["nSYTPImageHeight"], $GLOBALS["nSYTPPaddingV"]);
imagecopymerge($ground_im, $water_im, $posX, $posY, 0, 0, $water_w, $water_h, $GLOBALS["nSYTPOpacity"]*100);
}
//@unlink($groundImage);
switch($ground_info[2]){
case 1:
imagegif($ground_im,$groundImage);
break;
case 2:
imagejpeg($ground_im,$groundImage);
break;
case 3:
imagepng($ground_im,$groundImage);
break;
}
if(isset($water_info)) unset($water_info);
if(isset($water_im)) imagedestroy($water_im);
unset($ground_info);
imagedestroy($ground_im);
break;
default:
break;
}
return true;
}
function getSYPosX($posFlag, $originalW, $syW, $paddingH){
switch($posFlag){
case 1:
case 2:
case 3:
return $paddingH;
break;
case 4:
case 5:
case 6:
return floor(($originalW - $syW) / 2);
break;
case 7:
case 8:
case 9:
return ($originalW - $paddingH - $syW);
break;
}
}
function getSYPosY($posFlag, $originalH, $syH, $paddingV){
switch($posFlag){
case 1:
case 4:
case 7:
return $paddingV;
break;
case 2:
case 5:
case 8:
return floor(($originalH - $syH) / 2);
break;
case 3:
case 6:
case 9:
return ($originalH - $paddingV - $syH);
break;
}
}
function makeImageSLT($s_Path, $s_File, $s_SmallFile){
if($GLOBALS["nSLTFlag"] != 1){return false;}
if(!isValidSLTSYExt($s_File)){return false;}
switch($GLOBALS["nSLTSYObject"]){
case 0:
$s_Ext = substr(strrchr($s_File, "."), 1);
switch($s_Ext){
case "png":
$im = imagecreatefrompng($s_Path.$s_File);
break;
case "gif":
$im = imagecreatefromgif($s_Path.$s_File);
break;
default:
$im = imagecreatefromjpeg($s_Path.$s_File);
break;
}
if(!$im){return false;}
$nOriginalWidth = imagesx($im);
$nOriginalHeight = imagesy($im);
switch($GLOBALS["nSLTCheckFlag"]){
case 0:
if ($nOriginalWidth <= $GLOBALS["nSLTMinSize"]){return false;}
$nWidth = $GLOBALS["nSLTOkSize"];
$nHeight = ($GLOBALS["nSLTOkSize"] / $nOriginalWidth) * $nOriginalHeight;
break;
case 1:
if ($nOriginalHeight <= $GLOBALS["nSLTMinSize"]){return false;}
$nHeight = $GLOBALS["nSLTOkSize"];
$nWidth = ($GLOBALS["nSLTOkSize"] / $nOriginalHeight) * $nOriginalWidth;
break;
case 2:
if (($nOriginalWidth <= $GLOBALS["nSLTMinSize"]) && ($nOriginalHeight <= $GLOBALS["nSLTMinSize"])){return false;}
if ($nOriginalWidth > $nOriginalHeight){
$nWidth = $GLOBALS["nSLTOkSize"];
$nHeight = ($GLOBALS["nSLTOkSize"] / $nOriginalWidth) * $nOriginalHeight;
}else{
$nHeight = $GLOBALS["nSLTOkSize"];
$nWidth = ($GLOBALS["nSLTOkSize"] / $nOriginalHeight) * $nOriginalWidth;
}
break;
}
if(function_exists("imagecopyresampled")){
$newim = imagecreatetruecolor($nWidth, $nHeight);
imagecopyresampled($newim, $im, 0, 0, 0, 0, $nWidth, $nHeight, $nOriginalWidth, $nOriginalHeight);
}else{
$newim = imagecreate($nWidth, $nHeight);
imagecopyresized($newim, $im, 0, 0, 0, 0, $nWidth, $nHeight, $nOriginalWidth, $nOriginalHeight);
}
touch($s_Path.$s_SmallFile);
switch($s_Ext){
case "png":
imagepng($newim,$s_Path.$s_SmallFile);
break;
case "gif":
imagegif($newim,$s_Path.$s_SmallFile);
break;
default:
imagejpeg($newim,$s_Path.$s_SmallFile);
break;
}
imagedestroy($newim);
imagedestroy($im);
break;
default:
break;
}
return true;
}
function isValidSLTSYExt($s_File){
$sExt = substr(strrchr($s_File, "."), 1);
$aExt = explode('|',strtoupper($GLOBALS["sSLTSYExt"]));
if(!in_array(strtoupper($sExt),$aExt)){
return false;
}
return true;
}
function getSmallImageFile($s_File){
$exts = explode(".",$s_File);
return $exts[0]."_s.".$exts[1];
}
function DoRemote(){
if (isset($_POST["eWebEditor_UploadText"])){
$sContent = stripslashes($_POST["eWebEditor_UploadText"]);
}else{
$sContent = "";
}
if (($GLOBALS["sAllowExt"] != "")&&($sContent!="")) {
$sContent = ReplaceRemoteUrl($sContent, $GLOBALS["sAllowExt"]);
}
echo "<html><head><title>eWebEditor</title><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body>".
"<input type=hidden id=UploadText value=\"".htmlspecialchars($sContent)."\">".
"</body></html>";
OutScript("parent.setHTML(document.getElementById('UploadText').value);try{parent.addUploadFile('".$GLOBALS["sOriginalFileName"]."', '".$GLOBALS["sPathFileName"]."');} catch(e){} parent.remoteUploadOK();");
}
function CheckSpaceSize(){
if ($GLOBALS["sSpaceSize"] == ""){return true;}
$s_Dir="";
if ($GLOBALS["sSpacePath"] == ""){
$s_Dir = $GLOBALS["sUploadDir"];
}else{
$s_Dir = $GLOBALS["sSpacePath"];
}
if ((GetFolderSize($s_Dir)/1024/1024)>=floatval($GLOBALS["sSpaceSize"])){
OutScript("parent.UploadError('space')");
exit();
}
}
function GetFolderSize( $dir ){ 
if(!$dir or !is_dir($dir)){ 
return 0; 
}
$ret = 0; 
$sub = opendir( $dir );
while( $file = readdir( $sub )){
if( is_dir( $dir . '/' . $file ) && $file !== ".." && $file !== "." ){
$ret += GetFolderSize( $dir . '/' . $file );
unset( $file );
}elseif(!is_dir( $dir . '/' . $file )){
$stats = stat( $dir . '/' . $file );
$ret += $stats['size'];
unset( $file );
}
}
closedir( $sub );
unset( $sub );
return $ret;
}
function DoCreateNewDir(){
if ($GLOBALS["sCusDir"]!=""){
$a = explode("/", $GLOBALS["sCusDir"]);
for($i=0; $i<count($a); $i++){
if ($a[$i]!=""){
CreateFolder($a[$i]);
}
}
}
CheckSpaceSize();
switch ($GLOBALS["sAutoDirOrderFlag"]){
case "0":
DoCreateNewTypeDir();
DoCreateNewDateDir();
break;
case "1":
DoCreateNewDateDir();
DoCreateNewTypeDir();
break;
}
}
function DoCreateNewDateDir(){
if ($GLOBALS["sAutoDir"]==""){return;}
$s_DateDir = ReplaceTime(time(), $GLOBALS["sAutoDir"]);
$a = explode("/", $s_DateDir);
for($i=0; $i<count($a); $i++){
if ($a[$i]!=""){
CreateFolder($a[$i]);
}
}
}
function DoCreateNewTypeDir(){
if ($GLOBALS["sAutoTypeDir"]==""){return;}
$a = explode("/", $GLOBALS["sAutoTypeDir"]);
for($i=0; $i<count($a); $i++){
if ($a[$i]!=""){
CreateFolder($a[$i]);
}
}
}
function CreateFolder($s_Folder){
$GLOBALS["sUploadDir"] = $GLOBALS["sUploadDir"].$s_Folder."/";
$GLOBALS["sContentPath"] = $GLOBALS["sContentPath"].$s_Folder."/";
if (!is_dir($GLOBALS["sUploadDir"])){
mkdir($GLOBALS["sUploadDir"]);
}
}
function GetRndFileName($s_Ext){
if ($GLOBALS["sAction"]=="MFU" && $GLOBALS["sParamBlockFile"]!=""){
return $GLOBALS["sParamBlockFile"].".".$s_Ext;
}
$s_Rnd = "";
if ($GLOBALS["sParamRnd"]==""){
$s_Rnd = rand(1,999);
}else{
$s_Rnd = $GLOBALS["sParamRnd"];
}
$s_RndTime = date("YmdHis").$s_Rnd;
$s_FileName = $s_RndTime.".".$s_Ext;
if ($GLOBALS["sAction"]=="SAVE" || $GLOBALS["sAction"]=="MFU"){
$s_Pre = GetOriginalFileNamePre($GLOBALS["sOriginalFileName"], $s_Ext);
if ($s_Pre!=""){
if (($GLOBALS["sFileNameMode"]=="1") || (($GLOBALS["sFileNameMode"]=="2") && ($GLOBALS["sType"]=="FILE"))){
$s_FileName = $s_Pre.".".$s_Ext;
if ($GLOBALS["sFileNameSameFix"]!=""){
if (file_exists($GLOBALS["sUploadDir"].$s_FileName)){
$s_FileName = str_replace("{time}", $s_RndTime, $GLOBALS["sFileNameSameFix"]);
if (strpos($s_FileName, "{sn}")!==false){
$i = 0;
while (true){
$i = $i + 1;
$s = str_replace("{sn}", strval($i), $s_FileName);
$s = str_replace("{name}", $s_Pre, $s);
if (!file_exists($GLOBALS["sUploadDir"].$s.".".$s_Ext)){
$s_FileName = $s;
break;
}
}
}else{
$s_FileName = str_replace("{name}", $s_Pre, $s_FileName);
}
$s_FileName = $s_FileName.".".$s_Ext;
}
}
}
}
}
return $s_FileName;
}
function GetOriginalFileNamePre($s_FileName, $s_OkExt){
$s_FileName = str_replace("%20", " ", $s_FileName);
$s_FileName = trim($s_FileName);
if ($s_FileName==""){return "";}
$s_FileName = str_replace("/", "\\", $s_FileName);
$n = strrpos($s_FileName, "\\");
if ($n!==false){
$s_FileName = substr($s_FileName, $n+1);
}
$n = strrpos($s_FileName, ".");
if ($n===false){return "";}
$s_Ext = substr($s_FileName, $n+1);
if (strtolower($s_Ext) != strtolower($s_OkExt)){return "";}
$s_Pre = substr($s_FileName, 0, $n);
if (!IsFileNameFormat($s_Pre)) {
$s_Pre = "";
}
return trim($s_Pre);
}
function OutScript($str){
echo "<script language=javascript>".$str."</script>";
}
function IsValidExt($sExt){
$aExt = explode('|',$GLOBALS["sAllowExt"]);
if(!in_array(strtoupper($sExt),$aExt)){
return false;
}
return true;
}
function  InitUpload(){
global $sType, $sStyleName, $sCusDir, $sParamSYFlag, $sParamRnd;
global $sAllowExt, $nAllowSize, $sUploadDir, $nUploadObject, $sAutoDir, $sBaseUrl, $sContentPath, $sSetContentPath;
global $sFileExt, $sOriginalFileName, $sSaveFileName, $sPathFileName, $nFileNum;
global $nSLTFlag, $nSLTMode, $nSLTCheckFlag, $nSLTMinSize, $nSLTOkSize, $nSYWZFlag, $sSYText, $sSYFontColor, $nSYFontSize, $sSYFontName, $sSYPicPath, $nSLTSYObject, $sSLTSYExt, $nSYWZMinWidth, $sSYShadowColor, $nSYShadowOffset, $nSYWZMinHeight, $nSYWZPosition, $nSYWZTextWidth, $nSYWZTextHeight, $nSYWZPaddingH, $nSYWZPaddingV, $nSYTPFlag, $nSYTPMinWidth, $nSYTPMinHeight, $nSYTPPosition, $nSYTPPaddingH, $nSYTPPaddingV, $nSYTPImageWidth, $nSYTPImageHeight, $nSYTPOpacity;
global $sSpaceSize, $sSpacePath, $sMFUMode;
global $sParamBlockFile, $sParamBlockFlag;
global $sFileNameMode, $sFileNameSameFix, $sAutoDirOrderFlag, $sAutoTypeDir;
global $sSYValidNormal, $sSYValidLocal, $sSYValidRemote;
$sType = TrimGet("type");
$sStyleName = TrimGet("style");
$sCusDir = TrimGet("cusdir");
$sParamSYFlag = TrimGet("syflag");
$sParamRnd = TrimGet("rnd");
$s_SKey = TrimGet("skey");
$s_SParams = TrimGet("sparams");
$sParamBlockFile = TrimGet("blockfile");
$sParamBlockFlag = TrimGet("blockflag");
if ($sParamBlockFile != ""){
if (!IsFileNameFormat($sParamBlockFile)){
OutScript("blockfile");
exit;
}
}
$bValidStyle = false;
$numElements = count($GLOBALS["aStyle"]);
for($i=1; $i<=$numElements; $i++){
$aStyleConfig = explode("|||", $GLOBALS["aStyle"][$i]);
if (strtolower($sStyleName)==strtolower($aStyleConfig[0])){
$bValidStyle = true;
break;
}
}
if ($bValidStyle == false) {
OutScript("parent.UploadError('style')");
}
if ($aStyleConfig[61] != "1"){
$sCusDir = "";
}
if (($aStyleConfig[61] == "2") && (($s_SKey != "") || (IsOkSParams($s_SParams, $aStyleConfig[70])))){
$ss_FileSize="";
$ss_FileBrowse="";
$ss_SpaceSize="";
$ss_SpacePath="";
$ss_PathMode="";
$ss_PathUpload="";
$ss_PathCusDir="";
$ss_PathCode="";
$ss_PathView="";
if ($s_SKey != ""){
$ss_FileSize = GetSAPIvalue($s_SKey, "FileSize");
$ss_FileBrowse = GetSAPIvalue($s_SKey, "FileBrowse");
$ss_SpaceSize = GetSAPIvalue($s_SKey, "SpaceSize");
$ss_SpacePath = GetSAPIvalue($s_SKey, "SpacePath");
$ss_PathMode = GetSAPIvalue($s_SKey, "PathMode");
$ss_PathUpload = GetSAPIvalue($s_SKey, "PathUpload");
$ss_PathCusDir = GetSAPIvalue($s_SKey, "PathCusDir");
$ss_PathCode = GetSAPIvalue($s_SKey, "PathCode");
$ss_PathView = GetSAPIvalue($s_SKey, "PathView");
}else{
$a_SParams = explode("|", $s_SParams);
$ss_FileSize = $a_SParams[1];
$ss_FileBrowse = $a_SParams[2];
$ss_SpaceSize = $a_SParams[3];
$ss_SpacePath = $a_SParams[4];
$ss_PathMode = $a_SParams[5];
$ss_PathUpload = $a_SParams[6];
$ss_PathCusDir = $a_SParams[7];
$ss_PathCode = $a_SParams[8];
$ss_PathView = $a_SParams[9];
}
if (is_numeric($ss_FileSize)){
$aStyleConfig[11] = $ss_FileSize;
$aStyleConfig[12] = $ss_FileSize;
$aStyleConfig[13] = $ss_FileSize;
$aStyleConfig[14] = $ss_FileSize;
$aStyleConfig[15] = $ss_FileSize;
$aStyleConfig[45] = $ss_FileSize;
}else{
$ss_FileSize = "";
}
if ($ss_FileBrowse == "0" || $ss_FileBrowse == "1"){
$aStyleConfig[43] = $ss_FileBrowse;
}else{
$ss_FileBrowse = "";
}
if (is_numeric($ss_SpaceSize)){
$aStyleConfig[78] = $ss_SpaceSize;
}else{
$ss_SpaceSize = "";
}
if ($ss_PathMode != ""){
$aStyleConfig[19] = $ss_PathMode;
}
if ($ss_PathUpload != ""){
$aStyleConfig[3] = $ss_PathUpload;
}
if ($ss_PathCode != ""){
$aStyleConfig[23] = $ss_PathCode;
}
if ($ss_PathView != ""){
$aStyleConfig[22] = $ss_PathView;
}
$sCusDir = $ss_PathCusDir;
$sSpacePath = $ss_SpacePath;
}else{
$sSpacePath = "";
}
$sBaseUrl = $aStyleConfig[19];
$nUploadObject = (int)$aStyleConfig[20];
$sAutoDir = $aStyleConfig[71];
$sUploadDir = $aStyleConfig[3];
if ($sBaseUrl!="3"){
if (substr($sUploadDir, 0, 1) != "/"){
$sUploadDir = "../".$sUploadDir;
}
}
switch ($sBaseUrl){
case "0":
case "3":
$sContentPath = $aStyleConfig[23];
break;
case "1":
$sContentPath = RelativePath2RootPath($sUploadDir);
break;
case "2":
$sContentPath = RootPath2DomainPath(RelativePath2RootPath($sUploadDir));
break;
}
$sSetContentPath = $sContentPath;
if ($sBaseUrl!="3"){
$sUploadDir = realpath($sUploadDir);
}
if ((substr($sUploadDir,-1)!="\\") && (substr($sUploadDir,-1)!="/")){
$sUploadDir .= "/";
}
switch (strtoupper($sType)){
case "REMOTE":
$sAllowExt = $aStyleConfig[10];
$nAllowSize = (int)$aStyleConfig[15];
$sAutoTypeDir = $aStyleConfig[93];
break;
case "FILE":
$sAllowExt = $aStyleConfig[6];
$nAllowSize = (int)$aStyleConfig[11];
$sAutoTypeDir = $aStyleConfig[92];
break;
case "MEDIA":
$sAllowExt = $aStyleConfig[9];
$nAllowSize = (int)$aStyleConfig[14];
$sAutoTypeDir = $aStyleConfig[91];
break;
case "FLASH":
$sAllowExt = $aStyleConfig[7];
$nAllowSize = (int)$aStyleConfig[12];
$sAutoTypeDir = $aStyleConfig[90];
break;
case "LOCAL":
$sAllowExt = $aStyleConfig[44];
$nAllowSize = (int)$aStyleConfig[45];
$sAutoTypeDir = $aStyleConfig[94];
break;
default:
$sAllowExt = $aStyleConfig[8];
$nAllowSize = (int)$aStyleConfig[13];
$sAutoTypeDir = $aStyleConfig[89];
break;
}
$sAllowExt = strtoupper($sAllowExt);
$nSLTFlag = (int)$aStyleConfig[29];
$nSLTMode = (int)$aStyleConfig[69];
$nSLTCheckFlag = (int)$aStyleConfig[77];
$nSLTMinSize = (int)$aStyleConfig[30];
$nSLTOkSize = (int)$aStyleConfig[31];
$nSYWZFlag = (int)$aStyleConfig[32];
$sSYText = $aStyleConfig[33];
$sSYFontColor = $aStyleConfig[34];
$nSYFontSize = (int)$aStyleConfig[35];
$sSYFontName = $aStyleConfig[36];
$sSYPicPath = $aStyleConfig[37];
$nSLTSYObject = (int)$aStyleConfig[38];
$sSLTSYExt = $aStyleConfig[39];
$nSYWZMinWidth = (int)$aStyleConfig[40];
$sSYShadowColor = $aStyleConfig[41];
$nSYShadowOffset = (int)$aStyleConfig[42];
$nSYWZMinHeight = (int)$aStyleConfig[46];
$nSYWZPosition = (int)$aStyleConfig[47];
$nSYWZTextWidth = (int)$aStyleConfig[48];
$nSYWZTextHeight = (int)$aStyleConfig[49];
$nSYWZPaddingH = (int)$aStyleConfig[50];
$nSYWZPaddingV = (int)$aStyleConfig[51];
$nSYTPFlag = (int)$aStyleConfig[52];
$nSYTPMinWidth = (int)$aStyleConfig[53];
$nSYTPMinHeight = (int)$aStyleConfig[54];
$nSYTPPosition = (int)$aStyleConfig[55];
$nSYTPPaddingH = (int)$aStyleConfig[56];
$nSYTPPaddingV = (int)$aStyleConfig[57];
$nSYTPImageWidth = (int)$aStyleConfig[58];
$nSYTPImageHeight = (int)$aStyleConfig[59];
$nSYTPOpacity = (float)$aStyleConfig[60];
$sSpaceSize = $aStyleConfig[78];
$sMFUMode = $aStyleConfig[79];
$sFileNameMode = $aStyleConfig[68];
$sFileNameSameFix = $aStyleConfig[87];
$sAutoDirOrderFlag = $aStyleConfig[88];
$sSYValidNormal = $aStyleConfig[99];
$sSYValidLocal = $aStyleConfig[100];
$sSYValidRemote = $aStyleConfig[101];
if ((($GLOBALS["sAction"]=="SAVE" || $GLOBALS["sAction"]=="MFU") && $sSYValidNormal!="1") || ($GLOBALS["sAction"]=="LOCAL" && $sSYValidLocal!="1") || ($GLOBALS["sAction"]=="REMOTE" && $sSYValidRemote!="1")){
$nSYWZFlag = 0;
$nSYTPFlag = 0;
}
if ($nSYWZFlag==2){
if ($sParamSYFlag == "1"){
$nSYWZFlag = 1;
}else{
$nSYWZFlag = 0;
}
}
if ($nSYTPFlag==2){
if ($sParamSYFlag == "1"){
$nSYTPFlag = 1;
}else{
$nSYTPFlag = 0;
}
}
if (!IsInt($sParamRnd)){
$sParamRnd = "";
}
if ($sCusDir!=""){
$sCusDir = str_replace("\\", "/", $sCusDir);
if ((substr($sCusDir,0,1)=="/") || (substr($sCusDir,0,1)==".") || (substr($sCusDir, -1)==".") || (strpos($sCusDir, "./")!==false) || (strpos($sCusDir, "/.")!==false) || (strpos($sCusDir, "//")!==false) || (strpos($sCusDir, "..")!==false)){
$sCusDir = "";
}else{
if (substr($sCusDir, -1) != "/"){
$sCusDir = $sCusDir."/";
}
}
}
}
function RelativePath2RootPath($url){
$sTempUrl = $url;
if (substr($sTempUrl, 0, 1) == "/"){
return $sTempUrl;
}
$sWebEditorPath = $_SERVER["SCRIPT_NAME"];
$sWebEditorPath = substr($sWebEditorPath, 0, strrpos($sWebEditorPath, "/"));
while (substr($sTempUrl, 0, 3) == "../"){
$sTempUrl = substr($sTempUrl, 3, strlen($sTempUrl));
$sWebEditorPath = substr($sWebEditorPath, 0, strrpos($sWebEditorPath, "/"));
}
return $sWebEditorPath."/".$sTempUrl;
}
function RootPath2DomainPath($url){
$sProtocol = explode("/", $_SERVER["SERVER_PROTOCOL"]);
$sHost = strtolower($sProtocol[0])."://".$_SERVER["HTTP_HOST"];
return $sHost.$url;
}
function ReplaceRemoteUrl($sHTML, $sExt){
$s_Content = $sHTML;
$s_Match = "/(http|https|ftp|rtsp|mms):(\/\/|\\\\){1}(([A-Za-z0-9_-])+[.]){1,}([A-Za-z0-9]{1,5})\/(\S+\.(".$sExt."))/i";
if (!preg_match_all($s_Match, $s_Content, $a_Matches)){
return $s_Content;
};
$s_SameSiteDomain = "";
if ($GLOBALS["sBaseUrl"]=="3"){
$s_SameSiteDomain = GetDomainFromUrl($GLOBALS["sSetContentPath"]);
}else{
$s_SameSiteDomain = strtolower($_SERVER["SERVER_NAME"]);
}
for ($i=0; $i< count($a_Matches[0]); $i++) {
$s=$a_Matches[0][$i];
$b_SameSiteUrl = false;
if (GetDomainFromUrl($s) == $s_SameSiteDomain ){
$b_SameSiteUrl = true;
}
if (!$b_SameSiteUrl){
$a_RepeatRemote[] = $s;
}
}
$a_RemoteUrl = array_unique($a_RepeatRemote);
$nFileNum = 0;
for ($i=0; $i< count($a_RemoteUrl); $i++) {
$SaveFileType = substr($a_RemoteUrl[$i], strrpos($a_RemoteUrl[$i], ".") + 1);
$SaveFileName = GetRndFileName($SaveFileType);
if (SaveRemoteFile($SaveFileName, $a_RemoteUrl[$i])) {
makeImageSY($GLOBALS["sUploadDir"], $SaveFileName);
$nFileNum = $nFileNum + 1;
if ($nFileNum > 1) {
$GLOBALS["sOriginalFileName"] .= "|";
$GLOBALS["sSaveFileName"] .= "|";
$GLOBALS["sPathFileName"] .= "|";
}
$GLOBALS["sOriginalFileName"] .= substr($a_RemoteUrl[i], strrpos($a_RemoteUrl[i], "/") + 1);
$GLOBALS["sSaveFileName"] .= $SaveFileName;
$GLOBALS["sPathFileName"] .= $GLOBALS["sContentPath"].$SaveFileName;
$s_Content = str_replace($a_RemoteUrl[$i], $GLOBALS["sContentPath"].$SaveFileName, $s_Content);
}
}
return $s_Content;
}
function SaveRemoteFile($s_LocalFileName, $s_RemoteFileUrl) { 
$fp = @fopen($s_RemoteFileUrl, "rb");
if (!$fp) {return false;}
$cont = "";
while(!feof($fp)) {
$cont.= fread($fp, 2048);
}
fclose($fp);
if (strlen($cont) > $GLOBALS["nAllowSize"]*1024) {
return false;
}
$fp2 = @fopen($GLOBALS["sUploadDir"].$s_LocalFileName,"w");
fwrite($fp2,$cont);
fclose($fp2);
return true;
} 
function DelFile($s_MapFile){
if(file_exists($s_MapFile)){
unlink($s_MapFile);
}
}
function GetDomainFromUrl($s_Url){
$s = strtolower($s_Url);
$n = strpos($s, "://");
if ($n!==false){
$s = substr($s, $n+3);
}
$n = strpos($s, "/");
if ($n!==false){
$s = substr($s, 0, $n-1);
}
$n = strpos($s, ":");
if ($n!==false){
$s = substr($s, 0, $n-1);
}
return $s;
}
function ReplaceTime($s_Time, $s_Patt){
$y2 = date("Y", $s_Time);
$y1 = date("y", $s_Time);
$m1 = date("n", $s_Time);
$m2 = date("m", $s_Time);
$d1 = date("j", $s_Time);
$d2 = date("d", $s_Time);
$h1 = date("G", $s_Time);
$h2 = date("H", $s_Time);
$i2 = date("i", $s_Time);
$i1 = (substr($i2,0,1)=="0") ? substr($i2,1,1) : $i2;
$s2 = date("s", $s_Time);
$s1 = (substr($s2,0,1)=="0") ? substr($s2,1,1) : $s2;
$ret = $s_Patt;
$ret = str_replace("{yyyy}", $y2, $ret);
$ret = str_replace("{yy}", $y1, $ret);
$ret = str_replace("{mm}", $m2, $ret);
$ret = str_replace("{m}", $m1, $ret);
$ret = str_replace("{dd}", $d2, $ret);
$ret = str_replace("{d}", $d1, $ret);
$ret = str_replace("{hh}", $h2, $ret);
$ret = str_replace("{h}", $h1, $ret);
$ret = str_replace("{ii}", $i2, $ret);
$ret = str_replace("{i}", $i1, $ret);
$ret = str_replace("{ss}", $s2, $ret);
$ret = str_replace("{s}", $s1, $ret);
return $ret;
}
function IsFileNameFormat($s_Name){
if (substr($s_Name, 0, 1)=="."){return false;}
if (preg_match("/[\/\\\:\*\?\"\<\>\|\r\n\t]+/", $s_Name)){return false;}
return true;
}
?>