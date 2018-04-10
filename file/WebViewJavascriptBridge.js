//notation: js file can only use this kind of comments
//since comments will cause error when use in webview.loadurl,
//comments will be remove by java use regexp
(function () {
    if (window.WebViewJavascriptBridge && /(Android)/i.test(navigator.userAgent)) {
        return;
    }

    var messagingIframe;
    var sendMessageQueue = [];
    var receiveMessageQueue = [];
    var messageHandlers = {};

    var CUSTOM_PROTOCOL_SCHEME = 'jeaes';
    var QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/';

    var responseCallbacks = {};
    var uniqueId = 1;

    function _createQueueReadyIframe(doc) {
        messagingIframe = doc.createElement('iframe');
        messagingIframe.style.display = 'none';
        doc.documentElement.appendChild(messagingIframe);
    }

    // set default messageHandler
    function init(messageHandler) {
        if (WebViewJavascriptBridge._messageHandler) {
            throw new Error('WebViewJavascriptBridge.init called twice');
        }
        WebViewJavascriptBridge._messageHandler = messageHandler;
        var receivedMessages = receiveMessageQueue;
        receiveMessageQueue = null;
        for (var i = 0; i < receivedMessages.length; i++) {
            _dispatchMessageFromNative(receivedMessages[i]);
        }
    }

    function send(data, responseCallback) {
        _doSend({
            data: data
        }, responseCallback);
    }

    function registerHandler(handlerName, handler) {
        messageHandlers[handlerName] = handler;
    }

    function callHandler(handlerName, data, responseCallback) {
        _doSend({
            handlerName: handlerName,
            data: data
        }, responseCallback);
    }

    // sendMessage add message, 触发native处理 sendMessage
    function _doSend(message, responseCallback) {
        if (responseCallback) {
            var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
            message.callbackId = callbackId;
        }

        sendMessageQueue.push(message);
        messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://'
            + QUEUE_HAS_MESSAGE;
    }

    // 提供给native调用,该函数作用:获取sendMessageQueue返回给native,由于android不能直接获取返回的内容,所以使用url
    // shouldOverrideUrlLoading 的方式返回内容
    function _fetchQueue() {
        var messageQueueString = JSON.stringify(sendMessageQueue);
        sendMessageQueue = [];
        // android can't read directly the return data, so we can reload iframe
        // src to communicate with java
        messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/'
            + encodeURIComponent(messageQueueString);
    }

    // 提供给native使用,
    function _dispatchMessageFromNative(messageJSON) {
        setTimeout(function () {
            var message = JSON.parse(messageJSON);
            var responseCallback;
            // java call finished, now need to call js callback function
            if (message.responseId) {
                responseCallback = responseCallbacks[message.responseId];
                if (!responseCallback) {
                    return;
                }
                responseCallback(message.responseData);
                delete responseCallbacks[message.responseId];
            } else {
                // 直接发送
                if (message.callbackId) {
                    var callbackResponseId = message.callbackId;
                    responseCallback = function (responseData) {
                        _doSend({
                            responseId: callbackResponseId,
                            responseData: responseData
                        });
                    };
                }

                var handler = WebViewJavascriptBridge._messageHandler;
                if (message.handlerName) {
                    handler = messageHandlers[message.handlerName];
                }
                // 查找指定handler
                try {
                    handler(message.data, responseCallback);
                } catch (exception) {
                    if (typeof console != 'undefined') {
                        console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
                    }
                }
            }
        });
    }

    // 提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
    function _handleMessageFromNative(messageJSON) {
        console.log(messageJSON);
        if (receiveMessageQueue && receiveMessageQueue.length > 0) {
            receiveMessageQueue.push(messageJSON);
        } else {
            _dispatchMessageFromNative(messageJSON);
        }
    }


    /***
     * IOS平台注册方法
     * @param callback
     * @returns {*}
     */
    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'jeaes://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }

    /***
     * 判断平台
     */
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        setupWebViewJavascriptBridge(function (bridge) {
            //window.IOSBridge = bridge;
            /*bridge.registerHandler('testJSFunction', function(data, responseCallback) {
             alert('JS方法被调用:'+data);
             responseCallback('js执行过了');
             });*/
        });
    } else if (/(Android)/i.test(navigator.userAgent)) {
        var WebViewJavascriptBridge = window.WebViewJavascriptBridge = {
            init: init,
            send: send,
            registerHandler: registerHandler,
            callHandler: callHandler,
            _fetchQueue: _fetchQueue,
            _handleMessageFromNative: _handleMessageFromNative
        };

        var doc = document;
        _createQueueReadyIframe(doc);
        var readyEvent = doc.createEvent('Events');
        readyEvent.initEvent('WebViewJavascriptBridgeReady');
        readyEvent.bridge = WebViewJavascriptBridge;
        doc.dispatchEvent(readyEvent);
    }
})();

