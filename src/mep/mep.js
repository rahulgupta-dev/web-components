'use-strict'
var Mep = {}

Mep.id = 0
Mep.ifrm
Mep.lastActiveTimeStamp
Mep.baseUrl
Mep.accessToken
Mep.uniqueId
Mep.requestId
Mep.supportbinderId
Mep.orgId
Mep.profileUrl
Mep.firstName
Mep.lastName
Mep.encrpt_access_token
Mep.encrpt_uniqueId
Mep.client_id
var globalAccessToken = ''
var txn_event_data = ''
var mepconfirmbtn_enabled = false
Mep.portal_type

//RM JS SDK Initialization
Mep.portal = function (options) {
  try {
    lastActiveTimeStamp = new Date().getTime()
    var initParams
    baseUrl = options.base_url
    accessToken = options.access_token
    if (typeof (options.iframe) !== "undefined" || options.iframe) {
      if (typeof (options.tagid4iframe) === "undefined") {
        throw "tagid4iframe is empty"
      }
    }
    if (options.iframe && document.getElementById(options.tagid4iframe) === null) {
      throw "tagid4iframe is not valid"
    }
    if (typeof (options.iframewidth) === "undefined") {
      options.iframewidth = '640px'
    }
    if (typeof (options.iframeheight) === "undefined") {
      options.iframeheight = '480px'
    }
    if (typeof (options.iframeheight) !== "undefined" && typeof options.onfailure === "function") {
      throw "onfailure is not valid function"
    }

    globalAccessToken = options.access_token
    var http = new XMLHttpRequest()
    var url = options.base_url + '/initParams'
    var params = 'custSdkCall=false&accessToken=' + options.access_token
    http.open('POST', options.base_url + '/initParams', true)

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

    http.onreadystatechange = function () {//Call a function when the state changes.
      if (http.readyState == 4 && http.status == 200) {

        initParams = JSON.parse(http.responseText)

        if (typeof (initParams.unique_id) === "undefined") {
          // throw "access_token is not valid or base_url is not valid";
          var error_options = { code: '400', description: "access_token is not valid or base_url is not valid" }
          if (typeof (options.onInitFailure) === 'function') {
            options.onInitFailure(error_options)
          }
        }
        uniqueId = initParams.unique_id
        portal_type = "RM_PORTAL"

        var origin
        if (location.origin == null || !(location.origin) || location.origin == 'null') {
          origin = location.protocol + "//" + location.host + (location.port ? ':' + location.port : '')
        } else {
          origin = location.origin
        }
        var twoFaStatus
        if (typeof (options.is2FaStatus) !== "undefined" && options.is2FaStatus) {
          twoFaStatus = 'Y'
        } else {
          twoFaStatus = 'N'
        }
        var locale_code
        if (typeof (options.locale_code) !== "undefined") {
          locale_code = options.locale_code
        } else {
          locale_code = "en"
        }

        var isRefresh
        if (typeof (options.isRefresh) !== "undefined") {
          isRefresh = options.isRefresh

          if (isRefresh == true) {
            $("body").find("iframe").remove()
          }
        }

        var isDeskstopCallbackEnabled
        if (typeof (options.isDeskstopCallbackEnabled) !== "undefined" && options.isDeskstopCallbackEnabled) {
          isDeskstopCallbackEnabled = true
        } else {
          isDeskstopCallbackEnabled = false
        }

        var binderId = ""
        if (typeof (sessionStorage['binderId']) !== 'undefined') {
          binderId = sessionStorage.getItem('binderId')
          if (binderId != "") {
            sessionStorage.removeItem('binderId')
          }
        }

        /*sessionStorage.setItem('firstLogin', true);
    sessionStorage.setItem("navPage",null);*/
        var browserDetails = get_browser()
        var browserName = browserDetails["name"]
        var browserVersion = browserDetails["version"]

        ifrm = document.createElement("iframe")
        var sdkForm = document.createElement("form")
        var sdkSubmit = document.createElement("input")
        sdkForm.method = 'post'
        sdkForm.target = 'sdk_iframe'
        sdkSubmit.type = 'submit'


        sdkForm.action = options.base_url + '/mepTimelineLocale'

        var hiddenIframe = document.createElement("input")
        hiddenIframe.setAttribute("type", "hidden")
        var hiddenIframe1 = document.createElement("input")
        hiddenIframe1.setAttribute("type", "hidden")
        var hiddenIframe2 = document.createElement("input")
        hiddenIframe2.setAttribute("type", "hidden")
        var hiddenIframe3 = document.createElement("input")
        hiddenIframe3.setAttribute("type", "hidden")
        var hiddenIframe4 = document.createElement("input")
        hiddenIframe4.setAttribute("type", "hidden")
        var hiddenIframe5 = document.createElement("input")
        hiddenIframe5.setAttribute("type", "hidden")
        var hiddenIframe6 = document.createElement("input")
        hiddenIframe6.setAttribute("type", "hidden")
        var hiddenIframe7 = document.createElement("input")
        hiddenIframe7.setAttribute("type", "hidden")
        var hiddenIframe8 = document.createElement("input")
        hiddenIframe8.setAttribute("type", "hidden")
        var hiddenIframe9 = document.createElement("input")
        hiddenIframe9.setAttribute("type", "hidden")
        var hiddenIframe10 = document.createElement("input")
        hiddenIframe10.setAttribute("type", "hidden")
        var hiddenIframe11 = document.createElement("input")
        hiddenIframe11.setAttribute("type", "hidden")


        hiddenIframe.setAttribute("name", "accessToken")
        hiddenIframe.setAttribute("value", initParams.data[0])
        hiddenIframe1.setAttribute("name", "localeCode")
        hiddenIframe1.setAttribute("value", locale_code)
        hiddenIframe2.setAttribute("name", "orgId")
        hiddenIframe2.setAttribute("value", initParams.org_id)
        hiddenIframe3.setAttribute("name", "twofaStatus")
        hiddenIframe3.setAttribute("value", twoFaStatus)
        hiddenIframe4.setAttribute("name", "core_lang_code")
        hiddenIframe4.setAttribute("value", initParams.core_language_code)
        hiddenIframe5.setAttribute("name", "core_timezone")
        hiddenIframe5.setAttribute("value", initParams.core_timezone)
        hiddenIframe6.setAttribute("name", "browserName")
        hiddenIframe6.setAttribute("value", browserName)
        hiddenIframe7.setAttribute("name", "browserVersion")
        hiddenIframe7.setAttribute("value", browserVersion)
        hiddenIframe8.setAttribute("name", "origin")
        hiddenIframe8.setAttribute("value", origin)
        hiddenIframe9.setAttribute("name", "isDeskstopCallbackEnabled")
        hiddenIframe9.setAttribute("value", isDeskstopCallbackEnabled)
        hiddenIframe10.setAttribute("name", "binderId")
        hiddenIframe10.setAttribute("value", binderId)
        hiddenIframe11.setAttribute("name", "isRefresh")
        hiddenIframe11.setAttribute("value", isRefresh)
        sdkForm.appendChild(hiddenIframe); sdkForm.appendChild(hiddenIframe1); sdkForm.appendChild(hiddenIframe2); sdkForm.appendChild(hiddenIframe3); sdkForm.appendChild(hiddenIframe4); sdkForm.appendChild(hiddenIframe5); sdkForm.appendChild(hiddenIframe6)
        sdkForm.appendChild(hiddenIframe7); sdkForm.appendChild(hiddenIframe8); sdkForm.appendChild(hiddenIframe9); sdkForm.appendChild(hiddenIframe10); sdkForm.appendChild(hiddenIframe11)
        /*if (typeof(sessionStorage['binderId']) !== 'undefined') {
        var hiddenIframe9 = document.createElement("input");			          
            hiddenIframe9.setAttribute("type", "hidden");
            hiddenIframe9.setAttribute("name", "binderId");
            hiddenIframe9.setAttribute("value", sessionStorage.getItem('binderId'));
            sdkForm.appendChild(hiddenIframe9);
      }*/

        sdkForm.appendChild(sdkSubmit)

        ifrm.id = 'containerRenderID'

        ifrm.name = 'sdk_iframe'
        ifrm.style.border = "0px"
        ifrm.setAttribute("allowfullscreen", true)
        ifrm.setAttribute("webkitallowfullscreen", true)
        ifrm.setAttribute("mozallowfullscreen", true)
        ifrm.setAttribute("oallowfullscreen", true)
        ifrm.setAttribute("msallowfullscreen", true)

        ifrm.src = '#'
        if (options.iframe) {
          ifrm.style.width = options.iframewidth
          ifrm.style.height = options.iframeheight
          document.getElementById(options.tagid4iframe).appendChild(sdkForm)
          document.getElementById(options.tagid4iframe).appendChild(ifrm)
          sdkForm.submit()
          //sdkForm.remove();
          sdkForm.parentNode.removeChild(sdkForm)
        } else {
          ifrm.style.width = options.iframewidth
          ifrm.style.height = options.iframeheight
          document.getElementsByTagName("BODY")[0].appendChild(sdkForm)
          document.getElementsByTagName("BODY")[1].appendChild(ifrm)
        }


        if (typeof (options.onInitSucccess) === 'function') {
          options.onInitSucccess()
          if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification")
          }
          else {
            Notification
              .requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                  console.log("This browser support desktop notification and user has granted.")
                }
              })
          }
        } else if (typeof (options.onInitSuccess) === 'function') {
          var unread_count = parseInt(initParams.unread_feeds, 10)
          options.onInitSuccess()
          options.getUnreadMessageCount(unread_count)
          if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification")
          }
          else {
            Notification
              .requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                  console.log("This browser support desktop notification and user has granted.")
                }
              })
          }
        }
      } else if (http.readyState == 2 && http.status == 500) {
        // throw "access_token is not valid or base_url is not valid";
        var error_options = { code: '500', description: "access_token is not valid" }
        if (typeof (options.onInitFailure) === 'function') {
          options.onInitFailure(error_options)
        }
      } else if (http.readyState == 4 && (http.status == 0 || http.status == 404)) {
        // throw "access_token is not valid or base_url is not valid";
        var error_options = { code: '404', description: "base_url is not valid" }
        if (typeof (options.onInitFailure) === 'function') {
          options.onInitFailure(error_options)
        }
      }
    }
    http.send(params)

    window.addEventListener('message', function (e) {
      lastActiveTimeStamp = new Date().getTime()
      if (e.data !== 'undefined') {
        if (typeof e.data === 'string' || e.data instanceof String) {
          var eventData = JSON.parse(e.data)
        } else {
          var eventData = e.data
        }
        if ((typeof (eventData.action) !== 'undefined' && eventData.action !== 'ipcMessage' && eventData.action !== 'updated_binders' && eventData.action !== 'updated_binders_raw_data' && eventData.action !== 'feed_update_self' && eventData.action !== 'presence_updated')) {
          lastActiveTimeStamp = new Date().getTime()
        }
        if (typeof (eventData.action) !== 'undefined' && eventData.action === 'update_unread_feeds' && typeof (options.getUnreadMessageCount) === 'function') {
          options.getUnreadMessageCount(eventData.count)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_call_event') {
          options.onMeetRinger()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_product_repository') {
          options.onProductRepositoryAdd(eventData.binder_id)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_session_expired') {
          sessionStorage.removeItem("navPage")
          options.onSessionExpiry()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_2fa_event' && typeof (options.check2FAStatus) === 'function') {
          if (typeof (eventData.callback_info) !== 'undefined') {
            sessionStorage.setItem('binderId', eventData.binder_id)
            options.check2FAStatus(eventData.callback_info)
          } else {
            sessionStorage.setItem('requestId', eventData.request_id)
            sessionStorage.setItem('binderId', eventData.binder_id)
            requestId = eventData.request_id
            var data = JSON.stringify({ binder_id: eventData.binder_id, event_type: 'Document', request_id: eventData.request_id, event_details: '', request: eventData.request })
            options.check2FAStatus(data)
          }
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'start_transaction_execution') {
          sessionStorage.setItem('payload_configs', JSON.parse(eventData.event).payload_config)
          sessionStorage.setItem('status_update', JSON.parse(eventData.event).payload_status)
          if (typeof (options.start_transaction_execution) === 'function') {
            txn_event_data = JSON.parse(eventData.event)
            var document_options = {
              binder_id: txn_event_data.binder_data,
              transaction_file_id: txn_event_data.document_id,
              transaction_id: txn_event_data.core_txn_id,
              load_view: txn_event_data.load_view
            }
            var load_eventformdata = ({ "binder_data": txn_event_data.binder_data, "document_id": txn_event_data.document_id, "core_txn_id": txn_event_data.core_txn_id, "load_view": txn_event_data.load_view, "document_options": document_options })
            options.start_transaction_execution(load_eventformdata)
          } else {
            txn_event_data = JSON.parse(eventData.event)
            ifrm.contentWindow.postMessage({
              'action': 'mep_loadnormalview_tc',
              'txn_id': txn_event_data.txn_id
            }, "*")
          }
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'end_transaction_execution') {
          // options.end_transaction_execution();
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_customerview_onload' && typeof (options.onload) === 'function') {

          options.onload()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_onDeskstopClick') {
          var data = JSON.stringify({ binder_id: eventData.binder_id, request: eventData.request, folder_id: eventData.folder_id })
          options.onDeskstopClick(data)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'callEndedCallback') {
          options.callEndedCallback(eventData.meetId)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'onInstrOptionClick') {
          var unique_ids = eventData.unique_id
          var data = JSON.stringify({ unique_ids: unique_ids })
          options.onInstrOptionClick(data)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_signature_event') {
          options.onESignature(eventData.event)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_customerview_onload' && typeof (options.onload) === 'function') {
          options.onload()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'notificationAPI') {
          notificationAPI(eventData)
        }
      }
      //	e.stopImmediatePropagation();
    }, false)

  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = { code: '400', description: errorMessage }
    if (typeof (options.onInitFailure) === 'function') {
      options.onInitFailure(error_options)
    }
  }
}



