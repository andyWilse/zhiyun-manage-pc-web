/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (typeof time === 'string') {
			if (/^[0-9]+$/.test(time)) {
				// support "1548221490638"
				time = parseInt(time)
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/')
			}
		}

		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		return value.toString().padStart(2, '0')
	})
	return time_str
};

export function timeFix() {
	const time = new Date()
	const hour = time.getHours()
	return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
	const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
	const index = Math.floor(Math.random() * arr.length)
	return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
	const event = document.createEvent('HTMLEvents')
	event.initEvent('resize', true, true)
	event.eventType = 'message'
	window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
	let timer = 0

	let beforeScrollTop = window.pageYOffset
	callback = callback || function() {}
	window.addEventListener(
		'scroll',
		event => {
			clearTimeout(timer)
			timer = setTimeout(() => {
				let direction = 'up'
				const afterScrollTop = window.pageYOffset
				const delta = afterScrollTop - beforeScrollTop
				if (delta === 0) {
					return false
				}
				direction = delta > 0 ? 'down' : 'up'
				callback(direction)
				beforeScrollTop = afterScrollTop
			}, 50)
		},
		false
	)
}

export function isIE() {
	const bw = window.navigator.userAgent
	const compare = (s) => bw.indexOf(s) >= 0
	const ie11 = (() => 'ActiveXObject' in window)()
	return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
	if (id === '') {
		return
	}
	setTimeout(() => {
		document.body.removeChild(document.getElementById(id))
	}, timeout)
}

// 节流
// 思路： 第一次先设定一个变量true，
// 第二次执行这个函数时，会判断变量是否true，
// 是则返回。当第一次的定时器执行完函数最后会设定变量为flase。
// 那么下次判断变量时则为flase，函数会依次运行。
export function throttle(fn, delay = 100) {
	// 首先设定一个变量，在没有执行我们的定时器时为null
	var timer = null
	return function() {
		// 当我们发现这个定时器存在时，则表示定时器已经在运行中，需要返回
		if (timer) return
		timer = setTimeout(() => {
			fn.apply(this, arguments)
			timer = null
		}, delay)
	}
}

// 防抖
// 首次运行时把定时器赋值给一个变量， 第二次执行时，
// 如果间隔没超过定时器设定的时间则会清除掉定时器，
// 重新设定定时器， 依次反复， 当我们停止下来时，
// 没有执行清除定时器， 超过一定时间后触发回调函数。
export function debounce(fun, delay) {
	return function(args) {
		// 获取函数的作用域和变量
		const that = this
		const _args = args
		// 每次事件被触发，都会清除当前的timeer，然后重写设置超时调用
		clearTimeout(fun.id)
		fun.id = setTimeout(function() {
			fun.call(that, _args)
		}, delay)
	}
}

/**
 * 判断是否为空对象
 * @param {*} object 源对象
 */
export function isEmptyObject(object) {
	return Object.keys(object).length === 0
}

/**
 * 判断是否为对象
 * @param {*} object
 */
export function isObject(object) {
	return Object.prototype.toString.call(object) === '[object Object]'
}

/**
 * 判断是否为对象
 * @param {*} array
 */
export function isArray(array) {
	return Object.prototype.toString.call(array) === '[object Array]'
}

/**
 * 判断是否为空
 * @param {*} object 源对象
 */
export function isEmpty(value) {
	if (isArray(value)) {
		return value.length === 0
	}
	if (isObject(value)) {
		return isEmptyObject(value)
	}
	return !value
}

/**
 * 判断是否在数组中
 * @param {*} search
 * @param {*} array
 */
export function inArray(search, array) {
	return array.includes(search)
}

/**
 * 获取指定天数的日期
 * @param day
 * @returns {string}
 */
export function getDateByDay(day) {
	var today = new Date()
	var targetdaySeconds = today.getTime() + 1000 * 60 * 60 * 24 * day
	today.setTime(targetdaySeconds) // 注意，这行是关键代码
	return today.getFullYear() + '-' + zeroFillLeft(today.getMonth() + 1) + '-' + zeroFillLeft(today.getDate())
}

