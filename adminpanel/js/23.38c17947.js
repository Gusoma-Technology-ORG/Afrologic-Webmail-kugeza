(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[23],{cce5:function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("q-scroll-area",{staticClass:"full-height full-width"},[t("div",{staticClass:"q-pa-lg"},[t("div",{staticClass:"row q-mb-md"},[t("div",{directives:[{name:"t",rawName:"v-t",value:"FACEBOOK.HEADING_SETTINGS",expression:"'FACEBOOK.HEADING_SETTINGS'"}],staticClass:"col text-h5"})]),t("q-card",{staticClass:"card-edit-settings",attrs:{flat:"",bordered:""}},[t("q-card-section",[t("div",{staticClass:"row q-mb-md"},[t("q-checkbox",{attrs:{dense:""},model:{value:e.enableFacebook,callback:function(a){e.enableFacebook=a},expression:"enableFacebook"}},[t("q-item-label",{directives:[{name:"t",rawName:"v-t",value:"FACEBOOK.ENABLE_MODULE",expression:"'FACEBOOK.ENABLE_MODULE'"}]})],1)],1),t("div",{staticClass:"row q-mb-md"},[t("div",{directives:[{name:"t",rawName:"v-t",value:"OAUTHINTEGRATORWEBCLIENT.LABEL_APP_ID",expression:"'OAUTHINTEGRATORWEBCLIENT.LABEL_APP_ID'"}],staticClass:"col-2 q-my-sm q-pl-sm required-field"}),t("div",{staticClass:"col-5"},[t("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},model:{value:e.appId,callback:function(a){e.appId=a},expression:"appId"}})],1)]),t("div",{staticClass:"row q-mb-md"},[t("div",{directives:[{name:"t",rawName:"v-t",value:"OAUTHINTEGRATORWEBCLIENT.LABEL_APP_SECRET",expression:"'OAUTHINTEGRATORWEBCLIENT.LABEL_APP_SECRET'"}],staticClass:"col-2 q-my-sm q-pl-sm required-field"}),t("div",{staticClass:"col-5"},[t("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},model:{value:e.appSecret,callback:function(a){e.appSecret=a},expression:"appSecret"}})],1)]),t("div",{staticClass:"row"},[t("q-item-label",{attrs:{caption:""}},[t("span",{directives:[{name:"t",rawName:"v-t",value:"FACEBOOK.INFO_SETTINGS",expression:"'FACEBOOK.INFO_SETTINGS'"}]})])],1),t("div",{staticClass:"row q-mt-md"},[t("q-checkbox",{attrs:{dense:""},model:{value:e.auth,callback:function(a){e.auth=a},expression:"auth"}},[t("q-item-label",{directives:[{name:"t",rawName:"v-t",value:"FACEBOOKAUTHWEBCLIENT.SCOPE_AUTH",expression:"'FACEBOOKAUTHWEBCLIENT.SCOPE_AUTH'"}]})],1)],1)])],1),t("div",{staticClass:"q-pt-md text-right"},[t("q-btn",{staticClass:"q-px-sm",attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:e.$t("COREWEBCLIENT.ACTION_SAVE")},on:{click:e.saveFacebookSettings}})],1)],1),t("q-inner-loading",{staticStyle:{"justify-content":"flex-start"},attrs:{showing:e.saving}},[t("q-linear-progress",{attrs:{query:""}})],1)],1)},i=[],o=(t("21de"),t("4245")),n=t("21ac"),c=t("e539"),r=t("be18"),l={name:"FacebookAdminSettings",data:function(){return{saving:!1,enableFacebook:!1,auth:!1,appId:"",appSecret:"",scopes:[]}},mounted:function(){this.populate()},beforeRouteLeave:function(e,a,t){this.doBeforeRouteLeave(e,a,t)},methods:{hasChanges:function(){var e=this,a=r["a"].getFacebookSettings(),t=!1;return this.scopes.forEach((function(a){t||"auth"===a.Name&&(t=e.auth!==a.Value)})),this.enableFacebook!==a.enableModule||this.appId!==a.id||t||this.appSecret!==a.secret},revertChanges:function(){this.populate()},populate:function(){var e=this,a=r["a"].getFacebookSettings();this.enableFacebook=a.enableModule,this.appId=a.id,this.scopes=a.scopes,this.appSecret=a.secret,this.scopes.forEach((function(a){"auth"===a.Name&&(e.auth=a.Value)}))},saveFacebookSettings:function(){this.appId&&this.appSecret||!this.enableFacebook?this.save():n["a"].showError(this.$t("MAILWEBCLIENT.ERROR_REQUIRED_FIELDS_EMPTY"))},save:function(){var e=this;if(!this.saving){this.saving=!0,this.scopes.forEach((function(a){"auth"===a.Name&&(a.Value=e.auth)}));var a={EnableModule:this.enableFacebook,Id:this.appId,Secret:this.appSecret,Scopes:this.scopes};c["a"].sendRequest({moduleName:"Facebook",methodName:"UpdateSettings",parameters:a}).then((function(t){e.saving=!1,!0===t?(r["a"].saveFacebookSettings(a),e.populate(),n["a"].showReport(e.$t("COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS"))):n["a"].showError(e.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED"))}),(function(a){e.saving=!1,n["a"].showError(o["a"].getTextFromResponse(a,e.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED")))}))}}}},p=l,E=t("2877"),d=t("4983"),u=t("f09f"),h=t("a370"),v=t("8f8e"),b=t("0170"),m=t("27f9"),C=t("9c40"),I=t("74f7"),T=t("6b1d"),S=t("eebe"),A=t.n(S),N=Object(E["a"])(p,s,i,!1,null,"57f9a3b3",null);a["default"]=N.exports;A()(N,"components",{QScrollArea:d["a"],QCard:u["a"],QCardSection:h["a"],QCheckbox:v["a"],QItemLabel:b["a"],QInput:m["a"],QBtn:C["a"],QInnerLoading:I["a"],QLinearProgress:T["a"]})}}]);