Mep.getLastActiveTimestamp = function () {

  var xhttp = new XMLHttpRequest()
  var responseParams
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
      responseParams = JSON.parse(xhttp.responseText)
    }
  }
  var remoteServerURL = baseUrl + '/onGoingMeets'
  xhttp.open("POST", remoteServerURL, false)
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  xhttp.send("accessToken=" + accessToken + "&uniqueId=" + uniqueId)
  if (typeof (responseParams.result) !== "undefined" && responseParams.result == 'Y') {
    lastActiveTimeStamp = new Date().getTime()
  }

  return lastActiveTimeStamp
}

Mep.logout = function () {

  localStorage.removeItem("navPage")
  sessionStorage.setItem('logout', true)
  sessionStorage.removeItem("navPage")

  ifrm.contentWindow.postMessage({
    'action': 'logout',
    'result': 1
  }, "*")

  var xhttpLO = new XMLHttpRequest()
  var remoteServerURL = baseUrl + '/mepLogout'

  xhttpLO.open("POST", remoteServerURL, true)
  xhttpLO.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  xhttpLO.send("accessToken=" + accessToken + "&uniqueId=" + uniqueId + "&portal_type=" + portal_type)
  xhttpLO.onreadystatechange = function () {
    if (xhttpLO.readyState === XMLHttpRequest.DONE && xhttpLO.status === 200) {
      console.log("Mep logout completed")
    }
  }
  localStorage.removeItem("navPage")
  sessionStorage.removeItem('status_update')
  sessionStorage.removeItem('payload_configs')
  sessionStorage.removeItem('callback_info')
  if (document.getElementById("confirmModal") != null && document.getElementById("confirmModal") != undefined) {
    var confirmModalEle = document.getElementById("confirmModal")
    confirmModalEle.parentElement.removeChild(confirmModalEle)
    var overlayEle = document.getElementById("overlay")
    overlayEle.parentElement.removeChild(overlayEle)
  }
}

Mep.changeLanguage = function (locale) {

  if (typeof (locale) !== "undefined") {
    ifrm.contentWindow.postMessage({
      'action': 'mep_changelocale',
      'locale_code': locale,
      'base_url': baseUrl
    }, "*")
  }

}

