/* eslint-disable keyword-spacing */
/* eslint-disable vars-on-top */
/* eslint-disable no-plusplus */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/prefer-default-export */
/* eslint-disable quotes */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-var */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-undef */
const CLIENT_ID = '835066819585-e7kiq3qh054m58gcorlr3krnd06p004d.apps.googleusercontent.com';
const API_KEY = 'AIzaSyD6etM8BrhS3Y13N5W0cCvFEYi86aKgKhI';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://slides.googleapis.com/$discovery/rest?version=v1"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/presentations.readonly";

/**
 * Prints the number of slides and elements in a sample presentation:
 * https://docs.google.com/presentation/d/1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc/edit
 */
export const getppts = async (pageObjectId: string, slideId: string) => {
  const response = await gapi.client.slides.presentations.pages.getThumbnail({
    presentationId: slideId,
    pageObjectId,
    thumbnailProperties: {
      thumbnailSize: 'SMALL',
    },
  })
  return response.result.contentUrl
  // .then(function (response: any) {
  //   // console.log(response.result.contentUrl);
  //   // resPic(response.result.contentUrl);
  // }, function () { });
}

function listSlides(res: any, slideId: string) {
  window.gapi.client.slides.presentations.get({
    presentationId: slideId,
  }).then(function (response: any) {
    var presentation = response.result;
    // console.log(presentation);
    var slides = presentation.slides;
    res(slides)
    // getppts(slides[0].objectId, res);
    // var pall = [];
    // for (let i = 0; i < slides; i++) {
    //   const item = slides[i];
    //   var fn = new Promise((resPic) => {
    //     console.log(item.objectId);
    //     resPic(getppts(item.objectId));
    //   });
    //   pall.push(fn);
    // }
    // Promise.all(pall).then((arr) => {
    //   res(arr);
    // });
  }, function () { });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn: boolean, res: any, slideId: string) {
  // console.log('3', isSignedIn)
  if (isSignedIn) {
    listSlides(res, slideId);
  }
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient(res: any, slideId: string) {
  // console.log('===')
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  }).then(function () {
    // Listen for sign-in state changes.
    // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // console.log('2')
    // Handle the initial sign-in state.
    gapi.auth2.getAuthInstance().signIn().then(() => {
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get(), res, slideId);
    });
  }, function () { });
}
/**
 *  On load, called to load the auth2 library and API client library.
 */
export const gotoGoogleAuth = (slideId: string) => {
  return new Promise((res) => {
    gapi.load('client:auth2', () => {
      initClient(res, slideId);
    });
  });
};
