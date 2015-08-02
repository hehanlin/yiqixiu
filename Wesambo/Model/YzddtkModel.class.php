<?php
class YzddtkModel extends Model{

	protected $_validate =array(
		array('d1','require','答案1不能为空',1),
		array('d2','require','答案2不能为空',1),
	);
	
	protected $_auto = array (
		
		array('token','gettoken',self::MODEL_INSERT,'callback')
		
	);
	
	
	function gettoken(){
		return session('token');
	}
	
}