Mep.loadDocumentView = function (options) {
  if (document.getElementById("confirmModal") != null && document.getElementById("confirmModal") != undefined) {
    var confirmModalEle = document.getElementById("confirmModal")
    confirmModalEle.parentElement.removeChild(confirmModalEle)
    var overlayEle = document.getElementById("overlay")
    overlayEle.parentElement.removeChild(overlayEle)
  }
  if (options.load_view == "form_view" || options.transaction_file_id == undefined) {
    var modalDiv = document.createElement('div')
    modalDiv.setAttribute("id", "confirmModal")
    modalDiv.setAttribute("style", "position: fixed; background-color:#fff; z-index: 9999; right:0; bottom:0; left: 0; top: 0; width: 75%; height: 92%; margin: auto; overflow-x: hidden; overflow-y:auto; box-shadow: 0 0 10px #ccc;border:1px solid #bcb3b3;padding:0 34px;")
    modalDiv.innerHTML = '<div id="transactionLoader" style="display:none;"><img src="' + txn_event_data.mep_base_url + '/img/demo_wait.gif" alt="loading..."></div><div id="terms1_panel" class="termsPagePanel"><div id="view_terms_1" class="termsFormat"></div></div><div id="viewFormDetails" style="display:none" class="termsPagePanel"><div id="txnClientdetails"></div></div><div id="terms2_panel" style="display:none" class="termsPagePanel"><div id="view_terms_2"></div></div><div id="btnPanel" style="box-sizing: border-box;  bottom:0; left:0;; text-align:center; width:100%;position:sticky"><div class="btn-panel"><input type="button" id="moxtra_back" onclick="javascript:moxtra_back()"  class="btn btn-primary cancel_terms" style="display:none;margin-right:20px;height: 35px;padding:5px 15px;border-radius:5px;border:1px solid #0062cc;background-color:#0062cc;color:#fff;" value="Back"><input type="button" id="moxtra_cancel" onclick="javascript:moxtra_cancel()" style="margin-right:20px;height: 35px;padding: 5px 15px;border: 1px solid #0062cc;background-color: #0062cc;color: #fff;border-radius: 5px;"  class="btn btn-primary cancel_terms" value="Cancel"><input type="button" id="moxtra_next"  onclick="javascript:moxtra_next()" class="btn btn-success" value="Next" disabled="" style="opacity:.5;height: 35px;display:none;padding:5px 15px;border-radius:5px;border:1px solid #28a745;background-color:#28a745;color:#fff;margin-right:20px;"><input type="button" id="moxtra_submit" onclick="javascript:moxtra_submit()"  class="btn btn-success" value="Confirm" disabled="" style="opacity:.5;display:none; margin-right:20px;height: 35px;padding:5px 15px;border-radius:5px;border:1px solid #28a745;background-color:#28a745;color:#fff"></div><input type="hidden" id="binder_id"><input type="hidden" id="txn_type_id"></div>'
    var overlayDiv = document.createElement('div')
    overlayDiv.setAttribute("id", "overlay")
    overlayDiv.setAttribute("style", "position: fixed; background-color:#ccc; z-index: 9998; right:0; bottom:0; left: 0; top: 0; width: 100%; height: 100%; opacity:0.9")
    document.body.appendChild(modalDiv)
    document.body.appendChild(overlayDiv)
    setTimeout(function () {


      var platform = txn_event_data.platform
      if (platform == 'web') {
        document.getElementById("moxtra_cancel").style.display = ''
      } else {
        document.getElementById("moxtra_cancel").style.display = 'none'
      }
      var confirm_text = txn_event_data.confirm_text
      if (confirm_text != '') {
        document.getElementById("moxtra_submit").value = confirm_text
      }
      var back_text = txn_event_data.back_text
      if (back_text != '') {
        document.getElementById("moxtra_back").value = back_text
      }
      var cancel_text = txn_event_data.cancel_text
      if (cancel_text != '') {
        document.getElementById("moxtra_cancel").value = cancel_text
      }
      var next_text = txn_event_data.next_text
      if (next_text != '') {
        document.getElementById("moxtra_next").value = next_text
      }

      var loaderDiv = document.createElement("div")
      loaderDiv.id = 'tc-loader'
      loaderDiv.innerHTML = "<img src='" + txn_event_data.mep_base_url + "/img/demo_wait.gif'>"
      document.body.appendChild(loaderDiv)

      var xhr
      try {
        xhr = new XMLHttpRequest()
      } catch (e) {
        try {
          xhr = new XDomainRequest()
        } catch (e) {
          try {
            xhr = new ActiveXObject('Msxml2.XMLHTTP')
          } catch (e) {
            try {
              xhr = new ActiveXObject('Microsoft.XMLHTTP')
            } catch (e) {
              statusField('\nYour browser is not' +
                ' compatible with XHR2')
            }
          }
        }
      }

      xhr.open('GET', txn_event_data.ext_base_url + '/transaction/' + txn_event_data.txn_id, true)
      xhr.setRequestHeader("Content-Type", "application/json")
      xhr.setRequestHeader("Authorization", "Bearer " + txn_event_data.access_token)
      xhr.setRequestHeader("uid", txn_event_data.unique_id)
      xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var jsonData = JSON.parse(this.responseText)

          document.getElementById("binder_id").value = jsonData.data.binder_id
          document.getElementById("txn_type_id").value = jsonData.data.txn_type_id
          var front_terms_conditions = ""

          if (jsonData.data.pre_tc != undefined && jsonData.data.pre_tc != "") {
            if (jsonData.data.pre_tc.content != "" && jsonData.data.pre_tc.content != undefined) {
              front_terms_conditions = jsonData.data.pre_tc.content
              if (jsonData.data.pre_tc.checkbox != "" && jsonData.data.pre_tc.checkbox != undefined) {
                var pre_tc_checkbox = jsonData.data.pre_tc.checkbox
                document.getElementById("view_terms_1").innerHTML = front_terms_conditions + pre_tc_checkbox
              } else {
                document.getElementById("view_terms_1").innerHTML = front_terms_conditions
              }
            } else {
              //	document.getElementById("terms1_panel").remove();
              var child1 = document.getElementById("terms1_panel")
              child1.parentNode.removeChild(child1)
            }
          } else {
            //document.getElementById("terms1_panel").remove();
            var child2 = document.getElementById("terms1_panel")
            child2.parentNode.removeChild(child2)
          }


          if (jsonData.data.post_tc != undefined && jsonData.data.post_tc != "") {
            if (jsonData.data.post_tc.content != "" && jsonData.data.post_tc.content != undefined) {
              var back_term_conditions = jsonData.data.post_tc.content
              if (jsonData.data.post_tc.checkbox != "" && jsonData.data.post_tc.checkbox != undefined) {
                var post_tc_checkbox = jsonData.data.post_tc.checkbox
                document.getElementById("view_terms_2").innerHTML = front_terms_conditions + post_tc_checkbox
              } else {
                document.getElementById("view_terms_2").innerHTML = front_terms_conditions
              }
            } else {
              //document.getElementById("terms2_panel").remove();
              var child4 = document.getElementById("terms2_panel")
              child4.parentNode.removeChild(child4)
            }
          } else {
            //document.getElementById("terms2_panel").remove();
            var child5 = document.getElementById("terms2_panel")
            child5.parentNode.removeChild(child5)
          }

          if (!document.getElementById("terms1_panel")) {
            document.getElementById("viewFormDetails").style.display = ''
            if (!(document.getElementById("terms1_panel")) && !(document.getElementById("terms2_panel"))) {
              document.getElementById("moxtra_submit").style.display = ''
            } else {
              document.getElementById("moxtra_next").style.display = ''
            }
          } else {
            document.getElementById("moxtra_next").style.display = ''
          }

          var div = "<div class='text-center txn-header'><h1>" + jsonData.data.txn_type_desc + "</h1> <span> " + jsonData.data.txn_id + "</span></div>"

          div += "<div class='details-panel'>";
          (jsonData.data.details.form_data).forEach(function (val, key) {
            var fieldVal = "-blank-"
            if (val.field_value != undefined) {
              if (val.field_value != "") {
                fieldVal = val.field_value
              } else {
                if (val.field_value.indexOf('checkbox') != -1) {
                  if (val.field_value.indexOf('checked') != -1) { fieldVal = "Checked" }
                  else { fieldVal = "Not Checked" }
                }
              }
            }
            var is_hide_to_customer = "N"
            if (val.is_hide_to_customer != undefined) {
              is_hide_to_customer = val.is_hide_to_customer
            }
            if (val.field_id != 'internalRemarks' && is_hide_to_customer != 'Y') {
              if (val.field_id == "myFile1" && val.field_label == "&nbsp;") {
                fieldVal = ""
                div += '<div class="form-group row textInput formCtrl" style="padding:0px;"></div>'
              } else {
                if (val.field_label != "") {
                  div += '<div class="form-group row textInput formCtrl">' +
                    '<label class="col-3 col-form-label" key="" id="' + val.field_id + '">' + val.field_label + '</label>' +
                    '<div class="col-9" style="line-height: 24px;">' + fieldVal.replace(/-br-/g, '<br>') + '</div>' +
                    '</div>'
                } else {
                  if (val.field_value != "") {
                    div += '<div class="form-group row textInput formCtrl">' +
                      '<label class="col-3 col-form-label" key="" id="' + val.field_id + '">' + val.field_label + '</label>' +
                      '<div class="col-9" style="line-height: 24px;">' + fieldVal.replace(/-br-/g, '<br>') + '</div>' +
                      '</div>'
                  }
                }
              }
            }



          })
          div += '</div>'
          div += '<div class="btn-footer p-2 text-center" id="transaction-details-btn-bar">'
          div += '<input type="button"  class="btn mx-btn detailsBtn transaction-status goToTerms1" disabled  value="Back"> '
          div += '<input type="button"  class="btn btn-success detailsBtn transaction-status goToTerms2"  value="Confirm">'
          div += '</div>'

          //document.getElementById("tc-loader").remove();
          var child3 = document.getElementById("tc-loader")
          child3.parentNode.removeChild(child3)

          var termDetailsElement = document.getElementById("txnClientdetails")
          termDetailsElement.innerHTML = termDetailsElement.innerHTML + div

          var xclass, i
          xclass = document.querySelectorAll(".col-form-label")
          for (i = 0; i < xclass.length; i++) {
            if (xclass[i].innerText == "Note: Minimum amount") {
              xclass[i].style.display = "none"
              xclass[i].nextElementSibling.style.display = 'none'
              xclass[i].parentElement.style.border = '0px'
            }
            if (xclass[i].innerText == "Internal Remarks" && jsonData.data.txn_type_id == "marathonSavingsAccount") {
              xclass[i].style.display = "none"
              xclass[i].nextElementSibling.style.display = 'none'
              xclass[i].parentElement.style.border = '0px'
            }
          }


        }
        else {
          document.getElementById("transactionLoader").style.display = 'none'
        }
      }
      xhr.send()

      var style = document.createElement('style')
      style.innerHTML = "#confirmModal{font-family:'Open Sans';}#txnClientdetails{font-family:'Open Sans',sans-serif;padding:10px 10px 24px 10px}h1,h2{font-size:22px;font-weight:600}#view_terms_2,.termsFormat{padding:10px}#view_terms_1,#view_terms_2{margin-bottom:50px}.termsFormat ol,.termsFormat ul{margin-left:30px}.termsFormat ol li,.termsFormat ul li{margin-bottom:10px}.btn-footer{position:fixed}.details-panel{border:1px solid #d9d9d9;border-radius:5px;margin-top:75px}.details-panel .form-group{padding:10px;border-bottom:1px solid #d9d9d9;margin:0;word-break:break-word}.col-form-label{color:#999;font-size:12px;padding:0}.txn-header{width:100%;background-color:#fff;top:0;padding:10px;left:0;z-index:999;text-align:center}#tc-loader{position:fixed;z-index:9999;top:0;left:0;right:0;bottom:0;height:35px;width:35px;margin:auto}#tc-loader img{width:100%}.form-group label{color:#999;font-size:12px;padding:0;flex:0 0 100%;max-width:100%;position:inherit}.btn-panel{width:100%;bottom:0;left:0;background-color:#f5f5f5;text-align:center;padding:10px;display:block}#terms2_panel,#terms1_panel,#view_terms_1,#view_terms_2{font-family:'Open Sans',sans-serif; line-height:24px;}"
      document.head.appendChild(style)

    }, 1000)


    setTimeout(function () {
      var scrollTop = document.getElementById('confirmModal').scrollTop
      var height = document.getElementById('confirmModal').clientHeight

      var confirmModal = document.getElementById('confirmModal')
      window.scrollTo(0, confirmModal.innerHeight)

      var nxt = document.getElementById("moxtra_next")
      var sbt = document.getElementById("moxtra_submit")
      var goToTerms2 = document.getElementsByClassName("goToTerms2")[0]
      if ((document.getElementById('confirmModal').scrollTop + document.getElementById('confirmModal').offsetHeight) >= (document.getElementById('confirmModal').scrollHeight)) {
        if (nxt.disabled && window.getComputedStyle(nxt).display !== "none") {
          if (document.getElementById('flexCheckDefault') == null) {
            nxt.disabled = false
            document.getElementById("moxtra_next").removeAttribute("disabled")
            document.getElementById("moxtra_next").style.opacity = "1"
          } else {
            if (document.getElementById('flexCheckDefault').checked) {
              nxt.disabled = false
              document.getElementById("moxtra_next").removeAttribute("disabled")
              document.getElementById("moxtra_next").style.opacity = "1"
            }
          }
        }
        if (sbt.disabled && window.getComputedStyle(sbt).display !== "none") {
          sbt.disabled = false
          document.getElementById("moxtra_submit").removeAttribute("disabled")
          document.getElementById("moxtra_submit").style.opacity = "1"
        }
        if (goToTerms2.disabled && window.getComputedStyle(goToTerms2).display !== "none") {
          goToTerms2.disabled = false
          document.getElementsByClassName("goToTerms2")[0].removeAttribute("disabled")
          document.getElementsByClassName("goToTerms2")[0].style.opacity = "1"
        }
      }
    }, 3000)
    document.getElementById('confirmModal').addEventListener('scroll', throttle(ScrollHandler, 10))
  } else {

    var total_moxtradoc = options.transaction_file_id.length
    var modalDiv = document.createElement('div')
    modalDiv.setAttribute("id", "confirmModal")
    modalDiv.setAttribute("style", "position: fixed; background-color:#fff; z-index: 9999; right:0; bottom:0; left: 0; top: 0; width: 75%; height: 84%; margin: auto; overflow-x: hidden; overflow-y:auto; box-shadow: 0 0 10px #ccc;border:1px solid #bcb3b3;")
    modalDiv.innerHTML = '<div style="width:100%; height:50px; text-align:center;padding:21px;font-weight:500;">Viewing Document <span id="current_doc">1</span> of <span id="total_doc">' + total_moxtradoc + '</span></div><div id="moxtradocumentview" style="height:94%;"></div><div id="btnPanel" style="box-sizing: border-box; position:absolute; bottom:0; left:0;; text-align:center; width:100%; padding: 10px;border:1px solid #bcb3b3;"><button id="cancel" style="padding: 5px 15px; border:1px solid #0062cc; background-color:#0062cc; color:#fff; border-radius:5px;" onclick="moxtracloseConfirmModal()">' + txn_event_data.cancel_text + '</button> <button id="moxtra_confirm" onclick="moxtraconfirmModal()" style=" padding: 5px 15px; border-radius:5px; border:1px solid #28a745; background-color:#28a745; color:#fff; opacity:0.5" disabled>' + txn_event_data.confirm_text + '</button> </div>'
    var overlayDiv = document.createElement('div')
    overlayDiv.setAttribute("id", "overlay")
    overlayDiv.setAttribute("style", "position: fixed; background-color:#ccc; z-index: 9998; right:0; bottom:0; left: 0; top: 0; width: 100%; height: 100%; opacity:0.9")
    document.body.appendChild(modalDiv)
    document.body.appendChild(overlayDiv)
    setTimeout(function () {
      mepconfirmbtn_enabled = false
      var in_options = {
        client_id: txn_event_data.client_id,
        org_id: txn_event_data.org_id,
        plugin_version: txn_event_data.plugin_version,
        sdk_version: txn_event_data.sdk_version,
        hideAccessTokenFromUrl: true,
        safe_url: true,
        mode: txn_event_data.mode,
        base_url: txn_event_data.base_url,
        access_token: globalAccessToken,
        invalid_token: function (result) {
        }
      }

      Moxtra.init(in_options)

      Moxtra.pageView({
        tagid4iframe: 'moxtradocumentview',
        binder_id: options.binder_id,
        transaction_files: options.transaction_file_id,
        transaction_id: options.transaction_id,
        hideAccessTokenFromUrl: true,
        iframe: true,
        border: false,
        iframewidth: "100%",
        iframeheight: "82%",
        view_binder_page: function (event) {
          if (event.page_id === 0) {
          }
          var names_arr = txn_event_data.document_file_id
          var current_doc_no = names_arr.indexOf(event.file_id) + 1
          document.getElementById("current_doc").innerHTML = current_doc_no
        },
        change_page: function (event) {
          if (event.current_index == (event.total_pages - 1)) {
            mepconfirmbtn_enabled = true
            //document.getElementById("moxtra_confirm").removeAttribute("disabled"); 
            //document.getElementById("moxtra_confirm").style.opacity = "1"; 
          } else {
            document.getElementById("moxtra_confirm").addAttribute("disabled")
            document.getElementById("moxtra_confirm").style.opacity = "0.5"
          }
        },
        pageview_scroll_to_bottom: function (event) {
          console.log("pageview_scroll_to_bottom triggered line no 679")
          if (mepconfirmbtn_enabled == true) {
            console.log("pageview_scroll_to_bottom triggered line no 681 accept button enabled")
            document.getElementById("moxtra_confirm").removeAttribute("disabled")
            document.getElementById("moxtra_confirm").style.opacity = "1"
          }
        }
      })
    }, 1000)

  }
}


Mep.mepPortalResize = function (options) {
  if (typeof (options.iframewidth) === "undefined") {
  }
  if (typeof (options.iframeheight) === "undefined") {
  }
  ifrm.style.width = options.iframewidth
  ifrm.style.height = options.iframeheight


}



Mep.portalResize = function (options) {
  if (typeof (options.iframewidth) === "undefined") {
  }
  if (typeof (options.iframeheight) === "undefined") {
  }
  ifrm.style.width = options.iframewidth
  ifrm.style.height = options.iframeheight

  if (options.iframewidth == "0px" || options.iframewidth == "0") {
    if (typeof (options.iframewidth) !== "undefined") {
      ifrm.contentWindow.postMessage({
        'action': 'mep_minimizechat'
      }, "*")
    }
    //$("#containerRenderID").attr("src", $("#containerRenderID").attr("src"));	    	  
  } else {
    if (typeof (options.iframewidth) !== "undefined") {
      ifrm.contentWindow.postMessage({
        'action': 'mep_maximizechat'
      }, "*")
    }
  }
}

Mep.minimize = function () {
  ifrm.contentWindow.postMessage({
    'action': 'mep_closechat'
  }, "*")
}

function get_browser () {
  var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || []
    return { name: 'IE', version: (tem[1] || '') }
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/)
    if (tem != null) { return { name: 'Opera', version: tem[1] } }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
  if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]) }
  return {
    name: M[0],
    version: M[1]
  }
}

