import MediaStreamRecorder from 'msr'

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
  navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
    domVideoElement.srcObject = stream;
    domVideoElement.play()
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.start(1000 * 60 * 60)
    mediaRecorder.mimeType = 'video/webm';
    mediaRecorder.ondataavailable = (blob: Blob) => {
        // POST/PUT "Blob" using FormData/XHR2
        const blobURL = URL.createObjectURL(blob);
        // callback(blobURL)
        // document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
    };
  }).catch(onMediaError);
}

export const pauseRecordVideo = () => {
  mediaRecorder.pause();
  domVideoElement.pause()
}

export const resumeRecordVideo = () => {
  mediaRecorder.resume();
  domVideoElement.play()
}

export const saveRecordVideo = () => {
  debugger
  mediaRecorder.stop();
  domVideoElement.pause();
}
