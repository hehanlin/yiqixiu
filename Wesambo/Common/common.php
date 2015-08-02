<?php
function isAndroid(){
	if(strstr($_SERVER['HTTP_USER_AGENT'],'Android')) {
		return 1;
	}
	return 0;
}

function countGetM($M,$W){
	$model = M( $M );
	return $count = $model->where($W)->count();
}


function findList($tname,$where="", $order, $count){
	$m = M($tname);
	if(!empty($where)){
		$m->where($where);
	}
	if(!empty($order)){
		$m->order($order);
	}
	if($count>0){
		$m->limit($count);
	}
	return $m->select();
}

function findList2($tname,$where="", $order, $limit){
	$m = M($tname);
	if(!empty($where)){
		$m->where($where);
	}
	if(!empty($order)){
		$m->order($order);
	}
	if(!empty($limit)){
		$m->limit($limit);
	}
	return $m->select();
}

function findBy($name,$where,$field=''){
	$m = M($name);
	if($field=""){
		return $m->where($where)->find();
	}
	else{
		return $m->where($where)->field($field)->find();
	}
}

 /*function isAu(){
	$arr = include './Conf/info.php';
	
	$str = file_get_contents('http://key.kmarfl.com/index.php/License/index/domain/'.$_SERVER['SERVER_NAME']);

	if(is_numeric($str) || $str != $arr['site_Token']){
		header('location:http://key.kmarfl.com/index.php/License/connect/id/'.$str);
		exit;
	}
}*/

function showType($type,$value){
	switch($type){
		case 'flag_q':
			$arrs = array('周边近郊','青羊区','锦江区','金牛区','成华区','武候区','青白江区','龙泉驿区','新都区','温江区');
			return $arrs[$value];
			break;
		case 'flag_x':
			$arrs = array('特色场地','田园农家乐','酒家酒楼','3星级酒店','4星级酒店','5星级酒店');
			return $arrs[$value];
			break;
		case 'flag_z':
			$arrs = array('10以下','10-20桌','20-30桌','30-50桌','50桌以上');
			return $arrs[$value];
			break;
		default:
			break;
	}	
		
}



?>