//原生方法封装
(function () {
    if (window.je) {
        return;
    }

    /***
     * 调用原生方法
     * @param handlerName 原生方法
     * @param paramJson 参数json
     * @param responseCallback 回调方法
     * @private
     */
    function _callNativeHandler(handlerName, paramJson, responseCallback) {
        if (window.WebViewJavascriptBridge) {
            window.WebViewJavascriptBridge.callHandler(handlerName, paramJson, responseCallback);
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function () {
                    window.WebViewJavascriptBridge.callHandler(handlerName, paramJson, responseCallback);
                },
                false
            );
        }
    }

    /***
     * 注册接口方法供原生调用
     * @param handlerName 注册接口名
     * @param handler 接口方法
     * @private
     */
    function _registerNativeHandler(handlerName, handler) {
        if (window.WebViewJavascriptBridge) {
            window.WebViewJavascriptBridge.registerHandler(handlerName, handler);
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function () {
                    window.WebViewJavascriptBridge.registerHandler(handlerName, handler);
                },
                false
            );
        }
    }

    //工具类
    var Utils = {
        /**
         * 将日期格式化成指定格式的字符串
         * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
         * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
         * @returns 返回格式化后的日期字符串
         * ---示例代码---
         * formatDate(); // 2016-09-02 13:17:13
         * formatDate(new Date(), 'yyyy-MM-dd'); // 2016-09-02
         * // 2016-09-02 第3季度 星期五 13:19:15:792
         * formatDate(new Date(), 'yyyy-MM-dd 第q季度 www HH:mm:ss:SSS');
         * formatDate(1472793615764); // 2016-09-02 13:20:15
         */
        formatDate: function (date, fmt) {
            date = date == undefined ? new Date() : date;
            date = typeof date == 'number' ? new Date(date) : date;
            fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
            var obj =
            {
                'y': date.getFullYear(), // 年份，注意必须用getFullYear
                'M': date.getMonth() + 1, // 月份，注意是从0-11
                'd': date.getDate(), // 日期
                'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                'w': date.getDay(), // 星期，注意是0-6
                'H': date.getHours(), // 24小时制
                'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                'm': date.getMinutes(), // 分钟
                's': date.getSeconds(), // 秒
                'S': date.getMilliseconds() // 毫秒
            };
            var week = ['天', '一', '二', '三', '四', '五', '六'];
            for (var i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    var val = obj[i] + '';
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
                    return m.length == 1 ? val : val.substring(val.length - m.length);
                });
            }
            return fmt;
        },
        /**
         * 将字符串解析成日期
         * @param str 输入的日期字符串，如'2014-09-13'
         * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
         * @returns 解析后的Date类型日期
         * ---示例代码---
         * parseDate('2016-08-11'); // Thu Aug 11 2016 00:00:00 GMT+0800
         * parseDate('2016-08-11 13:28:43', 'yyyy-MM-dd HH:mm:ss') // Thu Aug 11 2016 13:28:43 GMT+0800
         */
        parseDate: function (str, fmt) {
            fmt = fmt || 'yyyy-MM-dd';
            var obj = { y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0 };
            fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
                str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
                    obj[$3] = parseInt(_$1);
                    return '';
                });
                return '';
            });
            obj.M--; // 月份是从0开始的，所以要减去1
            var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
            if (obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
            return date;
        },
        /**
         * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
         * 当天的返回时分，当年的返回月日，否则，返回年月日
         * @param {Object} date
         */
        formatDateToFriendly: function (date) {
            date = date || new Date();
            date = typeof date === 'number' ? new Date(date) : date;
            var now = new Date();
            if ((now.getTime() - date.getTime()) < 60 * 1000) return '刚刚'; // 1分钟以内视作“刚刚”
            var temp = this.formatDate(date, 'yyyy年M月d');
            if (temp == this.formatDate(now, 'yyyy年M月d')) return this.formatDate(date, 'HH:mm');
            if (date.getFullYear() == now.getFullYear()) return this.formatDate(date, 'M月d日');
            return temp;
        },
        /**
         * 将一段时长转换成友好格式，如：
         * 147->“2分27秒”
         * 1581->“26分21秒”
         * 15818->“4小时24分”
         * @param {Object} second
         */
        formatDurationToFriendly: function (second) {
            if (second < 60) return second + '秒';
            else if (second < 60 * 60) return (second - second % 60) / 60 + '分' + second % 60 + '秒';
            else if (second < 60 * 60 * 24) return (second - second % 3600) / 60 / 60 + '小时' + Math.round(second % 3600 / 60) + '分';
            return (second / 60 / 60 / 24).toFixed(1) + '天';
        },
        /**
         * 将时间转换成MM:SS形式
         */
        formatTimeToFriendly: function (second) {
            var m = Math.floor(second / 60);
            m = m < 10 ? ( '0' + m ) : m;
            var s = second % 60;
            s = s < 10 ? ( '0' + s ) : s;
            return m + ':' + s;
        },
        /**
         * 判断某一年是否是闰年
         * @param year 可以是一个date类型，也可以是一个int类型的年份，不传默认当前时间
         */
        isLeapYear: function (year) {
            if (year === undefined) year = new Date();
            if (year instanceof Date) year = year.getFullYear();
            return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
        },
        /**
         * 获取某一年某一月的总天数，没有任何参数时获取当前月份的
         * 方式一：$.getMonthDays();
         * 方式二：$.getMonthDays(new Date());
         * 方式三：$.getMonthDays(2013, 12);
         */
        getMonthDays: function (date, month) {
            var y, m;
            if (date == undefined) date = new Date();
            if (date instanceof Date) {
                y = date.getFullYear();
                m = date.getMonth();
            }
            else if (typeof date == 'number') {
                y = date;
                m = month - 1;
            }
            var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 非闰年的一年中每个月份的天数
            //如果是闰年并且是2月
            if (m == 1 && this.isLeapYear(y)) return days[m] + 1;
            return days[m];
        },
        /**
         * 计算2日期之间的天数，用的是比较毫秒数的方法
         * 传进来的日期要么是Date类型，要么是yyyy-MM-dd格式的字符串日期
         * @param date1 日期一
         * @param date2 日期二
         */
        countDays: function (date1, date2) {
            var fmt = 'yyyy-MM-dd';
            // 将日期转换成字符串，转换的目的是去除“时、分、秒”
            if (date1 instanceof Date && date2 instanceof Date) {
                date1 = this.format(fmt, date1);
                date2 = this.format(fmt, date2);
            }
            if (typeof date1 === 'string' && typeof date2 === 'string') {
                date1 = this.parse(date1, fmt);
                date2 = this.parse(date2, fmt);
                return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
            }
            else {
                console.error('参数格式无效！');
                return 0;
            }
        },
        /***
         * 获取时间戳
         * @param date
         * @returns {number}
         */
        getTimestamp: function (date) {
            var timestamp = Date.parse(date);
            return timestamp;
        }
    }


    //开放接口
    var OpenAPI = {
        //发起微信登陆
        weChatLogin: function (paramJson, responseCallback) {
            _callNativeHandler('weChatLogin', paramJson, responseCallback);
        },
        //发起微博登陆
        weiBoLogin: function (paramJson, responseCallback) {
            _callNativeHandler('weiBoLogin', paramJson, responseCallback);
        },
        //微信分享与收藏
        wxShareCollection: function (paramJson, responseCallback) {
            _callNativeHandler('wxShareCollection', paramJson, responseCallback);
        },
        //微博分享
        weiBoShare: function (paramJson, responseCallback) {
            _callNativeHandler('weiBoShare', paramJson, responseCallback);
        }
    }

    //界面
    var UI = {
        //禁止截屏
        disableScreenshots: function (responseCallback) {
            _callNativeHandler('disableScreenshots', {}, responseCallback);
        },
        //允许截屏
        allowScreenshots: function (responseCallback) {
            _callNativeHandler('allowScreenshots', {}, responseCallback);
        },
        //打开新窗口
        openNativeView: function (paramJson, responseCallback) {
            _callNativeHandler('openNativeView', paramJson, responseCallback);
        },
        //显示原生标题栏
        showNativeTitleBar: function (responseCallback) {
            _callNativeHandler('showNativeTitleBar', {}, responseCallback);
        },
        //隐藏原生标题栏
        hideNativeTitleBar: function (responseCallback) {
            _callNativeHandler('hideNativeTitleBar', {}, responseCallback);
        },
        //设置界面标题
        setNativeTitle: function (paramJson, responseCallback) {
            _callNativeHandler('setNativeTitle', paramJson, responseCallback);
        },
        //设置标题栏背景色
        setNativeTitleBackgroundColor: function (paramJson, responseCallback) {
            _callNativeHandler('setNativeTitleBackgroundColor', paramJson, responseCallback);
        },
        //设置标题栏文字颜色
        setNativeTitleColor: function (paramJson, responseCallback) {
            _callNativeHandler('setNativeTitleColor', paramJson, responseCallback);
        },
        //打开POP窗口
        openPopWindow: function (paramJson, responseCallback) {
            _callNativeHandler('openPopWindow', paramJson, responseCallback);
        },
        //关闭POP窗口
        colsePopWindow: function (responseCallback) {
            _callNativeHandler('colsePopWindow', {}, responseCallback);
        },
        //显示通知
        showNotify: function (paramJson, responseCallback) {
            _callNativeHandler('showNotify', paramJson, responseCallback);
        },
    }

    //设备
    var Device = {
        //扫码
        scanCode: function (responseCallback) {
            _callNativeHandler('scanCode', {}, responseCallback);
        },
        //打电话
        makePhoneCall: function (paramJson, responseCallback) {
            _callNativeHandler('makePhoneCall', paramJson, responseCallback);
        },
        //设置屏幕亮度
        setScreenBrightness: function (paramJson, responseCallback) {
            _callNativeHandler('setScreenBrightness', paramJson, responseCallback);
        },
        //获取屏幕亮度
        getScreenBrightness: function (responseCallback) {
            _callNativeHandler('getScreenBrightness', {}, responseCallback);
        },
        //设置是否保持常亮状态
        setKeepScreenOn: function (paramJson, responseCallback) {
            _callNativeHandler('setKeepScreenOn', paramJson, responseCallback);
        },
        //用户截屏事件监听
        onUserCaptureScreen: function (handler) {
            _registerNativeHandler('onUserCaptureScreen', handler);
        },
        //使手机发生较长时间的振动，振动时长400ms
        vibrateLong: function (responseCallback) {
            _callNativeHandler('vibrateLong', {}, responseCallback);
        },
        //使手机发生较短时间的振动，振动时长15ms
        vibrateShort: function (responseCallback) {
            _callNativeHandler('vibrateShort', {}, responseCallback);
        },
        //新增手机联系人
        addPhoneContact: function (paramJson, responseCallback) {
            _callNativeHandler('addPhoneContact', paramJson, responseCallback);
        },
        //添加系统日历事件、日程
        addCalendarEvent: function (paramJson, responseCallback) {
            _callNativeHandler('addCalendarEvent', paramJson, responseCallback);
        },
        //发短信
        sendSMS: function (paramJson, responseCallback) {
            _callNativeHandler('sendSMS', paramJson, responseCallback);
        },
        //设置系统剪贴板的内容
        setClipboardData: function (paramJson, responseCallback) {
            _callNativeHandler('setClipboardData', paramJson, responseCallback);
        },
        //获取系统剪贴板内容
        getClipboardData: function (responseCallback) {
            _callNativeHandler('getClipboardData', {}, responseCallback);
        },
        //获取系统信息
        getSystemInfo: function (responseCallback) {
            _callNativeHandler('getSystemInfo', {}, responseCallback);
        }
    }

    //媒体
    var Media = {
        //从本地相册选择图片或使用相机拍照
        chooseImage: function (paramJson, responseCallback) {
            _callNativeHandler('chooseImage', paramJson, responseCallback);
        },
        //预览图片
        previewImage: function (paramJson, responseCallback) {
            _callNativeHandler('previewImage', paramJson, responseCallback);
        },
        //保存图片到系统相册
        saveImageToPhotosAlbum: function (paramJson, responseCallback) {
            _callNativeHandler('saveImageToPhotosAlbum', paramJson, responseCallback);
        },
        //本地图片转Base64
        imageToBase64: function (paramJson, responseCallback) {
            _callNativeHandler('imageToBase64', paramJson, responseCallback);
        },
        //开始录音
        startRecord: function (paramJson, responseCallback) {
            _callNativeHandler('startRecord', paramJson, responseCallback);
        },
        //停止录音
        stopRecord: function (responseCallback) {
            _callNativeHandler('stopRecord', {}, responseCallback);
        },
        //取消录音
        cancelRecord: function (responseCallback) {
            _callNativeHandler('cancelRecord', {}, responseCallback);
        }
    }

    //数据
    var Data = {
        //将数据存储在本地缓存中指定的 key 中
        setStorage: function (paramJson, responseCallback) {
            _callNativeHandler('setStorage', paramJson, responseCallback);
        },
        //从本地缓存中获取指定 key 对应的内容
        getStorage: function (paramJson, responseCallback) {
            _callNativeHandler('getStorage', paramJson, responseCallback);
        },
        //获取当前storage的相关信息
        getStorageInfo: function (paramJson, responseCallback) {
            _callNativeHandler('getStorageInfo', paramJson, responseCallback);
        },
        //从本地缓存中移除指定 key
        removeStorage: function (paramJson, responseCallback) {
            _callNativeHandler('removeStorage', paramJson, responseCallback);
        },
        //清理本地数据缓存
        clearStorage: function (paramJson, responseCallback) {
            _callNativeHandler('clearStorage', paramJson, responseCallback);
        }
    }

    //蓝牙API
    var BlueTooth = {
        //蓝牙状态
        bluetoothStatus: function (responseCallback) {
            _callNativeHandler('bluetoothStatus', {}, responseCallback);
        },
        //打开蓝牙
        openBlueTooth: function (responseCallback) {
            _callNativeHandler('openBlueTooth', {}, responseCallback);
        },
        //关闭蓝牙
        closeBlueTooth: function (responseCallback) {
            _callNativeHandler('closeBlueTooth', {}, responseCallback);
        },
        //搜索设备
        searchDevices: function (responseCallback) {
            _callNativeHandler('searchDevices', {}, responseCallback);
        },
        //停止搜索
        stopSearchDevices: function (responseCallback) {
            _callNativeHandler('stopSearchDevices', {}, responseCallback);
        },
        //获取已经配对的设备
        getPairedDevices: function (responseCallback) {
            _callNativeHandler('getPairedDevices', {}, responseCallback);
        }
    }

    //网络
    var Network = {
        //获取网络类型
        getNetworkType: function (responseCallback) {
            _callNativeHandler('getNetworkType', {}, responseCallback);
        },
        //监听网络状态变化
        onNetworkStatusChange: function (handler) {
            _registerNativeHandler('onNetworkStatusChange', handler);
        },
        //发起网络请求
        request: function (paramJson, responseCallback) {
            _callNativeHandler('request', paramJson, responseCallback);
        },
        //将本地资源上传到服务器
        uploadFile: function (paramJson, responseCallback) {
            _callNativeHandler('uploadFile', paramJson, responseCallback);
        },
        //下载文件资源到本地
        downloadFile: function (paramJson, responseCallback) {
            _callNativeHandler('downloadFile', paramJson, responseCallback);
        }
    }

    //WebSocket
    var WebSocket = {
        //创建一个 WebSocket 连接
        connectSocket: function (paramJson, responseCallback) {
            _callNativeHandler('connectSocket', paramJson, responseCallback);
        },
        //监听WebSocket连接打开事件
        onSocketOpen: function (handler) {
            _registerNativeHandler('onSocketOpen', handler);
        },
        //监听WebSocket错误事件
        onSocketError: function (handler) {
            _registerNativeHandler('onSocketError', handler);
        },
        //监听WebSocket接受到服务器的消息事件
        onSocketMessage: function (handler) {
            _registerNativeHandler('onSocketMessage', handler);
        },
        //监听WebSocket关闭
        onSocketClose: function (handler) {
            _registerNativeHandler('onSocketClose', handler);
        },
        //通过 WebSocket 连接发送数据
        sendSocketMessage: function (paramJson, responseCallback) {
            _callNativeHandler('sendSocketMessage', paramJson, responseCallback);
        },
        //关闭WebSocket连接
        closeSocket: function (responseCallback) {
            _callNativeHandler('closeSocket', {}, responseCallback);
        }
    }

    //位置
    var Location = {
        //获取当前的地理位置、速度
        getLocation: function (paramJson, responseCallback) {
            _callNativeHandler('getLocation', paramJson, responseCallback);
        }
    }

    //应用
    var Application = {
        //APP应用更新
        updateApplication: function (paramJson, responseCallback) {
            _callNativeHandler('updateApplication', paramJson, responseCallback);
        },
        //Assets资源文件更新
        updateAssets: function (paramJson, responseCallback) {
            _callNativeHandler('updateAssets', paramJson, responseCallback);
        }
    }

    var je = window.je = {
        UI: UI,
        OpenAPI: OpenAPI,
        Device: Device,
        Media: Media,
        Data: Data,
        BlueTooth: BlueTooth,
        Network: Network,
        WebSocket: WebSocket,
        Location: Location,
        Utils: Utils,
        Application: Application
    };

    var doc = document;
    var readyEvent = doc.createEvent('Events');
    readyEvent.initEvent('jeReady');
    readyEvent.bridge = je;
    doc.dispatchEvent(readyEvent);
})();
