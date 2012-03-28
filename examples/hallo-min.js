/*
  Hallo - a rich text editing jQuery UI widget
  (c) 2011 Henri Bergius, IKS Consortium
  Hallo may be freely distributed under the MIT license
  */(function(a){return a.widget("IKS.hallo",{toolbar:null,bound:!1,originalContent:"",uuid:"",selection:null,options:{editable:!0,plugins:{},floating:!0,offset:{x:0,y:0},fixed:!1,showAlways:!1,activated:function(){},deactivated:function(){},selected:function(){},unselected:function(){},enabled:function(){},disabled:function(){},placeholder:"",parentElement:"body",forceStructured:!0,buttonCssClass:null},_create:function(){var b,c,d,e;this.originalContent=this.getContents(),this.id=this._generateUUID(),this._prepareToolbar(),d=this.options.plugins,e=[];for(c in d)b=d[c],a.isPlainObject(b)||(b={}),b.editable=this,b.toolbar=this.toolbar,b.uuid=this.id,b.buttonCssClass=this.options.buttonCssClass,e.push(a(this.element)[c](b));return e},_init:function(){return this.options.editable?this.enable():this.disable()},disable:function(){return this.element.attr("contentEditable",!1),this.element.unbind("focus",this._activated),this.element.unbind("blur",this._deactivated),this.element.unbind("keyup paste change",this._checkModified),this.element.unbind("keyup",this._keys),this.element.unbind("keyup mouseup",this._checkSelection),this.bound=!1,this._trigger("disabled",null)},enable:function(){var a;return this.element.attr("contentEditable",!0),this.element.html()||this.element.html(this.options.placeholder),this.bound||(this.element.bind("focus",this,this._activated),this.element.bind("blur",this,this._deactivated),this.element.bind("keyup paste change",this,this._checkModified),this.element.bind("keyup",this,this._keys),this.element.bind("keyup mouseup",this,this._checkSelection),a=this,this.bound=!0),this.options.forceStructured&&this._forceStructured(),this._trigger("enabled",null)},activate:function(){return this.element.focus()},getSelection:function(){var b,c;if(a.browser.msie)b=document.selection.createRange();else{if(window.getSelection)c=window.getSelection();else{if(!document.selection)throw"Your browser does not support selection handling";c=document.selection.createRange()}c.rangeCount>0?b=c.getRangeAt(0):b=c}return b},restoreSelection:function(b){return a.browser.msie?b.select():(window.getSelection().removeAllRanges(),window.getSelection().addRange(b))},replaceSelection:function(b){var c,d,e,f,g;return a.browser.msie?(g=document.selection.createRange().text,d=document.selection.createRange(),d.pasteHTML(b(g))):(f=window.getSelection(),e=f.getRangeAt(0),c=document.createTextNode(b(e.extractContents())),e.insertNode(c),e.setStartAfter(c),f.removeAllRanges(),f.addRange(e))},removeAllSelections:function(){return a.browser.msie?range.empty():window.getSelection().removeAllRanges()},getContents:function(){return this.element.html()},setContents:function(a){return this.element.html(a)},isModified:function(){return this.originalContent!==this.getContents()},setUnmodified:function(){return this.originalContent=this.getContents()},restoreOriginalContent:function(){return this.element.html(this.originalContent)},execute:function(a,b){if(document.execCommand(a,!1,b))return this.element.trigger("change")},_generateUUID:function(){var a;return a=function(){return((1+Math.random())*65536|0).toString(16).substring(1)},""+a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()},_getToolbarPosition:function(a,b){var c;if(!a)return;if(!this.options.floating)return c=parseFloat(this.element.css("outline-width"))+parseFloat(this.element.css("outline-offset")),{top:this.element.offset().top-this.toolbar.outerHeight()-c,left:this.element.offset().left-c};if(a.originalEvent instanceof KeyboardEvent)return this._getCaretPosition(b);if(a.originalEvent instanceof MouseEvent)return{top:a.pageY,left:a.pageX}},_getCaretPosition:function(b){var c,d,e;return e=a("<span/>"),c=document.createRange(),c.setStart(b.endContainer,b.endOffset),c.insertNode(e.get(0)),d={top:e.offset().top,left:e.offset().left},e.remove(),d},_bindToolbarEventsFixed:function(){var a=this;return this.options.floating=!1,this.element.bind("halloactivated",function(b,c){return a._updateToolbarPosition(a._getToolbarPosition(b)),a.toolbar.show()}),this.element.bind("hallodeactivated",function(b,c){return a.toolbar.hide()})},_bindToolbarEventsRegular:function(){var a=this;return this.element.bind("halloselected",function(b,c){var d;d=a._getToolbarPosition(c.originalEvent,c.selection);if(!d)return;return a._updateToolbarPosition(d),a.toolbar.show()}),this.element.bind("hallounselected",function(b,c){return a.toolbar.hide()}),this.element.bind("hallodeactivated",function(b,c){return a.toolbar.hide()})},_prepareToolbar:function(){var b=this;return this.toolbar=a('<div class="hallotoolbar"></div>').hide(),this.options.fixed||(this.toolbar.css("position","absolute"),this.toolbar.css("top",this.element.offset().top-20),this.toolbar.css("left",this.element.offset().left)),a(this.options.parentElement).append(this.toolbar),this.toolbar.bind("mousedown",function(a){return a.preventDefault()}),this.options.showAlways&&this._bindToolbarEventsFixed(),this.options.showAlways||this._bindToolbarEventsRegular(),a(window).resize(function(a){return b._updateToolbarPosition(b._getToolbarPosition(a))})},_updateToolbarPosition:function(a){if(this.options.fixed)return;if(!a)return;if(!a.top||!a.left)return;return this.toolbar.css("top",a.top),this.toolbar.css("left",a.left)},_checkModified:function(a){var b;b=a.data;if(b.isModified())return b._trigger("modified",null,{editable:b,content:b.getContents()})},_keys:function(a){var b,c;c=a.data;if(a.keyCode===27)return b=c.getContents(),c.restoreOriginalContent(a),c._trigger("restored",null,{editable:c,content:c.getContents(),thrown:b}),c.turnOff()},_rangesEqual:function(a,b){return a.startContainer===b.startContainer&&a.startOffset===b.startOffset&&a.endContainer===b.endContainer&&a.endOffset===b.endOffset},_checkSelection:function(a){var b;if(a.keyCode===27)return;return b=a.data,setTimeout(function(){var c;c=b.getSelection();if(b._isEmptySelection(c)||b._isEmptyRange(c)){b.selection&&(b.selection=null,b._trigger("unselected",null,{editable:b,originalEvent:a}));return}if(!b.selection||!b._rangesEqual(c,b.selection))return b.selection=c.cloneRange(),b._trigger("selected",null,{editable:b,selection:b.selection,ranges:[b.selection],originalEvent:a})},0)},_isEmptySelection:function(a){return a.type==="Caret"?!0:!1},_isEmptyRange:function(a){return a.collapsed?!0:a.isCollapsed?a.isCollapsed():!1},turnOn:function(){var b,c;return this.getContents()===this.options.placeholder&&this.setContents(""),a(this.element).addClass("inEditMode"),this.options.floating?this.toolbar.css("width","auto"):(b=a(this.element),c=parseFloat(b.css("padding-left")),c+=parseFloat(b.css("padding-right")),c+=parseFloat(b.css("border-left-width")),c+=parseFloat(b.css("border-right-width")),c+=parseFloat(b.css("outline-width"))*2,c+=parseFloat(b.css("outline-offset"))*2,a(this.toolbar).css("width",b.width()+c)),this._trigger("activated",this)},turnOff:function(){a(this.element).removeClass("inEditMode"),this._trigger("deactivated",this);if(!this.getContents())return this.setContents(this.options.placeholder)},_activated:function(a){return a.data.turnOn()},_deactivated:function(a){return a.data.turnOff()},_forceStructured:function(a){try{return document.execCommand("styleWithCSS",0,!1)}catch(b){try{return document.execCommand("useCSS",0,!0)}catch(b){try{return document.execCommand("styleWithCSS",!1,!1)}catch(b){}}}}})})(jQuery),function(a){return a.widget("IKS.hallolists",{options:{editable:null,toolbar:null,uuid:"",lists:{ordered:!1,unordered:!0},buttonCssClass:null},_create:function(){var b,c,d=this;return c=a('<span class="'+this.widgetName+'"></span>'),b=function(b,e){var f;return f=a("<span></span>"),f.hallobutton({uuid:d.options.uuid,editable:d.options.editable,label:e,command:"insert"+b+"List",icon:"icon-list",cssClass:d.options.buttonCssClass}),c.append(f)},this.options.lists.ordered&&b("Ordered","OL"),this.options.lists.unordered&&b("Unordered","UL"),c.buttonset(),this.options.toolbar.append(c)},_init:function(){}})}(jQuery),function(a){return a.widget("IKS.halloheadings",{options:{editable:null,toolbar:null,uuid:"",headers:[1,2,3]},_create:function(){var b,c,d,e,f,g,h,i,j,k,l=this;h=this,d=a('<span class="'+h.widgetName+'"></span>'),f=""+this.options.uuid+"-paragraph",g="P",d.append(a('<input id="'+f+'" type="radio" name="'+h.options.uuid+'-headings"/><label for="'+f+'" class="p_button">'+g+"</label>").button()),b=a("#"+f,d),b.attr("hallo-command","formatBlock"),b.bind("change",function(b){var c;return c=a(this).attr("hallo-command"),h.options.editable.execute(c,"P")}),c=function(c){return g="H"+c,f=""+l.options.uuid+"-"+c,d.append(a('<input id="'+f+'" type="radio" name="'+h.options.uuid+'-headings"/><label for="'+f+'" class="h'+c+'_button">'+g+"</label>").button()),b=a("#"+f,d),b.attr("hallo-size","H"+c),b.bind("change",function(b){var c;return c=a(this).attr("hallo-size"),h.options.editable.execute("formatBlock",c)})},k=this.options.headers;for(i=0,j=k.length;i<j;i++)e=k[i],c(e);return d.buttonset(),this.element.bind("keyup paste change mouseup",function(b){var c,e,f,g,i;try{c=document.queryCommandValue("formatBlock").toUpperCase()}catch(j){c=""}if(c==="P")i=a("#"+h.options.uuid+"-paragraph");else if(g=c.match(/\d/))e=g[0],i=a("#"+h.options.uuid+"-"+e);f=a(d),f.children("input").attr("checked",!1),f.children("label").removeClass("ui-state-clicked"),f.children("input").button("widget").button("refresh");if(i)return i.attr("checked",!0),i.next("label").addClass("ui-state-clicked"),i.button("refresh")}),this.options.toolbar.append(d)},_init:function(){}})}(jQuery),function(a){return a.widget("Liip.hallooverlay",{options:{editable:null,toolbar:null,uuid:"",overlay:null,padding:10,background:null},_create:function(){var b;b=this;if(!this.options.bound)return this.options.bound=!0,b.options.editable.element.bind("halloactivated",function(c,d){b.options.currentEditable=a(c.target);if(!b.options.visible)return b.showOverlay()}),b.options.editable.element.bind("hallomodified",function(c,d){b.options.currentEditable=a(c.target);if(b.options.visible)return b.resizeOverlay()}),b.options.editable.element.bind("hallodeactivated",function(c,d){b.options.currentEditable=a(c.target);if(b.options.visible)return b.hideOverlay()})},_init:function(){},showOverlay:function(){return this.options.visible=!0,this.options.overlay===null&&(a("#halloOverlay").length>0?this.options.overlay=a("#halloOverlay"):(this.options.overlay=a('<div id="halloOverlay" class="halloOverlay">'),a(document.body).append(this.options.overlay)),this.options.overlay.bind("click",a.proxy(this.options.editable.turnOff,this.options.editable))),this.options.overlay.show(),this.options.background===null&&(a("#halloBackground").length>0?this.options.background=a("#halloBackground"):(this.options.background=a('<div id="halloBackground" class="halloBackground">'),a(document.body).append(this.options.background))),this.resizeOverlay(),this.options.background.show(),this.options.originalZIndex||(this.options.originalZIndex=this.options.currentEditable.css("z-index")),this.options.currentEditable.css("z-index","350")},resizeOverlay:function(){var a;return a=this.options.currentEditable.offset(),this.options.background.css({top:a.top-this.options.padding,left:a.left-this.options.padding}),this.options.background.width(this.options.currentEditable.width()+2*this.options.padding),this.options.background.height(this.options.currentEditable.height()+2*this.options.padding)},hideOverlay:function(){return this.options.visible=!1,this.options.overlay.hide(),this.options.background.hide(),this.options.currentEditable.css("z-index",this.options.originalZIndex)},_findBackgroundColor:function(a){var b;return b=a.css("background-color"),b!=="rgba(0, 0, 0, 0)"&&b!=="transparent"?b:a.is("body")?"white":this._findBackgroundColor(a.parent())}})}(jQuery),function(a){return a.widget("Liip.hallotoolbarlinebreak",{options:{editable:null,toolbar:null,uuid:"",breakAfter:[]},_create:function(){var b,c,d,e,f,g,h,i,j,k;c=a(".ui-buttonset",this.options.toolbar),d=a(),f=0,k=this.options.breakAfter;for(g=0,i=k.length;g<i;g++){e=k[g],f++;for(h=0,j=c.length;h<j;h++){b=c[h],d=a(d).add(a(b));if(a(b).hasClass(e)){d.wrapAll('<div class="halloButtonrow halloButtonrow-'+f+'" />'),c=c.not(d),d=a();break}}}if(c.length>0)return f++,c.wrapAll('<div class="halloButtonrow halloButtonrow-'+f+'" />')},_init:function(){}})}(jQuery),function(a){return a.widget("Liip.halloimage",{options:{editable:null,toolbar:null,uuid:"",limit:8,search:null,suggestions:null,loaded:null,upload:null,uploadUrl:null,dialogOpts:{autoOpen:!1,width:270,height:"auto",title:"Insert Images",modal:!1,resizable:!1,draggable:!0,dialogClass:"halloimage-dialog",close:function(b,c){return a(".image_button").removeClass("ui-state-clicked")}},dialog:null,buttonCssClass:null},_create:function(){var b,c,d,e,f,g;return g=this,e=""+this.options.uuid+"-image-dialog",this.options.dialog=a('<div id="'+e+'">                <div class="nav">                    <ul class="tabs">                    </ul>                    <div id="'+this.options.uuid+'-tab-activeIndicator" class="tab-activeIndicator" />                </div>                <div class="dialogcontent">            </div>'),g.options.uploadUrl&&!g.options.upload&&(g.options.upload=g._iframeUpload),g.options.suggestions&&this._addGuiTabSuggestions(a(".tabs",this.options.dialog),a(".dialogcontent",this.options.dialog)),g.options.search&&this._addGuiTabSearch(a(".tabs",this.options.dialog),a(".dialogcontent",this.options.dialog)),g.options.upload&&this._addGuiTabUpload(a(".tabs",this.options.dialog),a(".dialogcontent",this.options.dialog)),d=a('<span class="'+g.widgetName+'"></span>'),f=""+this.options.uuid+"-image",c=a("<span></span>"),c.hallobutton({label:"Images",icon:"icon-picture",editable:this.options.editable,command:null,queryState:!1,uuid:this.options.uuid,cssClass:this.options.buttonCssClass}),d.append(c),b=c.button(),b.bind("change",function(a){return g.options.dialog.dialog("isOpen")?g._closeDialog():g._openDialog()}),this.options.editable.element.bind("hallodeactivated",function(a){return g._closeDialog()}),a(this.options.editable.element).delegate("img","click",function(a){return g._openDialog()}),a(this.options.dialog).find(".nav li").click(function(){return a("."+g.widgetName+"-tab").each(function(){return a(this).hide()}),f=a(this).attr("id"),a("#"+f+"-content").show(),a("#"+g.options.uuid+"-tab-activeIndicator").css("margin-left",a(this).position().left+a(this).width()/2)}),a("."+g.widgetName+"-tab .imageThumbnail").live("click",function(b){var c;return c=a(this).closest("."+g.widgetName+"-tab"),a(".imageThumbnail",c).removeClass("imageThumbnailActive"),a(this).addClass("imageThumbnailActive"),a(".activeImage",c).attr("src",a(this).attr("src")),a(".activeImageBg",c).attr("src",a(this).attr("src"))}),d.buttonset(),this.options.toolbar.append(d),this.options.dialog.dialog(this.options.dialogOpts),this._addDragnDrop()},_init:function(){},_openDialog:function(){var b,c,d,e,f,g,h,i,j,k,l,m;k=this,c=function(){return window.setTimeout(function(){var b;return b=a(".imageThumbnail"),a(b).each(function(){var b;b=a("#"+this.id).width();if(b<=20)return a("#"+this.id).parent("li").remove()})},15e3)},e=!1,f=function(b){a.each(b.assets,function(b,c){return a(".imageThumbnailContainer ul").append('<li><img src="'+c.url+'" class="imageThumbnail"></li>'),e=!0});if(b.assets.length>0)return a("#activitySpinner").hide()},a(".image_button").addClass("ui-state-clicked"),a("#"+this.options.uuid+"-sugg-activeImage").attr("src",a("#"+this.options.uuid+"-tab-suggestions-content .imageThumbnailActive").first().attr("src")),a("#"+this.options.uuid+"-sugg-activeImageBg").attr("src",a("#"+this.options.uuid+"-tab-suggestions-content .imageThumbnailActive").first().attr("src")),this.lastSelection=this.options.editable.getSelection(),l=a(this.options.editable.element).offset().left+a(this.options.editable.element).outerWidth()-3,m=a(this.options.toolbar).offset().top-a(document).scrollTop()-29,this.options.dialog.dialog("option","position",[l,m]);if(k.options.loaded===null&&k.options.suggestions){b=[],a("#activitySpinner").show(),i=a(".inEditMode").parent().find(".articleTags input").val(),i=i.split(",");for(d in i)g=typeof i[d],"string"===g&&i[d].indexOf("http")!==-1&&b.push(i[d]);a(".imageThumbnailContainer ul").empty(),k.options.suggestions(a(".inEditMode").parent().find(".articleTags input").val(),k.options.limit,0,f),j=new VIE,j.use(new j.DBPediaService({url:"http://dev.iks-project.eu/stanbolfull",proxyDisabled:!0})),h=1,b.length===0&&a("#activitySpinner").html("No images found."),a(b).each(function(){return j.load({entity:this+""}).using("dbpedia").execute().done(function(b){return a(b).each(function(){var b,c;if(this.attributes["<http://dbpedia.org/ontology/thumbnail>"])return c=typeof this.attributes["<http://dbpedia.org/ontology/thumbnail>"],c==="string"&&(b=this.attributes["<http://dbpedia.org/ontology/thumbnail>"],b=b.substring(1,b.length-1)),c==="object"&&(b="",b=this.attributes["<http://dbpedia.org/ontology/thumbnail>"][0].value),a(".imageThumbnailContainer ul").append('<li><img id="si-'+h+'" src="'+b+'" class="imageThumbnail"></li>'),h++}),a("#activitySpinner").hide()})})}return c(),k.options.loaded=1,this.options.dialog.dialog("open")},_closeDialog:function(){return this.options.dialog.dialog("close")},_addGuiTabSuggestions:function(b,c){var d;return d=this,b.append(a('<li id="'+this.options.uuid+'-tab-suggestions" class="'+d.widgetName+"-tabselector "+d.widgetName+'-tab-suggestions"><span>Suggestions</span></li>')),c.append(a('<div id="'+this.options.uuid+'-tab-suggestions-content" class="'+d.widgetName+'-tab tab-suggestions">                <div class="imageThumbnailContainer fixed"><div id="activitySpinner">Loading Images...</div><ul><li>                    <img src="http://imagesus.homeaway.com/mda01/badf2e69babf2f6a0e4b680fc373c041c705b891" class="imageThumbnail imageThumbnailActive" />                  </li></ul><br style="clear:both"/>                </div>                <div class="activeImageContainer">                    <div class="rotationWrapper">                        <div class="hintArrow"></div>                        <img src="" id="'+this.options.uuid+'-sugg-activeImage" class="activeImage" />                    </div>                    <img src="" id="'+this.options.uuid+'-sugg-activeImageBg" class="activeImage activeImageBg" />                </div>                <div class="metadata">                    <label for="caption-sugg">Caption</label><input type="text" id="caption-sugg" />                </div>            </div>'))},_addGuiTabSearch:function(b,c){var d,e;return e=this,d=""+this.options.uuid+"-image-dialog",b.append(a('<li id="'+this.options.uuid+'-tab-search" class="'+e.widgetName+"-tabselector "+e.widgetName+'-tab-search"><span>Search</span></li>')),c.append(a('<div id="'+this.options.uuid+'-tab-search-content" class="'+e.widgetName+'-tab tab-search">                <form type="get" id="'+this.options.uuid+"-"+e.widgetName+'-searchForm">                    <input type="text" class="searchInput" /><input type="submit" id="'+this.options.uuid+"-"+e.widgetName+'-searchButton" class="button searchButton" value="OK"/>                </form>                <div class="searchResults imageThumbnailContainer"></div>                <div id="'+this.options.uuid+'-search-activeImageContainer" class="search-activeImageContainer activeImageContainer">                    <div class="rotationWrapper">                        <div class="hintArrow"></div>                        <img src="" id="'+this.options.uuid+'-search-activeImageBg" class="activeImage" />                    </div>                    <img src="" id="'+this.options.uuid+'-search-activeImage" class="activeImage activeImageBg" />                </div>                <div class="metadata" id="metadata-search" style="display: none;">                    <label for="caption-search">Caption</label><input type="text" id="caption-search" />                    <!--<button id="'+this.options.uuid+"-"+e.widgetName+'-addimage">Add Image</button>-->                </div>            </div>')),a(".tab-search form",c).submit(function(b){var c,f;return b.preventDefault(),f=this,c=function(b){var f,g,h;return h=[],h.push('<div class="pager-prev" style="display:none"></div>'),a.each(b.assets,function(a,b){return h.push('<img src="'+b.url+'" class="imageThumbnail '+e.widgetName+'-search-imageThumbnail" /> ')}),h.push('<div class="pager-next" style="display:none"></div>'),f=a("#"+d+" .tab-search .searchResults"),f.html(h.join("")),b.offset>0&&a(".pager-prev",f).show(),b.offset<b.total&&a(".pager-next",f).show(),a(".pager-prev",f).click(function(a){return e.options.search(null,e.options.limit,b.offset-e.options.limit,c)}),a(".pager-next",f).click(function(a){return e.options.search(null,e.options.limit,b.offset+e.options.limit,c)}),a("#"+e.options.uuid+"-search-activeImageContainer").show(),g=a("."+e.widgetName+"-search-imageThumbnail").first().addClass("imageThumbnailActive"),a("#"+e.options.uuid+"-search-activeImage, #"+e.options.uuid+"-search-activeImageBg").attr("src",g.attr("src")),a("#metadata-search").show()},e.options.search(null,e.options.limit,0,c)})},_prepareIframe:function(b){var c;return b.options.iframeName=""+b.options.uuid+"-"+b.widgetName+"-postframe",c=a('<iframe name="'+b.options.iframeName+'" id="'+b.options.iframeName+'" class="hidden" src="javascript:false;" style="display:none" />'),a("#"+b.options.uuid+"-"+b.widgetName+"-iframe").append(c),c.get(0).name=b.options.iframeName},_iframeUpload:function(b){var c,d;return d=b.widget,d._prepareIframe(d),a("#"+d.options.uuid+"-"+d.widgetName+"-tags").val(a(".inEditMode").parent().find(".articleTags input").val()),c=a("#"+d.options.uuid+"-"+d.widgetName+"-uploadform"),c.attr("action",d.options.uploadUrl),c.attr("method","post"),c.attr("userfile",b.file),c.attr("enctype","multipart/form-data"),c.attr("encoding","multipart/form-data"),c.attr("target",d.options.iframeName),c.submit(),a("#"+d.options.iframeName).load(function(){return b.success(a("#"+d.options.iframeName)[0].contentWindow.location.href)})},_addGuiTabUpload:function(b,c){var d,e,f;return f=this,b.append(a('<li id="'+this.options.uuid+'-tab-upload" class="'+f.widgetName+"-tabselector "+f.widgetName+'-tab-upload"><span>Upload</span></li>')),c.append(a('<div id="'+this.options.uuid+'-tab-upload-content" class="'+f.widgetName+'-tab tab-upload">                <form id="'+this.options.uuid+"-"+f.widgetName+'-uploadform">                    <input id="'+this.options.uuid+"-"+f.widgetName+'-file" name="'+this.options.uuid+"-"+f.widgetName+'-file" type="file" class="file">                    <input id="'+this.options.uuid+"-"+f.widgetName+'-tags" name="tags" type="hidden" />                    <br />                    <input type="submit" value="Upload" id="'+this.options.uuid+"-"+f.widgetName+'-upload">                </form>                <div id="'+this.options.uuid+"-"+f.widgetName+'-iframe"></div>            </div>')),d=a('<iframe name="postframe" id="postframe" class="hidden" src="about:none" style="display:none" />'),a("#"+f.options.uuid+"-"+f.widgetName+"-upload").live("click",function(b){var c;return b.preventDefault(),c=a("#"+f.options.uuid+"-"+f.widgetName+"-file").val(),f.options.upload({widget:f,file:c,success:function(b){var c,d;return c="si"+Math.floor(Math.random()*101+400)+"ab",a(".imageThumbnailContainer ul",f.options.dialog).length===0&&(d=a("<ul></ul>"),a(".imageThumbnailContainer").append(d)),a(".imageThumbnailContainer ul",f.options.dialog).append('<li><img src="'+b+'" id="'+c+'" class="imageThumbnail"></li>'),a("#"+c).trigger("click"),a(f.options.dialog).find(".nav li").first().trigger("click")}}),!1}),e=function(){var b,c;try{if(!f.options.editable.getSelection())throw new Error("SelectionNotSet")}catch(d){f.options.editable.restoreSelection(f.lastSelection)}return document.execCommand("insertImage",null,a(this).attr("src")),b=document.getSelection().anchorNode.firstChild,a(b).attr("alt",a(".caption").value),c=function(){return f.element.trigger("hallomodified")},window.setTimeout(c,100),f._closeDialog()},this.options.dialog.find(".halloimage-activeImage, #"+f.options.uuid+"-"+f.widgetName+"-addimage").click(e)},_addDragnDrop:function(){var b,c,d,e,f,g,h,i,j;return e={delayAction:function(a,b){var c;c=clearTimeout(c);if(!c)return c=setTimeout(a,b)},calcPosition:function(a,b){var c;c=a.left+i;if(b.pageX>=c&&b.pageX<=a.left+i*2)return"middle";if(b.pageX<c)return"left";if(b.pageX>a.left+i*2)return"right"},createInsertElement:function(b,c){var d,e,f,g,h,i,j,k;h=250,g=250,j=new Image,j.src=b.src,c||(this.startPlace.parents(".tab-suggestions").length>0?d=a("#caption-sugg").val():this.startPlace.parents(".tab-search").length>0?d=a("#caption-search").val():d=a(b).attr("alt")),k=j.width,e=j.height;if(k>h||e>g)k>e?i=(j.width/h).toFixed():i=(j.height/g).toFixed(),k=(j.width/i).toFixed(),e=(j.height/i).toFixed();return f=a("<img>").attr({src:j.src,width:k,height:e,alt:d,"class":c?"tmp":""}).show(),f},createLineFeedbackElement:function(){return a("<div/>").addClass("tmpLine")},removeFeedbackElements:function(){return a(".tmp, .tmpLine",d).remove()},removeCustomHelper:function(){return a(".customHelper").remove()},showOverlay:function(a){var b;b=d.height()+parseFloat(d.css("paddingTop"))+parseFloat(d.css("paddingBottom")),g.big.css({height:b}),g.left.css({height:b}),g.right.css({height:b});switch(a){case"left":return g.big.addClass("bigOverlayLeft").removeClass("bigOverlayRight").css({left:i}).show(),g.left.hide(),g.right.hide();case"middle":return g.big.removeClass("bigOverlayLeft bigOverlayRight"),g.big.hide(),g.left.show(),g.right.show();case"right":return g.big.addClass("bigOverlayRight").removeClass("bigOverlayLeft").css({left:0}).show(),g.left.hide(),g.right.hide()}},checkOrigin:function(b){return a(b.target).parents("[contenteditable]").length!==0?!0:!1},startPlace:""},b={createTmpFeedback:function(a,b){var c;return b==="middle"?e.createLineFeedbackElement():(c=e.createInsertElement(a,!0),c.addClass("inlineImage-"+b))},handleOverEvent:function(c,h){var i;return i=function(){var i;return window.waitWithTrash=clearTimeout(window.waitWithTrash),i=e.calcPosition(f,c),a(".trashcan",h.helper).remove(),d.append(g.big),d.append(g.left),d.append(g.right),e.removeFeedbackElements(),a(c.target).prepend(b.createTmpFeedback(h.draggable[0],i)),i==="middle"?(a(c.target).prepend(b.createTmpFeedback(h.draggable[0],"right")),a(".tmp",a(c.target)).hide()):(a(c.target).prepend(b.createTmpFeedback(h.draggable[0],"middle")),a(".tmpLine",a(c.target)).hide()),e.showOverlay(i)},setTimeout(i,5)},handleDragEvent:function(c,g){var h,i,j;h=e.calcPosition(f,c);if(h===b.lastPositionDrag)return;return b.lastPositionDrag=h,i=a(".tmp",d),j=a(".tmpLine",d),h==="middle"?(j.show(),i.hide()):(j.hide(),i.removeClass("inlineImage-left inlineImage-right").addClass("inlineImage-"+h).show()),e.showOverlay(h)},handleLeaveEvent:function(b,c){var d;return d=function(){return a("div.trashcan",c.helper).length||a(c.helper).append(a('<div class="trashcan"></div>')),a(".bigOverlay, .smallOverlay").remove()},window.waitWithTrash=setTimeout(d,200),e.removeFeedbackElements()},handleStartEvent:function(b,c){var d;return d=e.checkOrigin(b),d&&a(b.target).remove(),a(document).trigger("startPreventSave"),e.startPlace=a(b.target)},handleStopEvent:function(b,c){var f;return f=e.checkOrigin(b),f?a(b.target).remove():d.trigger("change"),g.big.hide(),g.left.hide(),g.right.hide(),a(document).trigger("stopPreventSave")},handleDropEvent:function(c,h){var i,j,k;return j=e.checkOrigin(c),k=e.calcPosition(f,c),e.removeFeedbackElements(),e.removeCustomHelper(),i=e.createInsertElement(h.draggable[0],!1),k==="middle"?(i.show(),i.removeClass("inlineImage-middle inlineImage-left inlineImage-right").addClass("inlineImage-"+k).css({position:"relative",left:(d.width()+parseFloat(d.css("paddingLeft"))+parseFloat(d.css("paddingRight"))-i.attr("width"))/2}),i.insertBefore(a(c.target))):(i.removeClass("inlineImage-middle inlineImage-left inlineImage-right").addClass("inlineImage-"+k).css("display","block"),a(c.target).prepend(i)),g.big.hide(),g.left.hide(),g.right.hide(),d.trigger("change"),b.init(d)},createHelper:function(b){return a("<div>").css({backgroundImage:"url("+a(b.currentTarget).attr("src")+")"}).addClass("customHelper").appendTo("body")},init:function(){var e,f;return e=[],f=function(e){return e.jquery_draggable_initialized||(e.jquery_draggable_initialized=!0,a(e).draggable({cursor:"move",helper:b.createHelper,drag:b.handleDragEvent,start:b.handleStartEvent,stop:b.handleStopEvent,disabled:!d.hasClass("inEditMode"),cursorAt:{top:50,left:50}})),c.push(e)},a(".rotationWrapper img",j.dialog).each(function(a,b){if(!b.jquery_draggable_initialized)return f(b)}),a("img",d).each(function(a,b){b.contentEditable=!1;if(!b.jquery_draggable_initialized)return f(b)}),a("p",d).each(function(c,e){if(!e.jquery_droppable_initialized)return e.jquery_droppable_initialized=!0,a("p",d).droppable({tolerance:"pointer",drop:b.handleDropEvent,over:b.handleOverEvent,out:b.handleLeaveEvent})})},enableDragging:function(){return a.each(c,function(b,c){return a(c).draggable("option","disabled",!1)})},disableDragging:function(){return a.each(c,function(b,c){return a(c).draggable("option","disabled",!0)})}},c=[],d=a(this.options.editable.element),j=this.options,f=d.offset(),i=parseFloat(d.width()/3),h={width:i,height:d.height()},g={big:a("<div/>").addClass("bigOverlay").css({width:i*2,height:d.height()}),left:a("<div/>").addClass("smallOverlay smallOverlayLeft").css(h),right:a("<div/>").addClass("smallOverlay smallOverlayRight").css(h).css("left",i*2)},b.init(),d.bind("halloactivated",b.enableDragging),d.bind("hallodeactivated",b.disableDragging)}})}(jQuery),function(a){return a.widget("IKS.halloformat",{options:{editable:null,toolbar:null,uuid:"",formattings:{bold:!0,italic:!0,strikeThrough:!1,underline:!1},buttonCssClass:null},_create:function(){var b,c,d,e,f,g,h=this;f=this,c=a('<span class="'+f.widgetName+'"></span>'),b=function(b){var d;return d=a("<span></span>"),d.hallobutton({label:b,editable:h.options.editable,command:b,uuid:h.options.uuid,cssClass:h.options.buttonCssClass}),c.append(d)},g=this.options.formattings;for(e in g)d=g[e],d&&b(e);return c.buttonset(),this.options.toolbar.append(c)},_init:function(){}})}(jQuery),function(a){return a.widget("IKS.halloreundo",{options:{editable:null,toolbar:null,uuid:"",buttonCssClass:null},_create:function(){var b,c,d=this;return c=a('<span class="'+this.widgetName+'"></span>'),b=function(b,e){var f;return f=a("<span></span>"),f.hallobutton({uuid:d.options.uuid,editable:d.options.editable,label:e,icon:b==="undo"?"icon-arrow-left":"icon-arrow-right",command:b,queryState:!1,cssClass:d.options.buttonCssClass}),c.append(f)},b("undo","Undo"),b("redo","Redo"),c.buttonset(),this.options.toolbar.append(c)},_init:function(){}})}(jQuery),function(a){return a.widget("IKS.halloblock",{options:{editable:null,toolbar:null,uuid:"",elements:["h1","h2","h3","p","pre","blockquote"],buttonCssClass:null},_create:function(){var b,c,d;return b=a('<span class="'+this.widgetName+'"></span>'),c=""+this.options.uuid+"-"+this.widgetName+"-data",d=this._prepareDropdown(c),b.append(d),b.append(this._prepareButton(d)),this.options.toolbar.append(b)},_prepareDropdown:function(b){var c,d,e,f,g,h,i,j=this;e=a('<div id="'+b+'"></div>'),d=this.options.editable.element.get(0).tagName.toLowerCase(),c=function(b){var c,e;return c=a("<"+b+' class="menu-item">'+b+"</"+b+">"),d===b&&c.addClass("selected"),d!=="div"&&c.addClass("disabled"),c.bind("click",function(){if(c.hasClass("disabled"))return;return j.options.editable.execute("formatBlock",b.toUpperCase())}),e=function(a){var d;d=document.queryCommandValue("formatBlock");if(d.toLowerCase()===b){c.addClass("selected");return}return c.removeClass("selected")},j.options.editable.element.bind("halloenabled",function(){return j.options.editable.element.bind("keyup paste change mouseup",e)}),j.options.editable.element.bind("hallodisabled",function(){return j.options.editable.element.unbind("keyup paste change mouseup",e)}),c},i=this.options.elements;for(g=0,h=i.length;g<h;g++)f=i[g],e.append(c(f));return e},_prepareButton:function(b){var c;return c=a("<span></span>"),c.hallodropdownbutton({uuid:this.options.uuid,editable:this.options.editable,label:"block",icon:"icon-text-height",target:b,cssClass:this.options.buttonCssClass}),c}})}(jQuery),function(a){return a.widget("IKS.hallolink",{options
:{editable:null,toolbar:null,uuid:"",link:!0,image:!0,defaultUrl:"http://",dialogOpts:{autoOpen:!1,width:540,height:95,title:"Enter Link",modal:!0,resizable:!1,draggable:!1,dialogClass:"hallolink-dialog"}},_create:function(){var b,c,d,e,f,g,h,i=this;h=this,e=""+this.options.uuid+"-dialog",d=a('<div id="'+e+'"><form action="#" method="post" class="linkForm"><input class="url" type="text" name="url" value="'+this.options.defaultUrl+'" /><input type="submit" id="addlinkButton" value="Insert" /></form></div>'),g=a("input[name=url]",d).focus(function(a){return this.select()}),f=function(){var a;return a=g.val(),h.options.editable.restoreSelection(h.lastSelection),(new RegExp(/^\s*$/)).test(a)||a===h.options.defaultUrl?(h.lastSelection.collapsed&&(h.lastSelection.setStartBefore(h.lastSelection.startContainer),h.lastSelection.setEndAfter(h.lastSelection.startContainer),window.getSelection().addRange(h.lastSelection)),document.execCommand("unlink",null,"")):h.lastSelection.startContainer.parentNode.href===void 0?document.execCommand("createLink",null,a):h.lastSelection.startContainer.parentNode.href=a,h.options.editable.element.trigger("change"),h.options.editable.removeAllSelections(),d.dialog("close"),!1},d.find("form").submit(f),c=a('<span class="'+h.widgetName+'"></span>'),b=function(b){var e,f;return f=""+i.options.uuid+"-"+b,c.append(a('<input id="'+f+'" type="checkbox" /><label for="'+f+'" class="btn anchor_button" ><i class="icon-bookmark"></i></label>').button()),e=a("#"+f,c),e.bind("change",function(b){return h.lastSelection=h.options.editable.getSelection(),g=a("input[name=url]",d),h.lastSelection.startContainer.parentNode.href===void 0?g.val(h.options.defaultUrl):(g.val(a(h.lastSelection.startContainer.parentNode).attr("href")),a(g[0].form).find("input[type=submit]").val("update")),d.dialog("open")}),i.element.bind("keyup paste change mouseup",function(b){var c,d;return d=a(h.options.editable.getSelection().startContainer),c=d.prop("nodeName")?d.prop("nodeName"):d.parent().prop("nodeName"),c&&c.toUpperCase()==="A"?(e.attr("checked",!0),e.next().addClass("ui-state-clicked"),e.button("refresh")):(e.attr("checked",!1),e.next().removeClass("ui-state-clicked"),e.button("refresh"))})},this.options.link&&b("A");if(this.options.link)return c.buttonset(),this.options.toolbar.append(c),d.dialog(this.options.dialogOpts)},_init:function(){}})}(jQuery),function(a){return a.widget("IKS.hallojustify",{options:{editable:null,toolbar:null,uuid:"",buttonCssClass:null},_create:function(){var b,c,d=this;return c=a('<span class="'+this.widgetName+'"></span>'),b=function(b){var e;return e=a("<span></span>"),e.hallobutton({uuid:d.options.uuid,editable:d.options.editable,label:b,command:"justify"+b,icon:"icon-align-"+b.toLowerCase(),cssClass:d.options.buttonCssClass}),c.append(e)},b("Left"),b("Center"),b("Right"),c.buttonset(),this.options.toolbar.append(c)},_init:function(){}})}(jQuery),function(a){return a.widget("IKS.hallobutton",{button:null,options:{uuid:"",label:null,icon:null,editable:null,command:null,queryState:!0,cssClass:null},_create:function(){var a,b;return(b=(a=this.options).icon)!=null?b:a.icon="icon-"+this.options.label.toLowerCase()},_init:function(){var a,b,c=this;this.button||(this.button=this._prepareButton()),this.element.append(this.button),this.button.bind("change",function(a){return c.options.editable.execute(c.options.command)});if(!this.options.queryState)return;return a=this.options.editable.element,b=function(a){if(document.queryCommandState(c.options.command)){c.button.attr("checked",!0),c.button.next("label").addClass("ui-state-clicked"),c.button.button("refresh");return}return c.button.attr("checked",!1),c.button.next("label").removeClass("ui-state-clicked"),c.button.button("refresh")},a.bind("halloenabled",function(){return a.bind("keyup paste change mouseup",b)}),a.bind("hallodisabled",function(){return a.unbind("keyup paste change mouseup",b)})},_prepareButton:function(){var b,c,d;return d=""+this.options.uuid+"-"+this.options.label,c=a('<input id="'+d+'" type="checkbox" />\n<label for="'+d+'" class="'+this.options.command+'_button" title="'+this.options.label+'">\n  <i class="'+this.options.icon+'"></i>\n</label>'),this.options.cssClass&&c.addClass(this.options.cssClass),b=c.button(),b.data("hallo-command",this.options.command),b}})}(jQuery),function(a){return a.widget("IKS.hallodropdownbutton",{button:null,options:{uuid:"",label:null,icon:null,editable:null,target:"",cssClass:null},_create:function(){var a,b;return(b=(a=this.options).icon)!=null?b:a.icon="icon-"+this.options.label.toLowerCase()},_init:function(){var b,c=this;return b=a(this.options.target),b.css("position","absolute"),b.addClass("dropdown-menu"),b.hide(),this.button||(this.button=this._prepareButton()),this.button.bind("click",function(){if(b.hasClass("open")){c._hideTarget();return}return c._showTarget()}),b.bind("click",function(){return c._hideTarget()}),this.options.editable.element.bind("hallodeactivated",function(){return c._hideTarget()}),this.element.append(this.button)},_showTarget:function(){var b;return b=a(this.options.target),this._updateTargetPosition(),b.addClass("open"),b.show()},_hideTarget:function(){var b;return b=a(this.options.target),b.removeClass("open"),b.hide()},_updateTargetPosition:function(){var b,c,d,e,f,g,h;return c=a(this.options.target),g=this.element.offset(),f=g.top,b=g.left,h=this.options.editable.toolbar.offset(),e=h.toolbarTop,d=h.toolbarLeft,c.css("top",b-d),c.css("left",f-e)},_prepareButton:function(){var b,c,d;return d=""+this.options.uuid+"-"+this.options.label,c=a('<button id="'+d+'" data-toggle="dropdown" data-target="#'+this.options.target.attr("id")+'" title="'+this.options.label+'">\n  <span class="ui-button-text"><i class="'+this.options.icon+'"></i></span>\n</button>'),this.options.cssClass&&c.addClass(this.options.cssClass),b=c.button(),b}})}(jQuery);