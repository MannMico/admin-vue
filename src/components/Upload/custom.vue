<template>
  <div class="upload-inner">
    <el-upload
      action=""
      :auto-upload="false"
      :drag="isDrag"
      :on-change="Uploader"
      :on-remove="removeFile"
      :multiple="upMultiple"
      :limit="upLimit"
      :on-success="successCB"
      :on-progress="progressCB"
      :on-error="errorCB"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :list-type="listType"
      :show-file-list="showFileList"
      width="100%">
      <template v-if="!isDrag">
        <el-button size="small" :type="btnType">
          {{btnTxt}}
        </el-button>
        <span class="tishi">{{ info }}</span>
      </template>
      <template v-else>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </template>
    </el-upload>
    <el-progress v-show="percent > 0 && percent < 100" :percentage="percent"></el-progress>
  </div>
</template>
<script>
import CosCloud from 'cos-js-sdk-v4/dist/cos-js-sdk-v4.js'
// import CryptoJS from 'cos-js-sdk-v4/demo/crypto.js'
import $ from 'cos-js-sdk-v4/src/jquery.ajax.js'
import jsSHA from 'cos-js-sdk-v4/src/jssha.js'
import request from '@/utils/request'
export default {
  name: 'UploadCustom',
  props: {
    // 上传文件类型
    upfileType: {
      type: String,
      required: false,
      default: 'file'
    },
    // 当upfileType为custom时候才有用，格式为'jpg、jpeg'
    customFormat: {
      type: String,
      required: false
    },
    // 上传文件大小
    upfileSize: {
      type: Number,
      required: false
    },
    // 上传的文件个数
    upLimit: {
      type: Number,
      required: false
    },
    // 是否支持一次多个上传
    upMultiple: {
      type: Boolean,
      required: false
    },
    // 是否可以覆盖当前图
    isCover: {
      type: Boolean,
      required: false
    },
    CBParams: {
      type: Object,
      required: false
    },
    // 显示在按钮后面的文字,提示语句
    info: {
      type: String,
      required: false
    },
    // 是否支持拖拽上传
    isDrag: {
      type: Boolean,
      required: false,
      default: false
    },
    // 文件列表的类型 text/picture/picture-card
    listType: {
      type: String,
      required: false,
      default: 'text'
    },
    // 是否显示已上传的文件列表
    showFileList: {
      type: Boolean,
      required: false,
      default: true
    },
    // 上传按钮文字
    btnTxt: {
      type: String,
      required: false,
      default: '点击上传'
    },
    // 上传按钮类型
    btnType: {
      type: String,
      required: false,
      default: 'primary'
    }
  },
  data () {
    return {
      CosUploader: null,
      // fileType: this.upfileType || {
      fileType: {
        image: {
          cosFolderName: '/Images/',
          str: 'img、png、bmp、jpeg、gif、jpg'
        },
        file: {
          cosFolderName: '/documents/',
          str: 'pdf、doc、docx、xlsx、xls、docm、ppt、pptx、pptm、potx、potm、ppsx、ppsm、zip、rar'
        },
        video: {
          cosFolderName: '/videos/',
          str: 'avi、wmv、mpeg、mp4、mov、mkv、flv、f4v、m4v、rmvb、rm、3gp、dat、ts、mts、vob'
        }
      },
      flieSave: {},
      fileLimit: this.upLimit,
      percent: 0,
      lastTaskId: '',
      fileList: []
    };
  },
  mounted () {
    this.$nextTick(function () {
      window.$ = $
      window.jsSHA = jsSHA
    })
  },
  methods: {
    getCosAppSign () {
      var bucket = 'lkker';
      var appid = '10041312';
      var region = 'sh';
      var getSign = function (callback) {
        request({
          url: '/v1/common/cos/sign',
          method: 'get',
          params: {}
        })
          .then(data => {
            if (data.code == 300000) {
              callback(data.data.sign);
            }
          })
          .catch()
      }
      this.CosUploader = new CosCloud({
        appid: appid,
        bucket: bucket,
        region: region,
        getAppSign  (callback) {
          getSign(callback)
        },
        getAppSignOnce  (callback) {
          getSign(callback)
        }
      });
    },
    // 错误信息
    getErrorMsg () {
      return {
        'FILE_TYPE_ERROR': '请选择格式为：' + this.upfileType + '的文件！',
        'FILE_NUM_LIMIT': '文件数量超过最大上传数' + this.upLimit,
        'FILE_SIZE_LIMIT': '文件总大小不能超过' + this.upfileSize + 'M',
        'FILE_SINGLE_SIZE': '单个文件大小不能超过' + this.upfileSize + 'M',
        'FILE_DUPLICATE': '文件重复',
        'TIMEOUT': '上传超时，请重试'
      }
    },

    // 替换字符
    replaceWith (val, before, after) {
      return val.replace(new RegExp(before, 'g'), after);
    },

    /**
      * 得到验证的具体的格式
      * @param  {String} accept [ image=>图片,  file=>文件, custom=>自定义]
      * @return {String}        [description]
      */
    getVerifyStr (accept) {
      var str = '';
      switch (accept) {
      case 'custom':
        str = this.customFormat;
        break;
      default:
        // image or file
        str = this.fileType[accept].str
      }
      if (!str) {
        throw new Error('请传入验证格式！')
      }
      return str;
    },

    // 随机获取min-max间的num个字母
    getRandomLetters (num, max, min) {
      var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      num = num || 4;
      max = max || 25;
      min = min || 0;
      var random = 0
      var result = '';
      for (var i = 0; i < num; i++) {
        random = Math.round(Math.random() * (max - min)) + min;
        result += letters[random].toLocaleLowerCase();
      }
      return result;
    },

    // 日期格式化方法
    dateFormat (format) {
      var date = new Date();
      var map = {
        'M': date.getMonth() + 1, // 月份
        'd': date.getDate(), // 日
        'h': date.getHours(), // 小时
        'm': date.getMinutes(), // 分
        's': date.getSeconds(), // 秒
        'q': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      };

      format = format && format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
          if (all.length > 1) {
            v = '0' + v;
            v = v.substr(v.length - 2);
          }
          return v;
        } else if (t === 'y') {
          return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
      });
      return format || date.getTime();
    },

    /**
      * 获取时间格式
      * 1. 获取日期（yyyy-MM） eg：201712 => 文件夹名称
      * 2. 获取年月日时分秒（yyyy-MM-dd-hh-mm-ss）eg:20171225100950 => 附件时间戳
      * @param  {String} timeStr [description]
      * @return {String}         [description]
      */
    getFormatDate (timeStr) {
      return this.dateFormat(timeStr).replace(/-/g, '');
    },

    /**
      * 获取文件大小
      * @param  {Number} size [单位 B]
      * @return {Number}      [单位 MB]
      */
    getFileSize (size) {
      return size / 1024 / 1024;
    },

    // 获取文件后缀名
    getFileExt (fileName) {
      let len = fileName.length;
      let start = fileName.lastIndexOf('.');
      let ext = fileName.substr(start + 1, len).toLocaleLowerCase();
      return ext;
    },

    /**
      * 获取文件类型
      * @param  {String} fileName [文件名]
      * @return {String}          [image or file]
      */
    getFileType (fileName) {
      var ext = this.getFileExt(fileName);
      var fileType = this.fileType;
      var type = '';
      var isExit = false;
      for (var key in fileType) {
        if (isExit) {
          break;
        }

        if (fileType.hasOwnProperty(key)) {
          var item = fileType[key]
          var format = item.str

          if (format.indexOf(ext) != -1) {
            isExit = true;
            type = key;
            break;
          }
        }
      }

      if (!type) {
        this.$message.warning('请确认上传文件类型是否存在！')
      }

      return type;
    },

    // 获取cos上传文件夹
    getCosFolderName (fileName) {
      return this.fileType[this.getFileType(fileName)].cosFolderName;
    },

    // 同步服务器上传规则，处理文件名
    fileNameFormat (fileName) {
      var beforeArr = [
        '（', '）', '　', '“', '”', '‘', '’', '；', '：', '？', '！', '、', '，', '。', '～', '《', '》', '【', '】', '丨', ' '
      ]
      var afterArr = [
        '(', ')', '', '"', '"', "'", "'", ';', ':', '?', '!', '.', ',', '.', '~', '<', '>', '[', ']', '|', ''
      ]
      var length = beforeArr.length;
      for (var i = 0; i < length; i++) {
        var replaceItem = beforeArr[i];
        if (fileName.indexOf(replaceItem) != -1) {
          fileName = fileName.replace(new RegExp(replaceItem, 'g'), afterArr[i])
        }
      }
      return fileName;
    },

    // 获取文件上传名称
    getCosFileName (fileName, isSaveImgName) {
      var fileRuled = this.fileNameFormat(fileName);
      var timestap = this.dateFormat();
      var fileNameLen = fileRuled.length;
      var fileSpotPos = fileRuled.lastIndexOf('.');
      var fileExt = fileRuled.substr(fileSpotPos, fileNameLen);
      var fileFirstHalf = fileRuled.substr(0, fileSpotPos);
      if (isSaveImgName) {
        // 需要保存文件名称
        fileRuled = fileRuled.replace(fileFirstHalf, fileFirstHalf + timestap);
      } else {
        // 不需要保存
        fileRuled = this.getRandomLetters() + timestap + fileExt;
      }
      return fileRuled;
    },

    // 获取文件cos的上传path
    getCosPath (fileName, isSaveImgName) {
      var fileFolder = this.getCosFolderName(fileName);
      var dataFolder = this.getFormatDate('yyyy-MM') + '/';
      fileName = this.getCosFileName(fileName, isSaveImgName);

      return fileFolder + dataFolder + fileName;
    },

    /**
      * 利用闭包进行值的存储
      * @return {[type]} [description]
      */
    valueManager () {
      var valObj = {};

      return {
        saveVal (val) {
          valObj[val] = val;
        },
        delVal (val) {
          delete valObj[val]
        },
        getVal () {
          return valObj;
        }
      }
    },
    successCB (fileInfo, result, taskId) {
      var that = this;
      var obj = {};
      obj.code = result.code;
      obj.message = result.message;

      if (result.code == 0) {
        // success
        // 提示上传成功
        obj.file_url = result.data.access_url;
        // obj.file_id = that.UI.gtDomId.call(that, taskId);
        obj.file_name = fileInfo.file_name;
        this.$message.success(obj.file_name + '上传成功！');
        that.$emit('urlCB', obj, that.CBParams);
      }
      if (this.isCover) {
        this.fileList = [{name: obj.file_name, url: obj.file_url}];
      } else {
        this.fileList.push({name: obj.file_name, url: obj.file_url});
      }
    },
    errorCB (result, taskId) {
      result = result || { message: '上传失败，请重试！' };
      this.percent = 0
    },
    progressCB (event, file, fileList) {
      // debugger
      // 记录每次上传的taskId，用于确认是否全部上传完毕
      // var that = this;
      // if (!that.Utils.VMInstance) {
      //   that.Utils.VMInstance = that.Utils.valueManager()
      // }

      // var vmi = that.Utils.VMInstance;
      // vmi.saveVal(taskId)
      // var sha1CheckProgress = ((sha1 * 100).toFixed(2) || 100);
      // var uploadProgress = ((curr || 0) * 100).toFixed(2);
      // console.log('event' + event)
      // console.log('file' + file)
      // console.log('fileList' + fileList)
      // // 由于sha1CheckProgress 100% 之后 uploadProgress才开始出发，尤其是大文件分片时，sha1CheckProgress时间会比较久，为了给用户更好的体验，将上传进度的算法改为curr+sha1

      // // 等于0 表示已经存在/上传成功/不分片 的情况
      // if (sha1 != 0) {
      //   uploadProgress = (sha1CheckProgress * 0.9 + uploadProgress * 0.1).toFixed(2);
      // }
      this.percent = Math.floor(event * 100)
    },
    setTaskIdCB (taskId) {
      taskId = this.lastTaskId;
    },
    // changeUpload (file, fileList) {
    //   debugger
    //   var that = this;
    //   var fileInfo = {
    //     file_name: file.name
    //   };
    //   this.CosUploader.uploadFile(this.successCB.bind(that, fileInfo), this.errorCB, this.progressCB, 'lkker', '/videos/' + file['name'], file.raw, 0, this.setTaskIdCB);
    // },
    completeCallBack (taskId) {
      // 将任务id移除
      // this.Utils.VMInstance.delVal(taskId);
      console.log(taskId)
      // 判断是否全部上传完毕
      // this.completeAllCallBack();
    },
    // httpChange () {
    //   debugger
    //   console.log(arguments)
    // },
    beforeUpload (files) {
      var that = this;
      var getErrorMsgFun = this.getErrorMsg.bind(that);
      var fileLen = this.fileList.length;
      // 错误信息
      var errorMsg = getErrorMsgFun();
      var isPassVerify = true;
      // for (var i = 0; i < fileLen; i++) {
      //   if (!isPassVerify) {
      //     break;
      //   }

      var fileSize = this.getFileSize(files['size']);
      // 文件格式
      var verifyStr = this.getVerifyStr.call(that, this.upfileType)
      var fileExt = this.getFileExt(files['name'])

      if (verifyStr.indexOf(fileExt) == -1) {
        var err = errorMsg['FILE_TYPE_ERROR']
        var info = err.replace(this.upfileType, verifyStr)
        this.$message.warning(info)
        this.fileList = this.fileList.slice(0, fileLen)
        isPassVerify = false;
        return;
      }

      // 单文件大小
      if (fileSize > this.upfileSize) {
        this.$message.warning(errorMsg['FILE_SINGLE_SIZE']);
        this.fileList = this.fileList.slice(0, fileLen)
        isPassVerify = false;
        return;
      }
      // // 上传的文件总数量
      // if (fileLen > this.upfileSize) {
      //   this.$message.warning(errorMsg['FILE_NUM_LIMIT']);
      //   isPassVerify = false;
      //   break;
      // }

      // TODO 确认是否有需要的场景
      // 上传文件总大小
      // }
      // 没有通过验证，重置input，为了重新选择
      if (!isPassVerify) {
        this.fileList = '';
      }
      return isPassVerify;
    },
    Uploader (file) {
      var isPassVerify = this.beforeUpload(file);
      if (!this.isSupport() || !isPassVerify) {
        return;
      }
      // 获取腾讯云实例
      this.getCosAppSign();
      this.starUpload(file);
    },
    isSupport () {
      var flag = true;
      if (!window.FileReader || !window.File) {
        flag = false;
        this.$message.warning('您的浏览器不支持文件上传，建议使用Chrome浏览器！');
      }
      return flag;
    },
    starUpload (files) {
      var that = this;
      var cosConfig = that.getCosConfig();

      // 还有需要上传的文件
      var obj = {
        bucket: cosConfig['bucket'],
        path: that.getCosPath(files['name'], 0),
        file: files,
        insertOnly: cosConfig['insertOnly']
      }
      console.log(obj)
      that.cosUpload(obj)
      files = Array.prototype.slice.call(files)
      // that.starUpload(files)
    },
    getCosConfig () {
      return {
        bucket: 'lkker',
        insertOnly: 0 // 表示允许覆盖文件 0允许 1表示不允许
      }
    },
    cosUpload (item) {
      var that = this
      var file = item.file
      var path = item.path
      var bucket = item.bucket
      var insertOnly = item.insertOnly
      var setTaskIdCB = that.lastTaskId
      var successCB = item.successCB || that.successCB
      var errorCB = item.errorCB || that.errorCB
      var progressCB = item.progressCB || that.progressCB
      var fileInfo = {
        file_name: file.name
      };
      /*
        * 通常用于较小文件(一般小于20MB)的上传，
        * 可以通过此接口上传较小的文件并获得文件的url，
        * 如果文件大于20M则本接口内部会去调用分片上传接口。
        * @param  {Function} successCallBack  上传成功的回调
        * @param  {Function} errorCallBack    上传失败的回调
        * @param  {Function} progressCallBack 上传过程进度的回调
        * @param  {String} bucket  bucket名称
        * @param  {String} path 文件在COS服务端的路径
        * @param  {File} file 本地要上传文件的文件对象（二进制数据）
        * @param  {Int} insertOnly insertOnly==0 表示允许覆盖文件 1表示不允许 其他值忽略
        * @param  {Function} setTaskId 每条上传对接的taskId，用于取消上传
        **/
      this.CosUploader.uploadFile(successCB.bind(that, fileInfo), errorCB, progressCB, bucket, path, file.raw, insertOnly, setTaskIdCB);
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 ${this.upLimit} 个文件，本次选择了${files.length} 个文件，共选择了${files.length + fileList.length} 个文件`);
    },
    // beforeRemove (file, fileList) {
    //   return this.$confirm(`确定移除${file.name}？`);
    // },
    removeFile (file, files) {
      this.fileList = files
      this.$emit('removeFile', files, this.CBParams)
    }
  }
}
</script>
<style lang="scss" scoped>
  .tishi {
    font-size: 12px;
    color: #999;
  }
  /* .upload-inner {
    .el-upload {
      width: 600px;
    }
    .el-upload-dragger {
      width: 600px;
      height: 140px;
      .el-icon-upload {
        margin-top: 20px;
      }
    }
  } */
</style>
