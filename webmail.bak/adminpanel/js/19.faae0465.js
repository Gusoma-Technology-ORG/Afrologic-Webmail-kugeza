(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{"662a":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-scroll-area",{staticClass:"full-height full-width"},[a("div",{staticClass:"q-pa-lg "},[a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"COREWEBCLIENT.HEADING_COMMON_SETTINGS",expression:"'COREWEBCLIENT.HEADING_COMMON_SETTINGS'"}],staticClass:"col text-h5"})]),a("q-card",{staticClass:"card-edit-settings",attrs:{flat:"",bordered:""}},[a("q-card-section",[a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"COREWEBCLIENT.LABEL_SITENAME",expression:"'COREWEBCLIENT.LABEL_SITENAME'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5"},[a("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.save(t)}},model:{value:e.siteName,callback:function(t){e.siteName=t},expression:"siteName"}})],1)]),e.themeList.length>1?a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"COREWEBCLIENT.LABEL_THEME",expression:"'COREWEBCLIENT.LABEL_THEME'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5"},[a("q-select",{attrs:{outlined:"",dense:"","bg-color":"white","emit-value":"","map-options":"",options:e.themeList,"option-label":"name"},model:{value:e.theme,callback:function(t){e.theme=t},expression:"theme"}})],1)]):e._e(),e.mobileThemeList.length>1?a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"COREWEBCLIENT.LABEL_MOBILE_THEME",expression:"'COREWEBCLIENT.LABEL_MOBILE_THEME'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5"},[a("q-select",{attrs:{outlined:"",dense:"","bg-color":"white","emit-value":"","map-options":"",options:e.mobileThemeList,"option-label":"name"},model:{value:e.mobileTheme,callback:function(t){e.mobileTheme=t},expression:"mobileTheme"}})],1)]):e._e(),e.languageOptions.length>1?a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"COREWEBCLIENT.LABEL_LANGUAGE",expression:"'COREWEBCLIENT.LABEL_LANGUAGE'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5"},[a("q-select",{attrs:{outlined:"",dense:"","bg-color":"white","emit-value":"","map-options":"",options:e.languageOptions,"option-label":"name"},model:{value:e.language,callback:function(t){e.language=t},expression:"language"}})],1)]):e._e(),a("div",{staticClass:"row"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"COREWEBCLIENT.LABEL_TIME_FORMAT",expression:"'COREWEBCLIENT.LABEL_TIME_FORMAT'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5 "},[a("div",{staticClass:"  q-my-sm"},[a("q-radio",{attrs:{dense:"",val:"1",label:e.$t("COREWEBCLIENT.LABEL_TIME_FORMAT_12")},model:{value:e.timeFormat,callback:function(t){e.timeFormat=t},expression:"timeFormat"}}),a("q-radio",{staticClass:"q-ml-md",attrs:{dense:"",val:"0",label:e.$t("COREWEBCLIENT.LABEL_TIME_FORMAT_24")},model:{value:e.timeFormat,callback:function(t){e.timeFormat=t},expression:"timeFormat"}})],1)])])])],1),a("div",{staticClass:"q-pt-md text-right"},[a("q-btn",{staticClass:"q-px-sm",attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:e.$t("COREWEBCLIENT.ACTION_SAVE")},on:{click:e.save}})],1)],1),a("q-inner-loading",{staticStyle:{"justify-content":"flex-start"},attrs:{showing:e.saving}},[a("q-linear-progress",{attrs:{query:""}})],1)],1)},i=[],o=a("4245"),n=a("21ac"),m=a("e539"),l=a("b2f5"),r=a.n(l),c=a("83d6"),u={name:"CommonAdminSetting",data:function(){return{language:"",savedLanguage:"",theme:"",mobileTheme:"",siteName:"",timeFormat:0,saving:!1,languageOptions:[],themeList:[],mobileThemeList:[],commonSettings:{},autodetectLanguage:!1}},mounted:function(){this.populate(),this.languageOptions=r.a.cloneDeep(c["a"].getLanguageList()),this.languageOptions.unshift({name:"Autodetect",value:"AutodetectLanguage"}),this.themeList=c["a"].getThemeList(),this.mobileThemeList=c["a"].getMobileThemeList()},beforeRouteLeave:function(e,t,a){this.doBeforeRouteLeave(e,t,a)},methods:{populate:function(){var e=c["a"].getCommonSettingData();this.autodetectLanguage=e.autodetectLanguage,this.language=this.autodetectLanguage?"AutodetectLanguage":e.language,this.savedLanguage=this.autodetectLanguage?"AutodetectLanguage":e.language,this.theme=e.theme,this.mobileTheme=e.mobileTheme,this.siteName=e.siteName,this.timeFormat=e.timeFormat},hasChanges:function(){var e=c["a"].getCommonSettingData();return this.language!==this.savedLanguage||this.theme!==e.theme||this.mobileTheme!==e.mobileTheme||this.siteName!==e.siteName||this.timeFormat!==e.timeFormat},revertChanges:function(){this.populate()},save:function(){var e=this;if(!this.saving){this.saving=!0;var t={Theme:this.theme,MobileTheme:this.mobileTheme,TimeFormat:this.timeFormat,SiteName:this.siteName};"AutodetectLanguage"===this.language?t.AutodetectLanguage=!0:(t.AutodetectLanguage=!1,t.Language=this.language),m["a"].sendRequest({moduleName:"Core",methodName:"UpdateSettings",parameters:t}).then((function(t){e.saving=!1,!0===t?(c["a"].saveCommonSettingData({siteName:e.siteName,theme:e.theme,mobileTheme:e.mobileTheme,language:e.language,timeFormat:e.timeFormat,autodetectLanguage:"AutodetectLanguage"===e.language}),e.populate(),n["a"].showReport(e.$t("COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS"))):n["a"].showError(e.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED"))}),(function(t){e.saving=!1,n["a"].showError(o["a"].getTextFromResponse(t,e.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED")))}))}}}},g=u,E=a("2877"),d=a("4983"),h=a("f09f"),L=a("a370"),C=a("27f9"),v=a("ddd8"),T=a("3786"),p=a("9c40"),N=a("74f7"),b=a("6b1d"),A=a("eebe"),I=a.n(A),_=Object(E["a"])(g,s,i,!1,null,"e316bee6",null);t["default"]=_.exports;I()(_,"components",{QScrollArea:d["a"],QCard:h["a"],QCardSection:L["a"],QInput:C["a"],QSelect:v["a"],QRadio:T["a"],QBtn:p["a"],QInnerLoading:N["a"],QLinearProgress:b["a"]})}}]);