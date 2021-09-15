/* eslint-disable no-console */
/* eslint-disable no-undef */
import { getTeacherClientStoreToken, saveTeacherClientStoreToken } from "@/model/store.teacher"
import { showLoading } from "./loading"

/* eslint-disable quote-props */
class LoadPicker {
  private clientId = '909953111628-acoskn3h8gvhscc90bs70a1hkb3ktmn4.apps.googleusercontent.com' // dev
  // private clientId = '909953111628-pi3hq11ioecpr49ordr9am0c7va533dj.apps.googleusercontent.com' // test
  private appId = '909953111628'
  private scope = [
    'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
  ]

  private developerKey = 'AIzaSyAmw2xInu4ZyamfvDaGxiznpVMag_rvpjI'
  private oauthToken = ''
  private pickerApiLoaded = false
  private classCallback: any = null

  init(callback: any) {
    this.loadPicker()
    this.classCallback = callback
  }

  private async checkLogin() {
    if(!this.oauthToken || this.oauthToken === '') return Promise.reject()
    return new Promise((res, rej) => {
      gapi.client.init({
          'apiKey': this.developerKey,
          'clientId': this.clientId,
          'scope': this.scope.join(' '),
      }).then(() => {
          const GoogleAuth = gapi.auth2.getAuthInstance();

          // Listen for sign-in state changes.
          const status = GoogleAuth.isSignedIn.get()
          if(status) {
            res(true)
          } else {
              rej()
          }
      });
    })
  }

  private loadPicker() {
    console.log('=====')
    this.checkLogin()
    .then(() => {
      window.gapi.load('picker', {'callback': this.onPickerApiLoad});
    }).catch(() => {
      window.gapi.load('client:auth2', {'callback': this.onAuthApiLoad});
      window.gapi.load('picker', {'callback': this.onPickerApiLoad});
    })
  }

  private onPickerApiLoad = () => {
    this.pickerApiLoaded = true
    this.createPicker();
  }

  private onAuthApiLoad = () => {
    window.gapi.auth.authorize(
      {
        'client_id': this.clientId,
        'scope': this.scope,
        'immediate': false
      }, this.handleAuthResult
      )
  }

  private handleAuthResult = (authResult: any) => {
    if(authResult && !authResult.error) {
      this.oauthToken = authResult.access_token;
      saveTeacherClientStoreToken(this.oauthToken)
      this.createPicker();
    }
  }

  private createPicker = () => {
    if(this.pickerApiLoaded && this.oauthToken) {
      const view = new window.google.picker.View(google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS);
      view.setMimeTypes("image/png,image/jpeg,image/jpg");
      const picker = new google.picker.PickerBuilder()
          .setTitle("My Drive 1")
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
          .setOrigin(undefined)
          .setAppId(this.appId)
          .setOAuthToken(this.oauthToken)
          .addView(view)
          .addView(new google.picker.DocsUploadView())
          .setDeveloperKey(this.developerKey)
          .setCallback(this.pickerCallback)
          .build();
       picker.setVisible(true);
    }
  }

  private pickerCallback = (data: any) => {
    console.log(data)
    if(data.action === google.picker.Action.PICKED) {
      const {id} = data.docs[0];
      showLoading()
      this.getDownloadUrl(id)
    }
  }

  private getDownloadUrl = (id: string) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET',
      `https://www.googleapis.com/drive/v2/files/${id}?supportsTeamDrives=true&access_token=${this.oauthToken}`);
    xhr.setRequestHeader('Authorization', `Bearer ${this.oauthToken}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status === 200) {
        const data = JSON.parse(xhr.response)
        const {downloadUrl} = data
        this.downloadFile(downloadUrl)
      }
    }
    xhr.send();
  }

  private getBlob(xhr: any) {
    const imageType = xhr.getResponseHeader("Content-Type");
    const blob = new Blob([xhr.response], { type: imageType });
    const imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);
    console.log(imageUrl)
    return blob
  }

  private downloadFile(downloadUrl: string) {
    if(downloadUrl) {
      // var accessToken = gapi.auth.getToken().access_token;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', downloadUrl);
      xhr.setRequestHeader('Authorization', `Bearer ${this.oauthToken}`);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        const blob = this.getBlob(xhr)
        const file = new File([blob], 'test.png', {
            type: 'image/png',
        });
        this.upLoadFile(file)
      };
      xhr.send();
    } else {
      console.log(null);
    }
  }

  private upLoadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);

    // callback('Uploading ' + fileType + ' recording to server.');

    // var upload_directory = upload_url;

    this.makeXMLHttpRequest(`https://dev.api.newzealand.actself.me/file/upload`, formData);
  }

  // 创建http请求
  private makeXMLHttpRequest = (url: string, data: any) => {
    const request = new XMLHttpRequest();
    const callback = this.classCallback
    request.onreadystatechange = () => {
      if(request.readyState === 4 && request.status === 200) {
        callback('upload-ended', request.response);
      }
      if(request.status === 413) {
        callback('onerror');
      }
    };

    request.upload.onloadstart = () => {
      callback('Upload started...');
    };

    request.upload.onprogress = (event) => {
      // callback('Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
    };

    request.upload.onload = () => {
      callback('progress-about-to-end');
    };

    request.upload.onload = () => {
      callback('progress-ended');
    };

    request.upload.onerror = (error) => {
      callback('onerror');
      // console.error('XMLHttpRequest failed', error);
    };

    request.upload.onabort = (error) => {
      callback('Upload aborted.');
      // console.error('XMLHttpRequest aborted', error);
    };

    request.open('POST', url);
    request.send(data);
  }
}

export default new LoadPicker()
