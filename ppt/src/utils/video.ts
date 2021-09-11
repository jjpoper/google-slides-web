import { upLoadFile } from '@/model';
import RecordRTC from 'recordrtc'
import { hideLoading, showLoading, showToast } from './loading';

function onMediaError() {
  // // console.error('media error', e);
}
const mediaConstraints = {
  audio: true,
  video: true
};
let mediaRecorder: any = null
let domVideoElement: any = null

export const startRecordVideo = (domVideo: any) => {
  domVideoElement = domVideo
  domVideoElement.muted = true
  domVideoElement.volume = 0
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
  });
}

export const saveRecordVideo = async (): Promise<any> => {
  return new Promise((res, rej) => {
    domVideoElement.pause();
    mediaRecorder.stopRecording(() => {
      domVideoElement.src = domVideoElement.srcObject = null;
      const blobData = mediaRecorder.getBlob()
      domVideoElement.src = URL.createObjectURL(blobData);
      // // console.log(URL.createObjectURL(blobData))
      let files = new window.File([blobData], 'webm')

      // showLoading('uploading')
      upLoadFile(files).then((data) => {
        // hideLoading()
        res(data)
      }).catch(() => {
        // hideLoading()
        showToast('upload failed, please try again', 'error')
      })

      mediaRecorder.camera.stop();
      mediaRecorder.destroy();
      mediaRecorder = null;
    });
  })
}
