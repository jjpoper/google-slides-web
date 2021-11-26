/* eslint-disable import/order */
/* eslint-disable no-empty */
import { upLoadFile } from '@/model';
import RecordRTC from 'recordrtc'
import { hideLoading, showLoading, showToast } from './loading';
import { upFireBaseFile } from './uploadFile';

function onMediaError() {
  // // console.error('media error', e);
}
const mediaConstraints = {
  audio: true,
  video: true
};
let mediaRecorder: any = null
let domVideoElement: any = null
let upFileInstance: any = null

const closePictureInPicture = () => {
  const dom: any = document
  dom.exitPictureInPicture()
}

export const startRecordVideo = (domVideo: any, callback: any = () => null) => {
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
    mediaRecorder.startRecording();

    mediaRecorder.camera = camera;
    callback && callback()
  }).catch(onMediaError);
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
  domVideoElement.pause();
  mediaRecorder.stopRecording(() => {
    domVideoElement.src = domVideoElement.srcObject = null;
    mediaRecorder.camera.stop();
    mediaRecorder.destroy();
    mediaRecorder = null;
    try {
      closePictureInPicture()
    } catch(e){}
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
      try {
        closePictureInPicture()
      } catch(e){}
    });
  })
}
