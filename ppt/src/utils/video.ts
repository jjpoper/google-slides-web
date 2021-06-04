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
  domVideoElement.width = 202
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
    domVideoElement.src = URL.createObjectURL(mediaRecorder.getBlob());
    mediaRecorder.camera.stop();
    mediaRecorder.destroy();
    mediaRecorder = null;
  });
}
