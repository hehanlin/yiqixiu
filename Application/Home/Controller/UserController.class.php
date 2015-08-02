<?php
namespace Home\Controller;
use Think\Controller;
class UserController extends Controller {
	public function unlogin(){
		if(intval(session('userid')) == 0)
		{
			header('Content-type: text/json');
			header('HTTP/1.1 401 Unauthorized');
			echo json_encode(array("success" => false,"code"=> 1001,"msg" => "请先登录!","obj"=> null,"map"=> null,"list"=> null));
			exit;
		}
	}
    public function check(){
		if(intval(session('userid'))>0)
		{
			header('Content-type: text/json');
			header('HTTP/1.1 200 ok');
			cookie('USERID',session('userid'));
			cookie('MD5STR',session('md5str'));
			$property='null';
			$mytplid=M('mytpl')->where('userid_int='.session('userid'))->getField('id');
 			if($mytplid){
				$property='{\"myTplId\":'.$mytplid.'}';
 			}
			$userInfoStr='"id":"'.session('userid').'","loginName":"'.session('username').'","xd":0,"sex":1,"phone":null,"tel":null,"qq":null,"headImg":"","idNum":null,"idPhoto":null,"regTime":1425093623000,"extType":0,"property":"'.$property.'","companyId":null,"deptName":null,"deptId":0,"name":"'.session('username').'","email":null,"type":1,"status":0,"relType":null,"companyTplId":null,"roleIdList":[]';
			$jsonStr='{"success":true,"code":200,"msg":"操作成功","obj":{'.$userInfoStr.'},"map":null,"list":null}';
			echo $jsonStr;
		}
		else
		{
			header('Content-type: text/json');
			header('HTTP/1.1 200 ok');
			echo json_encode(array("success" => false,"code"=> 1001,"msg" => "请先登录!","obj"=> null,"map"=> null,"list"=> null));
		}
    }
	
    public function login(){
		if (IS_POST && intval(session('userid'))==0) {
			$datas = $_POST;
			$userinfo['password_varchar'] = md5($datas['password']);
			$userinfo['email_varchar'] = $datas['username'];
			
			$User = M('users');
			
			$returnInfo=$User->where($userinfo)->select();
			if($returnInfo)
			{
			    if(date("Y-m-d H-m-s",time())>$returnInfo[0]["limit_time"]){
			        header('Content-type: text/json');
			        header('HTTP/1.1 200 ok');
					
			        echo json_encode(array("success" => false,"code"=> 1004,"msg" => "用户已到期，请联系管理员！","obj"=> null,"map"=> array("isValidateCodeLogin"=>false),"list"=> null,"limit_time"=>$returnInfo[0]["limit_time"]));
					exit;
			    }else{
					
					//最后一次登录时间修改
					$time['last_time'] = date("Y-m-d H:m:s",time());
					
					$User->where($userinfo)->save($time);
					
			        session('userid',$returnInfo[0]["userid_int"]);
			        session('username',$returnInfo[0]["email_varchar"]);
			        session('scene_times',$returnInfo[0]["scene_times"]);
			        session('email',$returnInfo[0]["email_varchar"]);
			        session('md5str',md5('adklsj[]999875sssee,'.$returnInfo[0]["id"]));
			        cookie('USERID',$returnInfo[0]["userid_int"]);
			        cookie('MD5STR',md5('adklsj[]999875sssee,'.$returnInfo[0]["id"]));
			        header('HTTP/1.1 200 ok');
			        echo json_encode(array("success" => true,"code"=> 200,"msg" => "success","obj"=> null,"map"=> null,"list"=> null,"now_time"=>date("Y-m-d H:i:s",time()),"limit_time"=>$returnInfo[0]["limit_time"],"scene_times"=>$returnInfo[0]["scene_times"]));
			    }
								
			}
			else
			{
				header('Content-type: text/json');
				header('HTTP/1.1 200 ok');
				echo json_encode(array("success" => false,"code"=> 1005,"msg" => "密码错误","obj"=> null,"map"=> array("isValidateCodeLogin"=>false),"list"=> null));
				
			}
		}
    }