Mep.init = function (options) {
  try {
    lastActiveTimeStamp = new Date().getTime()
    var initParams
    baseUrl = options.base_url
    accessToken = options.access_token

    if (typeof (options.iframe) !== "undefined" || options.iframe) {
      if (typeof (options.tagid4iframe) === "undefined") {
        throw "tagid4iframe is empty"
      }
    }
    if (options.iframe && document.getElementById(options.tagid4iframe) === null) {
      throw "tagid4iframe is not valid"
    }
    if (typeof (options.iframewidth) === "undefined") {
      options.iframewidth = '100%'
    }
    if (typeof (options.iframeheight) === "undefined") {
      options.iframeheight = '100%'
    }
    if (typeof (options.iframeheight) !== "undefined" && typeof options.onfailure === "function") {
      throw "onfailure is not valid function"
    }
    if (typeof (options.base_url) === "undefined" || options.base_url == '') {
      throw "base_url is mandatory"

    }

    if (typeof (options.access_token) === "undefined" || options.access_token == '') {
      throw "access_token is mandatory"

    }

    if (typeof (options.onInitFailure) !== "undefined" && typeof options.onInitFailure !== "function") {
      throw "onInitFailure is not valid function"
    }

    if (typeof (options.onInitSuccess) !== "undefined" && typeof options.onInitSuccess !== "function") {
      throw "onInitSuccess is not valid function"
    }

    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        initParams = JSON.parse(xhttp.responseText)
        if (initParams && typeof (initParams.unique_id) === "undefined") {
          throw "access_token is not valid or base_url is not valid"
        }
        if (typeof (options.onInitSuccess) === 'function') {
          uniqueId = initParams.unique_id
          supportbinderId = initParams.binder_id
          orgId = initParams.org_id
          options.onInitSuccess()
        }
      }
    }


    var remoteServerURL = options.base_url + '/initParams'
    xhttp.open("POST", remoteServerURL, true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send("accessToken=" + options.access_token + "&custSdkCall=false")


    window.addEventListener('message', function (e) {
      lastActiveTimeStamp = new Date().getTime()
      if (e.data !== 'undefined') {
        if (typeof e.data === 'string' || e.data instanceof String) {
          var eventData = JSON.parse(e.data)
        } else {
          var eventData = e.data
        }
        if (typeof (eventData.action) !== 'undefined' && eventData.action === 'callEndedCallback') {
          options.callEndedCallback(eventData.meetId)
        }
      }
    }, false)


  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = { code: '400', description: errorMessage }
    if (typeof (options.onInitFailure) === 'function') {
      options.onInitFailure(error_options)
    }
  }
}


Mep.supportChatView = function (options) {

  $("body").find("#containerRenderID").remove()
  if (typeof (options.iframe) !== "undefined" || options.iframe) {
    if (typeof (options.tagid4iframe) === "undefined") {
      throw "tagid4iframe is empty"
    }
  }
  if (options.iframe && document.getElementById(options.tagid4iframe) === null) {
    throw "tagid4iframe is not valid"
  }
  if (typeof (options.iframewidth) === "undefined") {
    options.iframewidth = '60%'
  }
  if (typeof (options.iframeheight) === "undefined") {
    options.iframeheight = '100%'
  }
  /*  var iframes = document.getElementById('container');
    for (var i = 0; i < iframes.length; i++) {
        iframes[i].parentNode.removeChild(iframes[i]);
    }*/

  var ifrm = document.createElement("iframe")
  ifrm.id = 'containerRenderID'
  ifrm.style.border = "0px"
  ifrm.setAttribute("allowfullscreen", true)
  ifrm.setAttribute("webkitallowfullscreen", true)
  ifrm.setAttribute("mozallowfullscreen", true)
  ifrm.setAttribute("oallowfullscreen", true)
  ifrm.setAttribute("msallowfullscreen", true)
  ifrm.src = baseUrl + '/mepCustTimeline?accessToken=' + accessToken + '&binderId=' + supportbinderId + '&requestType=Chat' + '&uniqueId=' + uniqueId[0] + '&orgId=' + orgId

  if (options.iframe) {
    ifrm.style.width = options.iframewidth
    ifrm.style.height = options.iframeheight
    document.getElementById(options.tagid4iframe).appendChild(ifrm)
  } else {
    ifrm.style.width = options.iframewidth
    ifrm.style.height = options.iframeheight
    document.getElementsByTagName("BODY")[0].appendChild(ifrm)
  }

}


Mep.supportCallView = function (options) {


  $("body").find("#containerRenderID").remove()
  if (typeof (options.iframe) !== "undefined" || options.iframe) {
    if (typeof (options.tagid4iframe) === "undefined") {
      throw "tagid4iframe is empty"
    }
  }
  if (options.iframe && document.getElementById(options.tagid4iframe) === null) {
    throw "tagid4iframe is not valid"
  }
  if (typeof (options.iframewidth) === "undefined") {
    options.iframewidth = '60%'
  }
  if (typeof (options.iframeheight) === "undefined") {
    options.iframeheight = '100%'
  }
  var ifrm = document.createElement("iframe")
  ifrm.id = 'containerRenderID'
  ifrm.style.border = "0px"
  ifrm.setAttribute("allowfullscreen", true)
  ifrm.setAttribute("webkitallowfullscreen", true)
  ifrm.setAttribute("mozallowfullscreen", true)
  ifrm.setAttribute("oallowfullscreen", true)
  ifrm.setAttribute("msallowfullscreen", true)

  ifrm.src = baseUrl + '/mepCustTimeline?accessToken=' + accessToken + '&binderId=' + supportbinderId + '&requestType=Call' + '&uniqueId=' + uniqueId[0] + '&orgId=' + orgId

  if (options.tagid4iframe) {
    ifrm.style.width = options.iframewidth
    ifrm.style.height = options.iframeheight
    document.getElementById(options.tagid4iframe).appendChild(ifrm)
  } else {
    ifrm.style.width = options.iframewidth
    ifrm.style.height = options.iframeheight
    document.getElementsByTagName("BODY")[0].appendChild(ifrm)
  }

}

Mep.sdkportal = function (options) {
  try {
    lastActiveTimeStamp = new Date().getTime()
    var initParams
    baseUrl = options.base_url
    accessToken = options.access_token
    if (typeof (options.iframe) !== "undefined" || options.iframe) {
      if (typeof (options.tagid4iframe) === "undefined") {
        throw "tagid4iframe is empty"
      }
    }
    if (options.iframe && document.getElementById(options.tagid4iframe) === null) {
      throw "tagid4iframe is not valid"
    }
    if (typeof (options.iframewidth) === "undefined") {
      options.iframewidth = '100%'
    }
    if (typeof (options.iframeheight) === "undefined") {
      options.iframeheight = '100%'
    }
    if (typeof (options.iframeheight) !== "undefined" && typeof options.onfailure === "function") {
      throw "onfailure is not valid function"
    }

    var http = new XMLHttpRequest()
    var url = options.base_url + '/initCustParams'
    var params = 'accessToken=' + options.access_token
    globalAccessToken = options.access_token
    http.open('POST', options.base_url + '/initCustParams', true)

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

    http.onreadystatechange = function () {//Call a function when the state changes.
      if (http.readyState == 4 && http.status == 200) {
        initParams = JSON.parse(http.responseText)

        if (typeof (initParams.unique_id) === "undefined") {
          // throw "access_token is not valid or base_url is not valid"; 
          var error_options = { code: '400', description: "access_token is not valid or base_url is not valid" }
          if (typeof (options.onInitFailure) === 'function') {
            options.onInitFailure(error_options)
          }
        }
        uniqueId = initParams.unique_id

        ifrm = document.createElement("iframe")
        ifrm.id = 'containerRenderID'
        ifrm.style.border = "0px"
        ifrm.setAttribute("allowfullscreen", true)
        ifrm.setAttribute("webkitallowfullscreen", true)
        ifrm.setAttribute("mozallowfullscreen", true)
        ifrm.setAttribute("oallowfullscreen", true)
        ifrm.setAttribute("msallowfullscreen", true)

        var origin
        if (location.origin == null || !(location.origin) || location.origin == 'null') {
          origin = location.protocol + "//" + location.host + (location.port ? ':' + location.port : '')
        } else {
          origin = location.origin
        }
        var twoFaStatus
        if (typeof (options.is2FaStatus) !== "undefined" && options.is2FaStatus) {
          twoFaStatus = 'Y'
        } else {
          twoFaStatus = 'Y'
        }
        if (typeof (options.isRefresh) !== "undefined") {
          isRefresh = options.isRefresh

          if (isRefresh == true) {
            $("body").find("iframe").remove()
          }
        }
        var browserDetails = get_browser()
        var browserName = browserDetails["name"]
        var browserVersion = browserDetails["version"]
        encryptData(options.access_token, initParams.unique_id)
        ifrm.src = options.base_url + '/mepCustomerInfo?accessToken=' + encrpt_access_token + '&uniqueId=' + encrpt_uniqueId + '&localeCode=' + options.locale_code + '&orgId=' + initParams.org_id + '&twofaStatus=' + twoFaStatus + '&isRefresh=' + isRefresh + '&core_lang_code=' + initParams.core_language_code + '&browserName=' + browserName + '&browserVersion=' + browserVersion
        if (options.iframe) {
          ifrm.style.width = options.iframewidth
          ifrm.style.height = options.iframeheight
          document.getElementById(options.tagid4iframe).appendChild(ifrm)
        } else {
          ifrm.style.width = options.iframewidth
          ifrm.style.height = options.iframeheight
          document.getElementsByTagName("BODY")[0].appendChild(ifrm)
        }
        if (typeof (options.onInitSuccess) === 'function') {
          orgId = initParams.org_id
          options.onInitSuccess()
          if (typeof (options.getUnreadMessageCount) === 'function') {
            options.getUnreadMessageCount(initParams.unread_feeds)
          }
        }
      } else if (http.readyState == 2 && http.status == 500) {
        // throw "access_token is not valid or base_url is not valid";
        var error_options = { code: '500', description: "access_token is not valid" }
        if (typeof (options.onInitFailure) === 'function') {
          options.onInitFailure(error_options)
        }
      } else if (http.readyState == 4 && (http.status == 0 || http.status == 404)) {
        // throw "access_token is not valid or base_url is not valid";
        var error_options = { code: '404', description: "base_url is not valid" }
        if (typeof (options.onInitFailure) === 'function') {
          options.onInitFailure(error_options)
        }
      }
    }
    http.send(params)


    window.addEventListener('message', function (e) {
      lastActiveTimeStamp = new Date().getTime()
      if (e.data !== 'undefined') {
        if (typeof e.data === 'string' || e.data instanceof String) {
          var eventData = JSON.parse(e.data)
        } else {
          var eventData = e.data
        }
        if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_2fa_event' && typeof (options.check2FAStatus) === 'function') {
          /* if (typeof(eventData.event_type) !== 'undefined' && eventData.event_type ==='confirm_transaction' ){
          sessionStorage.setItem('binderId', eventData.binder_id);
          var txn_id = eventData.request_id;
          var binderId = eventData.binder_id;
          var txn_status = eventData.txn_status;
          var btn_id = eventData.btn_id;
          var event_type = eventData.event_type;
           var data=JSON.stringify({binder_id:binderId, event_type :event_type,request_id :txn_id,event_details:{btn_id:btn_id}});
           options.check2FAStatus(data);
        }else{
        sessionStorage.setItem('requestId', eventData.request_id);
        sessionStorage.setItem('binderId', eventData.binder_id);
        requestId = eventData.request_id;
        var data=JSON.stringify({binder_id:eventData.binder_id, event_type :eventData.event_type,request_id :eventData.request_id,event_details:''});
        options.check2FAStatus(data);
        }	*/
          options.check2FAStatus(eventData)
          //set2FAStatus(eventData);
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_session_expired') {
          sessionStorage.removeItem("navPage")
          options.onSessionExpiry()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'update_unread_feeds' && typeof (options.getUnreadMessageCount) === 'function') {
          options.getUnreadMessageCount(eventData.count)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'end_transaction_execution') {
          //options.end_transaction_execution();
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_customerview_onload' && typeof (options.onload) === 'function') {
          options.onload()
        }
      }
      // e.stopImmediatePropagation();
    }, false)

  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = { code: '400', description: errorMessage }
    if (typeof (options.onInitFailure) === 'function') {
      options.onInitFailure(error_options)
    }
  }
}


