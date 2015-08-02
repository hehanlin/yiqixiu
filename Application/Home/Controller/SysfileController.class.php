<?php
namespace Home\Controller;
use Think\Controller;
class SysfileController extends Controller {



    public function updatesysdataform() {
		$m_scene=M('scene');
		$m_scenepage=M('scenepage');
		$m_scenedata=M('scenedatasys');

		$where['userid_int'] = 0;
		$_scene_list = $m_scene->where($where)->select();
		foreach($_scene_list as $vo){
			$wheredata['userid_int'] = 0;
			$wheredata['sceneid_bigint'] = $vo['sceneid_bigint'];
			$_scenepage_list = $m_scenepage->where($wheredata)->select();
			foreach($_scenepage_list as $vo2){
				foreach (json_decode($vo2['content_text'],true) as $key => $val ) 
				{	
					if($val['type']==5){
						$dataList[] = array('sceneid_bigint'=>$vo['sceneid_bigint'],
											'pageid_bigint'=>$vo2['pageid_bigint'],
											'elementid_int'=>$val['id'],
											'elementtitle_varchar'=>$val['title'],
											'elementtype_int'=>$val['type'],
											'userid_int'=>0
										);
					}
		
				}
			}
		}
		if(count($dataList)>0){
			//$m_scenedata->addAll($dataList);
		}
    }

	public function upload(){
			$filemcpath = 'img';
	
			$jsonstr='';
			
			
			$jsonresult = json_decode($jsonstr,true);
			foreach($jsonresult['list'] as $v){
				$data = file_get_contents('http://e.wesambo.com/'.$v['path']);
				$datathumb = file_get_contents('http://e.wesambo.com/'.$v['tmbPath']);
				$filetime = time();
				$filename1 = md5($v['path']);
				$filename1thumb = $filename1.'_thumb';
				$filename = $filename1.'.'.substr($v['path'],-3,3); //生成文件名，
				$fp = @fopen('./Uploads/syspic/'.$filemcpath.'/'.$filename,"w"); //以写方式打开文件
				@fwrite($fp,$data); //
				fclose($fp);//完工，哈

				$filenamethumb = $filename1thumb.'.'.substr($v['tmbPath'],-3,3); //生成文件名，
				$fp = @fopen('./Uploads/syspic/'.$filemcpath.'/'.$filenamethumb,"w"); //以写方式打开文件
				@fwrite($fp,$datathumb); //
				fclose($fp);//完工，哈
			
				// 取得成功上传的文件信息
				// 保存当前数据对象
				$model = M('upfilesys');
				$data3['ext_varchar'] = strtoupper($v['extName']);
				$data3['filename_varchar'] = 'syspic.jpg';
				$data3['filetype_int'] = $v['fileType']; //0背景,2音乐,1图片
				$data3['biztype_int'] = $v['bizType'];
				$data3['userid_int'] = 0;
				$data3['filesrc_varchar'] = 'syspic/'.$filemcpath.'/'.$filename;
				$data3['sizekb_int'] = $v['size'];
				$data3['filethumbsrc_varchar'] = 'syspic/'.$filemcpath.'/'.$filenamethumb;
				$data3['create_time'] = date('y-m-d H:i:s',time());

				$data3['eqsrc_varchar'] = $v['path'];
				$data3['eqsrcthumb_varchar'] = $v['tmbPath'];
				$data3['tagid_int'] = 14133;
				echo $data3['tagid_int'].'-----'.$data3['filesrc_varchar'].'---'.$v['path'].'<br>';
				//$model->add($data3);
			}

	}


