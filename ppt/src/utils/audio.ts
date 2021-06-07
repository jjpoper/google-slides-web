import { upLoadFile } from '@/model';
import RecordRTC from 'recordrtc'
import { showToast } from './loading';

let microphone: any = null
const isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const captureMicrophone = async () => {
  return new Promise((res, rej) => {
    if(microphone) {
      res(true);
      return
  }

  if(typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
      showToast('This browser does not supports WebRTC getUserMedia API.');

      if(!!navigator.getUserMedia) {
        showToast('This browser seems supporting deprecated getUserMedia API.');
      }
      rej()
      return
  }

  navigator.mediaDevices.getUserMedia({
      audio: isEdge ? true : {
          echoCancellation: false
      }
  }).then((mic) => {
    microphone = mic
    res(true)
  }).catch((error) => {
    showToast('Unable to capture your microphone. Please check console logs.');
    rej()
  });
  })
}

let domAudioElement: any = null
let recorder: any = null

export const startRecordAudio = (domAudio: any) => {
  domAudioElement = domAudio
  domAudioElement.muted = true

  captureMicrophone()
  .then(() => {
    domAudioElement.srcObject = microphone;
    if(recorder) {
      recorder.destroy();
      recorder = null;
    }

    const options = {
      type: 'audio',
      numberOfAudioChannels: isEdge ? 1 : 2,
      checkForInactiveTracks: true,
      bufferSize: 16384
    };
    recorder = RecordRTC(microphone, options);

    recorder.startRecording();
  })
}

export const endRecordAudio = () => {
  recorder.stopRecording(() => {
    microphone.stop();
    microphone = null;
  });
}

export const saveRecordAudio = async (): Promise<any> => {
  return new Promise((res, rej) => {
    recorder.stopRecording(() => {
      const blobData = recorder.getBlob()
      // domAudioElement.src = URL.createObjectURL(recorder.getBlob())
      const files = new File([blobData], 'mp3', {
          type: 'audio/mp3'
      });

      upLoadFile(files).then((data) => {
        res(data)
      })
      microphone.stop();
      microphone = null;
    });
  })
}