Mep.getCustomerAccessToken = function (options) {

  try {
    if (typeof (options.uniqueid) == "undefined" && !(typeof options.uniqueid === "string")) {
      throw "uniqueid is mandatory"
    }
    if (typeof (options.client_id) !== "undefined" && !(typeof options.client_id === "string")) {
      throw "client_id is mandatory"
    }
    if (typeof (options.orgid) !== "undefined" && !(typeof options.orgid === "string")) {
      throw "orgid is mandatory"
    }
    if (typeof (options.app_id) !== "undefined" && !(typeof options.app_id === "string")) {
      throw "app_id is mandatory"
    }
    if (typeof (options.mep_base_url) !== "undefined" && !(typeof options.mep_base_url === "string")) {
      throw "mep_base_url is mandatory"
    }

    var xhttp = new XMLHttpRequest()
    var accessToken
    var responseParams
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        responseParams = JSON.parse(xhttp.responseText)
      }
    }
    var remoteServerURL = options.mep_base_url + '/auth/custoken'
    xhttp.open("POST", remoteServerURL, false)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(options))
    if (typeof (responseParams.access_token) !== "undefined") {
      accessToken = responseParams.access_token
    } else {
      throw "Given not params are valid to generate access token"
    }

  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = { code: '400', description: errorMessage }
    if (typeof (options.onInitFailure) === 'function') {
      options.Failure(error_options)
    }
  }
  return accessToken
}

Mep.getCustomerAccessToken = function (options) {

  try {
    if (typeof (options.uniqueid) == "undefined" && !(typeof options.uniqueid === "string")) {
      throw "uniqueid is mandatory"
    }
    if (typeof (options.client_id) !== "undefined" && !(typeof options.client_id === "string")) {
      throw "client_id is mandatory"
    }
    if (typeof (options.orgid) !== "undefined" && !(typeof options.orgid === "string")) {
      throw "orgid is mandatory"
    }
    if (typeof (options.app_id) !== "undefined" && !(typeof options.app_id === "string")) {
      throw "app_id is mandatory"
    }
    if (typeof (options.mep_base_url) !== "undefined" && !(typeof options.mep_base_url === "string")) {
      throw "mep_base_url is mandatory"
    }

    var xhttp = new XMLHttpRequest()
    var accessToken
    var responseParams
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        responseParams = JSON.parse(xhttp.responseText)
      }
    }
    var remoteServerURL = options.mep_base_url + '/auth/custoken'
    xhttp.open("POST", remoteServerURL, false)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(options))
    if (typeof (responseParams.access_token) !== "undefined") {
      accessToken = responseParams.access_token
    } else {
      throw "Given not params are valid to generate access token"
    }

  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = { code: '400', description: errorMessage }
    if (typeof (options.onInitFailure) === 'function') {
      options.Failure(error_options)
    }
  }
  return accessToken
}

Mep.getAccessToken = function (options) {

  try {
    if (typeof (options.uniqueid) == "undefined" && !(typeof options.uniqueid === "string")) {
      throw "uniqueid is mandatory"
    }
    if (typeof (options.client_id) !== "undefined" && !(typeof options.client_id === "string")) {
      throw "client_id is mandatory"
    }
    if (typeof (options.client_secret) !== "undefined" && !(typeof options.client_secret === "string")) {
      throw "client_secret is mandatory"
    }
    if (typeof (options.orgid) !== "undefined" && !(typeof options.orgid === "string")) {
      throw "orgid is mandatory"
    }
    if (typeof (options.app_id) !== "undefined" && !(typeof options.app_id === "string")) {
      throw "app_id is mandatory"
    }
    if (typeof (options.mep_base_url) !== "undefined" && !(typeof options.mep_base_url === "string")) {
      throw "mep_base_url is mandatory"
    }

    var xhttp = new XMLHttpRequest()
    var accessToken
    var responseParams
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        responseParams = JSON.parse(xhttp.responseText)
      }
    }
    var remoteServerURL = options.mep_base_url + '/core/oauth/token'
    xhttp.open("POST", remoteServerURL, false)
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(options))
    if (typeof (responseParams.access_token) !== "undefined") {
      accessToken = responseParams.access_token
    } else {
      throw "Given not params are valid to generate access token"
    }

    var responseParamsURC
    var remoteServerURLURC = options.mep_base_url + '/core/me/unreadfeeds?version=0'
    var xhttpUR = new XMLHttpRequest()
    xhttpUR.onreadystatechange = function () {
      if (xhttpUR.readyState === XMLHttpRequest.DONE && xhttpUR.status === 200) {
        responseParamsURC = JSON.parse(xhttpUR.responseText)
      }
    }
    var unreadCnt
    xhttpUR.open("GET", remoteServerURLURC, false)
    xhttpUR.setRequestHeader("Content-type", "application/json")
    xhttpUR.setRequestHeader("Authorization", "Bearer " + accessToken)
    xhttpUR.setRequestHeader("uid", options.uniqueid)
    xhttpUR.send()
    if (typeof (responseParamsURC.data) !== "undefined" && typeof (responseParamsURC.data.unread_feeds) !== "undefined") {
      unreadCnt = responseParamsURC.data.unread_feeds
    } else {
      throw "Given params are valid to getnerate unread read count"
    }

  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = { code: '400', description: errorMessage }
    if (typeof (options.onInitFailure) === 'function') {
      options.Failure(error_options)
    }
  }
  return { access_token: accessToken, unread_feeds: unreadCnt }
}

var isRefresh = ""
Mep.showCustomerView = function (options) {
  try {
    lastActiveTimeStamp = new Date().getTime()
    var initParams
    baseUrl = options.base_url
    accessToken = options.access_token
    portal_type = "CUSTOMER_JSSDK"
    if (typeof (options.iframe) !== "undefined" || options.iframe) {
      if (typeof (options.tagid4iframe) === "undefined") {
        throw "tagid4iframe is empty"
      }
    }
    if (options.iframe && document.getElementById(options.tagid4iframe) === null) {
      throw "tagid4iframe is not valid"
    }
    if (typeof (options.iframewidth) === "undefined") {
      options.iframewidth = '100%'
    }
    if (typeof (options.iframeheight) === "undefined") {
      options.iframeheight = '100%'
    }
    if (typeof (options.iframeheight) !== "undefined" && typeof options.onfailure === "function") {
      throw "onfailure is not valid function"
    }

    var http = new XMLHttpRequest()
    var url = options.base_url + '/initCustParams'
    var params = 'accessToken=' + options.access_token + '&portal_type=' + portal_type
    globalAccessToken = options.access_token
    http.open('POST', options.base_url + '/initCustParams', true)

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

    http.onreadystatechange = function () {//Call a function when the state changes.
      if (http.readyState == 4 && http.status == 200) {
        initParams = JSON.parse(http.responseText)

        if (typeof (initParams.unique_id) === "undefined") {
          // throw "access_token is not valid or base_url is not valid"; 
          var error_options = { code: '400', description: "access_token is not valid or base_url is not valid" }
          if (typeof (options.onInitFailure) === 'function') {
            options.onInitFailure(error_options)
          }
        }
        uniqueId = initParams.unique_id
        var origin
        if (location.origin == null || !(location.origin) || location.origin == 'null') {
          origin = location.protocol + "//" + location.host + (location.port ? ':' + location.port : '')
        } else {
          origin = location.origin
        }
        var twoFaStatus
        if (typeof (options.is2FaStatus) !== "undefined" && options.is2FaStatus) {
          twoFaStatus = 'Y'
        } else {
          twoFaStatus = 'Y'
        }
        var isRefresh
        if (typeof (options.isRefresh) !== "undefined") {
          isRefresh = options.isRefresh

          if (isRefresh == true) {
            $("body").find("iframe").remove()
          }
        }
        var locale_code
        if (typeof (options.locale_code) !== "undefined") {
          locale_code = options.locale_code
        } else {
          locale_code = "en"
        }
        var browserDetails = get_browser()
        var browserName = browserDetails["name"]
        var browserVersion = browserDetails["version"]

        ifrm = document.createElement("iframe")

        var sdkForm = document.createElement("form")
        var sdkSubmit = document.createElement("input")

        sdkForm.method = 'post'
        sdkForm.target = 'sdk_iframe'
        sdkSubmit.type = 'submit'

        sdkForm.action = options.base_url + '/mepCustomerTimeline'

        var hiddenIframe = document.createElement("input")
        hiddenIframe.setAttribute("type", "hidden")
        var hiddenIframe1 = document.createElement("input")
        hiddenIframe1.setAttribute("type", "hidden")
        var hiddenIframe2 = document.createElement("input")
        hiddenIframe2.setAttribute("type", "hidden")
        var hiddenIframe3 = document.createElement("input")
        hiddenIframe3.setAttribute("type", "hidden")
        var hiddenIframe4 = document.createElement("input")
        hiddenIframe4.setAttribute("type", "hidden")
        var hiddenIframe5 = document.createElement("input")
        hiddenIframe5.setAttribute("type", "hidden")
        var hiddenIframe6 = document.createElement("input")
        hiddenIframe6.setAttribute("type", "hidden")
        var hiddenIframe7 = document.createElement("input")
        hiddenIframe7.setAttribute("type", "hidden")
        var hiddenIframe8 = document.createElement("input")
        hiddenIframe8.setAttribute("type", "hidden")
        var hiddenIframe9 = document.createElement("input")
        hiddenIframe9.setAttribute("type", "hidden")

        hiddenIframe.setAttribute("name", "accessToken")
        hiddenIframe.setAttribute("value", initParams.data[0])
        hiddenIframe1.setAttribute("name", "localeCode")
        hiddenIframe1.setAttribute("value", locale_code)
        hiddenIframe2.setAttribute("name", "orgId")
        hiddenIframe2.setAttribute("value", initParams.org_id)
        hiddenIframe3.setAttribute("name", "twofaStatus")
        hiddenIframe3.setAttribute("value", twoFaStatus)
        hiddenIframe4.setAttribute("name", "isRefresh")
        hiddenIframe4.setAttribute("value", isRefresh)
        hiddenIframe5.setAttribute("name", "core_lang_code")
        hiddenIframe5.setAttribute("value", initParams.core_language_code)
        hiddenIframe6.setAttribute("name", "core_timezone")
        hiddenIframe6.setAttribute("value", initParams.core_timezone)
        hiddenIframe7.setAttribute("name", "browserName")
        hiddenIframe7.setAttribute("value", browserName)
        hiddenIframe8.setAttribute("name", "browserVersion")
        hiddenIframe8.setAttribute("value", browserVersion)
        hiddenIframe9.setAttribute("name", "origin")
        hiddenIframe9.setAttribute("value", origin)
        sdkForm.appendChild(hiddenIframe); sdkForm.appendChild(hiddenIframe1); sdkForm.appendChild(hiddenIframe2); sdkForm.appendChild(hiddenIframe3); sdkForm.appendChild(hiddenIframe4); sdkForm.appendChild(hiddenIframe5); sdkForm.appendChild(hiddenIframe6)
        sdkForm.appendChild(hiddenIframe7); sdkForm.appendChild(hiddenIframe8); sdkForm.appendChild(hiddenIframe9)
        sdkForm.appendChild(sdkSubmit)

        ifrm.id = 'containerRenderID'
        ifrm.name = 'sdk_iframe'
        ifrm.style.border = "0px"
        ifrm.setAttribute("allowfullscreen", true)
        ifrm.setAttribute("webkitallowfullscreen", true)
        ifrm.setAttribute("mozallowfullscreen", true)
        ifrm.setAttribute("oallowfullscreen", true)
        ifrm.setAttribute("msallowfullscreen", true)

        ifrm.src = '#'
        if (options.iframe) {
          ifrm.style.width = options.iframewidth
          ifrm.style.height = options.iframeheight
          document.getElementById(options.tagid4iframe).appendChild(sdkForm)
          document.getElementById(options.tagid4iframe).appendChild(ifrm)
          sdkForm.submit()
          //sdkForm.remove();
          sdkForm.parentNode.removeChild(sdkForm)
        } else {
          ifrm.style.width = options.iframewidth
          ifrm.style.height = options.iframeheight
          document.getElementsByTagName("BODY")[0].appendChild(sdkForm)
          document.getElementsByTagName("BODY")[1].appendChild(ifrm)
        }
        if (typeof (options.onInitSuccess) === 'function') {
          orgId = initParams.org_id
          options.onInitSuccess()
          if (typeof (options.getUnreadMessageCount) === 'function') {
            options.getUnreadMessageCount(initParams.unread_feeds)
          }
          if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification")
          }
          else {
            Notification
              .requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                  console.log("This browser support desktop notification and user has granted.")
                }
              })
          }
        }
      } else if (http.readyState == 2 && http.status == 500) {
        // throw "access_token is not valid or base_url is not valid";
        var error_options = { code: '500', description: "access_token is not valid" }
        if (typeof (options.onInitFailure) === 'function') {
          options.onInitFailure(error_options)
        }
      } else if (http.readyState == 4 && (http.status == 0 || http.status == 404)) {
        // throw "access_token is not valid or base_url is not valid";
        var error_options = { code: '404', description: "base_url is not valid" }
        if (typeof (options.onInitFailure) === 'function') {
          options.onInitFailure(error_options)
        }
      }
    }
    http.send(params)


    window.addEventListener('message', function (e) {
      lastActiveTimeStamp = new Date().getTime()
      if (e.data !== 'undefined') {
        if (typeof e.data === 'string' || e.data instanceof String) {
          var eventData = JSON.parse(e.data)
        } else {
          var eventData = e.data
        }
        if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_2fa_event' && typeof (options.check2FAStatus) === 'function') {
          /* if (typeof(eventData.event_type) !== 'undefined' && eventData.event_type ==='confirm_transaction' ){
          sessionStorage.setItem('binderId', eventData.binder_id);
          var txn_id = eventData.request_id;
          var binderId = eventData.binder_id;
          var txn_status = eventData.txn_status;
          var btn_id = eventData.btn_id;
          var event_type = eventData.event_type;
           var data=JSON.stringify({binder_id:binderId, event_type :event_type,request_id :txn_id,event_details:{btn_id:btn_id}});
           options.check2FAStatus(data);
        }else{
        sessionStorage.setItem('requestId', eventData.request_id);
        sessionStorage.setItem('binderId', eventData.binder_id);
        requestId = eventData.request_id;
        var data=JSON.stringify({binder_id:eventData.binder_id, event_type :eventData.event_type,request_id :eventData.request_id,event_details:''});
        options.check2FAStatus(data);
        }	*/
          options.check2FAStatus(JSON.parse(eventData.callback_info))
          //set2FAStatus(eventData);
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_session_expired') {

          if (document.getElementById("confirmModal") != null && document.getElementById("confirmModal") != undefined) {
            var confirmModalEle = document.getElementById("confirmModal")
            confirmModalEle.parentElement.removeChild(confirmModalEle)
            var overlayEle = document.getElementById("overlay")
            overlayEle.parentElement.removeChild(overlayEle)
          }
          sessionStorage.removeItem("navPage")
          options.onSessionExpiry()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'update_unread_feeds' && typeof (options.getUnreadMessageCount) === 'function') {
          options.getUnreadMessageCount(eventData.count)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'start_transaction_execution') {
          sessionStorage.setItem('payload_configs', JSON.parse(eventData.event).payload_config)
          sessionStorage.setItem('status_update', JSON.parse(eventData.event).payload_status)
          if (typeof (options.start_transaction_execution) === 'function') {
            txn_event_data = JSON.parse(eventData.event)
            var document_options = {
              binder_id: txn_event_data.binder_data,
              transaction_file_id: txn_event_data.document_id,
              transaction_id: txn_event_data.core_txn_id,
              load_view: txn_event_data.load_view
            }
            var load_eventformdata = ({ "binder_data": txn_event_data.binder_data, "document_id": txn_event_data.document_id, "core_txn_id": txn_event_data.core_txn_id, "load_view": txn_event_data.load_view, "document_options": document_options })
            options.start_transaction_execution(load_eventformdata)
          } else {
            txn_event_data = JSON.parse(eventData.event)
            ifrm.contentWindow.postMessage({
              'action': 'mep_loadnormalview_tc',
              'txn_id': txn_event_data.txn_id
            }, "*")
          }
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'end_transaction_execution') {
          // options.end_transaction_execution();
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_customerview_onload' && typeof (options.onload) === 'function') {
          options.onload()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'notificationAPI') {
          notificationAPI(eventData)
        }
      }
      // e.stopImmediatePropagation();
    }, false)

  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = { code: '400', description: errorMessage }
    if (typeof (options.onInitFailure) === 'function') {
      options.onInitFailure(error_options)
    }
  }
}
Mep.set2FAStatus = function (data, isSuccessFul) {
  var isPassed = true
  if (typeof isSuccessFul !== "undefined") {
    isPassed = isSuccessFul
  }
  var status = false
  if (typeof data !== "undefined") {
    if (data == true) {
      status = true
    }
  }


  if (typeof data === 'string' || data instanceof String) {
    // var mepdata=JSON.parse(data);	
    var data = JSON.parse(data)
  }
  if (!status && data && typeof (data.request_id) !== 'undefined' && typeof (data.binder_id) !== 'undefined' && typeof (data.event_type) !== 'undefined') {
    ifrm.contentWindow.postMessage({
      'action': 'mep_2fa_response',
      'request_id': data.request_id,
      'binder_id': data.binder_id,
      'event_type': data.event_type,
      'is_passed': isPassed
    }, "*")
  } else if (status && typeof (sessionStorage['binderId']) !== 'undefined') {
    ifrm.contentWindow.postMessage({
      'action': 'mep_2fa_response',
      'request_id': sessionStorage.getItem('requestId'),
      'binder_id': sessionStorage.getItem('binderId')
    }, "*")
    sessionStorage.removeItem('requestId')
    sessionStorage.removeItem('binderId')
  }
}