	public function uploadmp3(){
			$filemcpath = 'mp3';
	
			$jsonstr='';
			
			$jsonresult = json_decode($jsonstr,true);
			foreach($jsonresult['list'] as $v){
				$data = file_get_contents('http://e.wesambo.com/'.$v['path']);
				$filetime = time();
				$filename1 = md5($v['path']);
				$filename = $filename1.'.'.substr($v['path'],-3,3); //生成文件名，
				$fp = @fopen('./Uploads/syspic/'.$filemcpath.'/'.$filename,"w"); //以写方式打开文件
				@fwrite($fp,$data); //
				fclose($fp);//完工，哈
			
				// 取得成功上传的文件信息
				// 保存当前数据对象
				$model = M('upfilesys');
				$data3['ext_varchar'] = strtoupper($v['extName']);
				$data3['filename_varchar'] = $v['name'];
				$data3['filetype_int'] = $v['fileType']; //0背景,2音乐,1图片
				$data3['biztype_int'] = $v['bizType'];
				$data3['userid_int'] = 0;
				$data3['filesrc_varchar'] = 'syspic/'.$filemcpath.'/'.$filename;
				$data3['sizekb_int'] = $v['size'];
				$data3['create_time'] = date('y-m-d H:i:s',time());

				$data3['eqsrc_varchar'] = $v['path'];
				echo $data3['filesrc_varchar'].'---'.$v['path'].'<br>';
				//$model->add($data3);
			}

	}



	public function createtag(){
	
			$jsonstr='{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":[{"id":58,"name":"清新","bizType":105,"type":2},{"id":59,"name":"蓝色","bizType":105,"type":2},{"id":60,"name":"中国风","bizType":105,"type":2},{"id":61,"name":"简洁","bizType":105,"type":2},{"id":62,"name":"黑白","bizType":105,"type":2},{"id":63,"name":"红色","bizType":105,"type":2},{"id":64,"name":"怀旧","bizType":105,"type":2},{"id":65,"name":"现代","bizType":105,"type":2},{"id":66,"name":"扁平化","bizType":105,"type":2}]}';
			
			$jsonresult = json_decode($jsonstr,true);
			foreach($jsonresult['list'] as $v){
				$model = M('tag');
				$data3['tagid_int'] = $v['id'];
				$data3['userid_int'] = 0;
				$data3['name_varchar'] = $v['name']; 
				$data3['type_int'] = 2;//0背景,2音乐,1图片
				$data3['biztype_int'] = $v['bizType'];
				$data3['create_time'] = date('y-m-d H:i:s',time());
				$model->add($data3);
				echo $data3['tagid_int'].'<br>';
			}

	}



	public function createsyspage(){
	
			$jsonstr='{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":[{"id":117231,"sceneId":1102,"num":103,"name":"红黄蓝绿","properties":{"thumbSrc":"group1/M00/36/C9/yq0KA1Sr5ICARtQVAACBGZ-7NDo635.png"},"elements":null,"scene":null},{"id":132905,"sceneId":1102,"num":65,"name":"泰戈尔虎","properties":{"thumbSrc":"group1/M00/CB/92/yq0KA1UChAKAAraXAAP0A-_CnmI265.png"},"elements":null,"scene":null},{"id":137449,"sceneId":1102,"num":76,"name":"联系方式I","properties":{"thumbSrc":"group1/M00/CB/68/yq0KA1UCgnCAdnQzAAI9WpaldyU158.png"},"elements":null,"scene":null},{"id":18227667,"sceneId":1102,"num":15,"name":"虹","properties":{"thumbSrc":"group1/M00/AB/83/yq0KA1TcH4-AXjarAACAIlpP3AA420.png"},"elements":null,"scene":null}]}';
			
			
			$jsonresult = json_decode($jsonstr,true);
			foreach($jsonresult['list'] as $v){
				$data = file_get_contents('http://e.wesambo.com/'.$v['properties']['thumbSrc']);
				$filetime = time();
				$filename1 = md5($v['properties']['thumbSrc']);
				$filename = $filename1.'.'.substr($v['properties']['thumbSrc'],-3,3); //生成文件名，
				$fp = @fopen('./Uploads/syspic/page/'.$filename,"w"); //以写方式打开文件
				@fwrite($fp,$data); //
				fclose($fp);//完工，哈


				$model = M('scenepagesys');
				$data3['tagid_int'] = 125;
				$data3['biztype_int'] = 1103;
				$data3['pagecurrentnum_int'] = $v['num'];
				$data3['userid_int'] = 0;
				$data3['sceneid_bigint'] = $v['sceneId']; 
				$data3['pagename_varchar'] = $v['name'];
				$data3['thumbsrc_varchar'] = 'syspic/page/'.$filename;
				$data3['eqsrc_varchar'] = $v['properties']['thumbSrc'];
				$data3['createtime_time'] = date('y-m-d H:i:s',time());
				//$model->add($data3);
				echo $data3['tagid_int'].'---'.$data3['thumbsrc_varchar'].'<br>';
			}

	}



