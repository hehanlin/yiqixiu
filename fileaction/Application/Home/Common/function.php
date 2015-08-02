<?php
/**
 * Created by PhpStorm.
 * User: cony
 * Date: 14-3-7
 * Time: 上午10:15
 */
/**
 * 获取默认图片
 * @param $str
 * @return bool|mixed
 */
function get_default_img($str){
    if(!$str)return false;
    $str_arr=explode(',',$str);
    $map['id']=$str_arr[0];
    return M('images')->where($map)->getField('savepath');
}

/**
 * 获取图片集
 * @param $str
 * @return bool|mixed
 */
function get_img_array($str){
    if(!$str)return false;
    $str_arr=@explode(',',$str);
    $map['id']=array('in',$str_arr);
    return M('images')->where($map)->field('savepath')->select();
}

/**
 * 分类面包屑导航
 * @param $cid
 * @param bool $flag
 * @return string
 */
function conist_nav($cid,$flag=false){
    $cat = new \Org\Util\Category('Category', array('cid', 'pid', 'name', 'fullname'));
    $arr=$cat->getPath($cid);
    $str='<a href='.__APP__.'>'.L('T_HOME').'</a>>';
    if(is_array($arr))
    foreach($arr as $v){
        $str.=$v['name'].'>';
    }
    if($flag)$str=substr($str,0,-1);
    return $str;
}


