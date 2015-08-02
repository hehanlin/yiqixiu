<?php

class CarownerModel extends Model {
	//自动验证
	protected $_validate = array(
			
			array('title','require','标题不能为空'),
			array('keyword','require','触发关键词不能为空',3),
			array('head_url','require','图文封面不能为空'),
			array('info','require','订单详情不能为空'),
				
	 );
}