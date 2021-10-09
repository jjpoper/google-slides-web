import axios from 'axios';
import PPT from '../utils/pptConfig'
import { connect } from 'echarts/core';

export const getItem = ({
  slideid,
  pageid,
  itemid
}: any) => {
  return axios.post(`${PPT.requestUrl}slide/items/view`, {
    slide_id: slideid,
    page_id: pageid,
    item_id: itemid
  })
}

// 获取所有的ppt内容
export const getAllPPTS = async (slideid: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_all`, {
    slide_id: slideid,
  })
  let { pages = [] } = data.data.data
  // // console.log(data.data.data)
  try {
    // list = data.data.data.pages.filter((item: any) => {
    //   return item.items.type === 'choice'
    // })
  } catch (e) {
    // // console.log(e)
  }
  return {
    pages
  }
}

//请求后台进行ppt刷新
export const requestRefreshPPT = async (slideid: string, _token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/download`, {
    slide_id: slideid,
    token: _token,
  })
  let res = data.data;
  return res;

}

//查询当前课程状态

export const queryClassStatus = async (classId: string, _token: string) => {
  // console.log(classId)
  const data = await axios.post(`${PPT.requestUrl}slide/get_class`, {
    class_id: classId,
    token: _token,
  })
  let res = data.data.data;
  return res;
}

//slide/get_task_result


//查询后台ppt更新状态
export const queryRefreshResult = async (taskId: string, _token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_task_result`, {
    task_id: taskId,
    token: _token,
  })
  let res = data.data;
  return res;

}

//结束课程
export const endClassRoomReq = async (_token: string, name: string, class_id: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/close_class`, {
    class_name: name,
    class_id: class_id,
    token: _token,
  })
  let res = data.data;
  return res;
}

export const startClassRoomReq = async (author: string, slide_id: string, file_name: string, status: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/start_lesson`, {
    author: author,
    slide_id: slide_id,
    file_name: file_name,
    status: status,
  })
  let res = data.data.data;
  return res;
}

//评价课堂

export const reopenClass = async (token: string, class_id: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/reopen_class`, {
    token: token,
    class_id: class_id,
  })
  let res = data.data;
  return res;
}

export const feedbackClass = async (token: string, class_id: string, feed: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/student_feel`, {
    token: token,
    class_id: class_id,
    feel: feed,
  })
  let res = data.data.data;
  return res;
}

export const getOnlineUsers = async (token: string, class_id: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/online_users`, {
    token: token,
    class_id: class_id,
  })
  let res = data.data;
  return res;
}

const filterHref = () => {
  const url = location.href
  return url.split("&token")[0]
}

// 获取授权登录
export const getTeacherLoginUrl = async (): Promise<string> => {
  const data = await axios.post(`${PPT.requestUrl}account/get_auth_url_for_teacher`, {
    return_url: filterHref(),
  })
  let authUrl = ''
  // let list = data.data.data.pages
  // // // console.log(data.data.data)
  try {
    authUrl = data.data.data.auth_url
  } catch (e) {
    // // console.log(e)
  }
  return authUrl
}

interface Profile {
  profile: {
    email: string
    user_name: string
  }
  logout: boolean
}

// 获取个人信息 account/profile
export const getUserProfile = async (token: string): Promise<Profile> => {
  const data = await axios.post(`${PPT.requestUrl}account/profile`, {
    token,
  })
  let result = {
    profile: {
      email: '',
      user_name: ''
    },
    logout: false
  }
  // let list = data.data.data.pages
  // // // console.log(data.data.data)
  try {
    result = data.data.data
  } catch (e) {
    // // console.log(e)
  }
  return result
}

// 获取学生授权登录
export const getStudentLoginUrl = async (): Promise<string> => {
  const data = await axios.post(`${PPT.requestUrl}account/get_auth_url_for_student`, {
    return_url: filterHref(),
  })
  let authUrl = ''
  // let list = data.data.data.pages
  // // // console.log(data.data.data)
  try {
    authUrl = data.data.data.auth_url
  } catch (e) {
    // // console.log(e)
  }
  return authUrl
}

