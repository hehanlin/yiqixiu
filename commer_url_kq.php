<?php
//http://www.shloong.net/gameframe/respond.php?code=alipay&buyer_email=david3773%40sina.com&buyer_id=2088002349817066&discount=0.00&gmt_create=2014-03-17+21%3A22%3A38&gmt_logistics_modify=2014-03-17+21%3A22%3A52&gmt_payment=2014-03-17+21%3A23%3A32&is_success=T&is_total_fee_adjust=N&logistics_fee=0.00&logistics_payment=BUYER_PAY_AFTER_RECEIVE&logistics_type=EXPRESS&notify_id=RqPnCoPT3K9%252Fvwbh3I74mwFmOD%252F7XLRMIJmNi3Nv%252FQgRJGR4fts5mcPo3eODitg4SUUS&notify_time=2014-03-17+21%3A23%3A35&notify_type=trade_status_sync&out_trade_no=VC0xMzIyMjIyMjIyMi00OS44OS0xLTk5LTAt216&payment_type=1&price=0.01&quantity=1&receive_address=%E5%B1%B1%E4%B8%9C%E7%9C%81+%E9%9D%92%E5%B2%9B%E5%B8%82+%E5%B8%82%E5%8D%97%E5%8C%BA+%E9%9D%92%E5%B2%9B%E5%B8%82%E5%B1%B1%E4%B8%9C%E8%B7%AF27%E5%8F%B7%E6%B8%AF%E6%BE%B3%E5%A4%A7%E5%8E%A62401%E5%AE%A4%E6%8A%80%E6%9C%AF%E7%A0%94%E5%8F%91%E9%83%A8&receive_mobile=13515325281&receive_name=%E7%8E%8B%E5%BA%86%E5%B9%B3&receive_phone=053285018950&receive_zip=266071&seller_actions=SEND_GOODS&seller_email=18678402527&seller_id=2088702144123226&subject=VC0xMzIyMjIyMjIyMi00OS44OS0xLTk5LTAt&total_fee=0.01&trade_no=2014031719985706&trade_status=WAIT_SELLER_SEND_GOODS&use_coupon=N&sign=9a094391174401b54bd68c529332cf58&sign_type=MD5
if ($_GET) {
	$arr = $_GET;
	$user_id = $arr['uid'];
	$zhuanch_money = $arr['zhuanru_money'] + 0;
	if (!$user_id || $zhuanch_money <= 0){	
		die('error');
	}
		
	//类型T/G/Q-帐号-优惠后钱-数量-表id-子表id-   uid
	//F-1-$zhuanch_money-1-1-1- uid
	if (1) {
		//mobile手机号 mz-面值 tid表id
		//$order_sn = "T-$arr[mobile]-Price-1-$tid-0";
		$order_sn = "F-1-$zhuanch_money-1-1-1-";
		$arr['gm_quantity'] = 1;
	} else {
		die('error');//tel-xxx-0-num-uid
	}
	
	$Price = $zhuanch_money;
	$order_amount = $arr['gm_quantity'] * $Price;
	$order_sn = base64_encode($order_sn).'-';//out_trade_no = order_sn . log_id	

	$merchantAcctId=$arr['kuaiqian_account'];
	$key=$arr['kuaiqian_key'];
	
	$payerName	 = 'uid-'.$user_id;
	$orderId	 = $arr['out_trade_no'];//date('YmdHis').'0'.rand(0, 1000);
	$orderAmount = $order_amount*100;//以分为单位
	$productName = 'kuaiqian_zhuanru';
	$productNum	 = $arr['gm_quantity'];
	$ext1		 = $order_sn . $user_id;
	$ext2		 = $order_amount . '@' . $orderId;//total_fee@trade_no
	$success_ret_url = "http://" .$_SERVER['SERVER_NAME']. "/index.php?g=User&m=Alipay&a=kuaiqian_charge_return"; //成功后的返回地址
} else {
	exit('forbidden');
}


///1代表UTF-8; 2代表GBK; 3代表gb2312
$inputCharset="1";

//服务器接受支付结果的后台地址.与[pageUrl]不能同时为空。必须是绝对地址。
///快钱通过服务器连接的方式将交易结果发送到[bgUrl]对应的页面地址，在商户处理完成后输出的<result>如果为1，页面会转向到<redirecturl>对应的地址。
///如果快钱未接收到<redirecturl>对应的地址，快钱将把支付结果GET到[pageUrl]对应的页面。
$bgUrl=$success_ret_url;

$version="v2.0";
$language="1";
$signType="1";	
   
//支付人姓名
///可为中文或英文字符
$payerName=$payerName;
$payerContactType="1";	
$payerContact="";
$orderId=$orderId;		
$orderAmount=$orderAmount;
$orderTime=date('YmdHis');
$productName=$productName;
$productNum=$productNum;
$productId="";
$productDesc="";
	
//扩展字段1
///在支付结束后原样返回给商户
$ext1=$ext1;
$ext2=$ext2;
	
