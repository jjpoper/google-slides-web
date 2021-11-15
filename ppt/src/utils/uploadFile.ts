/* eslint-disable no-console */
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_ziqvNJmMVgXNO2ah2xZPJKS79G7jAMU",
  authDomain: "classcipe-dev.firebaseapp.com",
  projectId: "classcipe-dev",
  storageBucket: "classcipe-dev.appspot.com",
  messagingSenderId: "1034791850641",
  appId: "1:1034791850641:web:2f18c4a573cb184e2d6530"
};

initializeApp(firebaseConfig);
// const app = getApp()

const storage = getStorage();

// const storage = firebase.storage();

// var storageRef = storage.ref();
// var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';
type OnProgress = any

export const upFireBaseFile = (
  file: File,
  onProgress: OnProgress = () => null,
  onSuccess: OnProgress = () => null,
) => {
  onProgress(1)
  const now = Date.now()
  console.log(now, '计时 开始上传')
  const metadata = {
    contentType: file.type
  };
  const storageRef = ref(storage, `file/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}`);
      // eslint-disable-next-line no-unused-expressions
      let value = Math.max(Math.floor(progress * 100) / 100, 0.01);
      onProgress && onProgress(Math.min(value, 99));
      // switch (snapshot.state) {
      //   case 'paused':
      //     console.log('Upload is paused');
      //     break;
      //   case 'running':
      //     console.log('Upload is running');
      //     break;
      //   default
      // }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      // switch (error.code) {
      //   case 'storage/unauthorized':
      //     // User doesn't have permission to access the object
      //     break;
      //   case 'storage/canceled':
      //     // User canceled the upload
      //     break;
      //   case 'storage/unknown':
      //     // Unknown error occurred, inspect error.serverResponse
      //     break;
      // }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        console.log(Date.now() - now, '计时 上传成功')
        onSuccess(downloadURL)
        onProgress(100)
      });
    });
  console.log(uploadTask)
  return uploadTask
}