/*  Mep.isRefresh = function(data) {
    if(typeof(data.refresh_type) !== 'undefined'){
       ifrm.contentWindow.postMessage({
        'action': 'mep_refresh_page',
        'refresh_type':data.refresh_type
        }, "*");
      }  
  }	 */

// SCB Private 
Mep.showCustomerChat = function (options) {
  try {
    lastActiveTimeStamp = new Date().getTime()
    var initParams
    baseUrl = options.base_url
    accessToken = options.access_token
    portal_type = "CUSTOMER_JSSDK"
    if (typeof (options.iframe) !== "undefined" || options.iframe) {
      if (typeof (options.tagid4iframe) === "undefined") {
        throw "tagid4iframe is empty"
      }
    }
    if (options.iframe && document.getElementById(options.tagid4iframe) === null) {
      throw "tagid4iframe is not valid"
    }
    if (typeof (options.iframewidth) === "undefined") {
      options.iframewidth = '100%'
    }
    if (typeof (options.iframeheight) === "undefined") {
      options.iframeheight = '100%'
    }
    if (typeof (options.iframeheight) !== "undefined" && typeof options.onfailure === "function") {
      throw "onfailure is not valid function"
    }

    var http = new XMLHttpRequest()
    var url = options.base_url + '/initCustParams'
    var params = 'accessToken=' + options.access_token + "&portal_type=" + portal_type
    http.open('POST', options.base_url + '/initCustParams', true)

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

    http.onreadystatechange = function () {//Call a function when the state changes.
      if (http.readyState == 4 && http.status == 200) {
        initParams = JSON.parse(http.responseText)
        if (typeof (initParams.unique_id) === "undefined") {
          // throw "access_token is not valid or base_url is not valid";
          var error_options = { code: '400', description: "access_token is not valid or base_url is not valid" }
          if (typeof (options.onInitFailure) === 'function') {
            options.onInitFailure(error_options)
          }
        }
        uniqueId = initParams.unique_id
        var origin
        if (location.origin == null || !(location.origin) || location.origin == 'null') {
          origin = location.protocol + "//" + location.host + (location.port ? ':' + location.port : '')
        } else {
          origin = location.origin
        }
        var twoFaStatus
        if (typeof (options.is2FaStatus) !== "undefined" && options.is2FaStatus) {
          twoFaStatus = 'Y'
        } else {
          twoFaStatus = 'Y'
        }
        var isRefresh
        if (typeof (options.isRefresh) !== "undefined") {
          isRefresh = options.isRefresh

          if (isRefresh == true) {
            $("body").find("iframe").remove()
          }
        }
        var locale_code
        if (typeof (options.locale_code) !== "undefined") {
          locale_code = options.locale_code
        } else {
          locale_code = "en"
        }
        if (options.iframewidth == 0 || options.iframewidth == "0" || options.iframewidth == "0px") {
          var chatiframewidth = false
        } else {
          var chatiframewidth = true
        }

        var browserDetails = get_browser()
        var browserName = browserDetails["name"]
        var browserVersion = browserDetails["version"]


        ifrm = document.createElement("iframe")

        var sdkForm = document.createElement("form")
        var sdkSubmit = document.createElement("input")

        sdkForm.method = 'post'
        sdkForm.target = 'sdk_iframe'
        sdkSubmit.type = 'submit'

        sdkForm.action = options.base_url + '/mepCustomerChat'

        var hiddenIframe = document.createElement("input")
        hiddenIframe.setAttribute("type", "hidden")
        var hiddenIframe1 = document.createElement("input")
        hiddenIframe1.setAttribute("type", "hidden")
        var hiddenIframe2 = document.createElement("input")
        hiddenIframe2.setAttribute("type", "hidden")
        var hiddenIframe3 = document.createElement("input")
        hiddenIframe3.setAttribute("type", "hidden")
        var hiddenIframe4 = document.createElement("input")
        hiddenIframe4.setAttribute("type", "hidden")
        var hiddenIframe5 = document.createElement("input")
        hiddenIframe5.setAttribute("type", "hidden")
        var hiddenIframe6 = document.createElement("input")
        hiddenIframe6.setAttribute("type", "hidden")
        var hiddenIframe7 = document.createElement("input")
        hiddenIframe7.setAttribute("type", "hidden")
        var hiddenIframe8 = document.createElement("input")
        hiddenIframe8.setAttribute("type", "hidden")
        var hiddenIframe9 = document.createElement("input")
        hiddenIframe9.setAttribute("type", "hidden")
        var hiddenIframe10 = document.createElement("input")
        hiddenIframe10.setAttribute("type", "hidden")

        hiddenIframe.setAttribute("name", "accessToken")
        hiddenIframe.setAttribute("value", initParams.data[0])
        hiddenIframe1.setAttribute("name", "localeCode")
        hiddenIframe1.setAttribute("value", locale_code)
        hiddenIframe2.setAttribute("name", "orgId")
        hiddenIframe2.setAttribute("value", initParams.org_id)
        hiddenIframe3.setAttribute("name", "twofaStatus")
        hiddenIframe3.setAttribute("value", twoFaStatus)
        hiddenIframe4.setAttribute("name", "isRefresh")
        hiddenIframe4.setAttribute("value", isRefresh)
        hiddenIframe5.setAttribute("name", "core_lang_code")
        hiddenIframe5.setAttribute("value", initParams.core_language_code)
        hiddenIframe6.setAttribute("name", "core_timezone")
        hiddenIframe6.setAttribute("value", initParams.core_timezone)
        hiddenIframe7.setAttribute("name", "browserName")
        hiddenIframe7.setAttribute("value", browserName)
        hiddenIframe8.setAttribute("name", "browserVersion")
        hiddenIframe8.setAttribute("value", browserVersion)
        hiddenIframe9.setAttribute("name", "origin")
        hiddenIframe9.setAttribute("value", origin)
        hiddenIframe10.setAttribute("name", "chatiframewidth")
        hiddenIframe10.setAttribute("value", chatiframewidth)
        sdkForm.appendChild(hiddenIframe); sdkForm.appendChild(hiddenIframe1); sdkForm.appendChild(hiddenIframe2); sdkForm.appendChild(hiddenIframe3); sdkForm.appendChild(hiddenIframe4); sdkForm.appendChild(hiddenIframe5); sdkForm.appendChild(hiddenIframe6)
        sdkForm.appendChild(hiddenIframe7); sdkForm.appendChild(hiddenIframe8); sdkForm.appendChild(hiddenIframe9); sdkForm.appendChild(hiddenIframe10)
        sdkForm.appendChild(sdkSubmit)

        ifrm.id = 'containerRenderID'
        ifrm.name = 'sdk_iframe'
        ifrm.style.border = "0px"
        ifrm.setAttribute("allowfullscreen", true)
        ifrm.setAttribute("webkitallowfullscreen", true)
        ifrm.setAttribute("mozallowfullscreen", true)
        ifrm.setAttribute("oallowfullscreen", true)
        ifrm.setAttribute("msallowfullscreen", true)


        ifrm.src = '#'
        if (options.iframe) {
          ifrm.style.width = options.iframewidth
          ifrm.style.height = options.iframeheight
          document.getElementById(options.tagid4iframe).appendChild(sdkForm)
          document.getElementById(options.tagid4iframe).appendChild(ifrm)
          sdkForm.submit()
          //sdkForm.remove();
          sdkForm.parentNode.removeChild(sdkForm)
        } else {
          ifrm.style.width = options.iframewidth
          ifrm.style.height = options.iframeheight
          document.getElementsByTagName("BODY")[0].appendChild(sdkForm)
          document.getElementsByTagName("BODY")[1].appendChild(ifrm)
        }
        if (typeof (options.onInitSuccess) === 'function') {
          orgId = initParams.org_id
          options.onInitSuccess()
          if (typeof (options.getUnreadMessageCount) === 'function') {
            options.getUnreadMessageCount(initParams.unread_feeds)
          }
          if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification")
          }
          else {
            Notification
              .requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                  console.log("This browser support desktop notification and user has granted.")
                }
              })
          }
        }

      } else if (http.readyState == 2 && http.status == 500) {
        // throw "access_token is not valid or base_url is not valid";
        var error_options = { code: '500', description: "access_token is not valid" }
        if (typeof (options.onInitFailure) === 'function') {
          options.onInitFailure(error_options)
        }
      } else if (http.readyState == 4 && (http.status == 0 || http.status == 404)) {
        // throw "access_token is not valid or base_url is not valid";
        var error_options = { code: '404', description: "base_url is not valid" }
        if (typeof (options.onInitFailure) === 'function') {
          options.onInitFailure(error_options)
        }
      }
    }
    http.send(params)



    window.addEventListener('message', function (e) {
      lastActiveTimeStamp = new Date().getTime()
      if (e.data !== 'undefined') {
        if (typeof e.data === 'string' || e.data instanceof String) {
          var eventData = JSON.parse(e.data)
        } else {
          var eventData = e.data
        }
        if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_2fa_event' && typeof (options.check2FAStatus) === 'function') {
          /* if (typeof(eventData.event_type) !== 'undefined' && eventData.event_type ==='confirm_transaction' ){
          sessionStorage.setItem('binderId', eventData.binder_id);
          var txn_id = eventData.request_id;
          var binderId = eventData.binder_id;
          var txn_status = eventData.txn_status;
          var btn_id = eventData.btn_id;
          var event_type = eventData.event_type;
           var data=JSON.stringify({binder_id:binderId, event_type :event_type,request_id :txn_id,event_details:{btn_id:btn_id}});
           options.check2FAStatus(data);
        }else{
        sessionStorage.setItem('requestId', eventData.request_id);
        sessionStorage.setItem('binderId', eventData.binder_id);
        requestId = eventData.request_id;
        var data=JSON.stringify({binder_id:eventData.binder_id, event_type :eventData.event_type,request_id :eventData.request_id,event_details:''});
        options.check2FAStatus(data);
        }	*/
          options.check2FAStatus(JSON.parse(eventData.callback_info))
          //set2FAStatus(eventData);
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_session_expired') {
          if (document.getElementById("confirmModal") != null && document.getElementById("confirmModal") != undefined) {
            var confirmModalEle = document.getElementById("confirmModal")
            confirmModalEle.parentElement.removeChild(confirmModalEle)
            var overlayEle = document.getElementById("overlay")
            overlayEle.parentElement.removeChild(overlayEle)
          }
          sessionStorage.removeItem("navPage")
          options.onSessionExpiry()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'update_unread_feeds' && typeof (options.getUnreadMessageCount) === 'function') {
          options.getUnreadMessageCount(eventData.count)
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'start_transaction_execution') {
          sessionStorage.setItem('payload_configs', JSON.parse(eventData.event).payload_config)
          sessionStorage.setItem('status_update', JSON.parse(eventData.event).payload_status)
          if (typeof (options.start_transaction_execution) === 'function') {
            txn_event_data = JSON.parse(eventData.event)
            var document_options = {
              binder_id: txn_event_data.binder_data,
              transaction_file_id: txn_event_data.document_id,
              transaction_id: txn_event_data.core_txn_id,
              load_view: txn_event_data.load_view
            }
            var load_eventformdata = ({ "binder_data": txn_event_data.binder_data, "document_id": txn_event_data.document_id, "core_txn_id": txn_event_data.core_txn_id, "load_view": txn_event_data.load_view, "document_options": document_options })
            options.start_transaction_execution(load_eventformdata)
          } else {
            txn_event_data = JSON.parse(eventData.event)
            ifrm.contentWindow.postMessage({
              'action': 'mep_loadnormalview_tc',
              'txn_id': txn_event_data.txn_id
            }, "*")
          }
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'end_transaction_execution') {
          // options.end_transaction_execution();
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'mep_customerview_onload' && typeof (options.onload) === 'function') {
          options.onload()
        } else if (typeof (eventData.action) !== 'undefined' && eventData.action === 'notificationAPI') {
          notificationAPI(eventData)
        }
      }
      // e.stopImmediatePropagation();
    }, false)

  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = { code: '400', description: errorMessage }
    if (typeof (options.onInitFailure) === 'function') {
      options.onInitFailure(error_options)
    }
  }
}


