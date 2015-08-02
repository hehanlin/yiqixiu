<?php
class UserAction extends BaseAction{
    public $userGroup;
    public $token;
    public $user;
    public $userFunctions;
    public $wxuser;
    protected function _initialize(){
        parent :: _initialize();
        $userinfo = M('User_group') -> where(array('id' => session('gid'))) -> find();
        $this -> assign('userinfo', $userinfo);
        $this -> userGroup = $userinfo;
        $users = M('Users') -> where(array('id' => $_SESSION['uid'])) -> find();
        $this -> user = $users;
        $this -> token = session('token');
        $this -> assign('thisUser', $users);
        $allow_pay = array('AlipayAction', 'TenpayAction', 'AlipayReceiveAction');
        $this -> assign('viptime', $users['viptime']);
        if(session('uid')){
            if($users['viptime'] < time()){
                if(function_exists('get_called_class')){
                    if(!in_array(get_called_class(), $allow_pay)){
                        $this -> error('非常遗憾的告诉您，您的帐号已经到期，请充值后再使用，感谢继续使用我们的系统。', U('User/Alipay/index', array('flag' => 5.3)));
                    }
                }else{
                    if(!in_array(get_class($this), $allow_pay)){
                        $this -> error('非常遗憾的告诉您，您的帐号已经到期，请充值后再使用，感谢继续使用我们的系统。', U('User/Alipay/index', array('flag' => 5.2)));
                    }
                }
            }
        }
        $token_open = M('Token_open') -> field('queryname') -> where(array('token' => $this -> token)) -> find();
        $trans = include('./Wesambo/Lib/ORG/FuncToModel.php');
        if (C('agent_version') && $this -> agentid){
            $user_group_where = array('id' => session('gid'), 'agentid' => $this -> agentid);
            $func_where = array('agentid' => $this -> agentid);
            $function_db = M('Agent_function');
        }else{
            $user_group_where = array('id' => session('gid'));
            $func_where = array('1 = 1');
            $function_db = M('Function');
        }
        $group_func = M('User_group') -> where($user_group_where) -> getField('func');
        $Afunc = $function_db -> where($func_where) -> field('id,funname') -> select();
        foreach ($Afunc as $tk => $tv){
            if(strpos($group_func, $tv['funname']) === false && strpos($token_open['queryname'], $tv['funname']) === false){
                $not_exist[] = isset($trans[$tv['funname']])?$trans[$tv['funname']]:ucfirst($tv['funname']);
            }
        }
        $this -> assign('not_exist', $not_exist);
        $wecha = M('Wxuser') -> where(array('token' => session('token'), 'uid' => session('uid'))) -> find();
        $this -> assign('wxuser', $wecha);
        $this -> wxuser = $wecha;
        $this -> assign('wecha', $wecha);
        $this -> assign('wxuser', $wecha);
        $this -> assign('token', $this -> token);
        $token_open = M('token_open') -> field('queryname') -> where(array('token' => $this -> token)) -> find();
        $this -> userFunctions = explode(',', $token_open['queryname']);
        if (MODULE_NAME != 'Upyun'){
            if(session('uid') == false){
                $this -> redirect('Home/Index/login');
            }
        }else{
            if (isset($_SESSION['administrator']) || isset($_SESSION['agentid']) || isset($_SESSION['uid']) || isset($_SESSION['wapupload'])){
            }else{
                if(isset($_POST['PHPSESSID'])){
                    session_id($_POST['PHPSESSID']);
                }else{
                    $this -> redirect('Home/Index/login');
                }
            }
        }
        if (session('companyLogin') == 1 && !in_array(MODULE_NAME, array('Attachment', 'Repast', 'Upyun', 'Hotels', 'Store', 'Classify', 'Catemenu'))){
            $this -> redirect(U('User/Repast/index', array('cid' => session('companyid'))));
        }
        define('UNYUN_BUCKET', C('up_bucket'));
        define('UNYUN_USERNAME', C('up_username'));
        define('UNYUN_PASSWORD', C('up_password'));
        define('UNYUN_FORM_API_SECRET', C('up_form_api_secret'));
        define('UNYUN_DOMAIN', C('up_domainname'));
        $this -> assign('upyun_domain', 'http://' . UNYUN_DOMAIN);
        $this -> assign('upyun_bucket', UNYUN_BUCKET);
        $token = $this -> _session('token');
        if (!$token){
            if (isset($_GET['token'])){
                $token = $this -> _get('token');
            }else{
                $token = 'admin';
            }
        }
        $options = array();
        $now = time();
        $options['bucket'] = UNYUN_BUCKET;
        $options['expiration'] = $now + 600;
        $options['save-key'] = '/' . $token . '/{year}/{mon}/{day}/' . $now . '_{random}{.suffix}';
        $options['allow-file-type'] = C('up_exts');
        $options['content-length-range'] = '0,' . intval(C('up_size')) * 1000;
        if (intval($_GET['width'])){
            $options['x-gmkerl-type'] = 'fix_width';
            $options['fix_width '] = $_GET['width'];
        }
        $policy = base64_encode(json_encode($options));
        $sign = md5($policy . '&' . UNYUN_FORM_API_SECRET);
        $this -> assign('editor_upyun_sign', $sign);
        $this -> assign('editor_upyun_policy', $policy);
    }
    public function canUseFunction($funname){
        $queryname = M('token_open') -> where(array('token' => $this -> token)) -> getField('queryname');
        if (strpos(strtolower($queryname), strtolower($funname)) === false){
            $this -> error('您还没有开启这个功能的使用权,请到“功能模块”菜单中勾选这个功能', U('Function/index', array('token' => $this -> token)));
        }
    }
}
?>