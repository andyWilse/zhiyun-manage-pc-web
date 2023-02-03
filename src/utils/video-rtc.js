// Time:   2021/11/17 11:16
// Author: Dily
// Remark:
import kurentoUtils from 'kurento-utils'

let webSocket = null
let webRtcPeer = null
let video = null // DOM元素
let videoUrl = ''  // 视频流获取地址
let wssUrl = ''    // 连接后台webSocket

// 初始化
function initVideo(video_dom, wsUrl, videoUrl) {
  webSocket = new webSocket(wsUrl)
  wssUrl = wsUrl
  videoUrl = videoUrl
  video = video_dom
}

// 获取数据并播放
function playVideo(isAudio, isVideo) {
  webSocket.onopen = () => getVideo(isAudio, isVideo)
  webSocket.onerror = () => initVideo(video, wssUrl, videoUrl)
  webSocket.onmessage = onMessage
}

// 关闭webSocket
function destroyVideo() {
  if (webSocket) webSocket.close()
}

// 使用RTP获取视频流
function getVideo(isAudio, isVideo) {
  // Video and audio by default
  const userMediaConstraints = {
    audio: isAudio,
    video: isVideo
  }

  const options = {
    remoteVideo: video,
    mediaConstraints: userMediaConstraints,
    onicecandidate: onIceCandidate
  }
  webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, error => {
    error ? console.error(error) : ''
    webRtcPeer.generateOffer(onOffer)
  })
}

// candidate对象
function onIceCandidate(candidate) {
  const message = {
    id: 'onIceCandidate',
    candidate: candidate
  }
  sendMessage(message)
}

// 开始请求数据
function onOffer(error, offerSdp) {
  error ? console.error('Error generating the offer :' + error) : ''
  const message = {
    id: 'start',
    sdpOffer: offerSdp,
    videoUrl: videoUrl
  }
  sendMessage(message)
}

// 发送后台数据
function sendMessage(message) {
  const jsonMessage = JSON.stringify(message)
  webSocket.send(jsonMessage)
}

// 接收数据
function onMessage(message) {
  const parsedMessage = JSON.parse(message.data)
  switch (parsedMessage.id) {
    case 'startResponse':
      startResponse(parsedMessage)
      break
    case 'error':
      console.error('Error message from server: ' + parsedMessage.message)
      break
    case 'playEnd':
      console.log('playEnd')
      break
    case 'videoInfo':
      showVideoData(parsedMessage)
      break
    case 'iceCandidate':
      webRtcPeer.addIceCandidate(parsedMessage.candidate, error => error ? console.error(error) : '')
      break
    case 'position':
      document.getElementById('videoPosition').value = parsedMessage.position
      break
    default:
      console.error('Unrecognized message: ' + parsedMessage.message)
  }
}

// 接收视频流信息
function startResponse(message) {
  webRtcPeer.processAnswer(message.sdpAnswer, error => error ? console.error(error) : '')
}

// 设置Seek
function showVideoData(parsedMessage) {
  document.getElementById('initSeek') ? document.getElementById('initSeek').value = parsedMessage.initSeekable : ''
  document.getElementById('endSeek') ? document.getElementById('endSeek').value = parsedMessage.endSeekable : ''
  document.getElementById('durations') ? document.getElementById('duration').value = parsedMessage.videoDuration : ''
}

export {
  initVideo,
  playVideo,
  destroyVideo
}