//支付方式.固定选择值
///只能选择00、10、11、12、13、14
///00：组合支付（网关支付页面显示快钱支持的各种支付方式，推荐使用）10：银行卡支付（网关支付页面只显示银行卡支付）.11：电话银行支付（网关支付页面只显示电话支付）.12：快钱账户支付（网关支付页面只显示快钱账户支付）.13：线下支付（网关支付页面只显示线下支付方式）
$payType="00";

//同一订单禁止重复提交标志
///固定选择值： 1、0
///1代表同一订单号只允许提交1次；0表示同一订单号在没有支付成功的前提下可重复提交多次。默认为0建议实物购物车结算类商户采用0；虚拟产品类商户采用1
$redoFlag="0";

//快钱的合作伙伴的账户号
///如未和快钱签订代理合作协议，不需要填写本参数
$pid=""; ///合作伙伴在快钱的用户编号
	$signMsgVal=appendParam($signMsgVal,"inputCharset",$inputCharset);
	$signMsgVal=appendParam($signMsgVal,"bgUrl",$bgUrl);
	$signMsgVal=appendParam($signMsgVal,"version",$version);
	$signMsgVal=appendParam($signMsgVal,"language",$language);
	$signMsgVal=appendParam($signMsgVal,"signType",$signType);
	$signMsgVal=appendParam($signMsgVal,"merchantAcctId",$merchantAcctId);
	$signMsgVal=appendParam($signMsgVal,"payerName",$payerName);
	$signMsgVal=appendParam($signMsgVal,"payerContactType",$payerContactType);
	$signMsgVal=appendParam($signMsgVal,"payerContact",$payerContact);
	$signMsgVal=appendParam($signMsgVal,"orderId",$orderId);
	$signMsgVal=appendParam($signMsgVal,"orderAmount",$orderAmount);
	$signMsgVal=appendParam($signMsgVal,"orderTime",$orderTime);
	$signMsgVal=appendParam($signMsgVal,"productName",$productName);
	$signMsgVal=appendParam($signMsgVal,"productNum",$productNum);
	$signMsgVal=appendParam($signMsgVal,"productId",$productId);
	$signMsgVal=appendParam($signMsgVal,"productDesc",$productDesc);
	$signMsgVal=appendParam($signMsgVal,"ext1",$ext1);
	$signMsgVal=appendParam($signMsgVal,"ext2",$ext2);
	$signMsgVal=appendParam($signMsgVal,"payType",$payType);	
	$signMsgVal=appendParam($signMsgVal,"redoFlag",$redoFlag);
	$signMsgVal=appendParam($signMsgVal,"pid",$pid);
	$signMsgVal=appendParam($signMsgVal,"key",$key);
	$signMsg= strtoupper(md5($signMsgVal));
	
	//功能函数。将变量值不为空的参数组成字符串
	Function appendParam($returnStr,$paramId,$paramValue){
		if($returnStr!=""){			
				if($paramValue!=""){					
					$returnStr.="&".$paramId."=".$paramValue;
				}			
		}else{		
			If($paramValue!=""){
				$returnStr=$paramId."=".$paramValue;
			}
		}		
		return $returnStr;
	}
	//功能函数。将变量值不为空的参数组成字符串。结束
	
?>
<form name="kqPay" method="post" action="https://www.99bill.com/gateway/recvMerchantInfoAction.htm">
    <input type="hidden" name="inputCharset" value="<?php echo $inputCharset; ?>"/>
    <input type="hidden" name="bgUrl" value="<?php echo $bgUrl; ?>"/>
    <input type="hidden" name="version" value="<?php echo $version; ?>"/>
    <input type="hidden" name="language" value="<?php echo $language; ?>"/>
    <input type="hidden" name="signType" value="<?php echo $signType; ?>"/>
    <input type="hidden" name="signMsg" value="<?php echo $signMsg; ?>"/>
    <input type="hidden" name="merchantAcctId" value="<?php echo $merchantAcctId; ?>"/>
    <input type="hidden" name="payerName" value="<?php echo $payerName; ?>"/>
    <input type="hidden" name="payerContactType" value="<?php echo $payerContactType; ?>"/>
    <input type="hidden" name="payerContact" value="<?php echo $payerContact; ?>"/>
    <input type="hidden" name="orderId" value="<?php echo $orderId; ?>"/>
    <input type="hidden" name="orderAmount" value="<?php echo $orderAmount; ?>"/>
    <input type="hidden" name="orderTime" value="<?php echo $orderTime; ?>"/>
    <input type="hidden" name="productName" value="<?php echo $productName; ?>"/>
    <input type="hidden" name="productNum" value="<?php echo $productNum; ?>"/>
    <input type="hidden" name="productId" value="<?php echo $productId; ?>"/>
    <input type="hidden" name="productDesc" value="<?php echo $productDesc; ?>"/>
    <input type="hidden" name="ext1" value="<?php echo $ext1; ?>"/>
    <input type="hidden" name="ext2" value="<?php echo $ext2; ?>"/>
    <input type="hidden" name="payType" value="<?php echo $payType; ?>"/>
    <input type="hidden" name="redoFlag" value="<?php echo $redoFlag; ?>"/>
    <input type="hidden" name="pid" value="<?php echo $pid; ?>"/>
</form>		
<script>
document.forms.kqPay.submit();
</script>