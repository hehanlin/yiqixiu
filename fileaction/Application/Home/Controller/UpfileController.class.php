<?php
namespace Home\Controller;
use Think\Controller;
class UpfileController extends Controller {

    public function _initialize(){
		header('Content-type: text/plain');
		header('Access-Control-Allow-Credentials:true');
		header('Access-Control-Allow-Origin:http://127.0.0.1');
		header('Access-Control-Allow-Origin:http://e.wesambo.com');
	}


	public function upload(){
		$useridint = I("get.ID",0);
		if(I("get.keycode",'0') != md5('adklsj[]999875sssee,'.$useridint))
		{
			header('Content-type: text/plain');
			header('HTTP/1.1 403 error');
			echo json_encode(array("success" => false,"code"=> 1001,"msg" => "请先登录!code-error","obj"=> null,"map"=> null,"list"=> null));
			exit;
		}
		$upload = new \Think\Upload();// 实例化上传类
		$upload->maxSize = 3145728 ;// 设置附件上传大小
		if(I('get.fileType',0)==2)
		{
			$upload->exts = array('mp3');// 设置附件上传类型
			$upload->savePath = 'mp3/'.$useridint.'/'; // 设置附件上传（子）目录
		}
		else
		{
			$upload->exts = array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
			$upload->savePath = 'pic/'.$useridint.'/'; // 设置附件上传（子）目录
		}
		$upload->rootPath = '../userfiles/'; // 设置附件上传根目录
		$upload->subName  = array('date','Ym');
		// 采用时间戳命名
		$upload->saveName = 'uniqid';
		// 采用GUID序列命名
		//$upload->saveName = 'guid'; 
		// 上传文件
		$info = $upload->upload();
		if(!$info) {// 上传错误提示错误信息
			header('Content-type: text/plain');
			header('HTTP/1.1 401 error');
			echo json_encode(array("success" => false,"code"=> 1001,"msg" => "文件上传错误!","obj"=> null,"map"=> null,"list"=> null));
			exit;
			echo $this->error($upload->getError());
			//$this->error($upload->getError());
		}else{// 上传成功 获取上传文件信息
			header('Content-type: text/plain');
			header('HTTP/1.1 200 ok');
			foreach($info as $file){
				$thubimagenew = $file['savepath'].$file['savename'];
				if(I('get.fileType',0)!=2)
				{
					$image = new \Think\Image(); 
					$thubimage = $file['savepath'].$file['savename'];
					$image->open($upload->rootPath.$thubimage);
					$thubimagenew = str_replace(".".$file['ext'],"_thumb.".$file['ext'],$file['savename']);
					$thubimagenewftp =$thubimagenew;
					$thubimagenew =  $file['savepath'].$thubimagenew;
					//echo $thubimagenew; exit;
					// 按照原图的比例生成一个最大为150*150的缩略图并保存为thumb.jpg
					if(I('get.fileType',0)==0)
					{
						$image->thumb(80, 126)->save($upload->rootPath.$thubimagenew);
					}
					else
					{
						$image->thumb(80, 80)->save($upload->rootPath.$thubimagenew);
					}
				}
				$sizeint = number_format($file['size']/1024,2);
				$jsonstr = '{"success":true,"code":200,"msg":"success","obj":{"id":9386090,"name":"'.$file['savename'].'","extName":"'.strtoupper($file['ext']).'","fileType":0,"bizType":0,"path":"'.$file['savepath'].$file['savename'].'","tmbPath":"'.$thubimagenew.'","createTime":1426209412922,"createUser":"'.$useridint.'","sort":0,"size":'.$sizeint.',"status":1},"map":null,"list":null}';
				
			
				
				$model = M('upfile');
				// 取得成功上传的文件信息
				// 保存当前数据对象

				$data['ext_varchar'] = strtoupper($file['ext']);
				$data['filename_varchar'] = $file['name'];
				$data['filetype_int'] = I('get.fileType',0);
				$data['biztype_int'] = I('get.bizType',0);
				$data['userid_int'] = $useridint;
				$data['filesrc_varchar'] = $file['savepath'].$file['savename'];
				$data['sizekb_int'] = $sizeint;
				$data['filethumbsrc_varchar'] = $thubimagenew;
				$data['create_time'] = date('y-m-d H:i:s',time());
				$model->add($data);
				echo $jsonstr;
			}
		}
    }


    public function delete(){
		$m_file = M("upfile");
		$map['fileid_bigint']= I('post.id',0);

		$useridint = I("post.UID",0);
		if(I("post.keycode",'0') != md5('adklsj[]999875sssee,'.$useridint))
		{
			header('Content-type: text/plain');
			header('HTTP/1.1 403 error');
			echo json_encode(array("success" => false,"code"=> 1001,"msg" => "请先登录!code-error","obj"=> null,"map"=> null,"list"=> null));
			exit;
		}

		$map['userid_int']  = intval($useridint);
		$fileinfo=$m_file->where($map)->select();
		if($fileinfo)
		{
			try {
				$fullpath="../userfiles/".$fileinfo[0]["filethumbsrc_varchar"];
				unlink($fullpath);
			} catch (Exception $e) {}
			try {
				$fullpath="../userfiles/".$fileinfo[0]["filesrc_varchar"];
				unlink($fullpath);
			} catch (Exception $e) {   
				$m_file->where($map)->delete();
				echo json_encode(array("success" => false,
						"code"=> 404,
						"msg" => "delerror",
						"obj"=> null,
						"map"=> null,
						"list"=> null
					   )
				);
				exit();   
			}   
			$m_file->where($map)->delete();
			echo json_encode(array("success" => true,
									"code"=> 200,
									"msg" => "success",
									"obj"=> null,
									"map"=> null,
									"list"=> null
								   )
							);
		}


    }
}