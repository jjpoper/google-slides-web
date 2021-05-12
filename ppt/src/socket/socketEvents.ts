export enum SocketEventsEnum {
  GO_PAGE = 'GO_PAGE', // 教师端发控制
  ANSWER_QUESTION = 'choice', // 回答
  DRAW_CANVAS = 'draw', // 白板
  STUDENTS_COUNTS = 'STUDENTS_COUNTS', // 人数
  RENAME = 'RENAME', // 改名
  TEXT_INPUT = 'text', // 文本框输入
  NUMBER_INPUT = 'number', // 数字输入
  TEACHER_COMMENT = 'TEACHER_COMMENT', // 教师端发评论
  CONTROL ="teacher_control",//教师端发送控制命令
  MODEL_CHANGE = 'Mode_Change',
  SHOW_RESPONSE = 'show_response',
}

export enum ModalEventsNameEnum {
  TEACHER_COMMENT_MODAL = 'TEACHER_COMMENT_MODAL', // 教师端打开评论弹框
  TEACHER_SEND_COMMENT = 'TEACHER_SEND_COMMENT', // 教师发送评论数据
  SHOW_STUDENT_MODAL = 'SHOW_STUDENT_MODAL', // 打开学生端评论
  SHOW_STUDENT_MODAL_REFRESH = 'SHOW_STUDENT_MODAL_REFRESH', // 更新
}

export enum ClassRoomModelEnum{
  TEACHER_MODEL = 'Insturctor-Paced',
  STUDENT_MODEL = 'Student-Paced',
}
