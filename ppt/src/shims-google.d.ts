/* eslint-disable no-var */
declare var gapi: any
declare var google: any
declare var io: any
declare var EventBus: any
declare var canvasPool: string[]
declare var drawPool: string[]
declare var textPool: any[]
declare var textOptsPool: any[] // 用来支持text的撤销和回滚操作，想法是保存当前所有的text。