Mep.onCloseChat = function () {
  ifrm.contentWindow.postMessage({
    'action': 'mep_onclosechat'
  }, "*")
  document.getElementById("messages").style.display = "none"
}

function encryptData (accessToken, uniqueId) {
  encrpt_uniqueId = btoa(uniqueId)
  encrpt_access_token = btoa(accessToken)
}


Mep.removeWidget = function () {
  if (Mep._currentIframe) {
    Mep._currentIframe.parenteNode.removeChild(Mep._currentIframe)
    window.removeEventListener('message', Mep.handleMessageEvent)
  }
}

Mep._extend = function (ext, defaults) {
  for (var i in defaults) {
    if (defaults.hasOwnProperty(i)) {
      if (!ext[i]) {
        ext[i] = defaults[i]
      }
    }
  }
  return ext
}

Mep.preLoginSupportView = function (options) {
  try {
    lastActiveTimeStamp = new Date().getTime()
    var initParams
    baseUrl = options.base_url
    if (typeof (options.iframe) !== "undefined" || options.iframe) {
      if (typeof (options.tagid4iframe) === "undefined") {
        throw "tagid4iframe is empty"
      }
    }
    if (options.iframe
      && document.getElementById(options.tagid4iframe) === null) {
      throw "tagid4iframe is not valid"
    }
    if (typeof (options.iframewidth) === "undefined") {
      options.iframewidth = '500px'
    }
    if (typeof (options.iframeheight) === "undefined") {
      options.iframeheight = '600px'
    }
    if (typeof (options.onfailure) !== "undefined"
      && typeof options.onfailure === "function") {
      throw "onfailure is not valid function"
    }
    if (typeof (options.client_id) === "undefined") {
      throw "client_id is mandatory"
    }
    client_id = options.client_id


    /* var iframes = document.getElementsByTagName('iframe');
    for (var i = 0; i < iframes.length; i++) {
      iframes[i].parentNode.removeChild(iframes[i]);
    }*/

    if (document.getElementById('containerRenderID') == undefined) {

      ifrm = document.createElement("iframe")
      ifrm.id = 'containerRenderID'
      ifrm.style.border = "0px"
      ifrm.setAttribute("allowfullscreen", true)
      ifrm.setAttribute("webkitallowfullscreen", true)
      ifrm.setAttribute("mozallowfullscreen", true)
      ifrm.setAttribute("oallowfullscreen", true)
      ifrm.setAttribute("msallowfullscreen", true)

      var origin
      if (location.origin == null || !(location.origin)
        || location.origin == 'null') {
        origin = location.protocol + "//" + location.host
          + (location.port ? ':' + location.port : '')
      } else {
        origin = location.origin
      }
      var twoFaStatus
      if (typeof (options.is2FaStatus) !== "undefined" && options.is2FaStatus) {
        twoFaStatus = 'Y'
      } else {
        twoFaStatus = 'N'
      }

      sessionStorage.setItem('firstLogin', true)
      sessionStorage.setItem("navPage", null)
      var browserDetails = get_browser()
      var browserName = browserDetails["name"]
      var browserVersion = browserDetails["version"]

      var localeCode = 'en'
      if (options.locale_code && options.locale_code != undefined) {
        localeCode = options.locale_code
      }
      var http = new XMLHttpRequest()
      var full_url = options.base_url + '/preLoginAgentRequestInit?client_id=' + client_id

      var params = 'client_id=' + client_id
      http.open('GET', full_url, true)

      //Send the proper header information along with the request
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

      http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
          initParams = JSON.parse(http.responseText)
          var full_urlNew = options.base_url + '/preLoginAgentRequest?localeCode='
            + localeCode + '&origin=' + origin + '&twofaStatus='
            + twoFaStatus + '&browserName=' + browserName
            + '&browserVersion=' + browserVersion + '&client_id=' + client_id + '&initData=' + initParams.data
          ifrm.src = full_urlNew

          if (options.iframe) {
            ifrm.style.width = options.iframewidth
            ifrm.style.height = options.iframeheight
            document.getElementById(options.tagid4iframe).appendChild(ifrm)
          } else {
            ifrm.style.width = options.iframewidth
            ifrm.style.height = options.iframeheight
            document.getElementsByTagName("BODY")[0].appendChild(ifrm)
          }
          if (typeof (options.onInitSuccess) === 'function') {
            options.onInitSuccess()
          }
        } else if (http.readyState == 2 && http.status == 500) {
          if (typeof (options.onInitFailure) === 'function') {
            options.onInitFailure()
          }
        }
      }
      http.send(full_url)

    }

    window
      .addEventListener(
        'message',
        function (e) {
          lastActiveTimeStamp = new Date().getTime()
        }, false)

  } catch (e) {
    var errorMessage
    if (typeof (e.description) !== "undefined") {
      errorMessage = e.description
    } else {
      errorMessage = e
    }
    var error_options = {
      code: '400',
      description: errorMessage
    }
    if (typeof (options.onInitFailure) === 'function') {
      options.onInitFailure(error_options)
    }
  }
}

function moxtracloseConfirmModal () {
  ifrm.contentWindow.postMessage({
    'action': 'mep_instruction_cancelled'
  }, "*")
  //document.getElementById('confirmModal').outerHTML='';
  //document.getElementById('overlay').outerHTML='';
  var confirmModalEle = document.getElementById("confirmModal")
  confirmModalEle.parentElement.removeChild(confirmModalEle)
  var overlayEle = document.getElementById("overlay")
  overlayEle.parentElement.removeChild(overlayEle)
  txn_event_data = ""
}

