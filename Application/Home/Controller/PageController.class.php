<?php
/**

 *  
 */
namespace Home\Controller;
use Think\Controller;
class PageController extends Controller{
 
	public function _initialize(){
		 
		 if(intval(session("userid"))==0)
		{
			header('Content-type: text/json');
			header('HTTP/1.1 401 error');
			echo json_encode(array("success" => false,"code"=> 1001,"msg" => "请先登录!","obj"=> null,"map"=> null,"list"=> null));
			exit;
		} 
	}
	public function index(){
		exit('index');
	}
	public function savePageName(){
		if(I('post.id',0)&& I('post.name')){
			$where['pageid_bigint'] = I('post.id',0);
			$where['sceneid_bigint'] = I('post.sceneId',0);
			$where['userid_int'] =intval(session("userid"));
			
			$datainfo['pagename_varchar']= I('post.name');
			M('scenepage')->data($datainfo)->where($where)->save();;
			$jsonstr = '{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":null}';
		}else{
			$jsonstr = '{"success":false,"code":100,"msg":"操作失败","obj":null,"map":null,"list":null}';
			}
		echo $jsonstr;
	}
	public function crop(){
		
		$src=WWW_ROOT.'Uploads/'. I('post.src');
		 
		$ImageCut = new \Think\ImageCut($src,I('post.x'),I('post.y'),I('post.x2'),I('post.y2'));// 实例化上传类
		
		$returnImg=$ImageCut->generate_shot();
		
		$returnImg=str_replace(WWW_ROOT.'Uploads/','',$returnImg);
		$jsonstr = '{"success":true,"code":200,"msg":"操作成功","obj":"'.$returnImg.'","map":null,"list":null}';	
		
			echo $jsonstr;
	}
	public function pageSort(){
 		if(I('get.id',0)){
			$where['pageid_bigint'] = I('get.id',0);
			
  			$where['userid_int'] =intval(session("userid"));
			
			$order=$datainfo['pagecurrentnum_int']= I('get.pos');
			$re_bool= M('scenepage')->data($datainfo)->where($where)->save();
			 
 			$work_id=M('scenepage')->where($where)->getField('sceneid_bigint');
			 
 			 
			 $photoList=	M('scenepage')->field('pagecurrentnum_int,pageid_bigint')->where("pageid_bigint<>{$where['pageid_bigint']} AND sceneid_bigint='$work_id' AND userid_int={$where['userid_int']} AND pagecurrentnum_int>='$order'")->order('pagecurrentnum_int asc')->select();
				
				foreach($photoList as $k=> $row){
					$sort=$row['pagecurrentnum_int']+$k+1;
				    M('scenepage')->where("pageid_bigint={$row[pageid_bigint]}")->save(array('pagecurrentnum_int'=>$sort)); 
 				}					
			 
		}
		$jsonstr = '{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":null}';
		echo $jsonstr;

	}
   

}