(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[25],{c4f8:function(t,s,e){"use strict";e.r(s);var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("q-scroll-area",{staticClass:"full-height full-width"},[e("div",{staticClass:"q-pa-lg "},[e("div",{staticClass:"row q-mb-md"},[e("div",{directives:[{name:"t",rawName:"v-t",value:"MAILCHANGEPASSWORDPOPPASSDPLUGIN.HEADING_SETTINGS_TAB",expression:"'MAILCHANGEPASSWORDPOPPASSDPLUGIN.HEADING_SETTINGS_TAB'"}],staticClass:"col text-h5"})]),e("q-card",{staticClass:"card-edit-settings",attrs:{flat:"",bordered:""}},[e("q-card-section",[e("div",{staticClass:"row q-mb-md"},[e("div",{directives:[{name:"t",rawName:"v-t",value:"MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_MAIL_SERVERS",expression:"'MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_MAIL_SERVERS'"}],staticClass:"col-2 q-mt-sm"}),e("div",{staticClass:"col-5 textarea"},[e("q-input",{attrs:{outlined:"",dense:"","bg-color":"white",type:"textarea"},model:{value:t.supportedServers,callback:function(s){t.supportedServers=s},expression:"supportedServers"}})],1)]),e("div",{staticClass:"row q-mb-md"},[e("div",{staticClass:"col-2"}),e("div",{staticClass:"col-8"},[e("q-item-label",{attrs:{caption:""}},[t._v("\n              "+t._s(t.$t("MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_HINT_MAIL_SERVERS"))+"\n            ")])],1)]),e("div",{staticClass:"row"},[e("div",{directives:[{name:"t",rawName:"v-t",value:"MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_HOST",expression:"'MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_HOST'"}],staticClass:"col-2 q-mt-sm"}),e("div",{staticClass:"col-5"},[e("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},model:{value:t.host,callback:function(s){t.host=s},expression:"host"}})],1),e("div",{directives:[{name:"t",rawName:"v-t",value:"MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_PORT",expression:"'MAILCHANGEPASSWORDPOPPASSDPLUGIN.LABEL_PORT'"}],staticClass:"col-1 q-mt-sm q-pl-md"}),e("div",{staticClass:"col-1"},[e("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},model:{value:t.port,callback:function(s){t.port=s},expression:"port"}})],1)])])],1),e("div",{staticClass:"q-pt-md text-right"},[e("q-btn",{staticClass:"q-px-sm",attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:t.$t("COREWEBCLIENT.ACTION_SAVE")},on:{click:t.save}})],1)],1),e("q-inner-loading",{staticStyle:{"justify-content":"flex-start"},attrs:{showing:t.saving}},[e("q-linear-progress",{attrs:{query:""}})],1)],1)},r=[],o=e("4245"),i=e("21ac"),n=e("e539"),l=e("2755"),p={name:"PoppassdAdminSettings",mounted:function(){this.populate()},data:function(){return{host:"",port:"",supportedServers:"",saving:!1}},beforeRouteLeave:function(t,s,e){this.doBeforeRouteLeave(t,s,e)},methods:{hasChanges:function(){var t=l["a"].getPoppassdSettings();return this.supportedServers!==t.supportedServers||this.host!==t.host||this.port!==t.port},revertChanges:function(){this.populate()},populate:function(){var t=l["a"].getPoppassdSettings();this.supportedServers=t.supportedServers,this.host=t.host,this.port=t.port},save:function(){var t=this;if(!this.saving){this.saving=!0;var s={SupportedServers:this.supportedServers,Host:this.host,Port:this.port};n["a"].sendRequest({moduleName:"MailChangePasswordPoppassdPlugin",methodName:"UpdateSettings",parameters:s}).then((function(s){t.saving=!1,!0===s?(l["a"].savePoppassdSettings({supportedServers:t.supportedServers,host:t.host,port:t.port}),t.populate(),i["a"].showReport(t.$t("COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS"))):i["a"].showError(t.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED"))}),(function(s){t.saving=!1,i["a"].showError(o["a"].getTextFromResponse(s,t.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED")))}))}}}},S=p,c=e("2877"),d=e("4983"),u=e("f09f"),v=e("a370"),A=e("27f9"),P=e("0170"),E=e("9c40"),h=e("74f7"),L=e("6b1d"),C=e("eebe"),m=e.n(C),I=Object(c["a"])(S,a,r,!1,null,"858f5966",null);s["default"]=I.exports;m()(I,"components",{QScrollArea:d["a"],QCard:u["a"],QCardSection:v["a"],QInput:A["a"],QItemLabel:P["a"],QBtn:E["a"],QInnerLoading:h["a"],QLinearProgress:L["a"]})}}]);