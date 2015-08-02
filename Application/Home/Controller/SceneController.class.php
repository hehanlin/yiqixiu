<?php
/**
 * Created by PhpStorm.
 * User: cony
 * Date: 14-3-7
 * Time: 下午3:40
 */
namespace Home\Controller;
use Think\Controller;
class SceneController extends Controller{

    public function unlogin(){
		if(intval(session('userid')) == 0)
		{
			header('Content-type: text/json');
			header('HTTP/1.1 401 Unauthorized');
			echo json_encode(array("success" => false,"code"=> 1001,"msg" => "请先登录!","obj"=> null,"map"=> null,"list"=> null));
			exit;
		}
    }
	

    public function _initialize(){
        header('Content-type: application/json;charset=UTF-8');
		if(intval(session('userid')) != 100)
		{
			$wheresessionuser["userid_int"] = intval(session('userid'));
			
		}
	}

    public function addpv(){
         $returnInfo = D("Scene")->addpv();
    }
	
    public function usepage(){
         $returnInfo = D("Scene")->usepage();
    }
	

    public function index(){
		$this->unlogin();
        if (IS_POST) {
			// 登录验证
            //$returnLoginInfo = D("Shoppingcart")->addcart();
            // 生成认证条件
			// 登录成功
			//echo json_encode($returnLoginInfo);
		}
		else
		{
			$_scene = M('scene');
			//$where['uid']  = $datainfo['uid'];
			$where['sceneid_bigint']  = I('get.id',0);
			if(intval(session('userid'))!=1)
			{
				$where['userid_int']  = intval(session('userid'));
			}
			$where['delete_int']  = 0;
			$_scene_list=$_scene->where($where)->order('sceneid_bigint desc')->select();     
			//$this->assign('webtitle','购物车');
            //$this->display();
			echo json_encode(array("success" => true,
									"code"=> 200,
									"msg" => "success",
									"obj"=> 1,
									"map"=> null,
									"list"=> null
								   )
							);
		}
    }
	
    public function create(){
		$this->unlogin();
        if (IS_POST) {
			// 登录验证
            $returnInfo = D("Scene")->addscene();
            // 生成认证条件
			// 登录成功
			//echo json_encode($returnLoginInfo);
		}
    }
	
	
    public function createBySys(){
		$this->unlogin();
        if (IS_POST) {
			// 登录验证
            $returnInfo = D("Scene")->addscenebysys();
            // 生成认证条件
			// 登录成功
			//echo json_encode($returnLoginInfo);
		}
    }
	
    public function createByCopy(){
		$this->unlogin();
        $returnInfo = D("Scene")->addscenebycopy();
    }
	
    public function on(){
		$this->unlogin();
        $returnInfo = D("Scene")->openscene(1);
    }
	
    public function off(){
		$this->unlogin();
        $returnInfo = D("Scene")->openscene(2);
    }
	
	public function publish(){
		$m_scene=M('Scene');	 

		$where['sceneid_bigint'] = I('get.id',0);
		$datainfo['publishTime'] = time();
		$where['userid_int'] = session('userid');
		if($m_scene->data($datainfo)->where($where)->save()){
			$jsonstr='{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":null}';	
			
		}else{
			$jsonstr='{"success":false,"code":101,"msg":"操作失败","obj":null,"map":null,"list":null}';	
			
			}
			
 		echo $jsonstr;
	}

    public function savepage(){
		$this->unlogin();
        if (IS_POST) {
			// 登录验证
            $returnInfo = D("Scene")->savepage();
            // 生成认证条件
			// 登录成功
			//echo json_encode($returnLoginInfo);
		}
    }
	

