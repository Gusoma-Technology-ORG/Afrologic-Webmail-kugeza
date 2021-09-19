(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{"04ad":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-scroll-area",{staticClass:"full-height full-width"},[a("div",{staticClass:"q-pa-lg "},[a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"CPANELINTEGRATOR.HEADING_SETTINGS_TAB",expression:"'CPANELINTEGRATOR.HEADING_SETTINGS_TAB'"}],staticClass:"col text-h5"})]),a("q-card",{staticClass:"card-edit-settings",attrs:{flat:"",bordered:""}},[a("q-card-section",[a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"CPANELINTEGRATOR.LABEL_CPANEL_HOST",expression:"'CPANELINTEGRATOR.LABEL_CPANEL_HOST'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5"},[a("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.save(t)}},model:{value:e.cpanelHost,callback:function(t){e.cpanelHost=t},expression:"cpanelHost"}})],1)]),a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"CPANELINTEGRATOR.LABEL_CPANEL_PORT",expression:"'CPANELINTEGRATOR.LABEL_CPANEL_PORT'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5"},[a("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.save(t)}},model:{value:e.cpanelPort,callback:function(t){e.cpanelPort=t},expression:"cpanelPort"}})],1)]),a("div",{staticClass:"row q-mb-md"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"CPANELINTEGRATOR.LABEL_CPANEL_USER",expression:"'CPANELINTEGRATOR.LABEL_CPANEL_USER'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5"},[a("q-input",{attrs:{outlined:"",dense:"","bg-color":"white"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.save(t)}},model:{value:e.cpanelUser,callback:function(t){e.cpanelUser=t},expression:"cpanelUser"}})],1)]),a("div",{staticClass:"row"},[a("div",{directives:[{name:"t",rawName:"v-t",value:"CPANELINTEGRATOR.LABEL_CPANEL_PASS",expression:"'CPANELINTEGRATOR.LABEL_CPANEL_PASS'"}],staticClass:"col-2 q-my-sm"}),a("div",{staticClass:"col-5"},[a("q-input",{attrs:{outlined:"",dense:"","bg-color":"white",type:"password",autocomplete:"new-password"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.save(t)}},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1)])])],1),a("div",{staticClass:"q-pt-md text-right"},[a("q-btn",{staticClass:"q-px-sm",attrs:{unelevated:"","no-caps":"",dense:"",ripple:!1,color:"primary",label:e.$t("COREWEBCLIENT.ACTION_SAVE")},on:{click:e.save}})],1)],1),a("q-inner-loading",{staticStyle:{"justify-content":"flex-start"},attrs:{showing:e.loading||e.saving}},[a("q-linear-progress",{attrs:{query:""}})],1)],1)},s=[],r=a("4245"),o=a("21ac"),l=a("6bfe"),i=a("e539"),p="     ",c={name:"CpanelAdminSettingsPerTenant",data:function(){return{saving:!1,loading:!1,cpanelHost:"",cpanelPort:"",cpanelUser:"",cpanelHasPassword:!1,password:p,savedPass:p}},computed:{tenantId:function(){return this.$store.getters["tenants/getCurrentTenantId"]},allTenants:function(){return this.$store.getters["tenants/getTenants"]}},watch:{allTenants:function(){this.populate()}},beforeRouteLeave:function(e,t,a){this.doBeforeRouteLeave(e,t,a)},mounted:function(){this.loading=!1,this.saving=!1,this.populate()},methods:{hasChanges:function(){var e;if(this.loading)return!1;var t=l["a"].pObject(null===(e=this.tenant)||void 0===e?void 0:e.completeData),a=t["CpanelIntegrator::CpanelPort"];return this.cpanelHost!==t["CpanelIntegrator::CpanelHost"]||l["a"].pInt(this.cpanelPort)!==a||this.cpanelUser!==t["CpanelIntegrator::CpanelUser"]||this.password!==this.savedPass},revertChanges:function(){var e,t=l["a"].pObject(null===(e=this.tenant)||void 0===e?void 0:e.completeData);this.cpanelHost=t["CpanelIntegrator::CpanelHost"],this.cpanelPort=t["CpanelIntegrator::CpanelPort"],this.cpanelUser=t["CpanelIntegrator::CpanelUser"],this.password=this.savedPass},populate:function(){var e=this.$store.getters["tenants/getTenant"](this.tenantId);e&&(void 0!==e.completeData["CpanelIntegrator::CpanelHost"]?(this.tenant=e,this.cpanelHost=e.completeData["CpanelIntegrator::CpanelHost"],this.cpanelPort=e.completeData["CpanelIntegrator::CpanelPort"],this.cpanelUser=e.completeData["CpanelIntegrator::CpanelUser"],this.cpanelHasPassword=e.completeData["CpanelIntegrator::CpanelHasPassword"]):this.getSettings())},save:function(){var e=this;if(!this.saving){this.saving=!0;var t={CpanelHost:this.cpanelHost,CpanelPort:l["a"].pInt(this.cpanelPort),CpanelUser:this.cpanelUser,TenantId:this.tenantId};this.password!==p&&(t.CpanelPassword=this.password),i["a"].sendRequest({moduleName:"CpanelIntegrator",methodName:"UpdateSettings",parameters:t}).then((function(a){if(e.saving=!1,!0===a){e.savedPass=e.password;var n={"CpanelIntegrator::CpanelHost":t.CpanelHost,"CpanelIntegrator::CpanelPort":t.CpanelPort,"CpanelIntegrator::CpanelUser":t.CpanelUser,"CpanelIntegrator::CpanelHasPassword":""!==e.password};e.$store.commit("tenants/setTenantCompleteData",{id:e.tenantId,data:n}),o["a"].showReport(e.$t("COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS"))}else o["a"].showError(e.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED"))}),(function(t){e.saving=!1,o["a"].showError(r["a"].getTextFromResponse(t,e.$t("COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED")))}))}},getSettings:function(){var e=this;this.loading=!0;var t={TenantId:this.tenantId};i["a"].sendRequest({moduleName:"CpanelIntegrator",methodName:"GetSettings",parameters:t}).then((function(t){if(e.loading=!1,t){var a={"CpanelIntegrator::CpanelHost":l["a"].pString(t.CpanelHost),"CpanelIntegrator::CpanelPort":l["a"].pInt(t.CpanelPort),"CpanelIntegrator::CpanelUser":l["a"].pString(t.CpanelUser),"CpanelIntegrator::CpanelHasPassword":l["a"].pBool(t.CpanelHasPassword)};e.$store.commit("tenants/setTenantCompleteData",{id:e.tenantId,data:a})}}),(function(e){o["a"].showError(r["a"].getTextFromResponse(e))}))}}},d=c,C=a("2877"),u=a("4983"),v=a("f09f"),E=a("a370"),g=a("27f9"),m=a("9c40"),h=a("74f7"),I=a("6b1d"),T=a("eebe"),P=a.n(T),A=Object(C["a"])(d,n,s,!1,null,"ad37eda4",null);t["default"]=A.exports;P()(A,"components",{QScrollArea:u["a"],QCard:v["a"],QCardSection:E["a"],QInput:g["a"],QBtn:m["a"],QInnerLoading:h["a"],QLinearProgress:I["a"]})}}]);