	public function createsysscene(){
	
			$jsonstr='';
			
			
			$jsonresult = json_decode($jsonstr,true);
			foreach($jsonresult['list'] as $v){
				$data = file_get_contents('http://e.wesambo.com/'.$v['image']['imgSrc']);
				$filetime = time();
				$filename1 = md5($v['image']['imgSrc']);
				$filename = $filename1.'.'.substr($v['image']['imgSrc'],-3,3); //生成文件名，
				$fp = @fopen('./Uploads/syspic/scene/'.$filename,"w"); //以写方式打开文件
				@fwrite($fp,$data); //
				fclose($fp);//完工，哈

				if($v['image']['bgAudio']['url']!="")
				{
					$data = file_get_contents('http://e.wesambo.com/'.$v['image']['bgAudio']['url']);
					$filetime = time();
					$filename1 = md5($v['image']['bgAudio']['url']);
					$filenameaudio = $filename1.'.'.substr($v['image']['bgAudio']['url'],-3,3); //生成文件名，
					$fp = @fopen('./Uploads/syspic/mp3/'.$filenameaudio,"w"); //以写方式打开文件
					@fwrite($fp,$data); //
					fclose($fp);//完工，哈
					$datainfo['musicurl_varchar'] = 'syspic/mp3/'.$filenameaudio;
				}else{
					$bgdatainfo['musicurl_varchar'] = '';
				}



				$model = M('scene');
				$datainfo['scenecode_varchar'] = 'S'.randorderno(10,-1);
				$datainfo['scenename_varchar'] = $v['name'];
				$datainfo['movietype_int'] = $v['pageMode'];
				$datainfo['ip_varchar'] = '127.0.0.1';
				$datainfo['thumbnail_varchar'] = 'syspic/scene/'.$filename;
				$datainfo['userid_int'] = 0;
				$datainfo['createtime_time'] = date('y-m-d H:i:s',time());
				$datainfo['scenetype_int'] = $v['type'];
				$datainfo['biztype_int'] = 105;
				$datainfo['tagid_int'] = 66;
				$model->add($datainfo);
				echo $datainfo['scenecode_varchar'].'<br>';
			}

	}



	public function updatesysscene(){
	
			$jsonstr='';
			
			
			$jsonresult = json_decode($jsonstr,true);
			foreach($jsonresult['list'] as $v){
				$filetime = time();
				$filename1 = md5($v['image']['imgSrc']);
				$filename = $filename1.'.'.substr($v['image']['imgSrc'],-3,3); //生成文件名，
				$model = M('scene');
				$datainfo['eqcode'] = $v['code'];
				$where['thumbnail_varchar'] = 'syspic/scene/'.$filename;
				$model->data($datainfo)->where($where)->save();
				echo $datainfo['eqid_int'].'<br>';
			}

	}

	// 增加系统模板内页数据
	public function addsyspages(){
	
			$m_scene=M('scene');
			$m_scenepage=M('scenepage');
			$where['userid_int'] = 0;
			$m_scenelist=$m_scene->where($where)->select();
			foreach($m_scenelist as $voo){
				echo "http://127.0.0.1/eqxiu/jsonsys/".$voo['eqcode'];
				$jsonstr = json_decode(file_get_contents("http://127.0.0.1/eqxiu/jsonsys/".$voo['eqcode']),true);
				//var_dump($jsonstr);
				$jsonstr = $jsonstr['list'];

				foreach($jsonstr as $v){
					$datainfo['sceneid_bigint'] = $voo['sceneid_bigint'];
					$datainfo['pagecurrentnum_int'] = $v['num'];
					$datainfo['scenecode_varchar'] = $voo['scenecode_varchar'];
					$datainfo['content_text'] = json_encode($v['elements']);
					$datainfo['createtime_time'] = date('y-m-d H:i:s',time());
					$datainfo['userid_int'] = 0;
					//$m_scenepage->data($datainfo)->where($where)->add();
					
					//$enjsonstr = $this->arr_foreach($jsonstr,$v['eqid_int']);

				}
				//exit;
			}
	}