    public function saveSettings(){
		$this->unlogin();
        if (IS_POST) {
			// 登录验证
            $returnInfo = D("Scene")->savesetting();
            // 生成认证条件
			// 登录成功
			//echo json_encode($returnLoginInfo);
		}
    }
	



	
    public function pageList(){
		$this->unlogin();
		$_scenepage = M('scenepage');
		//$where['uid']  = $datainfo['uid'];
		$where['sceneid_bigint']  = I('get.id',0);
		$where['myTypl_id']=0;
		if(intval(session('userid'))!=1)
		{
			$where['userid_int']  = intval(session('userid'));
		}
		$_scene_list=$_scenepage->where($where)->order('pagecurrentnum_int asc')->select();
		//var_dump($_scene_list);exit;     
		//$this->display();
		$jsonstr = '{"success":true,"code":200,"msg":"success","obj":null,"map":null,"list":[';
		$jsonstrtemp = '';
		foreach($_scene_list as $vo){
			$jsonstrtemp = $jsonstrtemp .'{"id":'.$vo["pageid_bigint"].',"sceneId":'.$vo["sceneid_bigint"].',"num":'.$vo["pagecurrentnum_int"].',"name":"'.$vo["pagename_varchar"].'","properties":null,"elements":null,"scene":null},';
		}
		$jsonstr = $jsonstr.rtrim($jsonstrtemp,',').']}';
		echo $jsonstr;
    }

	
    public function pvcount(){
		$this->unlogin();
		$_scene = M('scene');
		$where['userid_int']  = intval(session('userid'));
		$where['delete_int']  = 0;
		$_scene_list=$_scene->where($where)->sum('hitcount_int');
		echo '{"success":true,"code":200,"msg":"success","obj":'.$_scene_list.',"map":null,"list":null}';
    }
	
    public function opencount(){
		$this->unlogin();
		$_scene = M('scene');
		$where['userid_int']  = intval(session('userid'));
		$where['delete_int']  = 0;
		$where['showstatus_int']  = 1;
		$_scene_list=$_scene->where($where)->count();
		echo '{"success":true,"code":200,"msg":"success","obj":'.$_scene_list.',"map":null,"list":null}';
    }
	
