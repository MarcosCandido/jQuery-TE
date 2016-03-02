/*!
 *
 * jQuery TE 1.4.1 , http://jqueryte.com/
 * Copyright (C) 2013, Fatih Koca (fattih@fattih.com), (http://jqueryte.com/about)

 * jQuery TE is provided under the MIT LICENSE.
 *
*/

(function($){
	JQTE_VARFORMAT = {
		AT: 1,
		BRACKETS: 2,
	}
	$.fn.jqte = function(options){
  
		// default titles of buttons
		var varsTitle = [
			{title:"Text Format"},
			{title:"Font Size"},
			{title:"Color"},
			{title:"Bold",hotkey:"B"},
			{title:"Italic",hotkey:"I"},
			{title:"Underline",hotkey:"U"},
			{title:"Ordered List",hotkey:"."},
			{title:"Unordered List",hotkey:","},
			{title:"Subscript",hotkey:"down arrow"},
			{title:"Superscript",hotkey:"up arrow"},
			{title:"Outdent",hotkey:"left arrow"},
			{title:"Indent",hotkey:"right arrow"},
			{title:"Justify Left"},
			{title:"Justify Center"},
			{title:"Justify Right"},
			{title:"Strike Through",hotkey:"K"},
			{title:"Add Link",hotkey:"L"},
			{title:"Remove Link"},
			{title:"Cleaner Style",hotkey:"Delete"},
			{title:"Horizontal Rule",hotkey:"H"},
			{title:"Source"},
			{title:"Insert Variable"}
			];
		
		// default text formats
		var formats = [["p","Normal"],["h1","Header 1"],["h2","Header 2"],["h3","Header 3"],["h4","Header 4"],["h5","Header 5"],["h6","Header 6"],["pre","Preformatted"]];
		
		// default font sizes
		var fsizes = ["10","12","16","18","20","24","28"];
		
		// default rgb values of colors
		var colors = [
		"0,0,0","68,68,68","102,102,102","153,153,153","204,204,204","238,238,238","243,243,243","255,255,255",
		null,
		"255,0,0","255,153,0","255,255,0","0,255,0","0,255,255","0,0,255","153,0,255","255,0,255",
		null,
		"244,204,204","252,229,205","255,242,204","217,234,211","208,224,227","207,226,243","217,210,233","234,209,220",
		"234,153,153","249,203,156","255,229,153","182,215,168","162,196,201","159,197,232","180,167,214","213,166,189",
		"224,102,102","246,178,107","255,217,102","147,196,125","118,165,175","111,168,220","142,124,195","194,123,160",
		"204,0,0","230,145,56","241,194,50","106,168,79","69,129,142","61,133,198","103,78,167","166,77,121",
		"153,0,0","180,95,6","191,144,0","56,118,29","19,79,92","11,83,148","53,28,117","116,27,71",
		"102,0,0","120,63,4","127,96,0","39,78,19","12,52,61","7,55,99","32,18,77","76,17,48"
		];
		
		// default link-type names
		var linktypes = ["Web Address","E-mail Address","Picture URL"];
		
		var vars = $.extend({
			// options
			'status'		: true,
			'css' 			: "jqte",
			'title'			: true,
			'titletext'		: varsTitle,
			'button'		: "OK",
			'format'		: true,
			'formats'		: formats,
			'fsize' 		: true,
			'fsizes'		: fsizes,
			'funit'			: "px",
			'color'			: true,
			'linktypes'		: linktypes,
			'variables'		: false,
			'variable_format': JQTE_VARFORMAT.BRACKETS,
			'b' 			: true,
			'i' 			: true,
			'u' 			: true,
			'ol' 			: true,
			'ul' 			: true,
			'sub'			: true,
			'sup'			: true,
			'outdent'		: true,
			'indent'		: true,
			'left'			: true,
			'center'		: true,
			'right'			: true,
			'strike'		: true,
			'link'			: true,
			'unlink'		: true,
			'remove'		: true,
			'rule'			: true,
			'source'		: true,
			'placeholder'	: false,
			'br'			: true,
			'p'				: true,
			
			// events
			'change'		: "",
			'focus'			: "",
			'blur'			: ""
		}, options);
		
		// regularize variables
		if (vars.variables && vars.variables.length)
		{
			for (var n = 0; n < vars.variables.length; n++)
			{
				if (typeof(vars.variables[n]) == 'string')
					vars.variables[n] = { name: vars.variables[n] };
				
				vars.variables[n] = $.extend({
					name: null,
					text: null,
					parms: false,
				}, vars.variables[n]);
				
				if (vars.variables[n].parms)
				{
					for (var p = 0; p < vars.variables[n].parms.length; p++)
					{
						if (typeof(vars.variables[n].parms[p]) == 'string')
							vars.variables[n].parms[p] = { text: vars.variables[n].parms[p] };
						
						vars.variables[n].parms[p] = $.extend({
							text: null,
						}, vars.variables[n].parms[p]);
					}
				}
			}
		}
		else
		{
			vars.variables = false;
		}
		
		// methods
		$.fn.jqteVal = function(value){
			$(this).closest("."+vars.css).find("."+vars.css+"_editor").html(value);
		}
		
		// browser information is received
		var thisBrowser = navigator.userAgent.toLowerCase();
		
		// if browser is ie and it version is 7 or even older, close title property
		if(/msie [1-7]./.test(thisBrowser))
			vars.title = false;
		
		var buttons = [];
		
		// insertion function for parameters to toolbar
		function addParams(name,command,key,tag,emphasis)
		{
			var thisCssNo  = buttons.length+1;
			return buttons.push({name:name, cls:thisCssNo, command:command, key:key, tag:tag, emphasis:emphasis});
		};
		
		// add parameters for toolbar buttons
		addParams('format','formats','','',false); // text format button  --> no hotkey
		addParams('fsize','fSize','','',false); // font size button --> no hotkey
		addParams('color','colors','','',false); // text color button  --> no hotkey
		addParams('b','Bold','B',["b","strong"],true); // bold --> ctrl + b
		addParams('i','Italic','I',["i","em"],true); // italic --> ctrl + i
		addParams('u','Underline','U',["u"],true); // underline --> ctrl + u
		addParams('ol','insertorderedlist','¾',["ol"],true); // ordered list --> ctrl + .(dot)
		addParams('ul','insertunorderedlist','¼',["ul"],true); // unordered list --> ctrl + ,(comma)
		addParams('sub','subscript','(',["sub"],true); // sub script --> ctrl + down arrow
		addParams('sup','superscript','&',["sup"],true); // super script --> ctrl + up arrow
		addParams('outdent','outdent','%',["blockquote"],false); // outdent --> ctrl + left arrow
		addParams('indent','indent','\'',["blockquote"],true); // indent --> ctrl + right arrow
		addParams('left','justifyLeft','','',false); // justify Left --> no hotkey
		addParams('center','justifyCenter','','',false); // justify center --> no hotkey
		addParams('right','justifyRight','','',false); // justify right --> no hotkey
		addParams('strike','strikeThrough','K',["strike"],true); // strike through --> ctrl + K
		addParams('link','linkcreator','L',["a"],true); // insertion link  --> ctrl + L
		addParams('unlink','unlink','',["a"],false); // remove link --> ctrl + N 
		addParams('remove','removeformat','.','',false); // remove all styles --> ctrl + delete
		addParams('rule','inserthorizontalrule','H',["hr"],false); // insertion horizontal rule --> ctrl + H
		addParams('source','displaysource','','',false); // feature of displaying source
		if (vars.variables && vars.variables.length) {
			addParams('variables','variablecreator','','',false); // feature of add variable
		}
		
		return this.each(function(){
			if(!$(this).data("jqte") || $(this).data("jqte")==null || $(this).data("jqte")=="undefined")
				$(this).data("jqte",true);
			else 
				$(this).data("jqte",false);
			
			// is the status false of the editor
			if(!vars.status || !$(this).data("jqte"))
			{
				// if wanting the false status later
				if($(this).closest("."+vars.css).length>0)
				{
					var editorValue	= $(this).closest("."+vars.css).find("."+vars.css+"_editor").html();
					
					// add all attributes of element
					var thisElementAttrs = "";
					
					$($(this)[0].attributes).each(function()
					{
						if(this.nodeName!="style")
							thisElementAttrs = thisElementAttrs+" "+this.nodeName+'="'+this.nodeValue+'"';
					});
					
					var thisElementTag = $(this).is("[data-origin]") && $(this).attr("data-origin")!="" ? $(this).attr("data-origin") : "textarea";
					
					// the contents of this element
					var createValue	= '>'+editorValue;
					
					// if this element is input or option
					if(thisElementTag=="input" || thisElementTag=="option")
					{
						// encode special html characters
						editorValue = editorValue.replace(/"/g,'&#34;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
						
						// the value of this element
						createValue	= 'value="'+editorValue+'">';
					}
					
					var thisClone = $(this).clone();
					
					$(this).data("jqte",false).closest("."+vars.css).before(thisClone).remove();
					thisClone.replaceWith('<'+ thisElementTag + thisElementAttrs + createValue + '</'+thisElementTag+'>');
				}
				return;
			}
			
			// element will converted to the jqte editor
			var thisElement = $(this);
			
			// tag name of the element
			var thisElementTag = $(this).prop('tagName').toLowerCase();
			
			// tag name of origin
			$(this).attr("data-origin",thisElementTag);
			
			// contents of the element
			var thisElementVal = $(this).is("[value]") || thisElementTag == "textarea" ? $(this).val() : $(this).html();
			
			// decode special html characters
			thisElementVal = thisElementVal.replace(/&#34;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
			
			// start jqte editor to after the element
			$(this).after('<div class="'+vars.css+'"></div>');
			
			// jqte
			var jQTE = $(this).next('.'+vars.css);
			
			// insert toolbar in jqte editor
			jQTE.html('<div class="'+vars.css+"_toolbar"+'" role="toolbar" unselectable></div><div class="'+vars.css+'_linkform" style="display:none" role="dialog"></div><div class="'+vars.css+'_variablesform" style="display:none" role="dialog"></div><div class="'+vars.css+"_editor"+'"></div>');
			
			var toolbar			= jQTE.find('.'+vars.css+"_toolbar"); // the toolbar variable
			var linkform		= jQTE.find('.'+vars.css+"_linkform"); // the link-form-area in the toolbar variable
			var variablesform	= jQTE.find('.'+vars.css+"_variablesform"); // the variablesform-form-area in the toolbar variable
			var editor			= jQTE.find('.'+vars.css+"_editor"); // the text-field of jqte editor
			var emphasize		= vars.css+"_tool_depressed"; // highlight style of the toolbar buttons
			
			// add to some tools in link form area
			linkform.append('<div class="'+vars.css+'_linktypeselect" unselectable></div><input class="'+vars.css+'_linkinput" type="text/css" value=""><div class="'+vars.css+'_linkbutton" unselectable>'+vars.button+'</div> <div style="height:1px;float:none;clear:both"></div>');
			
			var linktypeselect	= linkform.find("."+vars.css+"_linktypeselect"); // the tool of link-type-selector
			var linkinput		= linkform.find("."+vars.css+"_linkinput"); // the input of insertion link
			var linkbutton		= linkform.find("."+vars.css+"_linkbutton"); // the button of insertion link
			
			// add to the link-type-selector sub tool parts
			linktypeselect.append('<div class="'+vars.css+'_linktypeview" unselectable></div><div class="'+vars.css+'_linktypes" role="menu" unselectable></div>');

			var linktypes		= linktypeselect.find("."+vars.css+"_linktypes"); // the select box of link types
			var linktypeview	= linktypeselect.find("."+vars.css+"_linktypeview"); // the link type preview
			var setdatalink		= vars.css+"-setlink"; // the selected text add to mark as "link will be added"
			
			
			//add to some tools in variables form area
			variablesform.append('<div class="'+vars.css+'_variableselect" unselectable></div><div class="'+vars.css+'_variableparms"></div><div class="'+vars.css+'_variablebutton" unselectable>'+vars.button+'</div> <div style="height:1px;float:none;clear:both"></div>')
			
			var variableselect	= variablesform.find("."+vars.css+"_variableselect"); // the tool of link-type-selector
			var variableparms	= variablesform.find("."+vars.css+"_variableparms"); // the input of insertion link
			var variablebutton	= variablesform.find("."+vars.css+"_variablebutton"); // the button of insertion link
			
			// add to the variables-selector sub tool parts
			variableselect.append('<div class="'+vars.css+'_variableview" unselectable></div><div class="'+vars.css+'_variables" role="menu" unselectable></div>');

			var variablesbox	= variableselect.find("."+vars.css+"_variables"); // the select box of variables
			jQTE.mouseup(function(){
				variablesbox.css('max-height', editor.height() + 'px');
			}).mouseup();
			var variableview	= variableselect.find("."+vars.css+"_variableview"); // the variable preview
			var setdatavariable	= vars.css+"-setvariable"; // the selected text add to mark as "variable will be added"
			
			
			// create to the source-area
			editor.after('<div class="'+vars.css+'_source '+vars.css+'_hiddenField"></div>');
			
			var sourceField = jQTE.find("."+vars.css+"_source"); // the source-area variable
			
			// move the element to the source-area
			thisElement.appendTo(sourceField);
			
			// if the element isn't a textarea, convert this to textarea
			if(thisElementTag!="textarea")
			{
				// add all attributes of element to new textarea (type and value except)
				var thisElementAttrs = "";
				
				$(thisElement[0].attributes).each(function(){
					if(this.nodeName!="type" && this.nodeName!="value")
						thisElementAttrs = thisElementAttrs+" "+this.nodeName+'="'+this.nodeValue+'"';
				});
				
				// convert the element to textarea
				thisElement.replaceWith('<textarea '+thisElementAttrs+'>'+thisElementVal+'</textarea>');
				
				// update to variable of thisElement
				thisElement = sourceField.find("textarea");
			}

			// add feature editable to the text-field ve copy from the element's value to text-field
			editor.attr("contenteditable","true").html(thisElementVal);

			// insertion the toolbar button
			for(var n = 0; n < buttons.length; n++)
			{
				// if setting of this button is activated (is it true?)
				if(vars[buttons[n].name] && (buttons[n].name!='variables' || (vars.variables && vars.variables.length)))
				{
					// if it have a title, add to this button
					var buttonHotkey = buttons[n].key.length>0 ? vars.titletext[n].hotkey!=null && vars.titletext[n].hotkey!="undefined" && vars.titletext[n].hotkey!="" ? ' (Ctrl+'+vars.titletext[n].hotkey+')' : '' : '';
					var buttonTitle = vars.titletext[n].title!=null && vars.titletext[n].title!="undefined" && vars.titletext[n].title!="" ? vars.titletext[n].title+buttonHotkey : '';
					
					// add this button to the toolbar
					toolbar.append('<div class="'+vars.css+'_tool '+vars.css+'_tool_'+buttons[n].cls+'" role="button" data-tool="'+n+'" unselectable><a class="'+vars.css+'_tool_icon" unselectable></a></div>');
					
					// add the parameters to this button
					toolbar.find('.'+vars.css+'_tool[data-tool='+n+']').data({tag : buttons[n].tag, command : buttons[n].command, emphasis : buttons[n].emphasis, title : buttonTitle});
					
					// format-selector field
					if(buttons[n].name=="format" && $.isArray(vars.formats))
					{
						// selected text format
						var toolLabel = vars.formats[0][1].length>0 && vars.formats[0][1]!="undefined" ? vars.formats[0][1] : "";
						
						toolbar.find("."+vars.css+'_tool_'+buttons[n].cls).find("."+vars.css+"_tool_icon").replaceWith('<a class="'+vars.css+'_tool_label" unselectable><span class="'+vars.css+'_tool_text" unselectable>'+toolLabel+'</span><span class="'+vars.css+'_tool_icon" unselectable></span></a>');
						
						toolbar.find("."+vars.css+'_tool_'+buttons[n].cls)
							.append('<div class="'+vars.css+'_formats" unselectable></div>');
						
						// add font-sizes to font-size-selector
						for(var f = 0; f < vars.formats.length; f++)
						{
							toolbar.find("."+vars.css+"_formats").append('<a '+vars.css+'-formatval="'+ vars.formats[f][0] +'" class="'+vars.css+'_format'+' '+vars.css+'_format_'+f+'" role="menuitem" unselectable>'+ vars.formats[f][1] +'</a>');
						}
						
						toolbar.find("."+vars.css+"_formats").data("status",false);
					}
					
					// font-size-selector field
					else if(buttons[n].name=="fsize" && $.isArray(vars.fsizes))
					{
						toolbar.find("."+vars.css+'_tool_'+buttons[n].cls)
							.append('<div class="'+vars.css+'_fontsizes" unselectable></div>');
						
						// add font-sizes to font-size-selector
						for(var f = 0; f < vars.fsizes.length; f++)
						{
							toolbar.find("."+vars.css+"_fontsizes").append('<a '+vars.css+'-styleval="'+ vars.fsizes[f] +'" class="'+vars.css+'_fontsize'+'" style="font-size:'+ vars.fsizes[f]  + vars.funit+'" role="menuitem" unselectable>Abcdefgh...</a>');
						}
					}
					
					// color-selector field
					else if(buttons[n].name=="color" && $.isArray(colors))
					{
						toolbar.find("."+vars.css+'_tool_'+buttons[n].cls)
							.append('<div class="'+vars.css+'_cpalette" unselectable></div>');
						
						// create color palette to color-selector field
						for(var c = 0; c < colors.length; c++)
						{
							if(colors[c]!=null)
								toolbar.find("."+vars.css+"_cpalette").append('<a '+vars.css+'-styleval="'+ colors[c] +'" class="'+vars.css+'_color'+'" style="background-color: rgb('+ colors[c] +')" role="gridcell" unselectable></a>');
							else
								toolbar.find("."+vars.css+"_cpalette").append('<div class="'+vars.css+"_colorSeperator"+'"></div>');
						}
					}
					
					// add variable
					else if(buttons[n].name=="variables")
					{
						toolbar.find('.'+vars.css+'_tool[data-tool='+n+']')
							.data('format', vars.variable_format)
							.addClass(vars.css + '_varformat_' + vars.variable_format);
					}
				}
			}
			
			// the default value of the link-type
			linktypes.data("linktype","0");
			
			// add link types to link-type-selector
			for(var n = 0; n < 3; n++)
			{
				linktypes.append('<a '+vars.css+'-linktype="'+n+'" unselectable>'+vars.linktypes[n]+'</a>');
				
				linktypeview.html('<div class="'+vars.css+'_linktypearrow" unselectable></div><div class="'+vars.css+'_linktypetext">'+linktypes.find('a:eq('+linktypes.data("linktype")+')').text()+'</div>');
			}
			
			// the default value of the variable
			variablesbox.data("variable","");
			
			// add variables to selector
			if (vars.variables && vars.variables.length)
			{
				for (var n = 0; n < vars.variables.length; n++)
				{
					variablesbox.append('<a '+vars.css+'-variable="'+n+'" unselectable>'+(vars.variables[n].text || vars.variables[n].name)+'</a>');
					
					variableview.html('<div class="'+vars.css+'_variablearrow" unselectable></div><div class="'+vars.css+'_variabletext">'+(variablesbox.data("variable")=="" ? "&nbsp;" : variablesbox.find('a:eq('+variablesbox.data("variable")+')').text())+'</div>');
				}
			}
			
			// add the prefix of css according to browser
			var prefixCss = "";

			if(/msie/.test(thisBrowser)) // ie
				prefixCss = '-ms-';
			else if(/chrome/.test(thisBrowser) || /safari/.test(thisBrowser) || /yandex/.test(thisBrowser)) // webkit group (safari, chrome, yandex)
				prefixCss = '-webkit-';
			else if(/mozilla/.test(thisBrowser)) // firefox
				prefixCss = '-moz-';
			else if(/opera/.test(thisBrowser)) // opera
				prefixCss = '-o-';
			else if(/konqueror/.test(thisBrowser)) // konqueror
				prefixCss = '-khtml-';
			else 
				prefixCss = '';
				
			// the feature of placeholder
			if(vars.placeholder)
			{
				jQTE.prepend('<div class="'+vars.css+'_placeholder" unselectable><div class="'+vars.css+'_placeholder_text">'+vars.placeholder+'</div></div>');
				
				var placeHolder = jQTE.find("."+vars.css+"_placeholder");
				
				placeHolder.click(function(){
					editor.focus();
				});
			}
			
			// make unselectable to unselectable attribute ones
			jQTE.find("[unselectable]")
				.css(prefixCss+"user-select","none")
				.addClass("unselectable")
				.attr("unselectable","on")
				.on("selectstart mousedown",false);
			
			// each button of the toolbar
			var toolbutton = toolbar.find("."+vars.css+"_tool");
			
			// format menu
			var formatbar = toolbar.find("."+vars.css+"_formats");
			
			// font-size filed
			var fsizebar = toolbar.find("."+vars.css+"_fontsizes");
			
			// color palette
			var cpalette = toolbar.find("."+vars.css+"_cpalette");
			
			// get the selected text as plain format
			function selectionGet()
			{
				// for webkit, mozilla, opera
				if (window.getSelection)
					return window.getSelection();
				// for ie
				else if (document.selection && document.selection.createRange && document.selection.type != "None")
					return document.selection.createRange();
			}
			
			// the function of changing to the selected text with "execCommand" method
			function selectionSet(addCommand,thirdParam)
			{
				var	range,
					sel = selectionGet();

				// for webkit, mozilla, opera
				if (window.getSelection)
				{
					if (sel.anchorNode && sel.getRangeAt)
						range = sel.getRangeAt(0);
						
					if(range)
					{
						sel.removeAllRanges();
						sel.addRange(range);
					}
					
					if(!thisBrowser.match(/msie/))
						document.execCommand('StyleWithCSS', false, false);
					
					//console.log('selectionSet\t' + addCommand + '\t' + false + "\t" + thirdParam);
					if (document.queryCommandSupported(addCommand)) {
						document.execCommand(addCommand, false, thirdParam);
					} else {
						if (addCommand.toLowerCase() == 'inserttext') {
							// ie support
							var frag = document.createDocumentFragment();
							frag.textContent = thirdParam;
							range.insertNode(frag);
						} else {
							console.log('Command not supported: ' + addCommand + '. Parameter: ' + thirdParam);
						}
					}
				}
				
				// for ie
				else if (document.selection && document.selection.createRange && document.selection.type != "None")
				{
					range = document.selection.createRange();
					if (document.queryCommandSupported(addCommand)) {
						range.execCommand(addCommand, false, thirdParam);
					} else {
						if (addCommand.toLowerCase() == 'inserttext') {
							// ie support
							var frag = document.createDocumentFragment();
							frag.textContent = thirdParam;
							range.insertNode(frag);
						}
					}
				}
				
				// change styles to around tags
				affectStyleAround(false,false);
			}
			
			// the function of changing to the selected text with tags and tags's attributes
			function replaceSelection(tTag,tAttr,tVal) {
				
				// first, prevent to conflict of different jqte editors
				if(editor.not(":focus"))
					editor.focus();
				
				// for webkit, mozilla, opera			
				if (window.getSelection)
				{
					var selObj = selectionGet(), selRange, newElement, documentFragment;
					
					if (selObj.anchorNode && selObj.getRangeAt)
					{
						selRange = selObj.getRangeAt(0);
						
						// create to new element
						newElement = document.createElement(tTag);
						
						// add the attribute to the new element
						$(newElement).attr(tAttr,tVal);
						
						// extract to the selected text
						documentFragment = selRange.extractContents();
						
						// add the contents to the new element
						newElement.appendChild(documentFragment);
						
						selRange.insertNode(newElement);
						selObj.removeAllRanges();
						
						// if the attribute is "style", change styles to around tags
						if(tAttr=="style")
							affectStyleAround($(newElement),tVal);
						// for other attributes
						else
							affectStyleAround($(newElement),false);
					}
				}
				// for ie
				else if (document.selection && document.selection.createRange && document.selection.type != "None")
				{
					var range = document.selection.createRange();
					var selectedText = range.htmlText;
					
					var newText = '<'+tTag+' '+tAttr+'="'+tVal+'">'+selectedText+'</'+tTag+'>';
					
					document.selection.createRange().pasteHTML(newText);
				}
			}
			
			// the function of getting to the parent tag
			var getSelectedNode = function() {
				var node,selection;
				if(window.getSelection) {
					selection = getSelection();
					node = selection.anchorNode;
				}
				if(!node && document.selection && document.selection.createRange && document.selection.type != "None")
				{
					selection = document.selection;
					var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
					node = range.commonAncestorContainer ? range.commonAncestorContainer :
						   range.parentElement ? range.parentElement() : range.item(0);
				}
				if(node) {
					return (node.nodeName == "#text" ? $(node.parentNode) : $(node));
				}
				else 
					return false;
			};
			
			// the function of replacement styles to the around tags (parent and child)
			function affectStyleAround(element,style)
			{
				var selectedTag = getSelectedNode(); // the selected node
				
				selectedTag = selectedTag ? selectedTag : element;
				
				// (for replacement with execCommand) affect to child tags with parent tag's styles
				if(selectedTag && style==false)
				{
					// apply to the selected node with parent tag's styles
					if(selectedTag.parent().is("[style]") && !selectedTag.parent().is("."+vars.css+"_editor"))
						selectedTag.attr("style",selectedTag.parent().attr("style"));
						
					// apply to child tags with parent tag's styles
					if(selectedTag.is("[style]") && !selectedTag.parent().is("."+vars.css+"_editor"))
						selectedTag.find("*").attr("style",selectedTag.attr("style"));
				}
				// (for replacement with html changing method)
				else if(element && style && element.is("[style]"))
				{
					var styleKey = style.split(";"); // split the styles
					
					styleKey = styleKey[0].split(":") // get the key of first style feature
					
					// apply to child tags with parent tag's styles
					if(element.is("[style*="+styleKey[0]+"]"))
						element.find("*").css(styleKey[0],styleKey[1]);
						
					// select to the selected node again
					selectText(element);
				}
			}

			// the function of making selected to a element
			function selectText(element)
			{
				if(element)
				{
					element = element[0];
					
					if (document.body.createTextRange)
					{
						var range = document.body.createTextRange();
						range.moveToElementText(element);
						range.select();
					}
					else if (window.getSelection)
					{
						var selection = window.getSelection();  
						var range = document.createRange();
						
						if(element != "undefined" && element != null)
						{
							range.selectNodeContents(element);
							
							selection.removeAllRanges();
							selection.addRange(range);
							
							if($(element).is(":empty"))
							{
								$(element).append("&nbsp;");
									selectText($(element));
							}
						}
					}
				}
			}

			// the function of converting text to link
			function selected2link()
			{
				if(!toolbar.data("sourceOpened"))
				{
					var selectedTag = getSelectedNode(); // the selected node
					var thisHrefLink = "http://"; // default the input value of the link-form-field
					
					// hide the variable-form-field field
					variableAreaSwitch(false);
					// display the link-form-field
					linkAreaSwitch(true);

					if(selectedTag)
					{
						
						var thisTagName  = selectedTag.prop('tagName').toLowerCase();
						
						// if tag name of the selected node is "a" and the selected node have "href" attribute
						if(thisTagName == "a" && selectedTag.is('[href]'))
						{
							thisHrefLink = selectedTag.attr('href');
							
							selectedTag.attr(setdatalink,"");
						}
						// if it don't have "a" tag name
						else 
							replaceSelection("a",setdatalink,"");
						
					}
					else 
						linkinput.val(thisHrefLink).focus();
					
					// the method of displaying-hiding to link-types
					linktypeselect.off('click.jqte').on('click.jqte', function(e)
					{
						if($(e.target).hasClass(vars.css+"_linktypetext") || $(e.target).hasClass(vars.css+"_linktypearrow"))
						{
							if (linktypes.is(':visible'))
								linktypeSwitch(false);
							else
								linktypeSwitch(true);
						}
					});
					
					// the method of selecting to link-types
					linktypes.find("a").off('click.jqte').on('click.jqte', function()
					{
						var thisLinkType = $(this).attr(vars.css+"-linktype");
						
						linktypes.data("linktype",thisLinkType)
						
						linktypeview.find("."+vars.css+"_linktypetext").html(linktypes.find('a:eq('+linktypes.data("linktype")+')').text());
						
						linkInputSet(thisHrefLink);
						
						linktypeSwitch();
					});
					
					linkInputSet(thisHrefLink);
					
					// the method of link-input
					linkinput
						// auto focus
						.focus()
						// update to value
						.val(thisHrefLink)
						// the event of key to enter in link-input
						.bind("keypress keyup",function(e)
						{
							if(e.keyCode==13)
							{
								linkRecord(jQTE.find("["+setdatalink+"]"));
								return false;
							}
						});
					
					// the event of click link-button
					linkbutton.off('click.jqte').on('click.jqte', function()
					{
						linkRecord(jQTE.find("["+setdatalink+"]"));
					});
				}
				else
					// hide the link-form-field
					linkAreaSwitch(false);
			}

			function linkRecord(thisSelection)
			{
				// focus to link-input
				linkinput.focus();
				
				// select to the selected node
				selectText(thisSelection);
				
				// remove pre-link attribute (mark as "link will be added") of the selected node
				thisSelection.removeAttr(setdatalink);
				
				// if not selected to link-type of picture
				if(linktypes.data("linktype")!="2")
					selectionSet("createlink",linkinput.val()); // insert link url of link-input to the selected node
				// if selected to link-type of picture
				else
				{
					selectionSet("insertImage",linkinput.val()); // insert image url of link-input to the selected node

					// the method of all pictures in the editor
					editor.find("img").each(function(){
						var emptyPrevLinks = $(this).prev("a");
						var emptyNextLinks = $(this).next("a");
						
						// if "a" tags of the front and rear of the picture is empty, remove
						if(emptyPrevLinks.length>0 && emptyPrevLinks.html()=="")
							emptyPrevLinks.remove();
						else if(emptyNextLinks.length>0 && emptyNextLinks.html()=="")
							emptyNextLinks.remove();
					});
				}

				// hide the link-form-field
				linkAreaSwitch();
				
				// export contents of the text to the sources
				editor.trigger("change");
			}

			// the function of switching link-form-field
			function linkAreaSwitch(status)
			{
				// remove all pre-link attribute (mark as "link will be added")
				clearSetElement("["+setdatalink+"]:not([href])");
				jQTE.find("["+setdatalink+"][href]").removeAttr(setdatalink);
				
				if(status)
				{
					toolbar.data("linkOpened",true);
					linkform.show();
				}
				else
				{ 
					toolbar.data("linkOpened",false);
					linkform.hide();
				}
				
				linktypeSwitch();
			}
			
			// the function of switching link-type-selector
			function linktypeSwitch(status)
			{
				if(status)
					linktypes.show();
				else
					linktypes.hide();
			}
			
			// the function of updating the link-input according to the link-type
			function linkInputSet(thisHrefLink)
			{
				var currentType = linktypes.data("linktype");
				
				// if selected type of e-mail
				if(currentType=="1" && (linkinput.val()=="http://" || linkinput.is("[value^=http://]") || !linkinput.is("[value^=mailto]"))) 
					linkinput.val("mailto:");
				else if(currentType!="1" && !linkinput.is("[value^=http://]"))
						linkinput.val("http://");
				else
					linkinput.val(thisHrefLink);
			}
			
			// the function of converting text to variable
			function selected2variable()
			{
				//console.log('SELECTED 2 VAR');
				if(!toolbar.data("sourceOpened"))
				{
					// hide the link-form-field
					linkAreaSwitch(false);
					// display the variable-form-field
					variableAreaSwitch(true);

					// the method of displaying-hiding to link-types
					variableselect.off('click.jqte').on('click.jqte', function(e)
					{
						if($(e.target).hasClass(vars.css+"_variabletext") || $(e.target).hasClass(vars.css+"_variablearrow") || $(e.target).hasClass(vars.css+"_variableview"))
						{
							if (variablesbox.is(':visible'))
								variableSwitch(false);
							else
								variableSwitch(true);
						}
					});
					
					// the method of selecting to variables
					variablesbox.find("a").off('click.jqte').on('click.jqte', function()
					{
						var thisVariable = $(this).attr(vars.css+"-variable");
						//console.log('VarClick', thisVariable);
						
						variablesbox.data("variable",thisVariable)
						
						variableview.find("."+vars.css+"_variabletext").html(variablesbox.find('a:eq('+variablesbox.data("variable")+')').text());
						
						variableParmSet((vars.variables[thisVariable] ? vars.variables[thisVariable].parms : null));
						
						variableSwitch(false);
					});
					
					variableParmSet((variablesbox.data("variable") && vars.variables[variablesbox.data("variable")] ? vars.variables[variablesbox.data("variable")].parms : null));
						
					// the event of click variable-button
					variablebutton.off('click.jqte').on('click.jqte', function()
					{
						addVariable();
					});
				}
				else
					// hide the link-form-field
					variableAreaSwitch(false);
			}

			function addVariable()
			{
				if (variablesbox.data("variable") && vars.variables[variablesbox.data("variable")])
				{
					var variable = vars.variables[variablesbox.data("variable")];
					
					var parameters = '';
					if (variable.parms && variable.parms.length)
					{
						for (var p = 0; p < variable.parms.length; p++)
						{
							if (parameters)
								parameters += ',';
							parameters += jQTE.find('input.' + vars.css + '_variableparminput[name=parm' + p + ']').val();
						}
					}
					
					var onStart = false;
					if (!jQTE.hasClass(vars.css+'_focused'))
					{
						onStart = true;
						editor.focus();
					}
					var finalVar = toVariable(variable.name, parameters);
					selectionSet("insertText", finalVar); // insert variable to the selected node
					
					// export contents of the text to the sources
					editor.trigger("change");
					
					if(onStart && document.createRange && window.getSelection)
					{
						var range = document.createRange();
						range.setStart(editor.get(0).firstChild, 0);
						range.setEnd(editor.get(0).firstChild, finalVar.length);
						var sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					}
				}
				variableSwitch(false); //close the variables select
				//variableAreaSwitch(false); //if you want to hide the variable area switch after inserting a variable, just uncomment this line
			}
			
			function toVariable(varName, parameters)
			{
				switch (vars.variable_format)
				{
					default:
					case JQTE_VARFORMAT.AT:
						return '@' + varName + (parameters ? ':' + parameters : '');
						
					case JQTE_VARFORMAT.BRACKETS:
						return '{{' + varName + (parameters ? ':' + parameters : '') + '}}';
						
				}
			}
			
			// Currently not used
			// function fromVariable(variable)
			// {
				// var varName = null;
				// switch (vars.variable_format)
				// {
					// default:
					// case JQTE_VARFORMAT.AT:
						// varName = variable.replace(/^@([^\s@]+)$/g, '$1');
						
					// case JQTE_VARFORMAT.BRACKETS:
						// varName = variable.replace(/^{{([^\s}]*?)}}/g, '$1');
						
				// }
				// return varName;
			// }

			// the function of switching variable-form-field
			function variableAreaSwitch(status)
			{
				// remove all pre-link attribute (mark as "link will be added")
				clearSetElement("["+setdatavariable+"]:not([href])");
				jQTE.find("["+setdatavariable+"][href]").removeAttr(setdatavariable);
				
				if(status)
				{
					toolbar.data("variablesOpened",true);
					variablesform.show();
				}
				else
				{ 
					toolbar.data("variablesOpened",false);
					variablesform.hide();
				}
				
				variableSwitch(false);
			}
			
			// the function of switching link-type-selector
			function variableSwitch(status)
			{
				if(status)
					variablesbox.show();
				else
					variablesbox.hide();
			}
			
			// the function of updating the link-input according to the link-type
			function variableParmSet(parms)
			{
				if (!parms || !parms.length) {
					variableparms.html('')
				} else {
					var htmlParms = '';
					for (var i = 0; i < parms.length; i++) {
						htmlParms += '<label class="' + vars.css + '_variableparmlabel unselectable" unselectable="on">' + parms[i].text + ':</label><input class="' + vars.css + '_variableparminput" name="parm' + i + '">';
					}
					variableparms.html(htmlParms);
					variableparms.find('input')
						.bind("keypress keyup",function(e)
						{
							if(e.keyCode==13)
							{
								addVariable();
								return false;
							}
						});
				}
			}
			
			// the function of adding style to selected text
			function selected2style(styleCommand)
			{
				if(!toolbar.data("sourceOpened"))
				{
					
					// if selected to changing the font-size value
					if(styleCommand=="fSize")
						styleField = fsizebar;
					
					// if selected to changing the text-color value
					else if(styleCommand=="colors")
						styleField = cpalette;
					
					// display the style-field
					styleFieldSwitch(styleField,true);
					
					// the event of click to style button
					styleField.find("a").unbind("click").click(function()
					{
						var styleValue = $(this).attr(vars.css + "-styleval"); // the property of style value to be added
						
						// if selected to changing the font-size value
						if(styleCommand=="fSize")
						{
							styleType  = "font-size";
							styleValue = styleValue + vars.funit; // combine the value with size unit
						}
						// if selected to changing the text-color value
						else if(styleCommand=="colors")
						{
							styleType  = "color";
							styleValue = "rgb("+styleValue + ")"; // combine color value with rgb
						}
						
						var prevStyles = refuseStyle(styleType); // affect styles to child tags (and extract to the new style attributes)
						
						// change to selected text
						replaceSelection("span","style",styleType+":"+styleValue+";"+prevStyles);
						
						// hide all style-fields
						styleFieldSwitch("",false);
						
						// remove title bubbles
						$('.'+vars.css+'_title').remove();
						
						// export contents of the text to the sources
						editor.trigger("change");
					});
					
				}
				else
					// hide the style-field
					styleFieldSwitch(styleField,false);
					
				// hide the link-form-field
				linkAreaSwitch(false);
			}
			
			// the function of switching the style-field
			function styleFieldSwitch(styleField,status)
			{
				var mainData="", // the style data of the actual wanted
					allData = [{"d":"fsizeOpened","f":fsizebar},{"d":"cpallOpened","f":cpalette}]; // all style datas
				
				// if the style data of the actual wanted isn't empty
				if(styleField!="")
				{
					// return to all datas and find the main data
					for(var si=0; si < allData.length; si++)
					{
						if(styleField==allData[si]["f"])
							mainData = allData[si];
					}
				}
				// display the style-field
				if(status)
				{
					toolbar.data(mainData["d"],true); // stil seçme alanının açıldığını belirten parametre yaz 
					mainData["f"].slideDown(100); // stil seçme alanını aç
					
					// return to all datas and close the fields of external datas
					for(var si=0; si < allData.length; si++)
					{
						if(mainData["d"]!=allData[si]["d"])
						{
							toolbar.data(allData[si]["d"],false);
							allData[si]["f"].slideUp(100);
						}
					}
				}
				// hide all style-fields
				else
				{
					// return to all datas and close all style fields
					for(var si=0; si < allData.length; si++)
					{
						toolbar.data(allData[si]["d"],false);
						allData[si]["f"].slideUp(100);
					}
				}
			}
			
			// the function of removing all pre-link attribute (mark as "link will be added")
			function clearSetElement(elem)
			{
				jQTE.find(elem).each(function(){
					$(this).before($(this).html()).remove();
				});
			}
			
			// the function of refusing some styles
			function refuseStyle(refStyle)
			{
				var selectedTag = getSelectedNode(); // the selected node
				
				// if the selected node have attribute of "style" and it have unwanted style
				if(selectedTag && selectedTag.is("[style]") && selectedTag.css(refStyle)!="")
				{
					var refValue = selectedTag.css(refStyle); // first get key of unwanted style
					
					selectedTag.css(refStyle,""); // clear unwanted style
					
					var cleanStyle = selectedTag.attr("style"); // cleaned style
					
					selectedTag.css(refStyle,refValue); // add unwanted style to the selected node again
					
					return cleanStyle; // print cleaned style
				}
				else
					return "";
			}
			
			// the function of adding style to selected text
			function selected2format()
			{
				formatFieldSwitch(true);
				
				formatbar.find("a").click(function()
				{
					$("*",this).click(function(e)
					{
						e.preventDefault();
						return false;
					});
					
					formatLabelView($(this).text());
					
					var formatValue = $(this).attr(vars.css + "-formatval"); // the type of format value
					
					// convert to selected format
					selectionSet("formatBlock",'<'+formatValue+'>');
					
					formatFieldSwitch(false);
				});
			}
			
			// the function of switching the style-field
			function formatFieldSwitch(status)
			{				
				var thisStatus = status ? true : false;
				
				thisStatus = status && formatbar.data("status") ? true : false;
				
				if(thisStatus || !status)
					formatbar.data("status",false).slideUp(200);
				else
					formatbar.data("status",true).slideDown(200);
			}
			
			// change format label
			function formatLabelView(str)
			{
				var formatLabel = formatbar.closest("."+vars.css+"_tool").find("."+vars.css+"_tool_label").find("."+vars.css+"_tool_text");
				
				if(str.length > 10)
						str = str.substr(0,7) + "...";
				
				// change format label of button
				formatLabel.html(str);
			}

			// the function of insertion a specific form to texts
			function extractToText(strings)
			{
				var $htmlContent, $htmlPattern, $htmlReplace;

				// first remove to unnecessary gaps
				$htmlContent = strings.replace(/\n/gim,'').replace(/\r/gim,'').replace(/\t/gim,'').replace(/&nbsp;/gim,' ');

				$htmlPattern =  [
					/\<span(|\s+.*?)><span(|\s+.*?)>(.*?)<\/span><\/span>/gim, // trim nested spans
					/<(\w*[^p])\s*[^\/>]*>\s*<\/\1>/gim, // remove empty or white-spaces tags (ignore paragraphs (<p>) and breaks (<br>))
					/\<div(|\s+.*?)>(.*?)\<\/div>/gim, // convert div to p
					/\<strong(|\s+.*?)>(.*?)\<\/strong>/gim, // convert strong to b
					/\<em(|\s+.*?)>(.*?)\<\/em>/gim // convert em to i
				];

				$htmlReplace = [
					'<span$2>$3</span>',
					'',
					'<p$1>$2</p>',
					'<b$1>$2</b>',
					'<i$1>$2</i>'
				];
				
				// repeat the cleaning process 5 times
				for(c=0; c<5; c++)
				{
					// create loop as the number of pattern
					for(var i = 0; i < $htmlPattern.length; i++)
					{
						$htmlContent = $htmlContent.replace($htmlPattern[i], $htmlReplace[i]);
					}
				}

				// if paragraph is false (<p>), convert <p> to <br>
				if(!vars.p)
					$htmlContent = $htmlContent.replace(/\<p(|\s+.*?)>(.*?)\<\/p>/ig, '<br/>$2');

				// if break is false (<br>), convert <br> to <p>
				if(!vars.br)
				{
					$htmlPattern =  [
						/\<br>(.*?)/ig,
						/\<br\/>(.*?)/ig
					];

					$htmlReplace = [
						'<p>$1</p>',
						'<p>$1</p>'
					];

					// create loop as the number of pattern (for breaks)
					for (var i = 0; i < $htmlPattern.length; i++) {
						$htmlContent = $htmlContent.replace($htmlPattern[i], $htmlReplace[i]);
					}
				}

				// if paragraph and break is false (<p> && <br>), convert <p> to <div>
				if(!vars.p && !vars.br)
					$htmlContent = $htmlContent.replace(/\<p>(.*?)\<\/p>/ig, '<div>$1</div>');

				return $htmlContent;
			}

			// the function of exporting contents of the text field to the source field (to be the standard in all browsers)
			function postToSource()
			{
				// clear unnecessary tags when editor view empty
				var sourceStrings = editor.text()=="" && editor.html().length<12 ? "" : editor.html();
				
				thisElement.val(extractToText(sourceStrings));
			}

			// the function of exporting contents of the source field to the text field (to be the standard in all browsers)
			function postToEditor()
			{
				editor.html(extractToText(thisElement.val()));
			}

			// the function of getting parent (or super parent) tag name of the selected node
			function detectElement(tags){
			
				var resultdetect=false, $node = getSelectedNode(), parentsTag;
				
				if($node)
				{
					$.each(tags, function(i, val){
						parentsTag = $node.prop('tagName').toLowerCase();

						if (parentsTag == val)
							resultdetect = true;
						else
						{
							$node.parents().each(function(){
								parentsTag = $(this).prop('tagName').toLowerCase();
								if (parentsTag == val)
									resultdetect = true;
							});
						}
					});
					
					return resultdetect;
				}
				else 
					return false;
			};

			// the function of highlighting the toolbar buttons according to the cursor position in jqte editor
			function buttonEmphasize(e)
			{
				for(var n = 0; n < buttons.length; n++)
				{				
					if(vars[buttons[n].name] && buttons[n].emphasis && buttons[n].tag!='')
						detectElement(buttons[n].tag) ? toolbar.find('.'+vars.css+'_tool_'+buttons[n].cls).addClass(emphasize) : $('.'+vars.css+'_tool_'+buttons[n].cls).removeClass(emphasize);
				}
				// showing text format
				if(vars.format && $.isArray(vars.formats))
				{
					var isFoundFormat = false;
					
					for(var f = 0; f < vars.formats.length; f++)
					{
						var thisFormat = [];
						thisFormat[0] = vars.formats[f][0];
						
						if(vars.formats[f][0].length>0 && detectElement(thisFormat))
						{
							formatLabelView(vars.formats[f][1]);
							
							isFoundFormat = true;
							break;
						}
					}
					
					if(!isFoundFormat)
						formatLabelView(vars.formats[0][1]);
				}
				
				// hide all style-fields
				styleFieldSwitch("",false);
				formatFieldSwitch(false);
			}

			// the event of click to the toolbar buttons
			toolbutton
				.unbind("click")
				.click(function(e){	
					// if source button is clicked
					if($(this).data('command')=='displaysource' && !toolbar.data("sourceOpened"))
					{
						// hide all the toolbar buttons (except the source button)
						toolbar.find("."+vars.css+"_tool").addClass(vars.css+"_hiddenField");
						$(this).removeClass(vars.css+"_hiddenField");
						
						// update to data of source displaying
						toolbar.data("sourceOpened",true);
						
						// equalize height of the text field with height of the source field
						thisElement.css("height",editor.outerHeight());
						
						sourceField.removeClass(vars.css+"_hiddenField");
						editor.addClass(vars.css+"_hiddenField");
						thisElement.focus();
						
						// hide the link-form-field
						linkAreaSwitch(false);
						
						// hide all style-fields
						styleFieldSwitch("",false);
						
						// hide format field
						formatFieldSwitch();
						
						// hide placeholder
						if(vars.placeholder && vars.placeholder!="")
							placeHolder.hide();
					}
					// if other buttons is clicked
					else
					{
						// if source field is closed
						if(!toolbar.data("sourceOpened"))
						{
							// if insert-link-button is clicked
							if($(this).data('command')=='linkcreator')
							{
								if(!toolbar.data("linkOpened"))
								{
									selected2link();
								}
								else
								{
									// hide the link-form-field
									linkAreaSwitch(false);
									
									// hide format field
									formatFieldSwitch(false);
								}
							}
							
							// if insert-variable-button is clicked
							else if($(this).data('command')=='variablecreator')
							{
								if(!toolbar.data("variablesOpened"))
								{
									selected2variable();
								}
								else
								{
									// hide the variable-form-field field
									variableAreaSwitch(false);
									
									// hide format field
									formatFieldSwitch(false);
								}
							}
							
							// if the format button is clicked
							else if($(this).data('command')=='formats')
							{
								if($(this).data('command')=='formats' && !$(e.target).hasClass(vars.css+"_format"))
									selected2format();
									
								// hide all style-fields
								styleFieldSwitch("",false);
								
								if(editor.not(":focus"))
									editor.focus();
							}
							
							// if the style buttons are clicked
							else if($(this).data('command')=='fSize' || $(this).data('command')=='colors')
							{
								if(
								($(this).data('command')=='fSize' && !$(e.target).hasClass(vars.css+"_fontsize")) || // the font-size button
								($(this).data('command')=='colors' && !$(e.target).hasClass(vars.css+"_color")) // the color button
								)
								selected2style($(this).data('command'));
								
								// hide format field
								formatFieldSwitch(false);
								
								if(editor.not(":focus"))
									editor.focus();
							}

							// if other buttons is clicked
							else
							{
								// first, prevent to conflict of different jqte editors
								if(editor.not(":focus"))
									editor.focus();

								// apply command of clicked button to the selected text
								selectionSet($(this).data('command'),null);

								// hide all menu-fields
								styleFieldSwitch("",false);
								formatFieldSwitch(false);
								linktypeSwitch();

								// to highlight the toolbar buttons according to the cursor position in jqte editor
								$(this).data('emphasis')==true && !$(this).hasClass(emphasize) ? $(this).addClass(emphasize) : $(this).removeClass(emphasize);

								sourceField.addClass(vars.css+"_hiddenField");
								editor.removeClass(vars.css+"_hiddenField");
							}

						}
						// hide the source field and display the text field
						else
						{
							// update to data of source hiding
							toolbar.data("sourceOpened",false);

							// display all the toolbar buttons
							toolbar.find("."+vars.css+"_tool").removeClass(vars.css+"_hiddenField");

							sourceField.addClass(vars.css+"_hiddenField");
							editor.removeClass(vars.css+"_hiddenField");
						}
						
						if(vars.placeholder && vars.placeholder!="")
							editor.html()!="" ? placeHolder.hide() : placeHolder.show();
					}
					
					// export contents of the text to the sources
					editor.trigger("change");
				})
				// the event of showing to the title bubble when mouse over of the toolbar buttons
				.hover(function(e){
					if(vars.title && $(this).data("title")!="" && ( $(e.target).hasClass(vars.css+"_tool") || $(e.target).hasClass(vars.css+"_tool_icon") ))
					{
						$('.'+vars.css+'_title').remove();

						// create the title bubble
						jQTE.append('<div class="'+vars.css+'_title"><div class="'+vars.css+'_titleArrow"><div class="'+vars.css+'_titleArrowIcon"></div></div><div class="'+vars.css+'_titleText">'+$(this).data("title")+'</div></div>');
						
						var thisTitle = $('.'+vars.css+'_title:first');
						var thisArrow = thisTitle.find('.'+vars.css+'_titleArrowIcon');
						var thisPosition = $(this).position();
						var thisAlignX = thisPosition.left + $(this).outerWidth() - (thisTitle.outerWidth()/2) - ($(this).outerWidth()/2);
						var thisAlignY = (thisPosition.top + $(this).outerHeight() + 5);

						// show the title bubble and set to its position
						thisTitle.delay(400).css({'top':thisAlignY, 'left':thisAlignX}).fadeIn(200);
					}
				},function(){
					$('.'+vars.css+'_title').remove();
				});

			// prevent multiple calling postToSource()
			var editorChangeTimer = null;

			// the methods of the text fields
			editor

				// trigger change method of the text field when the text field modified
				.bind("keypress keyup keydown drop cut copy paste DOMCharacterDataModified DOMSubtreeModified",function()
				{
					// export contents of the text to the sources
					if(!toolbar.data("sourceOpened"))
						$(this).trigger("change");
						
					// hide the link-type-field
					linktypeSwitch();
					
					// if the change method is added run the change method   
					if($.isFunction(vars.change))
						vars.change();
						
					// the feature of placeholder
					if(vars.placeholder && vars.placeholder!="")
						$(this).text()!="" ? placeHolder.hide() : placeHolder.show();
				})
				.bind("change",function()
				{
					if(!toolbar.data("sourceOpened"))
					{
						clearTimeout(editorChangeTimer);
						editorChangeTimer = setTimeout(postToSource,10);
					}
				})

				// run to keyboard shortcuts
				.keydown(function(e)
				{
					// if ctrl key is clicked
					if(e.ctrlKey)
					{
						// check all toolbar buttons
						for(var n = 0; n < buttons.length; n++)
						{
							// if this settings of this button is activated (is it true)
							// if the keyed button with ctrl is same of hotkey of this button
							if(vars[buttons[n].name] && e.keyCode == buttons[n].key.charCodeAt(0))
							{
								if(buttons[n].command=='linkcreator')
									selected2link();
								if(buttons[n].command=='variablecreator')
									selected2variable();
								else if(buttons[n].command!='')
									selectionSet(buttons[n].command,null);
								
								
									
								return false;
							}
						}
					}
				})

				// method of triggering to the highlight button
				.bind("mouseup keyup",buttonEmphasize)

				// the event of focus to the text field
				.focus(function()
				{
					// if the focus method is added run the focus method   
					if($.isFunction(vars.focus))
						vars.focus();
					
					// add onfocus class
					jQTE.addClass(vars.css+"_focused");
					
					// prevent focus problem on opera
					if(/opera/.test(thisBrowser))
					{
						var range = document.createRange();
						range.selectNodeContents(editor[0]);
						range.collapse(false);
						var selection = window.getSelection();
						selection.removeAllRanges();
						selection.addRange(range);
					}
				})

				// the event of focus out from the text field
				.focusout(function()
				{
					// remove to highlights of all toolbar buttons
					toolbutton.removeClass(emphasize);
					
					// hide all menu-fields
					styleFieldSwitch("",false);
					formatFieldSwitch(false);
					linktypeSwitch();					
					
					// if the blur method is added run the blur method   
					if($.isFunction(vars.blur))
						vars.blur();
					
					// remove onfocus class	
					jQTE.removeClass(vars.css+"_focused");
					
					// show default text format
					if($.isArray(vars.formats))
						formatLabelView(vars.formats[0][1]);
				});

			// the event of key in the source field
			thisElement
				.bind("keydown keyup",function()
				{
					// export contents of the source to the text field
					setTimeout(postToEditor,0);
					
					// auto extension for the source field
					$(this).height($(this)[0].scrollHeight);
					
					// if the source field is empty, shorten to the source field
					if($(this).val()=="")
						$(this).height(0);
				})
				.focus(function()
				{
					// add onfocus class
					jQTE.addClass(vars.css+"_focused");
				})
				.focusout(function()
				{
					// remove onfocus class	
					jQTE.removeClass(vars.css+"_focused");
				});
		});
	};
})(jQuery);