	// 增加系统模板内页数据
	public function addnotfound(){
			$m_scenepage=M('scenepage');
			echo "http://127.0.0.1/404.php";
			//var_dump($m_scenepage);exit;
			$jsonstr = json_decode(file_get_contents("http://127.0.0.1/404.htm"),true);
			$jsonstr = $jsonstr['list'];
			//var_dump($jsonstr);exit;
				//$enjsonstr = $this->arr_foreachme($jsonstr,267070);
	}

	public function updatesyspage(){
	
			$jsonstr='{"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":[{"id":1978536,"sceneId":1103,"num":7,"name":"橙色联系","properties":{"thumbSrc":"group1/M00/A2/CF/yq0KA1TBtOmAABsxAADT8Q9xq4w242.png"},"elements":null,"scene":null},{"id":14329619,"sceneId":1103,"num":6,"name":"高大上","properties":{"thumbSrc":"group1/M00/46/72/yq0KA1TTFxyAJlLiAAIXHwjKVuc105.png"},"elements":null,"scene":null}]}';
			
			
			$jsonresult = json_decode($jsonstr,true);
			foreach($jsonresult['list'] as $v){

				$model = M('scenepagesys');
				$data3['eqid_int'] = $v['id'];
				$where['eqsrc_varchar'] = $v['properties']['thumbSrc'];
				//$model->data($data3)->where($where)->save();
				echo $data3['eqid_int'].'<br>';
			}

	}
//	public function getfiles(){
//		$list = scandir('./Uploads/json/'); // 得到该文件下的所有文件和文件夹
//		foreach($list as $file){//遍历
//			$file_location=$dir."/".$file;//生成路径
//			if($file!="." &&$file!=".."){ //判断是不是文件夹
//				$file_location=$file;//生成路径
//				echo $file_location."<br/>";
//				$fp = @fopen('./Uploads/json/'.$file_location,"r"); //以写方式打开文件
//				echo $fp; //
//				fclose($fp);//完工，哈
//				exit;
//
//			}
//		}
//	}

    public function createtplurl() {
		$m_scene=M('scene');
		$m_scenelist=$m_scene->where('userid_int=0')->select();
		foreach($m_scenelist as $v){
			echo "http://e.wesambo.com/eqs/s/".$v['eqcode']."\n";
		}
	}

    public function updatesyspagebyid($id,$orstr,$resstr) {
		$model = M('scenepagesys');
		$where['eqid_int'] = $id;
		$m_scenelist=$model->distinct(true)->where($where)->select();
		$data3['content_text'] = str_replace($orstr,$resstr,$m_scenelist[0]['content_text']);
		$model->data($data3)->where($where)->save();
	}

    public function updatesyspagebymeid($id,$orstr,$resstr) {
		echo $id.$orstr.$resstr.'<br>';
		$model = M('scenepage');
		$where['pageid_bigint'] = 154695;
		$m_scenelist=$model->where($where)->select();
		$data3['content_text'] = str_replace($orstr,$resstr,$m_scenelist[0]['content_text']);
		$model->data($data3)->where($where)->save();
	}

    public function writejson() {
		$m_scene=M('scenepagesys');
		$m_scenelist=$m_scene->distinct(true)->field('eqid_int')->select();
		foreach($m_scenelist as $v){
			$jsonstr = json_decode(file_get_contents("http://127.0.0.1/eqxiu/Uploads/json/".$v['eqid_int']),true);
			$jsonstr = $jsonstr['obj']['elements'];
			$enjsonstr = $this->arr_foreach($jsonstr,$v['eqid_int']);
			$where['eqid_int']  = $v['eqid_int'];
			//$datainfo['content_text']  = $enjsonstr;
			//$m_scene->data($datainfo)->where($where)->save();
			echo $where['eqid_int'].'<br>';
			//exit;
		}
	}
	