	public function register(){
		
		
		if (IS_POST) {
			
			$User = M('user');
			$free_time = M('User')->where(array('username'=>'admin'))->select();
			
			
			
			$datas = $_POST;
			if(strlen($datas['password']) < 6 ){
				header('Content-type: text/json');
				header('HTTP/1.1 200 ok');
				echo json_encode(array("success" => false,"code"=> 1008,"msg" => "密码必须6位以上","obj"=> null,"map"=> array("isValidateCodeLogin"=>false),"list"=> null));	
				exit();			
				}
			$userinfo['password_varchar'] = md5($datas['password']);
			$userinfo['email_varchar'] = $datas['email'];
			$userinfo['create_time'] = date('y-m-d H:i:s',time());
			$userinfo['last_time'] = date('y-m-d H:i:s',time());
			$userinfo['createip_varchar'] = get_client_ip();
			$userinfo['lastip_varchar'] = get_client_ip();
			$userinfo['limit_time'] = date('y-m-d H:i:s',time() + $free_time[0]['free_time']);  //默认3天后到期
			$userinfo['scene_times'] = $free_time[0]['scene_times'];                                  //默认创建场景次数两次
			$User1 = M('users');
			
			$map['email_varchar'] = $userinfo['email_varchar'];
			$returnInfo = $User1->where($map)->select();
			
			//$returnInfo=$User->add($userinfo);
			if(!$returnInfo)
			{
				$User = M('users');
				$User->add($userinfo);
				header('HTTP/1.1 200 ok');
				echo '{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":null}';
				
			}
			else
			{
				header('Content-type: text/json');
				header('HTTP/1.1 200 ok');
				echo json_encode(array("success" => false,"code"=> 1006,"msg" => "帐号已经存在！","obj"=> null,"map"=> array("isValidateCodeLogin"=>false),"list"=> null));
				
			}
		}
    }
	
    
	 
	public function saveMyTpl(){
		$this->unlogin();
		$m_scenepage=M('scenepage');
		$datas = json_decode(file_get_contents("php://input"),true);

	 
		$myTplId = intval($datas['sceneId']);
		if(!$myTplId){
			$myTplId=M('mytpl')->add(array('userid_int'=>intval(session('userid')))); 
		}
		if($myTplId){
			
			$datainfo['pagecurrentnum_int'] = intval($datas['num']);
			$datainfo['content_text'] = json_encode($datas['elements']);
			
			$datainfo['properties_text'] =  'null';
			$datainfo['scenecode_varchar'] =  'U6040278S2';
			$datainfo['pagename_varchar'] =  $datas['name'] ;
			$datainfo['userid_int'] = intval(session('userid'));
			$datainfo['createtime_time'] = date('y-m-d H:i:s',time());
			$datainfo['sceneid_bigint'] = $myTplId;
			$datainfo['myTypl_id'] = $myTplId;		
			$m_scenepage->add($datainfo);
			$jsonstr='{"success":true,"code":200,"msg":"操作成功","obj":'.$myTplId.',"map":null,"list":null}';
 			
			
		}else{
 			$jsonStr='{"success":false,"code":100,"msg":"操作失败","obj":'.$myTplId.',"map":null,"list":null}';
			 
		}
		echo $jsonstr;
			
	}
	public function getMyTpl(){
		$this->unlogin();
		$jsonstr='{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":[';
		
		$where['myTypl_id']= I('get.id',0);
		$where['userid_int']  = intval(session('userid'));
		$_scene_list= M('scenepage')->where($where)->order('pagecurrentnum_int asc')->select();
		
		$jsonstrtemp = '';
		foreach($_scene_list as $vo){
			
			$replaceArray = json_decode($vo['content_text'],true);
			foreach($replaceArray as $key => $value){
				$replaceArray[$key]['sceneId'] = $where['myTypl_id'];
				$replaceArray[$key]['pageId'] = $vo['pageid_bigint'];
			}
			$replaceArray = json_encode($replaceArray);
			
			$jsonstrtemp = $jsonstrtemp .'{
			 "id": '.$vo["pageid_bigint"].',
            "sceneId": '.$where['myTypl_id'].',
            "name": '.json_encode($vo["scenename_varchar"]).', 
            "num": '.$vo["pagecurrentnum_int"].', 
            "properties": null, 
            "elements": '.$replaceArray.', 
            "scene": null
        },';
		}
		
		$jsonstr = $jsonstr.rtrim($jsonstrtemp,',').']}';
		echo $jsonstr;
	}

    public function logout(){
		session('userid',null);
		session('username',null);
		session('email',null);
		session('md5str',null);
		cookie('USERID',null);
		cookie('MD5STR',null);
		header("Location: http://".$_SERVER['HTTP_HOST']."");
    }
}