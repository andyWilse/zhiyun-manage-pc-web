import request from '@/utils/index'

/**
 * 地图场所展示
 */
export function map(params) {
	return request({
		url: 'venues/map/getVenues',
		method: 'get',
		params
	});
}

/**
 * 地图场所展示详情
 * @param {Object} venuesId
 */
export function venuesDetail(venuesId) {
	return request({
		url: 'venues/map/venuesDetail',
		method: 'get',
		params: {venuesId}
	});
}

/**
 * 人员画像
 * @param {Object} ManagerId
 */
export function getManagerById(ManagerId){
	return request({
		url: 'staff/getManagerById',
		method: 'get',
		params: {ManagerId}
	});
}