/**
 * 左侧补0
 * @param value
 * @returns {*}
 */
export function zeroFillLeft(value) {
	return (value.toString().length === 1) ? ('0' + value) : value
}

/**
 * 批量给指定对象赋值
 * @param obj obj 指定的对象,一般为vue实例
 * @param obj assignment 赋值的元素 { a: '123' }
 */
export function assignment(obj, assignment) {
	Object.keys(assignment).forEach(key => {
		obj[key] = assignment[key]
	})
}

/**
 * 对象转URL
 * @param {object} obj
 */
export const urlEncode = (obj = {}) => {
	const result = []
	for (const key in obj) {
		const item = obj[key]
		if (!item) {
			continue
		}
		if (isArray(item)) {
			item.forEach(val => {
				result.push(key + '=' + val)
			})
		} else {
			result.push(key + '=' + item)
		}
	}
	return result.join('&')
}

/**
 * 生成url (带参数)
 * @param {string} path 链接
 * @param {object} params query参数
 */
export function buildUrL(path, params) {
	const queryStr = urlEncode(params)
	if (!isEmpty(queryStr)) {
		return path + '?' + queryStr
	}
	return path
}

/**
 * 数据脱敏
 */
export function desensitization(str, beginLen, endLen = -1) {
	let len = str.length;
	if (beginLen == 0) {
		endLen = endLen * len + 1;
	}
	let firstStr = str.substr(0, beginLen);
	let lastStr = str.substr(endLen);
	let middleStr = str.substring(beginLen, len - Math.abs(endLen)).replace(/[\s\S]/ig, '*');
	return `${firstStr}${middleStr}${lastStr}`;
};

/**
 * 高德路线规划
 */
export function openLocation(myPosition, toLng, toLat, endpoint = '') {
	let url = `https://uri.amap.com/navigation?from=${myPosition}&to=${toLng},${toLat},${endpoint}`;
	console.log('导航地址', url);
	location.href = url;
}

/**
 * 获取教堂图片
 * @param {Object} name
 * @param {Object} type
 */
export function getReligionLog(name , type = 1) {
	switch (name) {
		case "道教":
			return type == 1 ? "/region/D.png" : "/region/D_sign.png";
		case "100100000001":
			return type == 1 ? "/region/D.png" : "/region/D_sign.png";
		case "佛教":
			return type == 1 ? "/region/F.png" : "/region/F_sign.png";
		case "100100000002":
			return type == 1 ? "/region/F.png" : "/region/F_sign.png";
		case "基督教":
			return type == 1 ? "/region/J.png" : "/region/J_sign.png";
		case "100100000003":
			return type == 1 ? "/region/J.png" : "/region/J_sign.png";
		case "天主教":
			return type == 1 ? "/region/T.png" : "/region/T_sign.png";
		case "100100000004":
			return type == 1 ? "/region/T.png" : "/region/T_sign.png";
		case "伊斯兰教":
			return type == 1 ? "/region/Y.png" : "/region/Y_sign.png";
		case "100100000005":
			return type == 1 ? "/region/Y.png" : "/region/Y_sign.png";
		default:
			return type == 1 ? "/region/D.png" : "/region/D_sign.png";
	}
}

/**
 * 获取教堂图片
 * @param {Object} name
 * @param {Object} type
 */
export function getReligionImg(name) {
	switch (name) {
		case "道教":
			return "/region/dj.jpg";
		case "100100000001":
			return "/region/dj.jpg";
		case "佛教":
			return "/region/fj.jpg";
		case "100100000002":
			return "/region/fj.jpg";
		case "基督教":
			return "/region/jdj.jpg";
		case "100100000003":
			return "/region/jdj.jpg";
		case "天主教":
			return "/region/tzj.jpg";
		case "100100000004":
			return "/region/tzj.jpg";
		default:
			return "";
	}
}