    public function view(){
		$_scene = M('scene');

		//$where['uid']  = $datainfo['uid'];
		if(is_numeric(I('get.id',0))){
			$where2['sceneid_bigint']  = I('get.id',0);
		}
		else
		{
			$where2['scenecode_varchar']  = I('get.id',0);
		}
		$where2['delete_int']  = 0;
		$_scene_list2=$_scene->where($where2)->select();
		if($_scene_list2[0]['showstatus_int']!=1)
		{
			if($_scene_list2[0]['userid_int']!=intval(session('userid')))
			{
				$where3['sceneid_bigint']  = 267070;
				$_scene_list2=$_scene->where($where3)->select();
			}  
		}  

		$advuserinfo['userid_int'] = $_scene_list2[0]['userid_int'];
		$advUser = M('users');
		$returnadvInfo=$advUser->where($advuserinfo)->select();
		
		$_scenepage = M('scenepage');
		$where['sceneid_bigint']  = $_scene_list2[0]['sceneid_bigint'];
		$where['userid_int']  = $_scene_list2[0]['userid_int'];
		$_scene_list=$_scenepage->where($where)->order('pagecurrentnum_int asc')->select();


		//var_dump($_scene_list);exit;     
		//$this->display();
		$jsonstr = '{"success": true,"code": 200,"msg": "操作成功","obj": {"id": '.$_scene_list2[0]['sceneid_bigint'].',"name": '.json_encode($_scene_list2[0]['scenename_varchar']).',"createUser": "'.$_scene_list2[0]['userid_int'].'","type": '.$_scene_list2[0]['scenetype_int'].',"pageMode": '.$_scene_list2[0]['movietype_int'].',"image": {"imgSrc": "'.$_scene_list2[0]['thumbnail_varchar'].'",';
			
		if($returnadvInfo[0]['level_int']==4){
			$jsonstr = $jsonstr.'"isAdvancedUser": true';
		}else{
			$jsonstr = $jsonstr.'"isAdvancedUser": false';
		}
		if($_scene_list2[0]["musicurl_varchar"]!='')
		{
			$jsonstr = $jsonstr.',"bgAudio": {"url": "'.$_scene_list2[0]["musicurl_varchar"].'","type": "'.$_scene_list2[0]["musictype_int"].'"}';
		}
		$jsonstr = $jsonstr.'	
        },
        "isTpl": 0,
        "isPromotion": 0,
        "status": 1,
        "openLimit": 0,
        "startDate": null,
        "endDate": null,
        "updateTime": 1426045746000,
		"createTime": 1426572693000,
		"publishTime":1426572693000,
        "applyTemplate": 0,
        "applyPromotion": 0,
        "sourceId": null,
        "code": "'.$_scene_list2[0]['scenecode_varchar'].'",
        "description": '.json_encode($_scene_list2[0]['desc_varchar']).',
        "sort": 0,
        "pageCount": 0,
        "dataCount": 0,
        "showCount": 0,
        "userLoginName": null,
        "userName": null
    },
    "map": null,
    "list": [';
		$jsonstrtemp = '';
		foreach($_scene_list as $vo)
        {
			$jsonstrtemp = $jsonstrtemp .'{"id": '.$vo["pageid_bigint"].',"sceneId": '.$vo["sceneid_bigint"].',"num": '.$vo["pagecurrentnum_int"].',
				"name": null,"properties":'.$vo["properties_text"].',"elements": '.$vo["content_text"].',"scene": null},';
		}
		$jsonstr = $jsonstr.rtrim($jsonstrtemp,',').'';
		$jsonstr = $jsonstr.']}';
		echo $jsonstr;
    }

	
    public function design(){
		$this->unlogin();
		$_scenepage = M('scenepage');
		//$where['uid']  = $datainfo['uid'];
		$where['pageid_bigint']  = I('get.id',0);
		if(intval(session('userid'))!=1)
		{
			$where['userid_int']  = intval(session('userid'));
		}
		$_scene_list=$_scenepage->where($where)->select();
		
		$_scene = M('scene');
		//$where['uid']  = $datainfo['uid'];
		if(intval(session('userid'))!=1)
		{
			$where2['userid_int']  = intval(session('userid'));
		}
		$where2['delete_int']  = 0;
		$where2['sceneid_bigint']  = $_scene_list[0]['sceneid_bigint'];
		$_scene_list2=$_scene->where($where2)->select();     

		$replaceArray = json_decode($_scene_list[0]['content_text'],true);
		foreach($replaceArray as $key => $value){
			$replaceArray[$key]['sceneId'] = $_scene_list[0]['sceneid_bigint'];
			$replaceArray[$key]['pageId'] = $where['pageid_bigint'];
		}
		$replaceArray = json_encode($replaceArray);

		$jsonstr = '{"success": true,"code": 200,"msg": "success","obj": {"id": '.$_scene_list[0]['pageid_bigint'].',"sceneId": '.$_scene_list[0]['sceneid_bigint'].',"num": '.$_scene_list[0]['pagecurrentnum_int'].',"name": null,"properties": '.$_scene_list[0]["properties_text"].',"elements": '.$replaceArray.',"scene": {"id": '.$_scene_list2[0]['sceneid_bigint'].',"name": '.json_encode($_scene_list2[0]['scenename_varchar']).',"createUser": "'.$_scene_list2[0]['userid_int'].'","createTime": 1425998747000,"type": '.$_scene_list2[0]['scenetype_int'].',"pageMode": '.$_scene_list2[0]['movietype_int'].',"image": {"imgSrc": "'.$_scene_list2[0]['movietype_int'].'","isAdvancedUser": false';
		if($_scene_list2[0]['musicurl_varchar']!=''){
			$jsonstr = $jsonstr.',"bgAudio": {"url": "'.$_scene_list2[0]["musicurl_varchar"].'","type": "'.$_scene_list2[0]["musictype_int"].'"}';
		}
		$jsonstr = $jsonstr.'},"isTpl": 0,"isPromotion": 0,"status": 1,"openLimit": 0,	"submitLimit": 0,	"startDate": null,	"endDate": null,	"accessCode": null,	"thirdCode": null,	"updateTime": 1426038857000,	"publishTime": 1426038857000,	"applyTemplate": 0,	"applyPromotion": 0,	"sourceId": null,	"code": "'.$_scene_list2[0]['scenecode_varchar'].'",	"description": "'.($_scene_list2[0]['desc_varchar']).'",	"sort": 0,"pageCount": 0,	"dataCount": 0,	"showCount": '.$_scene_list2[0]['hitcount_int'].',	"userLoginName": null,"userName": null}},	"map": null,"list": null}';
		echo $jsonstr;
    }


    public function detail(){
		$this->unlogin();
		$_scene = M('scene');
		if(intval(session('userid'))!=1)
		{
			$where['userid_int']  = intval(session('userid'));
		}
		$where['sceneid_bigint']  = I('get.id',0);
		$where['delete_int']  = 0;
		$_scene_list=$_scene->where($where)->select();     

		$jsonstr = '{
			"success": true,
			"code": 200,
			"msg": "success",
			"obj": {
				"id": '.$_scene_list[0]['sceneid_bigint'].',
				"name": '.json_encode($_scene_list[0]['scenename_varchar']).',
				"createUser": "'.$_scene_list[0]['userid_int'].'",
				"createTime": 1425998747000,
				"type": '.$_scene_list[0]['scenetype_int'].',
				"pageMode": '.$_scene_list[0]['movietype_int'].',
				"image": {
					"imgSrc": "'.$_scene_list[0]['thumbnail_varchar'].'",
					"isAdvancedUser": false';
				
				if($_scene_list[0]["musicurl_varchar"]!='')
				{
					$jsonstr = $jsonstr.',"bgAudio": {"url": "'.$_scene_list[0]["musicurl_varchar"].'","type": "'.$_scene_list[0]["musictype_int"].'"}';
				}
				$jsonstr = $jsonstr.'},
				"isTpl": 0,
				"isPromotion": 0,
				"status": '.$_scene_list[0]['showstatus_int'].',
				"openLimit": 0,
				"submitLimit": 0,
				"startDate": null,
				"endDate": null,
				"accessCode": null,
				"thirdCode": null,
				"updateTime": 1426041829000,
				"publishTime": 1426041829000,
				"applyTemplate": 0,
				"applyPromotion": 0,
				"sourceId": null,
				"code": "'.$_scene_list[0]['scenecode_varchar'].'",
				"description": '.json_encode($_scene_list[0]['desc_varchar']).',
				"sort": 0,
				"pageCount": 0,
				"dataCount": '.$_scene_list[0]["datacount_int"].',
				"showCount": '.$_scene_list[0]['hitcount_int'].',
				"userLoginName": null,
				"userName": null
			},
			"map": null,
			"list": null
		}';
		echo $jsonstr;

    }


    public function createpage(){
		$this->unlogin();
		$_scenepage = M('scenepage');
		$_scene = M('scene');
		$where['pageid_bigint']  = I('get.id',0);
		$iscopy  = I('get.copy',"false");
		if(intval(session('userid'))!=1)
		{
			$where['userid_int']  = intval(session('userid'));
		}
		$_scene_list=$_scenepage->where($where)->select();
		if(!$_scene_list)
		{
			header('HTTP/1.1 403 Unauthorized');
			echo json_encode(array("success" => false,"code"=> 403,"msg" => "false","obj"=> null,"map"=> null,"list"=> null));
			exit;
		}
		$datainfo['scenecode_varchar'] = $_scene_list[0]['scenecode_varchar'];
		$datainfo['sceneid_bigint'] = $_scene_list[0]['sceneid_bigint'];
		$datainfo['pagecurrentnum_int'] = $_scene_list[0]['pagecurrentnum_int']+1;
		$datainfo['createtime_time'] = date('y-m-d H:i:s',time());
		if($iscopy=="true")
		{
			$datainfo['content_text'] = $_scene_list[0]['content_text'];
		}
		else
		{
			$datainfo['content_text'] = "[]";
		}
		$datainfo['properties_text'] = 'null';
		$datainfo['userid_int'] = session('userid');
		$result = $_scenepage->add($datainfo);
		
		$where2['sceneid_bigint']  = $_scene_list[0]['sceneid_bigint'];
		if(intval(session('userid'))!=1)
		{
			$where2['userid_int']  = intval(session('userid'));
		}
		$_scene_list2=$_scene->where($where2)->select();     

		$jsonstr = '{
					"success": true,
					"code": 200,
					"msg": "success",
					"obj": {
						"id": '.$result.',
						"sceneId": '.$_scene_list[0]['sceneid_bigint'].',
						"num": '.($_scene_list[0]['pagecurrentnum_int']+1).',
						"name": null,
						"properties": null,
						"elements": null,
						"scene": {
							"id": '.$_scene_list2[0]['sceneid_bigint'].',
							"name": '.json_encode($_scene_list2[0]['scenename_varchar']).',
							"createUser": "'.$_scene_list2[0]['userid_int'].'",
							"createTime": 1425998747000,
							"type": '.$_scene_list2[0]['scenetype_int'].',
							"pageMode": '.$_scene_list2[0]['movietype_int'].',
							"image": {
								"imgSrc": "'.$_scene_list2[0]['thumbnail_varchar'].'",
								"isAdvancedUser": false
							},
							"isTpl": 0,
							"isPromotion": 0,
							"status": '.$_scene_list2[0]['showstatus_int'].',
							"openLimit": 0,
							"submitLimit": 0,
							"startDate": null,
							"endDate": null,
							"accessCode": null,
							"thirdCode": null,
							"updateTime": 1426039827000,
							"publishTime": 1426039827000,
							"applyTemplate": 0,
							"applyPromotion": 0,
							"sourceId": null,
							"code": "'.$_scene_list2[0]['scenecode_varchar'].'",
							"description": '.json_encode($_scene_list2[0]['desc_varchar']).',
							"sort": 0,
							"pageCount": 0,
							"dataCount": 0,
							"showCount": 0,
							"userLoginName": null,
							"userName": null
						}
					},
					"map": null,
					"list": null
				}';
						echo $jsonstr;

    }

    public function delpage(){
		$this->unlogin();
		$map['pageid_bigint']= I('get.id',0);
		if(intval(session('userid'))!=1)
		{
			$map['userid_int']  = intval(session('userid'));
		}
        M("scenepage")->where($map)->delete();
		echo json_encode(array("success" => true,
								"code"=> 200,
								"msg" => "success",
								"obj"=> null,
								"map"=> null,
								"list"=> null
							   )
						);


    }
	
    public function getcount(){
		echo json_encode(array("success" => true,
								"code"=> 200,
								"msg" => "success",
								"obj"=> null,
								"map"=> null,
								"list"=> null
							   )
						);


    }


    public function delscene(){
		$this->unlogin();
		$map['sceneid_bigint']= I('get.id',0);
		if(intval(session('userid'))!=1)
		{
			$map['userid_int']  = intval(session('userid'));
		}
		$datainfo['delete_int'] = 1;
		M("scene")->data($datainfo)->where($map)->save();

		echo json_encode(array("success" => true,
								"code"=> 200,
								"msg" => "success",
								"obj"=> null,
								"map"=> null,
								"list"=> null
							   )
						);


    }
	//我的场景列表 
    public function my(){
		$this->unlogin();
		$_scene = M('scene');
		$scenetype = intval(I('get.type',0));
		if($scenetype > 0)
		{
			$where['scenetype_int']  = $scenetype;
		}
		$where['userid_int']  = intval(session('userid'));
		//$_scene_list=$_scene->order('sceneid_bigint desc')->page(I('get.pageNo',1),I('get.pageSize',12))->select();
		$where['delete_int']  = 0;
		$pageshowsize = I('get.pageSize',12);
		if($pageshowsize>30){
			$pageshowsize = 30;
		}
		$_scene_list=$_scene->where($where)->order('sceneid_bigint desc')->page(I('get.pageNo',1),$pageshowsize)->select();
		$_scene_count = $_scene->where($where) ->count();
		
		//print_r($_scene_list);exit;     
		// $this->display();
		$jsonstr = '{"success":true,"code":200,"msg":"success","obj":null,"map": {"count": '.$_scene_count.',"pageNo": '.I('get.pageNo',0).',"pageSize": '.$pageshowsize.'},"list": [';
		$jsonstrtemp = '';
		foreach($_scene_list as $vo){
			$publishTime=$vo['publishtime']>0 ? $vo['publishtime']:'null';
			$updateTime=$vo['updateTime']>0 ? $vo['updateTime']:'null';
			
			$jsonstrtemp = $jsonstrtemp .'{
            "id": '.$vo["sceneid_bigint"].',
            "name": '.json_encode($vo["scenename_varchar"]).',
            "createUser": "'.$vo['userid_int'].'",
            "createTime": 1423645519000,
            "type": '.$vo["scenetype_int"].',
            "pageMode": '.$vo["movietype_int"].',
            "image": {
                "bgAudio": {
                    "url": "'.$vo["musicurl_varchar"].'",
                    "type": "'.$vo["musictype_int"].'"
                },
                "imgSrc": "'.$vo["thumbnail_varchar"].'",
                "hideEqAd": false,
                "isAdvancedUser": false
            },
            "isTpl": 0,
            "isPromotion": 0,
            "status": '.$vo['showstatus_int'].',
            "openLimit": 0,
            "submitLimit": 0,
            "startDate": null,
            "endDate": null,
            "accessCode": null,
            "thirdCode": null,
            "updateTime": '.$updateTime.',
            "publishTime": '.$publishTime.',
            "applyTemplate": 0,
            "applyPromotion": 0,
            "sourceId": 1225273,
            "code": "'.$vo["scenecode_varchar"].'",
            "description": '.json_encode($vo["desc_varchar"]).',
            "sort": 0,
            "pageCount": 0,
            "dataCount": '.$vo["datacount_int"].',
            "showCount": '.$vo["hitcount_int"].',
            "userLoginName": null,
            "userName": null
        },';
		}
		$jsonstr = $jsonstr.rtrim($jsonstrtemp,',').']}';
		echo $jsonstr;
    }

	//  系统模板列表
    public function syslist(){
		$this->unlogin();
		$_scene = M('scene');
		$scenetype = intval(I('get.tagId',0));
		if($scenetype > 0)
		{
			$where['tagid_int']  = $scenetype;
		}
		$where['userid_int']  = 0;

		$where['delete_int']  = 0;
		$pageshowsize = I('get.pageSize',12);
		if($pageshowsize>30){
			$pageshowsize = 30;
		}
		$_scene_list=$_scene->where($where)->order('sceneid_bigint desc')->page(I('get.pageNo',1),$pageshowsize)->select();
		$_scene_count = $_scene->where($where) ->count();
		//var_dump($_scene_list);exit;     
		//$this->display();
		$jsonstr = '{"success":true,"code":200,"msg":"success","obj":null,"map": {"count": '.$_scene_count.',"pageNo": '.I('get.pageNo',0).',"pageSize": '.$pageshowsize.'},"list": [';
		$jsonstrtemp = '';
		foreach($_scene_list as $vo){
			$jsonstrtemp = $jsonstrtemp .'{
            "id": '.$vo["sceneid_bigint"].',
            "name": '.json_encode($vo["scenename_varchar"]).',
            "createUser": "'.$vo['userid_int'].'",
            "createTime": 1423645519000,
            "type": '.$vo["scenetype_int"].',
            "pageMode": '.$vo["movietype_int"].',
            "image": {
                "bgAudio": {
                    "url": "'.$vo["musicurl_varchar"].'",
                    "type": "'.$vo["musictype_int"].'"
                },
                "imgSrc": "'.$vo["thumbnail_varchar"].'",
                "hideEqAd": false,
                "isAdvancedUser": false
            },
            "isTpl": 0,
            "isPromotion": 0,
            "status": '.$vo['showstatus_int'].',
            "openLimit": 0,
            "submitLimit": 0,
            "startDate": null,
            "endDate": null,
            "accessCode": null,
            "thirdCode": null,
            "updateTime": 1423645519000,
            "publishTime": 1423645519000,
            "applyTemplate": 0,
            "applyPromotion": 0,
            "sourceId": 1225273,
            "code": "'.$vo["scenecode_varchar"].'",
            "description": '.json_encode($vo["desc_varchar"]).',
            "sort": 0,
            "pageCount": 0,
            "dataCount": 0,
            "showCount": '.$vo["hitcount_int"].',
            "userLoginName": null,
            "userName": null
        },';
		}
		$jsonstr = $jsonstr.rtrim($jsonstrtemp,',').']}';
		echo $jsonstr;
    }

	public function promotion(){
		$jsonstr='{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":[';
		$_scene = M('scene');
		$scenetype = intval(I('get.tagId',0));
		if($scenetype > 0)
		{
			$where['tagid_int']  = $scenetype;
		}
		$where['userid_int']  = array('gt',0);

		$where['delete_int']  = 0;
		$pageshowsize = I('get.pageSize',6);
		if($pageshowsize>30){
			$pageshowsize = 30;
		}
		$_scene_list=$_scene->where($where)->order('sceneid_bigint desc')->page(I('get.pageNo',1),$pageshowsize)->select();
		 
		$jsonstrtemp = '';
		foreach($_scene_list as $vo){
			$jsonstrtemp = $jsonstrtemp .'{
            "id": '.$vo["sceneid_bigint"].',
            "name": '.json_encode($vo["scenename_varchar"]).',
            "createUser": "'.$vo['userid_int'].'",
            "createTime": 1423645519000,
            "type": '.$vo["scenetype_int"].',
            "pageMode": '.$vo["movietype_int"].',
            "image": {
                "bgAudio": {
                    "url": "'.$vo["musicurl_varchar"].'",
                    "type": "'.$vo["musictype_int"].'"
                },
                "imgSrc": "'.$vo["thumbnail_varchar"].'",
                "hideEqAd": false,
                "isAdvancedUser": false
            },
            "isTpl": 0,
            "isPromotion": 0,
            "status": '.$vo['showstatus_int'].',
            "createTime": "'.$vo['createtime_time'].'",                  
            "code": "'.$vo["scenecode_varchar"].'",           
            "sort": 0,
            "pageCount": 0,
            "dataCount": 0,
            "showCount": '.$vo["hitcount_int"].',
            "userLoginName": null,
            "userName": null
        },';
		}
		
		$jsonstr = $jsonstr.rtrim($jsonstrtemp,',').']}';
		echo $jsonstr;
	}

	public function syspageinfo(){
		$this->unlogin();
		$_scene = M('scenepagesys');
		$scenetype = intval(I('get.id',0));
		$where['pageid_bigint']  = $scenetype;
		$_scene_list=$_scene->where($where)->select();
		$jsonstr = '{"success":true,"code":200,"msg":"success","obj":{"id":'.$_scene_list[0]['pageid_bigint'].',"sceneId":1,"num":1,"name":"sys","properties":{"thumbSrc":"'.$_scene_list[0]['thumbsrc_varchar'].'"},"elements":'.$_scene_list[0]['content_text'].',"scene":null},"map":null,"list":null}';
		echo $jsonstr;
    }

    public function syspagetpl(){
		$this->unlogin();
		$_scene = M('scenepagesys');
		$scenetype = intval(I('get.tagId',0));
		$where['tagid_int']  = $scenetype;

		$_scene_list=$_scene->where($where)->order('pageid_bigint desc')->select();

		$jsonstr = '{"success":true,"code":200,"msg":"success","obj":null,"map": null,"list": [';
		$jsonstrtemp = '';
		foreach($_scene_list as $vo){
			$jsonstrtemp = $jsonstrtemp .'{"id":'.$vo["pageid_bigint"].',"sceneId":1,"num":1,"name":"name","properties":{"thumbSrc":"'.$vo["thumbsrc_varchar"].'"},"elements":null,"scene":null},';
		}
		$jsonstr = $jsonstr.rtrim($jsonstrtemp,',').']}';
		echo $jsonstr;
    }
	
	public function myTplSave(){
		
		$jsonStr='{"success":true,"code":200,"msg":"操作成功","obj":3138268,"map":null,"list":null}';
		echo $jsonstr;
	}

}