	function arr_foreachme($arr,$id) 
	{
		foreach ($arr as $key => $val ) 
		{	
			if (is_array ($val)) 
			{
				$this->arr_foreachme($val,$id);
			} 
			else 
			{
				if($key=="src" && substr($val,0,6)=='group1' && (substr($val,-4,4)=='.jpg' || substr($val,-4,4)=='.png' || substr($val,-4,4)=='.gif' || substr($val,-5,5)=='.jpeg')){
					$filename1 = md5($val);
					$filename11 = $val;
					$filename11 = str_replace('/','\/',$val);
					//var_dump( $filename11).'---';
					$this->updatesyspagebymeid($id,$filename11,'syspic/pageimg/'.$filename1.'.'.substr($val,-3,3));
					//echo $filename11.'---';
					$data = file_get_contents('http://res.eqxiu.com/'.$val);
					$filetime = time();
					$filename = $filename1.'.'.substr($val,-3,3); //生成文件名，
					$fp = @fopen('./Uploads/syspic/pageimg/'.$filename,"w"); //以写方式打开文件
					@fwrite($fp,$data);
					fclose($fp);//完工，哈
				}

			}
		}
		return 'aaa';
	}	
	
	function arr_foreach($arr,$id) 
	{
		foreach ($arr as $key => $val ) 
		{	
			if (is_array ($val)) 
			{
				$this->arr_foreach($val,$id);
			} 
			else 
			{
				if($key=="imgSrc" && substr($val,0,6)=='group1' && (substr($val,-4,4)=='.jpg' || substr($val,-4,4)=='.png' || substr($val,-4,4)=='.gif' || substr($val,-5,5)=='.jpeg')){
					$filename1 = md5($val);
					$filename11 = $val;
					$filename11 = str_replace('/','\/',$val);
					//var_dump( $filename11).'---';
					$this->updatesyspagebyid($id,$filename11,'syspic/pageimg/'.$filename1.'.'.substr($val,-3,3));
					//echo $filename11.'---';
					$data = file_get_contents('http://res.eqxiu.com/'.$val);
					$filetime = time();
					$filename = $filename1.'.'.substr($val,-3,3); //生成文件名，
					$fp = @fopen('./Uploads/syspic/pageimg/'.$filename,"w"); //以写方式打开文件
					@fwrite($fp,$data);
					fclose($fp);//完工，哈
				}

			}
		}
		return 'aaa';
	}	
	
	// 更新系统模板里面的图片信息
    public function writejsonxtpage() {
		$m_scene=M('scenepage');
		$m_scenelist=$m_scene->where("userid_int=0")->select();
		foreach($m_scenelist as $v){
			$jsonstr = json_decode($v['content_text'],true);
			$enjsonstr = $this->arr_foreachxt($jsonstr,$v['pageid_bigint']);
			echo $v['pageid_bigint'].'<br>';
			//exit;
		}
	}
	// 更新系统模板里面的图片信息
    public function updatextpagebyid($id,$orstr,$resstr) {
		$model = M('scenepage');
		$where['pageid_bigint'] = $id;
		$m_scenelist=$model->distinct(true)->where($where)->select();
		$data3['content_text'] = str_replace($orstr,$resstr,$m_scenelist[0]['content_text']);
		$model->data($data3)->where($where)->save();
	}

	
	function arr_foreachxt($arr,$id) 
	{
		foreach ($arr as $key => $val ) 
		{	
			if (is_array ($val)) 
			{
				$this->arr_foreachxt($val,$id);
			} 
			else 
			{
				if(($key=="imgSrc" || $key=="src") && substr($val,0,6)=='group1' && (substr($val,-4,4)=='.jpg' || substr($val,-4,4)=='.png' || substr($val,-4,4)=='.gif' || substr($val,-5,5)=='.jpeg')){
					$filename1 = md5($val);
					$filename11 = $val;
					$filename11 = str_replace('/','\/',$val);
					//var_dump( $filename11).'---';
					$this->updatextpagebyid($id,$filename11,'syspic/pageimg/'.$filename1.'.'.substr($val,-3,3));
					//echo $filename11.'---';
					$data = file_get_contents('http://res.eqxiu.com/'.$val);
					$filetime = time();
					$filename = $filename1.'.'.substr($val,-3,3); //生成文件名，
					$fp = @fopen('./Uploads/syspic/pageimg/'.$filename,"w"); //以写方式打开文件
					@fwrite($fp,$data);
					fclose($fp);//完工，哈
				}

			}
		}
		return 'aaa';
	}	
}