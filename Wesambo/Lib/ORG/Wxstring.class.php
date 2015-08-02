<?php
class Wxstring{

	/**
	 * 判断字符串开头
	 * 
	 * @param string $haystack
	 * @param string $needle
	 * @param boolean $case 是否大小写敏感
	 */
	public static function start_with($haystack,$needle,$case=true){
		if($case){
			return strpos($haystack, $needle, 0) === 0;
		}
		return stripos($haystack, $needle, 0) === 0;
	}

	/**
	 * 判断字符串结尾
	 *
	 * @param string $haystack
	 * @param string $needle
	 * @param boolean $case 是否大小写敏感
	 */
	public static function end_with($haystack,$needle,$case=true){
		$expectedPosition = strlen($haystack) - strlen($needle);

		if($case){
			return strrpos($haystack, $needle, 0) === $expectedPosition;
		}
		return strripos($haystack, $needle, 0) === $expectedPosition;		
	}
	
	/**
	 * 判断字符包含
	 *
	 * @param string $haystack
	 * @param string $needle
	 * @param boolean $case 是否大小写敏感
	 */
	public static function contain($haystack,$needle,$case=true){
		if($case){
			return strpos($haystack, $needle, 0) !== false;
		}
		return stripos($haystack, $needle, 0) !== false;
	}
	
	/**
	 * 根据正则表达式找到匹配到的第一个字串
	 * @param string $str 被查找的字符串
	 * @param string $reg 正则表达式
	 * @return string
	 */
	public static function  find_first_string_by_reg($str,$reg){
		$out = array();
		if(1==preg_match($reg,$str,$out,PREG_OFFSET_CAPTURE)){
			return $out[0][0];
		} else {
			return '';
		}
	}
	
	/**
	 * 字符串转换为二进制
	 * 
	 * @param string $str
	 */
	public static function str_to_binary($str){
		$str = base64_encode($str);
		$len = strlen($str);
		$data = '';
		for($i=0; $i<$len; $i++) {
			$data .= sprintf("%08b", ord(substr($str, $i, 1)));
		}
		echo $str.'</br>';
		echo $data;
		die();
		return  $data;
	}
	
	/**
	 * 二进制转换为字符串
	 *
	 * @param string $str
	 */
	public static function binary_to_str($str){
		$len = strlen($str);
		$data = '';
        for($i=0; $i<($len/8); $i++) {
                $data .= chr(intval(substr($str, $i * 8, 8), 2));
        }
		return base64_decode($data);
	}
	
	function encrypt($string, $action = 'ENCODE', $hash = '')
	{
		$action != 'E' && $string = base64_decode($string);
		$code = '';
		$key = md5($hash);
		$keylen = strlen($key);
		$strlen = strlen($string);
		for ($i = 0; $i < $strlen; $i ++) {
			//echo $i;
			$k = $i % $keylen; //余数  将字符全部位移
			$code .= $string[$i] ^ $key[$k];//位移
		}
		return ($action != 'D' ? base64_encode($code) : $code);
	}
	
	public static function strcode($string,$operation,$key='')	{
		$key=md5($key);
		$key_length=strlen($key);
		$string=$operation=='D'?base64_decode($string):substr(md5($string.$key),0,8).$string;
		$string_length=strlen($string);
		$rndkey=$box=array();
		$result='';
		for($i=0;$i<=255;$i++)		{
			$rndkey[$i]=ord($key[$i%$key_length]);
			$box[$i]=$i;
		}
		for($j=$i=0;$i<256;$i++)		{
			$j=($j+$box[$i]+$rndkey[$i])%256;
			$tmp=$box[$i];
			$box[$i]=$box[$j];
			$box[$j]=$tmp;
		}
		for($a=$j=$i=0;$i<$string_length;$i++)		{
			$a=($a+1)%256;
			$j=($j+$box[$a])%256;
			$tmp=$box[$a];
			$box[$a]=$box[$j];
			$box[$j]=$tmp;
			$result.=chr(ord($string[$i])^($box[($box[$a]+$box[$j])%256]));
		}
		if($operation=='D')		{
			if(substr($result,0,8)==substr(md5(substr($result,8).$key),0,8))			{
				return substr($result,8);
			}
			else{
				return'';
			}
		}
		else{
			return str_replace('=','',base64_encode($result));
		}
	}
	
	
	/**
	 * 字符串加密
	 * @param string $str 加密字串
	 * @param string $key 加密依据
	 * @return string
	 */
	public static function  encryption($str,$key=''){
		//加密的算法是取余
		return self::encrypt($str,'E',$key.Conf::$management_center_password);
	}
	/**
	 * 字符串解密
	 * @param string $str 解密字串
	 * @param string $key 解密依据
	 * @return string
	 */
	public static function  decryption($str,$key=''){
		return self::encrypt($str,'D',$key.Conf::$management_center_password);
	}
	
	/**
	 * 
	 * 生成文章导读
	 * @param string $str 字符串(Html代码)
	 * @param integer $len(缩小后的长度)
	 */
	public static function  smalltext($str,$len){
		return mb_substr(trim(strip_tags($str)), 0, $len) ;
	}
	
