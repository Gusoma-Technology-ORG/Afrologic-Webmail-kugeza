(function(t){function e(e){for(var a,s,o=e[0],c=e[1],l=e[2],d=0,p=[];d<o.length;d++)s=o[d],i[s]&&p.push(i[s][0]),i[s]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(t[a]=c[a]);u&&u(e);while(p.length)p.shift()();return r.push.apply(r,l||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],a=!0,o=1;o<n.length;o++){var c=n[o];0!==i[c]&&(a=!1)}a&&(r.splice(e--,1),t=s(s.s=n[0]))}return t}var a={},i={app:0},r=[];function s(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=a,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)s.d(n,a,function(e){return t[e]}.bind(null,a));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var l=0;l<o.length;l++)e(o[l]);var u=c;r.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"024f":function(t,e,n){},"05bc":function(t,e,n){"use strict";var a=n("024f"),i=n.n(a);i.a},5100:function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var a=n("2b0e"),i=n("43f9"),r=n.n(i),s=(n("51de"),n("9ebe")),o=n("2e9c"),c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("ObjectList"),n("router-view")],1)},l=[],u=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"list"},[n("div",{staticClass:"ui input fluid"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.apiUrlInput,expression:"apiUrlInput"}],attrs:{type:"text"},domProps:{value:t.apiUrlInput},on:{keypress:function(e){return e.type.indexOf("key")||13===e.keyCode?t.onApiUrlEnter(e):null},input:function(e){e.target.composing||(t.apiUrlInput=e.target.value)}}})]),n("ul",t._l(t.items,function(e,a){return n("li",{key:a,class:{selected:t.currObject===e.value},on:{click:function(n){return t.openList(e)}}},[t._v("\n      "+t._s(e.name)+"\n    ")])}),0)])},d=[],p=(n("a481"),n("2ef0")),f=n.n(p),h={name:"ObjectList",data:function(){return{apiUrlInput:"",items:[],currObject:null}},watch:{"$store.state.currentObjectName":function(t){console.log(this),this.currObject=t},"$store.state.objectsList":function(t){this.createObjectList(t)}},mounted:function(){this.apiUrlInput=this.$store.state.apiUrl,this.currObject=this.$store.state.currentObjectName},methods:{createObjectList:function(t){if(t){var e=[];f.a.each(t,function(t){e.push({name:t.replace("Aurora_Modules","").replace(/_/g," "),value:t})}),this.items=e}},openList:function(t){this.$router.push({name:"ObjectTable",params:{id:t.value}})},onApiUrlEnter:function(){this.$store.dispatch("setAppUrl",this.apiUrlInput)}}},b=h,v=(n("05bc"),n("2877")),g=Object(v["a"])(b,u,d,!1,null,"5e8a20cd",null),m=g.exports,j={name:"Home",components:{ObjectList:m},watch:{"$store.state.apiUrl":function(t){this.$store.dispatch("getObjectsList")},"$store.state.currentObjectName":function(t){this.$router.push({name:"ObjectTable",params:{id:t}})}},mounted:function(){this.$store.dispatch("getObjectsList")}},y=j,O=(n("5c0b"),Object(v["a"])(y,c,l,!1,null,null,null)),_=O.exports,w=n("8c4f"),P=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"main-panel ui"},[n("h1",[t._v(t._s(t.title))]),n("div",{staticClass:"vuetable-pagination ui basic segment grid"},[n("select",{directives:[{name:"model",rawName:"v-model",value:t.searchField,expression:"searchField"}],staticClass:"ui dropdown",staticStyle:{width:"250px","min-height":"46px"},on:{change:function(e){var n=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.searchField=e.target.multiple?n:n[0]}}},[n("option",{attrs:{value:""}},[t._v("\n        None\n      ")]),t._l(t.fields,function(e,a){return n("option",{key:a,domProps:{value:e}},[t._v("\n        "+t._s(e)+"\n      ")])})],2),n("div",{staticClass:"ui icon input"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.searchText,expression:"searchText"}],attrs:{type:"text",placeholder:"Search"},domProps:{value:t.searchText},on:{keypress:function(e){return e.type.indexOf("key")||13===e.keyCode?t.onEnter(e):null},input:function(e){e.target.composing||(t.searchText=e.target.value)}}})])]),t.loading?t._e():n("div",{staticClass:"vuetable-pagination ui basic segment grid"},[n("vuetable-pagination-info",{ref:"paginationInfo"}),n("div",{staticClass:"ui icon input"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.perPageInput,expression:"perPageInput"}],attrs:{type:"text",placeholder:"Per page"},domProps:{value:t.perPageInput},on:{keypress:function(e){return e.type.indexOf("key")||13===e.keyCode?t.onEnter(e):null},input:function(e){e.target.composing||(t.perPageInput=e.target.value)}}})]),n("vuetable-pagination",{ref:"pagination",on:{"vuetable-pagination:change-page":t.onChangePage}})],1),t.loading?n("div",[t._v("\n    Loading...\n  ")]):t._e(),t.currentObjectName?n("div",{staticClass:"table-container"},[n("vuetable",{directives:[{name:"show",rawName:"v-show",value:!t.loading,expression:"!loading"}],ref:"vuetable",attrs:{"api-url":t.apiUrl,fields:t.tableHeaders,"data-path":"result.Values","pagination-path":"result.pagination","http-method":"post","http-fetch":t.getObjectData,"per-page":1*t.perPage,"track-by":"EntityId"},on:{"vuetable:pagination-data":t.onPaginationData,"vuetable:checkbox-toggled":t.onCheckboxToggled,"vuetable:checkbox-toggled-all":t.onCheckboxToggled,"vuetable:row-dblclicked":t.onRowClick},scopedSlots:t._u([{key:"actions",fn:function(e){return[n("div",{staticClass:"table-button-container"},[n("button",{staticClass:"ui basic red button",on:{click:function(n){return t.deleteRow(e.rowData)}}},[t._v("\n            Delete\n          ")])])]}}],null,!1,3353159392)})],1):t._e(),t.selectedEntityIds.length>0?n("div",{staticClass:"table-button-container"},[t._v("\n    Selected items EntityId: "+t._s(t.selectedEntityIds)+"\n    "),n("button",{staticClass:"ui basic red button",on:{click:t.deleteRows}},[t._v("\n      Delete\n    ")])]):t._e(),n("sweet-modal",{ref:"modalEditor",attrs:{width:"800px",blocking:"","overlay-theme":"dark"}},[n("div",[n("h2",[t._v(t._s(t.title))]),n("div",{staticClass:"ui form"},[n("div",{staticClass:"buttons"},[n("button",{staticClass:"ui primary button",on:{click:t.saveData}},[t._v("\n            Save\n          ")]),n("button",{staticClass:"ui button",on:{click:t.onCancelEdit}},[t._v("\n            Cancel\n          ")])]),n("div",{staticClass:"grid stackable two column ui"},t._l(t.editedRow,function(e,a){return n("div",{key:a,staticClass:"column field"},[n("label",[t._v(t._s(e.name))]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.value,expression:"field.value"}],attrs:{type:"text"},domProps:{value:e.value},on:{input:function(n){n.target.composing||t.$set(e,"value",n.target.value)}}})])}),0),n("div",{staticClass:"buttons"},[n("button",{staticClass:"ui primary button",on:{click:t.saveData}},[t._v("\n            Save\n          ")]),n("button",{staticClass:"ui button",on:{click:t.onCancelEdit}},[t._v("\n            Cancel\n          ")])])])])])],1)},x=[],C=(n("7f7f"),n("ac6a"),n("c5f6"),n("c3d0")),k=n("3568"),$=n("127e"),N=n("bc3a"),I=n.n(N),E={name:"ObjectTable",components:{Vuetable:C["a"],VuetablePagination:k["a"],VuetablePaginationInfo:$["a"]},props:{id:{type:String,default:""}},data:function(){return{currentObjectName:"",fields:[],tableHeaders:[],currPage:1,perPageInput:"10",loading:!1,selectedEntityIds:[],searchField:"",searchText:"",editedRow:[],rowNumber:0}},computed:{apiUrl:function(){return"".concat(this.$store.state.apiUrl,"-action")},title:function(){return this.currentObjectName.replace("Aurora_Modules","").replace(/_/g," ")},perPage:function(){var t=10,e=parseInt(Number(this.perPageInput),10);return!isNaN(e)&&e>0&&(t=e),t}},watch:{"$store.state.currentObjectName":function(t){this.currentObjectName=t,this.currPage=1,this.$refs.vuetable.reload()},id:function(t){this.$store.dispatch("setObjectsName",t)}},mounted:function(){console.log("mounted this.$store.state.currentObjectName",this.$store.state.currentObjectName),this.currentObjectName=this.$store.state.currentObjectName},methods:{getObjectData:function(){console.log("this.currentObjectName",this.currentObjectName),this.$refs.vuetable.selectedTo=[],this.selectedEntityIds=[],this.loading=!0;var t=(this.currPage-1)*parseInt(this.perPage,10),e=this,n=I()({url:"".concat(this.apiUrl),method:"post",data:"action=list&ObjectName=".concat(this.currentObjectName,"&offset=").concat(t,"&limit=").concat(this.perPage,"&searchField=").concat(this.searchField,"&searchText=").concat(this.searchText)});return n.then(function(t){e.loading=!1,e.rowNumber=0,t.data&&t.data.result&&(t.data.result.Fields&&e.setFields(t.data.result.Fields),t.data.result.Values&&(e.rowNumber=t.data.result.Values.length),e.$nextTick(function(){e.$refs.vuetable.normalizeFields()}))}),n},setFields:function(t){var e=f.a.keys(t);this.fields=e,this.tableHeaders=f.a.concat("__checkbox","__slot:actions","EntityId",e)},deleteRow:function(t){var e=this;t.EntityId>0&&confirm("The object with the EntityId: ".concat(t.EntityId," will be deleted"))&&I()({url:"".concat(this.apiUrl),method:"post",data:"action=delete&ids=".concat(t.EntityId)}).then(function(){e.pagingCorrection(1),e.$nextTick(function(){e.$refs.vuetable.reload()})})},deleteRows:function(){var t=this,e="The objects with the following EntityIds will be deleted: ".concat(this.selectedEntityIds.join());this.selectedEntityIds.length>0&&confirm(e)&&I()({url:"".concat(this.apiUrl),method:"post",data:"action=delete&ids=".concat(this.selectedEntityIds.join(","))}).then(function(){t.pagingCorrection(t.selectedEntityIds.length),t.$nextTick(function(){t.$refs.vuetable.reload()})})},pagingCorrection:function(t){var e=this.$refs.pagination,n=this.rowNumber-t;0===n&&e.isOnLastPage&&!e.isOnFirstPage&&this.onChangePage("prev")},onCheckboxToggled:function(){this.selectedEntityIds=this.$refs.vuetable.selectedTo},onPaginationData:function(t){if(t){var e=f.a.clone(t);e.next_page_url="".concat(this.apiUrl),e.prev_page_url="".concat(this.apiUrl),e.last_page=Math.ceil(t.total/parseInt(this.perPage,10)),e.current_page=this.currPage,this.$refs.pagination.setPaginationData(e),this.$refs.paginationInfo.setPaginationData(e)}},onChangePage:function(t){"next"===t?this.currPage+=1:"prev"===t?this.currPage-=1:this.currPage=t,this.$refs.vuetable.changePage(t)},saveData:function(){var t=this,e={};f.a.each(this.editedRow,function(t){e[t.name]=t.value});var n=JSON.stringify(e);I()({url:"".concat(this.apiUrl),method:"post",data:"action=edit&manager=objects&ObjectName=".concat(this.currentObjectName,"&properties=").concat(n)}).then(function(){t.$nextTick(function(){t.editedRow=[],t.$refs.vuetable.reload(),t.$refs.modalEditor.close()})})},onRowClick:function(t){var e=[];f.a.each(t,function(t,n){e.push({name:n,value:t})}),this.editedRow=e,this.$refs.modalEditor.open()},onCancelEdit:function(){this.editedRow=[],this.$refs.modalEditor.close()},onEnter:function(){parseInt(Number(this.perPageInput),10)!==this.perPage&&(this.perPageInput=this.perPage),this.currPage=1,this.$refs.vuetable.reload()}}},U=E,T=(n("f00f"),Object(v["a"])(U,P,x,!1,null,null,null)),L=T.exports;a["default"].use(w["a"]);var S=new w["a"]({routes:[{path:"/list/:id/",name:"ObjectTable",components:{default:L},props:{default:!0}}]}),D=n("2f62"),F={ApiUrl:"?eav-viewer"},R=n("0e44");a["default"].use(D["a"]);var A=new D["a"].Store({plugins:[Object(R["a"])()],state:{apiUrl:F.ApiUrl,objectsList:null,currentObjectName:""},mutations:{setObjectsList:function(t,e){t.objectsList=e},setObjectsName:function(t,e){t.currentObjectName=e},setAppUrl:function(t,e){t.apiUrl=e}},actions:{setAppUrl:function(t,e){var n=t.commit;n("setAppUrl",e)},getObjectsList:function(t){var e=t.commit,n=t.state;I()({url:"".concat(n.apiUrl,"-action"),method:"post",data:"action=types"}).then(function(t){t&&t.data&&t.data.result?e("setObjectsList",t.data.result):console.log("can't get data")}).catch(function(t){console.log(t)})},setObjectsName:function(t,e){var n=t.commit;n("setObjectsName",e)}}});a["default"].use(r.a),a["default"].use(s["ServerTable"]),a["default"].use(s["ClientTable"]),a["default"].use(o["a"]),a["default"].config.productionTip=!1,new a["default"]({router:S,store:A,render:function(t){return t(_)}}).$mount("#app")},"5c0b":function(t,e,n){"use strict";var a=n("5e27"),i=n.n(a);i.a},"5e27":function(t,e,n){},f00f:function(t,e,n){"use strict";var a=n("5100"),i=n.n(a);i.a}});
//# sourceMappingURL=app.773fde0d.js.map