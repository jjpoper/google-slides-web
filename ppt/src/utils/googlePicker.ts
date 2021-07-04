/* eslint-disable no-console */
/* eslint-disable no-undef */
import { getTeacherStoreToken } from "@/model/store.teacher"

/* eslint-disable quote-props */
class LoadPicker {
  private clientId = '909953111628-acoskn3h8gvhscc90bs70a1hkb3ktmn4.apps.googleusercontent.com'
  private appId = '909953111628'
  private scope = [
    'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
  ]

  private developerKey = 'AIzaSyAmw2xInu4ZyamfvDaGxiznpVMag_rvpjI'
  private oauthToken = null
  private pickerApiLoaded = false

  init() {
    this.loadPicker()
  }

  private loadPicker() {
    console.log('=====')
    window.gapi.load('client:auth2', {'callback': this.onAuthApiLoad});
    window.gapi.load('picker', {'callback': this.onPickerApiLoad});
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
  }
}

export default new LoadPicker()
