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
// const CLIENT_ID = '835066819585-e7kiq3qh054m58gcorlr3krnd06p004d.apps.googleusercontent.com';
const CLIENT_ID = '1040108879273-ldfoennnk158t1p400hn2eok3atfll3i.apps.googleusercontent.com'; // dev
// const API_KEY = 'AIzaSyD6etM8BrhS3Y13N5W0cCvFEYi86aKgKhI';
const API_KEY = 'AIzaSyBzfqIuraxxIDUKeE9qx8LzkhfYRstiOO0'; // dev

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
  //   // // console.log(response.result.contentUrl);
  //   // resPic(response.result.contentUrl);
  // }, function () { });
}

function listSlides(res: any, slideId: string) {
  window.gapi.client.slides.presentations.get({
    presentationId: slideId,
  }).then(function (response: any) {
    var presentation = response.result;
    // // console.log(presentation);
    var slides = presentation.slides;
    res(slides)
    // getppts(slides[0].objectId, res);
    // var pall = [];
    // for (let i = 0; i < slides; i++) {
    //   const item = slides[i];
    //   var fn = new Promise((resPic) => {
    //     // console.log(item.objectId);
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
  // // console.log('3', isSignedIn)
  if (isSignedIn) {
    listSlides(res, slideId);
  }
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient(res: any, rej: any) {
  // // console.log('===')
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    // discoveryDocs: DISCOVERY_DOCS,
    scope: 'profile',
  }).then(function(e: any) {
    // Listen for sign-in state changes.
    // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // console.log('2', e)
    // Handle the initial sign-in state.
    res(true)
  }, function(e: any) {
    // console.log('2', e)
    rej(false)
  });
}
/**
 *  On load, called to load the auth2 library and API client library.
 */
export const gotoGoogleAuth = () => {
  return gapi.auth2.getAuthInstance().signIn()
};

// 检查Google登录
export const checkGoogleAuth = (): boolean => {
  return gapi.auth2.getAuthInstance().isSignedIn.get()
}

// https://developers.google.com/identity/sign-in/web/reference#googleusergetbasicprofile
export const getGoogleUserInfo = () => {
  // const id = gapi.auth2.getAuthInstance().BasicProfile.getId()
  const name = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName()
  return name
}

const loop = (res: any, rej: any) => {
  // @ts-ignore
  if(window.googleIsReady && window.gapi) {
    gapi.load('client:auth2', () => {
      initClient(res, rej);
    });
  } else {
    setTimeout(() => {
      loop(res, rej)
    }, 500)
  }
}

export const initGoogleAuth = () => {
  return new Promise((res, rej) => {
    loop(res, rej)
  });
};
