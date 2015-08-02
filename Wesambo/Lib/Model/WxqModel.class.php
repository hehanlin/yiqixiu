<?php
class WxqModel extends Model{
	protected $_validate =array(
		array('title','require','标题不能为空',1),
        array('keyword','require','进入墻的关键字不能为空',1),
        array('qrcode','require','必须填写二维码链接',1),
	);
	protected $_auto = array (
		array('uid','getuser',self::MODEL_INSERT,'callback'),
		array('createtime','time',self::MODEL_INSERT,'function'),
		array('uptatetime','time',self::MODEL_BOTH,'function'),
		array('token','gettoken',self::MODEL_INSERT,'callback')
	);

	public function getuser(){
		return session('uid');
	}

	function gettoken(){
		return session('token');
	}

}