	/**
	 * 标准化正文内容
	 * @param string $str 字符串(Html代码)
	 */
	public static function  measuretext($str,$appendtag=''){
		$str = strip_tags($str,'<ul><ol><p><b><i><br><li><img><strong><em><u><center><a><table><tr><th><td>'.$appendtag);
		$str =preg_replace('/\s\s+/', " ", $str);
		$str =str_replace('&nbsp;', ' ', $str);
		$str = preg_replace('#<br\s*?/?>#i', "\n", $str);
		$str =preg_replace('/\n\s+/', "\n", $str);
		$str = preg_replace('/(<[^>]+) style=".*?"/i', '$1', $str);
		$str = preg_replace('/(<[^>]+) align=".*?"/i', '$1', $str);
		$str = preg_replace('/(<[^>]+) class=".*?"/i', '$1', $str);
		return nl2br($str);
	}
	
	
	/**
	 * 过滤前台输入数据<br/>
	 * 对于要求高安全性的数据建议加上此过滤函数
	 * @param string $val
	 * @return string 过滤结果
	 */
	public static function xss_clean($val){
		if(empty($val)){
			return '';
		}
		$val = preg_replace('/([\x00-\x08][\x0b-\x0c][\x0e-\x20])/', '', $val);
		$search = 'abcdefghijklmnopqrstuvwxyz';
		$search .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$search .= '1234567890!@#$%^&*()';
		$search .= '~`";:?+/={}[]-_|\'\\';
		for ($i = 0; $i < strlen($search); $i++) {
			$val = preg_replace('/(&#[x|X]0{0,8}'.dechex(ord($search[$i])).';?)/i', $search[$i], $val); // with a ;
			$val = preg_replace('/(&#0{0,8}'.ord($search[$i]).';?)/', $search[$i], $val); // with a ;
		}
		$ra1 = Array('javascript', 'vbscript', 'expression', 'applet', 'meta', 'xml', 'blink', 'link', 'style', 'script', 'embed', 'object', 'iframe', 'frame', 'frameset', 'ilayer', 'layer', 'bgsound', 'title', 'base');
		$ra2 = Array('onabort', 'onactivate', 'onafterprint', 'onafterupdate', 'onbeforeactivate', 'onbeforecopy', 'onbeforecut', 'onbeforedeactivate', 'onbeforeeditfocus', 'onbeforepaste', 'onbeforeprint', 'onbeforeunload', 'onbeforeupdate', 'onblur', 'onbounce', 'oncellchange', 'onchange', 'onclick', 'oncontextmenu', 'oncontrolselect', 'oncopy', 'oncut', 'ondataavailable', 'ondatasetchanged', 'ondatasetcomplete', 'ondblclick', 'ondeactivate', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onerror', 'onerrorupdate', 'onfilterchange', 'onfinish', 'onfocus', 'onfocusin', 'onfocusout', 'onhelp', 'onkeydown', 'onkeypress', 'onkeyup', 'onlayoutcomplete', 'onload', 'onlosecapture', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onmove', 'onmoveend', 'onmovestart', 'onpaste', 'onpropertychange', 'onreadystatechange', 'onreset', 'onresize', 'onresizeend', 'onresizestart', 'onrowenter', 'onrowexit', 'onrowsdelete', 'onrowsinserted', 'onscroll', 'onselect', 'onselectionchange', 'onselectstart', 'onstart', 'onstop', 'onsubmit', 'onunload');
		$ra = array_merge($ra1, $ra2);
		$found = true;
		while ($found == true) {
			$val_before = $val;
			for ($i = 0; $i < sizeof($ra); $i++) {
				$pattern = '/';
				for ($j = 0; $j < strlen($ra[$i]); $j++) {
					if ($j > 0) {
						$pattern .= '(';
						$pattern .= '(&#[x|X]0{0,8}([9][a][b]);?)?';
						$pattern .= '|(&#0{0,8}([9][10][13]);?)?';
						$pattern .= ')?';
					}
					$pattern .= $ra[$i][$j];
				}
				$pattern .= '/i';
				$replacement = substr($ra[$i], 0, 2).'<x>'.substr($ra[$i], 2);
				$val = preg_replace($pattern, $replacement, $val);
				if ($val_before == $val) {
					$found = false;
				}
			}
		}
		return $val;
	}
	
	/**
	 * 特定字符分割，去除分割后的空字符
	 * @param string $str 被分割的字符串
	 * @param string $splitchar 分隔符
	 * @return array 分割结果结果
	 */
	public static function split($str, $splitchar=','){		
		return array_filter(explode($splitchar, $str));
	}
	
	/**
	 * 整数进制压缩为36位
	 * @param integer|string $intvalue 被压缩的整数
	 */
	public static function smallint($intvalue){
		return base_convert($intvalue,10,36);
	}
	
	/**
	 * 整数进制恢复为十进制
	 * @param string $int36value 被还原的36进制整数
	 */
	public static function toint($int36value){
		return base_convert($int36value,36,10);
	}
	
	
}