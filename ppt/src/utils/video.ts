/* eslint-disable import/order */
/* eslint-disable no-empty */
import { upLoadFile } from '@/model';
import RecordRTC from 'recordrtc'
import { hideLoading, showLoading, showToast } from './loading';
import { upFireBaseFile } from './uploadFile';

function onMediaError(e: any) {
  if(e.toString().indexOf('Permission')) {
    showToast('Unable to capture your camera. Please check', 'error');
  }
}
const mediaConstraints = {
  audio: true,
  video: true
};
let mediaRecorder: any = null
let domVideoElement: any = null
let upFileInstance: any = null
let videoRecordStatus = 0 // 0 未启动，1 启动中 2 已启动 3取消了
let retryTimes = 0

const closePictureInPicture = () => {
  const doc: any = document
  if(doc.pictureInPictureElement && doc.exitPictureInPicture) {
    try {
      doc.exitPictureInPicture()
    } catch(e) {}
  }
}

export const startRecordVideo = (domVideo: any, callback: any = () => null, fail: any = () => null) => {
  videoRecordStatus = 1
  domVideoElement = domVideo
  domVideoElement.muted = true
  domVideoElement.volume = 0
  const requestPicture = () => {
    try {
      domVideo.requestPictureInPicture();
    } catch(e) {}
    domVideoElement.removeEventListener('loadeddata', requestPicture)
  }
  domVideoElement.addEventListener('loadeddata', requestPicture)
  // domVideoElement.width = 202
  navigator.mediaDevices.getUserMedia(mediaConstraints).then((camera) => {
    domVideoElement.srcObject = camera;
    domVideoElement.play()
    mediaRecorder = RecordRTC(camera, {
      type: 'video',
      sampleRate: 22050,
      mimeType: 'video/webm',
    });
    mediaRecorder.camera = camera;
    setTimeout(() => {
      // if(videoRecordStatus === 1) {
      // } else if(videoRecordStatus === 3) {
      //   videoRecordStatus = 0
      //   retryTimes = 0
      // }
      mediaRecorder.startRecording();
      videoRecordStatus = 2
      callback && callback()
    }, 1000)
  }).catch((e) => {
    onMediaError(e)
    fail && fail()
  });
}

export const pauseRecordVideo = () => {
  mediaRecorder.pauseRecording();
  domVideoElement.pause()
}

export const resumeRecordVideo = () => {
  mediaRecorder.resumeRecording();
  domVideoElement.play()
}

export const endRecord = () => {
  if(videoRecordStatus === 1 && retryTimes <= 5) {
    retryTimes++
    setTimeout(() => {
      endRecord()
    }, 1000)
    return
  }
  videoRecordStatus = 0
  retryTimes = 0
  try {
    closePictureInPicture()
  } catch(e){}
  domVideoElement.pause();
  mediaRecorder.stopRecording(() => {
    domVideoElement.src = domVideoElement.srcObject = null;
    mediaRecorder.camera.stop();
    mediaRecorder.destroy();
    mediaRecorder = null;
    // console.log('=====endRecord close vdeo', )
    // try {
    //   const tracks = document.getElementById('record-video').srcObject.getTracks();
    //   for(let i = 0 ; i< tracks.length ; i++)
    //   {
    //       tracks[i].stop();
    //   }
    // } catch(e){}
  });
}

export const cancelUpVideo = () => {
  if(upFileInstance) {
    upFileInstance.cancel()
    upFileInstance = null
  }
}

export const saveRecordVideo = async (onProgressUpLoad: any = () => null): Promise<any> => {
  return new Promise((res, rej) => {
    try {
      closePictureInPicture()
    } catch(e){}
    domVideoElement.pause();
    mediaRecorder.stopRecording(() => {
      domVideoElement.src = domVideoElement.srcObject = null;
      const blobData = mediaRecorder.getBlob()
      domVideoElement.src = URL.createObjectURL(blobData);
      domVideoElement.play()
      // // console.log(URL.createObjectURL(blobData))
      const now = Date.now()
      let file = new window.File([blobData], `${now.toString()}.webm`, {type: "video/webm", lastModified: Date.now()})
      console.log(file)
      // showLoading('uploading')
      // upLoadFile(files).then((data) => {
      //   // hideLoading()
      //   res(data)
      // }).catch(() => {
      //   // hideLoading()
      //   showToast('upload failed, please try again', 'error')
      // })
      // return

      upFileInstance = upFireBaseFile(
        file,
        onProgressUpLoad,
        ((result: any) => {
          res(result)
          setTimeout(() => {
            onProgressUpLoad(0)
            upFileInstance = null
          }, 50);
        })
      )

      mediaRecorder.camera.stop();
      mediaRecorder.destroy();
      mediaRecorder = null;
    });
  })
}
