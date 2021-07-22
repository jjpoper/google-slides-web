export enum SocketEventsEnum {
  GO_PAGE = 'GO_PAGE', // 教师端发控制
  ANSWER_QUESTION = 'choice', // 回答
  DRAW_CANVAS = 'draw', // 白板
  STUDENTS_COUNTS = 'STUDENTS_COUNTS', // 人数
  RENAME = 'RENAME', // 改名
  TEXT_INPUT = 'text', // 文本框输入
  NUMBER_INPUT = 'number', // 数字输入
  AUDIO_INPUT = 'audio',
  VIDEO_INPUT = 'video',
  TEACHER_COMMENT = 'TEACHER_COMMENT', // 教师端发评论
  CONTROL = "teacher_control", // 教师端发送控制命令
  MODEL_CHANGE = 'Mode_Change',
  SHOW_RESPONSE = 'show_response',
  END_SESSION = 'end_session',
  CHANGE_SESSION_STATUS = 'change_session_status',
  LOCK_PAGE = 'lock_page',
  STAR_OR_HIDE_ANSWER = 'STAR_OR_HIDE_ANSWER',
  STUDETN_GO_PAGE = 'STUDENT_GO_PAGE',
  SET_DEADLINE_TIME = 'response_limit',
  COPY_LINK_DIALOG_CLOSE = 'copy_link_dialog_close',
  COPY_LINK_DIALOG_OPEN = 'copy_link_dialog_open',
  STUNDENT_COMMENT_PPT = 'STUNDENT_COMMENT_PPT',
  GET_COMMENT_ID = 'GET_COMMENT_ID',
  STUDENT_DELETE_PPT = 'STUDENT_DELETE_PPT',
  STUDENT_ADD_MEDIA = 'STUDENT_ADD_MEDIA',
  TEACHER_ADD_MEDIA = 'add-element'
}

export enum ModalEventsNameEnum {
  TEACHER_COMMENT_MODAL = 'TEACHER_COMMENT_MODAL', // 教师端打开评论弹框
  TEACHER_SEND_COMMENT = 'TEACHER_SEND_COMMENT', // 教师发送评论数据
  SHOW_STUDENT_MODAL = 'SHOW_STUDENT_MODAL', // 打开学生端评论
  SHOW_STUDENT_MODAL_REFRESH = 'SHOW_STUDENT_MODAL_REFRESH', // 更新
  SHOW_STAR_ANSWER = 'SHOW_STAR_ANSWER', // 老师给答案点星星，或者取消星星,或者老师确定隐藏某个答案
  GET_COMMENT_ID = 'GET_COMMENT_ID',
  ADD_NEW_MEDIA = 'ADD_NEW_MEDIA', // 显示新的 media 内容
  MEDIA_MODAL_VISIBLE = 'MEDIA_MODAL_VISABLE'
}

// 评论类型
export enum ModalEventsTypeEnum {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export enum ClassRoomModelEnum {
  TEACHER_MODEL = 'Insturctor-Paced',
  STUDENT_MODEL = 'Student-Paced',
}
