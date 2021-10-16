export const onRecordStopped = () => {
  console.log('onRecordStopped')
}

export const onDataAvailable = () => {
  
}

export const onScreenShareEnded = () => {
  console.log('onScreenShareEnded')
}

export const openShare = async (endCallBack = () => null) => {
  const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  let localScreenShareStream = await navigator.mediaDevices.getDisplayMedia();

  // add audio track to screen share stream
  localScreenShareStream.addTrack(tempStream.getAudioTracks()[0]);

  // do something when user stop screen share manually
  const screenShareTrack = localScreenShareStream.getVideoTracks()[0];
  if (screenShareTrack) {
    screenShareTrack.onended = endCallBack;
    screenShareTrack.onmute = onScreenShareEnded;
  }

  // init recorder
  let recorder = new MediaRecorder(localScreenShareStream);
  recorder.onstop = endCallBack;
  recorder.ondataavailable = onDataAvailable;
  return localScreenShareStream

  // this.screenShareVideoElement.srcObject = this.localScreenShareStream;
  // this.screenShareVideoElement.muted = true; // mute local audio to prevent aftersound

  // this.disabled.open = true;
  // this.disabled.start = false;
}