<?php
header("content-Type: text/html; charset=utf-8");
//error_reporting(E_ALL);

require("private.php");
$sAction = strtoupper(TrimGet("action"));
switch ($sAction) {
    case "LICENSE":
        ShowLicense();
        break;
    case "CONFIG":
        ShowConfig();
        break;
}
function ShowLicense()
{
    if ($GLOBALS["sLicense"] == "") {
        return;
    }
    $r = TrimGet("r");
    if (strlen($r) < 10) {
        return;
    }
    $s_Domain = strtolower($_SERVER["SERVER_NAME"]);
    if (($s_Domain == "127.0.0.1") || ($s_Domain == "localhost")) {
        return;
    }
    $ret = "";
    $aa  = explode(";", $GLOBALS["sLicense"]);
    for ($i = 0; $i < count($aa); $i++) {
        $a = explode(":", $aa[$i]);
        if (count($a) == 8) {
            if (strlen($a[7]) == 32) {
                $b = false;
                if ($a[0] == "3") {
                    if (($a[6] == $s_Domain) || ("." . $a[6] == substr($s_Domain, -strlen($a[6]) - 1))) {
                        $b = true;
                    }
                } else {
                    if (($a[6] == $s_Domain) || ("www." . $a[6] == $s_Domain)) {
                        $b = true;
                    }
                }
                if ($b) {
                    for ($j = 0; $j < 7; $j++) {
                        $ret = $ret . $a[$j] . ":";
                    }
                    $ret = $ret . MD5_16(substr($a[7], 0, 16) . $r) . MD5_16(substr($a[7], 16, 16) . $r);
                    break;
                }
            }
        }
    }
    echo $ret;
}
function ShowConfig()
{
    $s_License = "ok";
    
    $n_StyleID   = 0;
    $s_StyleName = TrimGet("style");
    $b           = false;
    $numElements = count($GLOBALS["aStyle"]);
    for ($i = 1; $i <= $numElements; $i++) {
        $aTmpStyle = explode("|||", $GLOBALS["aStyle"][$i]);
        if (strtolower($s_StyleName) == strtolower($aTmpStyle[0])) {
            $n_StyleID = $i;
            $b         = true;
            break;
        }
    }
    if (!$b) {
        return;
    }
    $ret       = "";
    $aTmpStyle = explode("|||", $GLOBALS["aStyle"][$n_StyleID]);
    $ret       = $ret . "config.FixWidth = \"" . $aTmpStyle[1] . "\";\r\n";
    if ($aTmpStyle[19] == "3") {
        $ret = $ret . "config.UploadUrl = \"" . $aTmpStyle[23] . "\";\r\n";
    } else {
        $ret = $ret . "config.UploadUrl = \"" . $aTmpStyle[3] . "\";\r\n";
    }
    
    $ret     = $ret . "config.InitMode = \"" . $aTmpStyle[18] . "\";\n\r";
    $ret     = $ret . "config.AutoDetectPaste = \"" . $aTmpStyle[17] . "\";\n\r";
    $ret     = $ret . "config.BaseUrl = \"" . $aTmpStyle[19] . "\";\n\r";
    $ret     = $ret . "config.BaseHref = \"" . $aTmpStyle[22] . "\";\n\r";
    $ret     = $ret . "config.AutoRemote = \"" . $aTmpStyle[24] . "\";\n\r";
    $ret     = $ret . "config.ShowBorder = \"" . $aTmpStyle[25] . "\";\n\r";
    $ret     = $ret . "config.StateFlag = \"" . $aTmpStyle[16] . "\";\n\r";
    $ret     = $ret . "config.SBCode = \"" . $aTmpStyle[62] . "\";\n\r";
    $ret     = $ret . "config.SBEdit = \"" . $aTmpStyle[63] . "\";\n\r";
    $ret     = $ret . "config.SBText = \"" . $aTmpStyle[64] . "\";\n\r";
    $ret     = $ret . "config.SBView = \"" . $aTmpStyle[65] . "\";\n\r";
    $ret     = $ret . "config.SBSize = \"" . $aTmpStyle[76] . "\";\n\r";
    $ret     = $ret . "config.EnterMode = \"" . $aTmpStyle[66] . "\";\n\r";
    $ret     = $ret . "config.Skin = \"" . $aTmpStyle[2] . "\";\n\r";
    $ret     = $ret . "config.AutoDetectLanguage = \"" . $aTmpStyle[27] . "\";\n\r";
    $ret     = $ret . "config.DefaultLanguage = \"" . $aTmpStyle[28] . "\";\n\r";
    $ret     = $ret . "config.AllowBrowse = \"" . $aTmpStyle[43] . "\";\n\r";
    $ret     = $ret . "config.AllowImageSize = \"" . $aTmpStyle[13] . "\";\n\r";
    $ret     = $ret . "config.AllowFlashSize = \"" . $aTmpStyle[12] . "\";\n\r";
    $ret     = $ret . "config.AllowMediaSize = \"" . $aTmpStyle[14] . "\";\n\r";
    $ret     = $ret . "config.AllowFileSize = \"" . $aTmpStyle[11] . "\";\n\r";
    $ret     = $ret . "config.AllowRemoteSize = \"" . $aTmpStyle[15] . "\";\n\r";
    $ret     = $ret . "config.AllowLocalSize = \"" . $aTmpStyle[45] . "\";\n\r";
    $ret     = $ret . "config.AllowImageExt = \"" . $aTmpStyle[8] . "\";\n\r";
    $ret     = $ret . "config.AllowFlashExt = \"" . $aTmpStyle[7] . "\";\n\r";
    $ret     = $ret . "config.AllowMediaExt = \"" . $aTmpStyle[9] . "\";\n\r";
    $ret     = $ret . "config.AllowFileExt = \"" . $aTmpStyle[6] . "\";\n\r";
    $ret     = $ret . "config.AllowRemoteExt = \"" . $aTmpStyle[10] . "\";\n\r";
    $ret     = $ret . "config.AllowLocalExt = \"" . $aTmpStyle[44] . "\";\n\r";
    $ret     = $ret . "config.AreaCssMode = \"" . $aTmpStyle[67] . "\";\n\r";
    $ret     = $ret . "config.SLTFlag = \"" . $aTmpStyle[29] . "\";\n\r";
    $ret     = $ret . "config.SLTMinSize = \"" . $aTmpStyle[30] . "\";\n\r";
    $ret     = $ret . "config.SLTOkSize = \"" . $aTmpStyle[31] . "\";\n\r";
    $ret     = $ret . "config.SLTMode = \"" . $aTmpStyle[69] . "\";\n\r";
    $ret     = $ret . "config.SLTCheckFlag = \"" . $aTmpStyle[77] . "\";\n\r";
    $ret     = $ret . "config.SYWZFlag = \"" . $aTmpStyle[32] . "\";\n\r";
    $ret     = $ret . "config.SYTPFlag = \"" . $aTmpStyle[52] . "\";\n\r";
    $ret     = $ret . "config.FileNameMode = \"" . $aTmpStyle[68] . "\";\n\r";
    $ret     = $ret . "config.PaginationMode = \"" . $aTmpStyle[72] . "\";\n\r";
    $ret     = $ret . "config.PaginationKey = \"" . $aTmpStyle[73] . "\";\n\r";
    $ret     = $ret . "config.PaginationAutoFlag = \"" . $aTmpStyle[74] . "\";\n\r";
    $ret     = $ret . "config.PaginationAutoNum = \"" . $aTmpStyle[75] . "\";\n\r";
    $ret     = $ret . "config.SParams = \"\";\n\r";
    $ret     = $ret . "config.SpaceSize = \"" . $aTmpStyle[78] . "\";\n\r";
    $ret     = $ret . "config.MFUBlockSize = \"" . $aTmpStyle[80] . "\";\n\r";
    $ret     = $ret . "config.MFUEnable = \"" . $aTmpStyle[81] . "\";\n\r";
    $ret     = $ret . "config.CodeFormat = \"" . $aTmpStyle[82] . "\";\n\r";
    $ret     = $ret . "config.TB2Flag = \"" . $aTmpStyle[83] . "\";\n\r";
    $ret     = $ret . "config.TB2Mode = \"" . $aTmpStyle[84] . "\";\n\r";
    $ret     = $ret . "config.TB2Max = \"" . $aTmpStyle[85] . "\";\n\r";
    $ret     = $ret . "config.ShowBlock = \"" . $aTmpStyle[86] . "\";\n\r";
    $ret     = $ret . "config.WIIMode = \"" . $aTmpStyle[95] . "\";\n\r";
    $ret     = $ret . "config.QFIFontName = \"" . $aTmpStyle[96] . "\";\n\r";
    $ret     = $ret . "config.QFIFontSize = \"" . $aTmpStyle[97] . "\";\n\r";
    $ret     = $ret . "config.UIMinHeight = \"" . $aTmpStyle[98] . "\";\n\r";
    $ret     = $ret . "config.SYVNormal = \"" . $aTmpStyle[99] . "\";\n\r";
    $ret     = $ret . "config.SYVLocal = \"" . $aTmpStyle[100] . "\";\n\r";
    $ret     = $ret . "config.SYVRemote = \"" . $aTmpStyle[101] . "\";\n\r";
    $ret     = $ret . "config.AutoDonePasteWord = \"" . $aTmpStyle[102] . "\";\n\r";
    $ret     = $ret . "config.AutoDonePasteExcel = \"" . $aTmpStyle[103] . "\";\n\r";
    $ret     = $ret . "config.AutoDoneQuickFormat = \"" . $aTmpStyle[104] . "\";\n\r";
    $ret     = $ret . "config.WIAPI = \"" . $aTmpStyle[105] . "\";\n\r";
    $ret     = $ret . "config.AutoDonePasteOption = \"" . $aTmpStyle[106] . "\";\n\r";
    $ret     = $ret . "config.Cookie = \"" . $_SERVER['HTTP_COOKIE'] . "\";\n\r";
    $ret     = $ret . "config.L = \"" . $s_License . "\";\n\r";
    $ret     = $ret . "config.ServerExt = \"php\";\n\r";
    $ret     = $ret . "config.Charset = \"utf-8\";\n\r";
    $ret     = $ret . "\r\n";
    $ret     = $ret . "config.Toolbars = [\r\n";
    $s_Order = "";
    $s_ID    = "";
    for ($n = 1; $n <= count($GLOBALS["aToolbar"]); $n++) {
        if ($GLOBALS["aToolbar"][$n] != "") {
            $aTmpToolbar = explode("|||", $GLOBALS["aToolbar"][$n]);
            if ((int) $aTmpToolbar[0] == $n_StyleID) {
                if ($s_ID != "") {
                    $s_ID    = $s_ID . "|";
                    $s_Order = $s_Order . "|";
                }
                $s_ID    = $s_ID . $n;
                $s_Order = $s_Order . $aTmpToolbar[3];
            }
        }
    }
    if ($s_ID != "") {
        $a_ID    = explode("|", $s_ID);
        $a_Order = explode("|", $s_Order);
        for ($n = 0; $n < count($a_Order); $n++) {
            $a_Order[$n] = (int) ($a_Order[$n]);
            $a_ID[$n]    = (int) ($a_ID[$n]);
        }
        for ($n = 0; $n < count($a_ID); $n++) {
            $aTmpToolbar = explode("|||", $GLOBALS["aToolbar"][$a_ID[$n]]);
            $aTmpButton  = explode("|", $aTmpToolbar[1]);
            $n_Count     = count($aTmpButton);
            if ($n > 0) {
                $ret = $ret . ",\r\n";
            }
            $ret = $ret . "\t[";
            for ($i = 0; $i < $n_Count; $i++) {
                if ($i > 0) {
                    $ret = $ret . ", ";
                }
                $ret = $ret . "\"" . $aTmpButton[$i] . "\"";
            }
            $ret = $ret . "]";
        }
    }
    $ret = $ret . "\r\n];\r\n";
    echo $ret;
}
function CheckLicense()
{
    $s_Domain = strtolower($_SERVER["SERVER_NAME"]);
    if (($s_Domain == "127.0.0.1") || ($s_Domain == "localhost")) {
        return true;
    }
    if ($GLOBALS["sLicense"] == "") {
        return false;
    }
    $aa = explode(";", $GLOBALS["sLicense"]);
    for ($i = 0; $i < count($aa); $i++) {
        $a = explode(":", $aa[$i]);
        if (count($a) == 8) {
            if (strlen($a[7]) == 32) {
                if ($a[0] == "3") {
                    if (($a[6] == $s_Domain) || ("." . $a[6] == substr($s_Domain, -strlen($a[6]) - 1))) {
                        return true;
                    }
                } else {
                    if (($a[6] == $s_Domain) || ("www." . $a[6] == $s_Domain)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
?>