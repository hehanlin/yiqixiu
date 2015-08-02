<?php
class WifiModel extends Model{

		
		protected $_auto = array (
			
			array('token','gettoken',self::MODEL_INSERT,'callback'),
			array('createtime','time',self::MODEL_INSERT,'function'),
			
		);
		
		
		function gettoken(){
			return session('token');
		}
}

?>