// 获取学生的答案
export const getTeacherClassAnswers = async (classId: string, token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_student_response`, {
    class_id: classId,
    role: "teacher",
    token
  })
  let result = []
  // // let list = data.data.data.pages
  // // // // console.log(data.data.data)
  try {
    result = data.data.data
  } catch (e) {
    // // console.log(e)
  }
  return result
}

// 获取学生的答案
export const getStudentClassAnswers = async (classId: string, token: string) => {

  // // console.log('=======', 'initStudentData')
  const data = await axios.post(`${PPT.requestUrl}slide/get_student_response`, {
    class_id: classId,
    role: "student",
    token
  })
  let result = []
  // // let list = data.data.data.pages
  // // // // console.log(data.data.data)
  try {
    result = data.data.data
  } catch (e) {
    // // console.log(e)
  }
  return result
}

// 获取学生的答案
export const getTeacherAllComments = async (classId: string, token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_comments`, {
    class_id: classId,
    role: "teacher",
    token
  })
  let result = []
  // // let list = data.data.data.pages
  // // // // console.log(data.data.data)
  try {
    result = data.data.data.filter((item: any) => item.page_id)
  } catch(e) {
    // // console.log(e)
  }
  return result.reverse()
}
// 获取学生的评论
export const getStudentAllComments = async (classId: string, token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_comments`, {
    class_id: classId,
    role: "student",
    token
  })
  let result = []
  // // let list = data.data.data.pages
  // // // // console.log(data.data.data)
  try {
    result = data.data.data.filter((item: any) => item.page_id)
  } catch(e) {
    // // console.log(e)
  }
  return result.reverse()
}

export const getAVComment = async (classId: string, token: string) => {

  const data = await axios.post(`${PPT.requestUrl}slide/get_presentation_comments`, {
    class_id: classId,
    token: token,
  })
  let result = []
  // // let list = data.data.data.pages
  // console.log(data.data)
  try {
    result = data.data
  } catch (e) {
    // // console.log(e)
  }

  return result;

}

const makeXMLHttpRequest = (url: string, data: any, callback: any) => {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      callback('upload-ended', request.response);
    }
    if (request.status === 413) {
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
    // // console.error('XMLHttpRequest failed', error);
  };

  request.upload.onabort = (error) => {
    callback('Upload aborted.');
    // // console.error('XMLHttpRequest aborted', error);
  };

  request.open('POST', url);
  request.send(data);
}

export const saveUserConfig = async (token: string, key: string, value: string) => {

  const data = await axios.post(`${PPT.requestUrl}account/save_config`, {
    token: token,
    key: key,
    value: value
  })

  return data;

}

// 上传文件
export const upLoadFile = async (mp4: Blob) => {
  // // console.log(file)
  // const data = await axios.post(`${PPT.requestUrl}upload`, {
  //   file
  // })
  return new Promise((res, rej) => {
    const fileType = 'video'
    const fileName = (Math.random() * 1000).toString().replace('.', '');

    const formData = new FormData();
    formData.append('file', mp4);

    // callback('Uploading ' + fileType + ' recording to server.');

    // var upload_directory = upload_url;

    makeXMLHttpRequest(`${PPT.requestUrl}file/upload`, formData, (progress: string, result: any) => {
      // console.log(progress, '===progress===')
      if (progress === 'upload-ended') {
        res(JSON.parse(result))
      }
      if (progress === 'onerror') {
        rej()
      }

      // callback('ended', upload_directory + fileName);

      // to make sure we can delete as soon as visitor leaves
      // listOfFilesUploaded.push(upload_directory + fileName);
    });
  })

  // 获取audio和video
}

// 下载服务器图片
export const getOnlineImage = async (url: string) => {
  const data = await axios.post(`${PPT.requestUrl}file/download`, {
    url,
  })
  let result = ''
  try {
    result = data.data.data
  } catch (e) {
    // // console.log(e)
  }
  return result;
}


export const addElementItem = async (slideId: string, pageId: string, type: string, content: string) => {


  var param = {
    type: type,
    content: content
  }
  const data = await axios.post(`${PPT.requestUrl}slide/elements/add`, {
    slide_id: slideId,
    page_id: pageId,
    data: param
  })
  let result = ''
  try {
    result = data.data.data.id
  } catch (e) {
    // // console.log(e)
  }
  return parseInt(result);

}

export const deleteElementItem = async (id: number) => {

  const data = await axios.post(`${PPT.requestUrl}slide/elements/delete`, {
    id: id
  })
  let result = ''
  try {
    result = data.data.code
  } catch (e) {
    // // console.log(e)
  }
  return result;

}

export const updateElementItem = async (id: number, content: string, type: string) => {

  var param = {
    type: type,
    content: content
  }
  const data = await axios.post(`${PPT.requestUrl}slide/elements/update`, {
    id: id,
    data: param
  })
  let result = ''
  try {
    result = data.data.code
  } catch (e) {
    // // console.log(e)
  }
  return result;

}

// 添加分组
export const addGroup = async (classId: string, name: string): Promise<string> => {
  const data = await axios.post(`${PPT.requestUrl}group/add`, {
    class_id: classId,
    name
  })
  let id = ''
  try {
    id = data.data.data.id
  } catch(e) {
    // // console.log(e)
  }
  console.log(id, '=====')
  return id;
}

export const deleteGroup = async (id: string): Promise<boolean> => {
  const data = await axios.post(`${PPT.requestUrl}group/delete`, {
    id
  })
  let code = ''
  try {
    code = data.data.code
  } catch(e) {
    // // console.log(e)
  }
  return code === 'ok';
}

export const updateGroupMember = async (id: string, uids: string[]): Promise<boolean> => {
  const data = await axios.post(`${PPT.requestUrl}group/assign_members`, {
    group_id: id,
    members: uids
  })
  let code = ''
  try {
    code = data.data.code
  } catch(e) {
    // // console.log(e)
  }
  return code === 'ok';
}

export const getAllGroupMember = async (classId: string): Promise<any[]> => {
  const data = await axios.post(`${PPT.requestUrl}group/get_all_group_and_members`, {
    class_id: classId
  })
  let result = []
  try {
    result = data.data.data
  } catch(e) {
    // // console.log(e)
  }
  return result
}
