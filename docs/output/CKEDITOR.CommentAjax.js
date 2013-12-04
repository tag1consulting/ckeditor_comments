Ext.data.JsonP.CKEDITOR_CommentAjax({"tagname":"class","name":"CKEDITOR.CommentAjax","autodetected":{},"files":[{"filename":"CommentAjax.js","href":"CommentAjax.html#CKEDITOR-CommentAjax"}],"extends":"CKEDITOR.Comments","members":[{"name":"_initialized","tagname":"property","owner":"CKEDITOR.Comments","id":"property-_initialized","meta":{"private":true}},{"name":"_temporaryCid","tagname":"property","owner":"CKEDITOR.Comments","id":"property-_temporaryCid","meta":{"private":true}},{"name":"activeComment","tagname":"property","owner":"CKEDITOR.Comments","id":"property-activeComment","meta":{}},{"name":"ajax","tagname":"property","owner":"CKEDITOR.Comments","id":"property-ajax","meta":{}},{"name":"comments","tagname":"property","owner":"CKEDITOR.Comments","id":"property-comments","meta":{}},{"name":"data","tagname":"property","owner":"CKEDITOR.Comments","id":"property-data","meta":{}},{"name":"editor","tagname":"property","owner":"CKEDITOR.Comments","id":"property-editor","meta":{}},{"name":"enabled","tagname":"property","owner":"CKEDITOR.Comments","id":"property-enabled","meta":{}},{"name":"loaded","tagname":"property","owner":"CKEDITOR.Comments","id":"property-loaded","meta":{}},{"name":"removeQueue","tagname":"property","owner":"CKEDITOR.Comments","id":"property-removeQueue","meta":{}},{"name":"saveQueue","tagname":"property","owner":"CKEDITOR.Comments","id":"property-saveQueue","meta":{}},{"name":"sidebar","tagname":"property","owner":"CKEDITOR.Comments","id":"property-sidebar","meta":{}},{"name":"users","tagname":"property","owner":"CKEDITOR.Comments","id":"property-users","meta":{}},{"name":"constructor","tagname":"method","owner":"CKEDITOR.CommentAjax","id":"method-constructor","meta":{}},{"name":"ajax","tagname":"method","owner":"CKEDITOR.CommentAjax","id":"method-ajax","meta":{}},{"name":"arrangeComments","tagname":"method","owner":"CKEDITOR.Comments","id":"method-arrangeComments","meta":{}},{"name":"closestComment","tagname":"method","owner":"CKEDITOR.Comments","id":"method-closestComment","meta":{}},{"name":"getTemporaryCid","tagname":"method","owner":"CKEDITOR.Comments","id":"method-getTemporaryCid","meta":{}},{"name":"loadComments","tagname":"method","owner":"CKEDITOR.CommentAjax","id":"method-loadComments","meta":{}},{"name":"subclass","tagname":"method","owner":"CKEDITOR.Comments","id":"method-subclass","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-CKEDITOR.CommentAjax","component":false,"superclasses":["CKEDITOR.Comments"],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='docClass'>CKEDITOR.Comments</a><div class='subclass '><strong>CKEDITOR.CommentAjax</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/CommentAjax.html#CKEDITOR-CommentAjax' target='_blank'>CommentAjax.js</a></div></pre><div class='doc-contents'><p>This class centralizes the ajax loading for ckeditor_comment.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-_initialized' class='member first-child inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-_initialized' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-_initialized' class='name expandable'>_initialized</a> : object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>State determining whether this instance has been initialized. ...</div><div class='long'><p>State determining whether this instance has been initialized.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-_temporaryCid' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-_temporaryCid' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-_temporaryCid' class='name expandable'>_temporaryCid</a> : object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>A temporary CID value used to unsaved comments (should always be &lt;= 0). ...</div><div class='long'><p>A temporary CID value used to unsaved comments (should always be &lt;= 0).</p>\n<p>Defaults to: <code>0</code></p></div></div></div><div id='property-activeComment' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-activeComment' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-activeComment' class='name expandable'>activeComment</a> : (boolean|<a href=\"#!/api/CKEDITOR.Comment\" rel=\"CKEDITOR.Comment\" class=\"docClass\">CKEDITOR.Comment</a>)<span class=\"signature\"></span></div><div class='description'><div class='short'>The current comment activated (focused). ...</div><div class='long'><p>The current comment activated (focused).</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-ajax' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-ajax' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-ajax' class='name expandable'>ajax</a> : <a href=\"#!/api/CKEDITOR.CommentAjax\" rel=\"CKEDITOR.CommentAjax\" class=\"docClass\">CKEDITOR.CommentAjax</a><span class=\"signature\"></span></div><div class='description'><div class='short'><p>An instance of the CommentAjax class.</p>\n</div><div class='long'><p>An instance of the CommentAjax class.</p>\n</div></div></div><div id='property-comments' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-comments' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-comments' class='name expandable'>comments</a> : object<span class=\"signature\"></span></div><div class='description'><div class='short'>Contains the comment IDs (cids) of initialized comments. ...</div><div class='long'><p>Contains the comment IDs (cids) of initialized comments.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='property-data' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-data' class='name expandable'>data</a> : object<span class=\"signature\"></span></div><div class='description'><div class='short'>Data set properties of the editor's textarea element. ...</div><div class='long'><p>Data set properties of the editor's textarea element.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='property-editor' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-editor' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-editor' class='name expandable'>editor</a> : CKEDITOR.editor<span class=\"signature\"></span></div><div class='description'><div class='short'>The CKEDITOR.editor instance used in construction.] ...</div><div class='long'><p>The CKEDITOR.editor instance used in construction.]</p>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='property-enabled' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-enabled' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-enabled' class='name expandable'>enabled</a> : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Status on whether commenting is enabled. ...</div><div class='long'><p>Status on whether commenting is enabled.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-loaded' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-loaded' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-loaded' class='name expandable'>loaded</a> : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Property determining whether instance has loaded. ...</div><div class='long'><p>Property determining whether instance has loaded.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-removeQueue' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-removeQueue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-removeQueue' class='name expandable'>removeQueue</a> : array<span class=\"signature\"></span></div><div class='description'><div class='short'>Queue containing the comment IDs (cids) of comments needed to be removed. ...</div><div class='long'><p>Queue containing the comment IDs (cids) of comments needed to be removed.</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='property-saveQueue' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-saveQueue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-saveQueue' class='name expandable'>saveQueue</a> : array<span class=\"signature\"></span></div><div class='description'><div class='short'>Queue containing the comment IDs (cids) of comments needed to be saved. ...</div><div class='long'><p>Queue containing the comment IDs (cids) of comments needed to be saved.</p>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='property-sidebar' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-sidebar' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-sidebar' class='name expandable'>sidebar</a> : <a href=\"#!/api/CKEDITOR.CommentSidebar\" rel=\"CKEDITOR.CommentSidebar\" class=\"docClass\">CKEDITOR.CommentSidebar</a><span class=\"signature\"></span></div><div class='description'><div class='short'>An instance of the CommentSidebar class. ...</div><div class='long'><p>An instance of the CommentSidebar class.</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-users' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-property-users' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-property-users' class='name expandable'>users</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>An object used to cache the users of comments. ...</div><div class='long'><p>An object used to cache the users of comments.</p>\n<p>Defaults to: <code>{}</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CKEDITOR.CommentAjax'>CKEDITOR.CommentAjax</span><br/><a href='source/CommentAjax.html#CKEDITOR-CommentAjax-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/CKEDITOR.CommentAjax-method-constructor' class='name expandable'>CKEDITOR.CommentAjax</a>( <span class='pre'></span> ) : <a href=\"#!/api/CKEDITOR.CommentAjax\" rel=\"CKEDITOR.CommentAjax\" class=\"docClass\">CKEDITOR.CommentAjax</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Initializes an instance of this class. ...</div><div class='long'><p>Initializes an instance of this class.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/CKEDITOR.CommentAjax\" rel=\"CKEDITOR.CommentAjax\" class=\"docClass\">CKEDITOR.CommentAjax</a></span><div class='sub-desc'>\n</div></li></ul><p>Overrides: <a href=\"#!/api/CKEDITOR.Comments-method-constructor\" rel=\"CKEDITOR.Comments-method-constructor\" class=\"docClass\">CKEDITOR.Comments.constructor</a></p></div></div></div><div id='method-ajax' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CKEDITOR.CommentAjax'>CKEDITOR.CommentAjax</span><br/><a href='source/CommentAjax.html#CKEDITOR-CommentAjax-method-ajax' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.CommentAjax-method-ajax' class='name expandable'>ajax</a>( <span class='pre'>action, options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>AJAX callback for retrieving data using default parameters. ...</div><div class='long'><p>AJAX callback for retrieving data using default parameters.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>action</span> : string<div class='sub-desc'>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-arrangeComments' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-method-arrangeComments' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-method-arrangeComments' class='name expandable'>arrangeComments</a>( <span class='pre'>[comment]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Arrange comments around the comment this was called on. ...</div><div class='long'><p>Arrange comments around the comment this was called on.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>comment</span> : <a href=\"#!/api/CKEDITOR.Comment\" rel=\"CKEDITOR.Comment\" class=\"docClass\">CKEDITOR.Comment</a> (optional)<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-closestComment' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-method-closestComment' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-method-closestComment' class='name expandable'>closestComment</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Find closest comments based on editor cursor position. ...</div><div class='long'><p>Find closest comments based on editor cursor position.</p>\n</div></div></div><div id='method-getTemporaryCid' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-method-getTemporaryCid' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-method-getTemporaryCid' class='name expandable'>getTemporaryCid</a>( <span class='pre'></span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves a temporary CID for comments. ...</div><div class='long'><p>Retrieves a temporary CID for comments.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-loadComments' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='CKEDITOR.CommentAjax'>CKEDITOR.CommentAjax</span><br/><a href='source/CommentAjax.html#CKEDITOR-CommentAjax-method-loadComments' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.CommentAjax-method-loadComments' class='name expandable'>loadComments</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Load existing comments for this instance. ...</div><div class='long'><p>Load existing comments for this instance.</p>\n</div></div></div><div id='method-subclass' class='member  inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><a href='#!/api/CKEDITOR.Comments' rel='CKEDITOR.Comments' class='defined-in docClass'>CKEDITOR.Comments</a><br/><a href='source/Comments.html#CKEDITOR-Comments-method-subclass' target='_blank' class='view-source'>view source</a></div><a href='#!/api/CKEDITOR.Comments-method-subclass' class='name expandable'>subclass</a>( <span class='pre'>Func</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a subclass of the object this is being called on. ...</div><div class='long'><p>Create a subclass of the object this is being called on.</p>\n\n<pre><code> var Comments = new <a href=\"#!/api/CKEDITOR.Comments\" rel=\"CKEDITOR.Comments\" class=\"docClass\">CKEDITOR.Comments</a>(editor);\n console.log(Comments.editor); // returns Comments.editor instance.\n\n var CommentSidebar = new <a href=\"#!/api/CKEDITOR.CommentSidebar\" rel=\"CKEDITOR.CommentSidebar\" class=\"docClass\">CKEDITOR.CommentSidebar</a>();\n console.log(CommentSidebar.editor); // returns undefined\n\n // However, if we subclass it instead, we will inherit all of Comments\n // properties and methods.\n var CommentSidebar = Comments.subclass(<a href=\"#!/api/CKEDITOR.CommentSidebar\" rel=\"CKEDITOR.CommentSidebar\" class=\"docClass\">CKEDITOR.CommentSidebar</a>);\n console.log(CommentSidebar.editor); // returns Comments.editor instance.\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>Func</span> : Function<div class='sub-desc'><p>The actual class function. Do not instantiate it:\nnew Func() or Func(), just pass the full path to the function:\n<a href=\"#!/api/CKEDITOR.CommentSidebar\" rel=\"CKEDITOR.CommentSidebar\" class=\"docClass\">CKEDITOR.CommentSidebar</a>.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});