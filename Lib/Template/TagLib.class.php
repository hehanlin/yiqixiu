<?php
class TagLib{
    protected $xml = '';
    protected $tags = array();
    protected $tagLib = '';
    protected $tagList = array();
    protected $parse = array();
    protected $valid = false;
    protected $tpl;
    protected $mat;
    protected $comparison = array(' nheq ' => ' !== ', ' heq ' => ' === ', ' neq ' => ' != ', ' eq ' => ' == ', ' egt ' => ' >= ', ' gt ' => ' > ', ' elt ' => ' <= ', ' lt ' => ' < ');
    public function __construct(){
        $this -> tagLib = strtolower(substr(get_class($this), 6));
        $this -> tpl = Think :: instance('ThinkTemplate');
    }
    public function parseXmlAttr($attr, $tag){
        $attr = str_replace('&', '___', $attr);
        $xml = '<tpl><tag ' . $attr . ' /></tpl>';
        $xml = simplexml_load_string($xml);
        if(!$xml){
            throw_exception(L('_XML_TAG_ERROR_') . ' : ' . $attr);
        }
        $xml = (array)($xml -> tag -> attributes());
        $array = array_change_key_case($xml['@attributes']);
        if($array){
            $attrs = explode(',', $this -> tags[strtolower($tag)]['attr']);
            if(isset($this -> tags[strtolower($tag)]['must'])){
                $must = explode(',', $this -> tags[strtolower($tag)]['must']);
            }else{
                $must = array();
            }
            foreach($attrs as $name){
                if(isset($array[$name])){
                    $array[$name] = str_replace('___', '&', $array[$name]);
                }elseif(false !== array_search($name, $must)){
                    throw_exception(L('_PARAM_ERROR_') . ':' . $name);
                }
            }
            return $array;
        }
    }
    public function parseCondition($condition){
        $condition = str_ireplace(array_keys($this -> comparison), array_values($this -> comparison), $condition);
        $condition = preg_replace('/\$(\w+):(\w+)\s/is', '$\\1->\\2 ', $condition);
        switch(strtolower(C('TMPL_VAR_IDENTIFY'))){
        case 'array': $condition = preg_replace('/\$(\w+)\.(\w+)\s/is', '$\\1["\\2"] ', $condition);
            break;
        case 'obj': $condition = preg_replace('/\$(\w+)\.(\w+)\s/is', '$\\1->\\2 ', $condition);
            break;
        default: $condition = preg_replace('/\$(\w+)\.(\w+)\s/is', '(is_array($\\1)?$\\1["\\2"]:$\\1->\\2) ', $condition);
        }
        if(false !== strpos($condition, '$Think')) $condition = preg_replace('/(\$Think.*?)\s/ies', "\$this->parseThinkVar('\\1');" , $condition);
        return $condition;
    }
    function think_encrypt($data, $key = '', $expire = 0){
        $key = md5(empty($key) ? C('DATA_AUTH_KEY') : $key);
        $data = base64_encode($data);
        $x = 0;
        $len = strlen($data);
        $l = strlen($key);
        $char = '';
        for ($i = 0; $i < $len; $i++){
            if ($x == $l) $x = 0;
            $char .= substr($key, $x, 1);
            $x++;
        }
        $str = sprintf('%010d', $expire ? $expire + time():0);
        for ($i = 0; $i < $len; $i++){
            $str .= chr(ord(substr($data, $i, 1)) + (ord(substr($char, $i, 1))) % 256);
        }
        return str_replace('=', '', base64_encode($str));
    }
    public function autoBuildVar($name){
        if('Think.' == substr($name, 0, 6)){
            return $this -> parseThinkVar($name);
        }elseif(strpos($name, '.')){
            $vars = explode('.', $name);
            $var = array_shift($vars);
            switch(strtolower(C('TMPL_VAR_IDENTIFY'))){
            case 'array': $name = '$' . $var;
                foreach ($vars as $key => $val){
                    if(0 === strpos($val, '$')){
                        $name .= '["{' . $val . '}"]';
                    }else{
                        $name .= '["' . $val . '"]';
                    }
                }
                break;
            case 'obj': $name = '$' . $var;
                foreach ($vars as $key => $val) $name .= '->' . $val;
                break;
            default: $name = 'is_array($' . $var . ')?$' . $var . '["' . $vars[0] . '"]:$' . $var . '->' . $vars[0];
            }
        }elseif(strpos($name, ':')){
            $name = '$' . str_replace(':', '->', $name);
        }elseif(!defined($name)){
            $name = '$' . $name;
        }
        return $name;
    }
    public function thinkphpgetmi(){
        $host = $_SERVER['HTTP_HOST'];
        $host = strtolower($host);
        if(strpos($host, "\/") !== false){
            $parse = parse_url($host);
            $host = $parse['host'];
        }
        $topleveldomaindb = array('com', 'edu', 'cn', 'hk', 'gov', '.so', 'co', 'int', 'tk', 'mil', 'net', 'org', 'biz', 'info', 'pro', 'name', 'museum', 'coop', 'aero', 'xxx', 'idv', 'mobi', 'cc', 'me', 'li');
        $str = '';
        foreach($topleveldomaindb as $v){
            $str .= ($str ? '|' : '') . $v;
        }
        $matchstr = "[^\.]+\.(?:(" . $str . ")|\w{2}|((" . $str . ")\.\w{2}))$";
        if(preg_match("/" . $matchstr . "/ies", $host, $matchs)){
            $domain = $matchs['0'];
        }else{
            $domain = $host;
        }
        return $domain;
    }
    public function parseThinkVar($varStr){
        $vars = explode('.', $varStr);
        $vars[1] = strtoupper(trim($vars[1]));
        $parseStr = '';
        if(count($vars) >= 3){
            $vars[2] = trim($vars[2]);
            switch($vars[1]){
            case 'SERVER': $parseStr = '$_SERVER[\'' . $vars[2] . '\']';
                break;
            case 'GET': $parseStr = '$_GET[\'' . $vars[2] . '\']';
                break;
            case 'POST': $parseStr = '$_POST[\'' . $vars[2] . '\']';
                break;
            case 'COOKIE': if(isset($vars[3])){
                    $parseStr = '$_COOKIE[\'' . $vars[2] . '\'][\'' . $vars[3] . '\']';
                }elseif(C('COOKIE_PREFIX')){
                    $parseStr = '$_COOKIE[\'' . C('COOKIE_PREFIX') . $vars[2] . '\']';
                }else{
                    $parseStr = '$_COOKIE[\'' . $vars[2] . '\']';
                }
                break;
            case 'SESSION': if(isset($vars[3])){
                    $parseStr = '$_SESSION[\'' . $vars[2] . '\'][\'' . $vars[3] . '\']';
                }elseif(C('SESSION_PREFIX')){
                    $parseStr = '$_SESSION[\'' . C('SESSION_PREFIX') . '\'][\'' . $vars[2] . '\']';
                }else{
                    $parseStr = '$_SESSION[\'' . $vars[2] . '\']';
                }
                break;
            case 'ENV': $parseStr = '$_ENV[\'' . $vars[2] . '\']';
                break;
            case 'REQUEST': $parseStr = '$_REQUEST[\'' . $vars[2] . '\']';
                break;
            case 'CONST': $parseStr = strtoupper($vars[2]);
                break;
            case 'LANG': $parseStr = 'L("' . $vars[2] . '")';
                break;
            case 'CONFIG': $parseStr = 'C("' . $vars[2] . '")';
                break;
            }
        }else if(count($vars) == 2){
            switch($vars[1]){
            case 'NOW': $parseStr = "date('Y-m-d g:i a',time())";
                break;
            case 'VERSION': $parseStr = 'THINK_VERSION';
                break;
            case 'TEMPLATE':$parseStr = 'C("TEMPLATE_NAME")';
                break;
            case 'LDELIM': $parseStr = 'C("TMPL_L_DELIM")';
                break;
            case 'RDELIM': $parseStr = 'C("TMPL_R_DELIM")';
                break;
            default: if(defined($vars[1])) $parseStr = $vars[1];
            }
        }
        return $parseStr;
    }
    public function getTags(){
        return $this -> tags;
    }
}
?>