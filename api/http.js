var API_PATH = 'http://60.205.180.202:8097'
const ajax = (opt) => {
	opt = opt || {};
	opt.url = opt.url || '';
	opt.data = opt.data || null;
	opt.method = opt.method || 'GET';
	opt.header = opt.header || {
		"Content-Type": "application/json"
	};
	opt.header = Object.assign(opt.header, {
		'Authorization': uni.getStorageSync('token')
	})
	opt.success = opt.success || function() {};

	uni.request({
		url: API_PATH + opt.url,
		data: opt.data,
		method: opt.method,
		header: opt.header,
		dataType: opt.dataType,
		success: function(res) {
			opt.success(res);
		},
		fail: function() {
			uni.showToast({
				icon:'none',
				title: '请稍后重试'
			});
		}
	})
}
export default {
	ajax
}
