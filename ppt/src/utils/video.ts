import { upLoadFile } from '@/model';
import RecordRTC from 'recordrtc'

function onMediaError() {
  // console.error('media error', e);
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
      type: 'video'
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

export const saveRecordVideo = () => {
  domVideoElement.pause();
  mediaRecorder.stopRecording(() => {
    domVideoElement.src = domVideoElement.srcObject = null;
    const blobData = mediaRecorder.getBlob()
    domVideoElement.src = URL.createObjectURL(blobData);
    console.log(URL.createObjectURL(blobData))
    let files = new window.File([blobData], 'video')

    upLoadFile(files)
    upLoadFile(blobData)
    mediaRecorder.camera.stop();
    mediaRecorder.destroy();
    mediaRecorder = null;
  });
}