function moxtraconfirmModal () {

  /*document.getElementById('confirmModal').outerHTML='';
  document.getElementById('overlay').outerHTML='';*/
  var confirmModalEle = document.getElementById("confirmModal")
  confirmModalEle.parentElement.removeChild(confirmModalEle)
  var overlayEle = document.getElementById("overlay")
  overlayEle.parentElement.removeChild(overlayEle)
  if (JSON.parse(sessionStorage.getItem("payload_configs")).is_2fa_applicable == true) {
    ifrm.contentWindow.postMessage({
      'action': 'mep_instruction_confirmed_tc',
      'result': 1
    }, "*")
  } else {
    ifrm.contentWindow.postMessage({
      'action': 'mep_2fa_response',
      'request_id': txn_event_data.txn_id,
      'binder_id': txn_event_data.binder_data,
      'event_type': txn_event_data.event_type,
      'is_passed': true
    }, "*")
  }
  txn_event_data = ""
}


function isHidden (el) {
  var style = window.getComputedStyle(el)
  return ((style.display === 'none') || (style.visibility === 'hidden'))
}

function moxtra_next () {
  window.scrollTo(0, 0)
  var elmnt = document.getElementById("confirmModal")
  elmnt.scrollTop = 0
  var termsPagePanel = document.getElementsByClassName("termsPagePanel")
  var activeTermsEle
  for (var i = 0; i < termsPagePanel.length; i++) {
    if (!isHidden(termsPagePanel[i])) {
      activeTermsEle = termsPagePanel[i]
    }
  }
  var next = activeTermsEle.nextElementSibling
  if (next.classList.contains("termsPagePanel")) {
    activeTermsEle.style.display = 'none'
    next.style.display = ''

    var termsPagePanel = document.getElementsByClassName("termsPagePanel")
    var activeTermsEle
    for (var i = 0; i < termsPagePanel.length; i++) {
      if (!isHidden(termsPagePanel[i])) {
        activeTermsEle = termsPagePanel[i]
      }
    }

    if (activeTermsEle.previousElementSibling.classList.contains("termsPagePanel")) {
      document.getElementById("moxtra_back").style.display = ''
    } else {
      document.getElementById("moxtra_back").style.display = 'none'
    }

    if (activeTermsEle.nextElementSibling.classList.contains("termsPagePanel")) {
      document.getElementById("moxtra_next").disabled = true
      document.getElementById("moxtra_next").style.display = ''
    } else {
      document.getElementById("moxtra_next").style.display = 'none'
      document.getElementById("moxtra_submit").style.display = ''
    }

  }

  setTimeout(function () {
    var scrollTop = document.getElementById('confirmModal').scrollTop
    var height = document.getElementById('confirmModal').clientHeight

    var confirmModal = document.getElementById('confirmModal')
    window.scrollTo(0, confirmModal.innerHeight)

    var nxt = document.getElementById("moxtra_next")
    var sbt = document.getElementById("moxtra_submit")
    var goToTerms2 = document.getElementsByClassName("goToTerms2")[0]
    if ((document.getElementById('confirmModal').scrollTop + document.getElementById('confirmModal').offsetHeight) >= (document.getElementById('confirmModal').scrollHeight)) {
      if (nxt.disabled && window.getComputedStyle(nxt).display !== "none") {
        nxt.disabled = false
        document.getElementById("moxtra_next").removeAttribute("disabled")
        document.getElementById("moxtra_next").style.opacity = "1"
      }
      if (sbt.disabled && window.getComputedStyle(sbt).display !== "none") {
        sbt.disabled = false
        document.getElementById("moxtra_submit").removeAttribute("disabled")
        document.getElementById("moxtra_submit").style.opacity = "1"
      }
      if (goToTerms2.disabled && window.getComputedStyle(goToTerms2).display !== "none") {
        goToTerms2.disabled = false
        document.getElementsByClassName("goToTerms2")[0].removeAttribute("disabled")
        document.getElementsByClassName("goToTerms2")[0].style.opacity = "1"
      }
      document.getElementById("transaction-details-btn-bar").style.display = "none"
    }
  }, 3000)
}
function moxtra_back () {
  window.scrollTo(0, 0)


  var termsPagePanel = document.getElementsByClassName("termsPagePanel")
  var activeTermsEle
  for (var i = 0; i < termsPagePanel.length; i++) {
    if (!isHidden(termsPagePanel[i])) {
      activeTermsEle = termsPagePanel[i]
    }
  }
  var prev = activeTermsEle.previousElementSibling

  if (prev.classList.contains("termsPagePanel")) {
    activeTermsEle.style.display = 'none'
    prev.style.display = ''
  }

  var termsPagePanel = document.getElementsByClassName("termsPagePanel")
  var activeTermsEle
  for (var i = 0; i < termsPagePanel.length; i++) {
    if (!isHidden(termsPagePanel[i])) {
      activeTermsEle = termsPagePanel[i]
    }
  }

  if (activeTermsEle.previousElementSibling.classList.contains("termsPagePanel")) {
    document.getElementById("moxtra_back").style.display = ''
  } else {
    document.getElementById("moxtra_back").style.display = 'none'
  }

  if (activeTermsEle.nextElementSibling.classList.contains("termsPagePanel")) {
    document.getElementById("moxtra_next").style.display = ''
    document.getElementById("moxtra_submit").style.display = 'none'
  } else {
    document.getElementById("moxtra_next").style.display = 'none'
    document.getElementById("moxtra_submit").style.display = ''
  }
}
function moxtra_submit () {
  window.scrollTo(0, 0)
  var platform = txn_event_data.platform
  /*document.getElementById('confirmModal').outerHTML='';
  document.getElementById('overlay').outerHTML='';*/

  var confirmModalEle = document.getElementById("confirmModal")
  confirmModalEle.parentElement.removeChild(confirmModalEle)
  var overlayEle = document.getElementById("overlay")
  overlayEle.parentElement.removeChild(overlayEle)
  if (platform == "android") {
    var result = 0
    MEPSdk.onTCPageResult(result, "")
  } else if (platform == "ios") {
    window.webkit.messageHandlers.MEP_TC.postMessage(0)
  } else {

    if (JSON.parse(sessionStorage.getItem("payload_configs")).is_2fa_applicable == true) {
      ifrm.contentWindow.postMessage({
        'action': 'mep_instruction_confirmed_tc',
        'result': 1
      }, "*")

    } else {
      ifrm.contentWindow.postMessage({
        'action': 'mep_2fa_response',
        'request_id': txn_event_data.txn_id,
        'binder_id': txn_event_data.binder_data,
        'event_type': txn_event_data.event_type,
        'is_passed': true
      }, "*")
    }
    txn_event_data = ""
    if (document.getElementById("transactionLoader") != null) {
      document.getElementById("transactionLoader").style.display = 'none'
    }
  }
  //window.parent.closeModal();
}

function moxtra_cancel () {
  var platform = txn_event_data.platform
  /*document.getElementById('confirmModal').outerHTML='';
  document.getElementById('overlay').outerHTML='';*/

  var confirmModalEle = document.getElementById("confirmModal")
  confirmModalEle.parentElement.removeChild(confirmModalEle)
  var overlayEle = document.getElementById("overlay")
  overlayEle.parentElement.removeChild(overlayEle)
  if (platform == "android") {
    MEPSdk.onTCPageResult(1, "Cancel")
  } else {
    ifrm.contentWindow.postMessage({
      'action': 'mep_instruction_cancelled'
    }, "*")
    txn_event_data = ""
    if (document.getElementById("transactionLoader") != null) {
      document.getElementById("transactionLoader").style.display = 'none'
    }
  }
}



function throttle (fn, wait) {
  var time = Date.now()
  return function () {
    if ((time + wait - Date.now()) < 0) {
      fn()
      time = Date.now()
    }
  }
}

function ScrollHandler () {
  if (txn_event_data.load_view == "form_view") {
    var scrollTop = document.getElementById('confirmModal').scrollTop
    var height = document.getElementById('confirmModal').clientHeight

    var confirmModal = document.getElementById('confirmModal')
    window.scrollTo(0, confirmModal.innerHeight)

    var nxt = document.getElementById("moxtra_next")
    var sbt = document.getElementById("moxtra_submit")
    var goToTerms2 = document.getElementsByClassName("goToTerms2")[0]

    //if((document.getElementById('confirmModal').innerHeight + document.getElementById('confirmModal').pageYOffset) >= document.getElementById('confirmModal').offsetHeight - 2) {

    if ((document.getElementById('confirmModal').scrollTop + document.getElementById('confirmModal').offsetHeight) >= (document.getElementById('confirmModal').scrollHeight)) {
      if (nxt.disabled && window.getComputedStyle(nxt).display !== "none") {
        if (document.getElementById('flexCheckDefault') == null) {
          nxt.disabled = false
          document.getElementById("moxtra_next").removeAttribute("disabled")
          document.getElementById("moxtra_next").style.opacity = "1"
        } else {
          if (document.getElementById('flexCheckDefault').checked) {
            nxt.disabled = false
            document.getElementById("moxtra_next").removeAttribute("disabled")
            document.getElementById("moxtra_next").style.opacity = "1"
          }
        }
      }
      if (sbt.disabled && window.getComputedStyle(sbt).display !== "none") {
        sbt.disabled = false
        document.getElementById("moxtra_submit").removeAttribute("disabled")
        document.getElementById("moxtra_submit").style.opacity = "1"
      }
      if (goToTerms2.disabled && window.getComputedStyle(goToTerms2).display !== "none") {
        goToTerms2.disabled = false
        document.getElementsByClassName("goToTerms2")[0].removeAttribute("disabled")
        document.getElementsByClassName("goToTerms2")[0].style.opacity = "1"
      }
    }
  }
}

function checkboxclickevent () {
  checkbox_ = document.getElementById('flexCheckDefault')
  if (checkbox_.checked) {
    document.getElementById("moxtra_next").removeAttribute("disabled")
    document.getElementById("moxtra_next").style.opacity = "1"
  } else {
    document.getElementById("moxtra_next").setAttribute("disabled", "disabled")
    document.getElementById("moxtra_next").style.opacity = ".5"
  }
}

function notificationAPI (eventData) {

  var jsonString
  var notification_title
  try {
    if (!Notification) {
      return
    }
    if (Notification.permission != "granted")
      Notification.requestPermission()
    else {
      jsonString = JSON.stringify(eventData.event)
      var stringify = JSON.parse(jsonString)

      if (eventData.event.data[0].binder_type == "meet") {
        if (eventData.event.data[0].meet.session_status == "SESSION_SCHEDULED") {
          notification_title = "Schedule Call"
        } else {
          notification_title = "Incoming Call"
        }
      }
      else if (eventData.event.data[0].binder_type == "chat") {
        notification_title = "New Message"
      }
      else {
        notification_title = "Notification"
      }

      var notification = new Notification(notification_title,
        {
          icon: eventData.sweetalertpath,
          body: eventData.notificationMsg,
          requireInteraction: true
        })
      setTimeout(notification.close.bind(notification), parseInt(eventData.browser_notification_display_time + "000"))
      notification.onclick = function (event) {
        if (stringify.data[0].binder_type == "meet") {
          if (stringify.data[0].meet.session_status == 'SESSION_STARTED' && stringify.data[0].status == 'BOARD_INVITED') {
            notification.close() //Hide notification
            notification_title = ""
          } else if (stringify.data[0].meet.session_status == 'SESSION_STARTED' && (stringify.data[0].meet.scheduled_end_time != '' && stringify.data[0].meet.scheduled_end_time != undefined) && (stringify.data[0].meet.scheduled_start_time != undefined && stringify.data[0].meet.scheduled_start_time != '') && stringify.data[0].status == 'BOARD_MEMBER') {
            notification.close() //Hide notification
            notification_title = ""
          }
        }
        else if (stringify.data[0].binder_type == "chat") {
          notification.close() //Hide notification
          notification_title = ""
        }
      }
    }
  }
  catch (e) {
    console.log("Notification is not supported in IE " + e.message)
  }
}

export { Mep }