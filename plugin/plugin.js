/**
 * @file
 * CKEditor Comment - v1.0.3812
 * A plugin for supporting inline commenting in CKEditor.
 *
 * Homepage: https://github.com/tag1consulting/ckeditor_comments
 * Author: Mark Carver (https://drupal.org/user/501638)
 * Last build: 2013-11-25 7:04:32 PM CST
 */

if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}  // empty constructor
    F.prototype = o; // set base object as prototype
    return new F();  // return empty object with right [[Prototype]]
  };
}

/**
 * Create new DOM elements: COMMENTS and COMMENT.
 */
CKEDITOR.dtd.comments = 1;
CKEDITOR.dtd.comment = 1;

/**
 * Ensure the COMMENTS element is not editable.
 */
var $nonEditable = CKEDITOR.dtd.$nonEditable || {};
$nonEditable.comments = 1;
CKEDITOR.dtd.$nonEditable = $nonEditable;

/**
 * Allow the COMMENTS element to live outside of BODY.
 */
var $nonBodyContent = CKEDITOR.dtd.$nonBodyContent || {};
$nonBodyContent.comments = 1;
CKEDITOR.dtd.$nonBodyContent = $nonBodyContent;

/**
 * Allow the COMMENT element to be treated as inline.
 */
var $inline = CKEDITOR.dtd.$inline || {};
$inline.comment = 1;
CKEDITOR.dtd.$inline = $inline;

/**
 * Allow the COMMENT element to be treated as editable.
 */
var $editable = CKEDITOR.dtd.$editable || {};
$editable.comment = 1;
CKEDITOR.dtd.$editable = $editable;

/**
 * Creates the "comments" plugin for CKEditor.
 */
CKEDITOR.plugins.add('comments', {
  /**
   * Initialization method.
   * @param editor The CKEDITOR.editor instance.
   */
  init : function (editor) {
    var plugin = this;
    window.CKEDITOR_COMMENTS_PLUGIN_PATH = plugin.path;
    // Initiate plugin when editor instance is ready.
    editor.on('instanceReady', function () {
      if (!editor.Comments) {
        editor.Comments = new CKEDITOR.Comments(editor);
        editor.Comments.init();
      }
    });
  }
});

(function ($) { if (CKEDITOR && !CKEDITOR.Comments) {

  /**
   * This is the API entry point. The entire CKEditor.Comments code runs under this object.
   *
   * @singleton
   * @requires CKEDITOR.CommentEvents
   * @constructor
   *   Creates a new CKEDITOR.Comments() instance for editor.
   *
   *     var Comments = new CKEDITOR.Comments(editor);
   *
   * @param {CKEDITOR.editor} editor
   * @returns {CKEDITOR.Comments} Comments
   */
  CKEDITOR.Comments = function(editor) {
    this._initialized = false;
    /**
     * Contains the comment IDs (cids) of initialized comments.
     * @property {object} [comments={}]
     */
    this.comments = {};
    /**
     * A temporary CID value used to unsaved comments (should always be <= 0).
     * @property {object} tempCid
     */
    this.tempCid = 0;
    /**
     * The CKEDITOR.editor instance used in construction.
     * @property {CKEDITOR.editor} editor={}]
     */
    this.editor = editor || {};
    /**
     * Data set properties of the editor's textarea element.
     * @property {object} [data={}]
     */
    this.data = this.editor.name ? $.extend(true, {commentsEnabled: false}, $('#' + this.editor.name).data()) : {};
    /**
     * Status on whether commenting is enabled.
     * @property {boolean} [enabled=false]
     */
    this.enabled = this.data.commentsEnabled || false;
    /**
     * The current comment activated (focused).
     * @property {(boolean|CKEDITOR.Comment)} activeComment
     */
    this.activeComment = false;
    /**
     * Property determining whether instance has loaded.
     * @property {boolean} loaded
     */
    this.loaded = false;
    /**
     * Queue containing the comment IDs (cids) of comments needed to be removed.
     * @property {array} removeQueue
     */
    this.removeQueue = [];
    /**
     * Queue containing the comment IDs (cids) of comments needed to be saved.
     * @property {array} saveQueue
     */
    this.saveQueue = [];
    /**
     * An object used to cache the users of comments.
     * @property {Object} users
     */
    this.users = {};
    return this;
  };

  CKEDITOR.Comments.prototype = {
    init: function () {
      if (!this.enabled || this._initialized) {
        return;
      }
      this._initialized = true;

      var self = this;

      /**
       * An instance of the CommentSidebar class.
       * @property {CKEDITOR.CommentSidebar} sidebar
       * @private
       */
      this.sidebar = this.subclass(CKEDITOR.CommentSidebar);
      this.sidebar.createContainer();

      // Add plugin stylesheet.
      $('<link/>').attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: window.CKEDITOR_COMMENTS_PLUGIN_PATH + 'plugin.css',
        media: 'screen'
      })
        .on('load', function () {
          self.sidebar.containerResize();
        })
        .appendTo($(this.editor.document.$).find('head'));

      // Add comment button.
      this.editor.ui.addButton('comment', {
        label: 'Comment',
        icon: window.CKEDITOR_COMMENTS_PLUGIN_PATH + 'comment.png',
        command: 'comment_add'
      });

      // Add command for comment_add button.
      this.editor.addCommand('comment_add', {
        canUndo: false, // No support for undo/redo
        modes: {
          wysiwyg: 1 // Command is available in wysiwyg mode only.
        },
        exec: function () {
          self.createComment();
        }
      });

      // Detect editor mode switches.
      this.editor.on('mode', function (e) {
        var editor = e.editor;
        // Switched to "wysiwyg" mode.
        if (editor.mode === 'wysiwyg' && !editor.Comments) {
          // Initiate comments plugin on editor again.
          editor.Comments = new CKEDITOR.Comments(editor);
          editor.Comments.init();
        }
        // If switching to source, instantiate a new instance of comments
        // so it can be re-initialized if switched back to 'wysiwyg' mode.
        else if (editor.mode === 'source' && editor.Comments && editor.Comments instanceof CKEDITOR.Comments) {
          delete editor.Comments;
        }
      });

      // Remove comments that haven't been saved before returning editor data.
      this.editor.on('getData', function (e) {
        var $data = $('<div/>').html(e.data.dataValue);
        var comments = $data.find('comment').removeAttr('style').removeAttr('class').toArray();
        for (var i = 0; i < comments.length; i++) {
          if (comments[i]._ && comments[i]._ instanceof CKEDITOR.Comments && !comments[i]._.cid) {
            comments[i]._.remove();
          }
        }
        e.data.dataValue = $data.html();
      });

      var selectionChange = function (evt) {
        evt.editor.removeListener('selectionChange');
        self.sidebar.sort();
        evt.editor.on('selectionChange', selectionChange);
        var range = evt.data.selection.getRanges()[0];
        if (range.collapsed) {
          var parent = range.startContainer.getParent().$;
          if (parent.nodeName === "COMMENT") {
            parent._.activate();
          }
          else if (self.activeComment) {
            self.activeComment.deactive();
          }
        }
        else if (self.activeComment) {
          self.activeComment.deactive();
        }
      };
      this.editor.on('selectionChange', selectionChange);
      this.loadComments();
    },

    /**
     * AJAX callback for retrieving data using default parameters.
     *
     * @param {string} action
     * @param {Object} options
     */
    ajax: function (action, options) {
      options = options || {};
      var defaults = {
        url: Drupal.settings.basePath + 'ajax/ckeditor/comment',
        type: 'POST',
        dataType: 'json',
        data: this.data
      };
      options = $.extend(true, defaults, options);
      options.data.action = action;
      $.ajax(options);
    },

    /**
     * Load existing comments for this instance.
     */
    loadComments: function() {
      var self = this;

      // Only load comments once per instance.
      if (self.loaded) {
        return;
      }

      // Lock editor while loading comments.
      self.editor.setReadOnly(true);

      var $loading = $('<div class="loading">Please wait...</div>');
      self.sidebar.container.append($loading);

      // Instantiate existing comments.
      $(self.editor.document.$).find('body comment').each(function () {
        var $inlineElement = $(this);
        var options = $.extend(true, { inlineElement: $inlineElement }, $inlineElement.data());
        var comment = self.subclass(CKEDITOR.Comment, [options]);
        if (!comment.cid) {
          comment.remove();
        }
      });

      // Load comments from database.
      self.ajax('comment_load', {
        data: {
          comments: self.data.cids
        },
        success: function (json) {
          self.template = json.template;
          for (var i = 0; i < json.comments.length; i++) {
            var comment = self.subclass(CKEDITOR.Comment, [json.comments[i]]);
            if (comment.cid && !self.comments[comment.cid]) {
              self.createComment(comment);
            }
          }
        },
        complete: function () {
          $loading.remove();
          self.editor.setReadOnly(false);
        }
      });
      self.loaded = true;
    },

    /**
     * Find closest comments based on editor cursor position.
     */
    closestComment: function() {
      var self = this,
        selection = self.editor.getSelection(),
        startElement = selection.getStartElement(),
        comment = $();
      if (startElement) {
        comment = $(startElement.$).closest('comment');
        // Try finding first child comment.
        if (!comment.length) {
          comment = $(startElement.$).find('comment:first');
        }
        // Try finding first parent child comment.
        if (!comment.length) {
          comment = $(startElement.$).parent().find('comment:first');
        }
      }
      // Try finding first comment in entire editor.
      if (!startElement || !comment.length) {
        comment = $(self.editor.document.$).find('comment:first');
      }
      if (comment.length && comment.get(0)._ && comment.get(0)._ instanceof CKEDITOR.Comments) {
        return comment.get(0)._;
      }
      return false;
    },

    /**
     * Arrange comments around the comment this was called on.
     * @param {CKEDITOR.Comment} [comment]
     */
    arrangeComments: function(comment) {
      var self = this;
      comment = comment || self.activeComment || self.closestComment();
      if (comment && comment.sidebarElement.length) {
        var beforeTop, beforeComment, commentsBefore = comment.sidebarElement.prevAll('comment').toArray();
        var afterTop, afterComment, commentsAfter = comment.sidebarElement.nextAll('comment').toArray();
        beforeTop = afterTop = comment.sidebarElement.get(0).newTop = comment.findTop();

        self.sidebar.container.find('> comment').stop(true);

        var animateSidebarComment = function() {
          this._.sidebarElement.animate({top: this.newTop + 'px'});
          delete this.newTop;
        };

        comment.sidebarElement.queue('arrangeComments', animateSidebarComment);
        while (commentsBefore.length || commentsAfter.length) {
          if (commentsBefore.length) {
            beforeComment = commentsBefore.splice(0,1)[0];
            beforeTop -= $(beforeComment).outerHeight(false) + 10;
            beforeComment.newTop = beforeTop;
            $(beforeComment).queue('arrangeComments', animateSidebarComment);
          }
          if (commentsAfter.length) {
            afterComment = commentsAfter.splice(0,1)[0];
            afterTop += $(afterComment).outerHeight(false) + 10;
            afterComment.newTop = afterTop;
            $(afterComment).queue('arrangeComments', animateSidebarComment);
          }
        }
        self.sidebar.container.find('> comment').dequeue('arrangeComments');
      }
    },

    /**
     * Create a new comment (CKEDITOR.Comment) for the editor.
     *
     * @param {object} [options={}]
     * @param {boolean} [activate=true]
     */
    createComment: function(options, activate) {
      var self = this;

      options = options || {};
      activate = activate || true;

      var readOnly = self.editor.readOnly;
      if (readOnly) {
        self.editor.setReadOnly(false);
      }
      var selection = rangy.getSelection(self.editor.document.$);
      if (options.character_range) {
        selection.restoreCharacterRanges(self.editor.document.getBody().$, options.character_range);
      }
      else {
        selection.expand('word');
        selection.refresh();
        options.character_range = selection.saveCharacterRanges();
      }
      if (!options.inlineElement || !options.inlineElement.length) {
        var $element = $('<comment/>').html(selection.toHtml());
        if (options.cid) {
          $element.attr('data-cid', options.cid);
        }
        self.editor.insertElement(new CKEDITOR.dom.element($element.get(0)));
        options.inlineElement = $element;
      }
      var comment = options;
      if (!(comment instanceof CKEDITOR.Comments)) {
        comment = self.subclass(CKEDITOR.Comment, [options]);
      }
      if (!comment.cid) {
        comment.edit();
      }
      else if (activate) {
        comment.activate();
      }
      if (readOnly) {
        self.editor.setReadOnly(true);
      }
    },

    /**
     * Create a subclass of the object this is being called on.
     *
     *      var Comments = new CKEDITOR.Comments(editor);
     *      console.log(Comments.editor); // returns Comments.editor instance.
     *
     *      var CommentEvents = new CKEDITOR.CommentEvents();
     *      console.log(CommentEvents.editor); // returns undefined
     *
     *      // However, if we subclass it instead, we will inherit all of Comments
     *      // properties and methods.
     *      var CommentEvents = Comments.subclass(CKEDITOR.CommentEvents);
     *      console.log(CommentEvents.editor); // returns Comments.editor instance.
     *
     * @param {Function} Func The actual class function. Do not instantiate it:
     * new Func() or Func(), just pass the full path to the function:
     * CKEDITOR.CommentSidebar.
     * @param {Array} [args=[]] An array of arguments to pass to the function.
     */
    subclass: function (Func, args) {
      // Default arguments.
      args = args || [];
      // Save the original prototype of the function so we don't destroy it.
      var OriginalPrototype = Func.prototype || {},
          Parent = this,
          ParentPrototype = {},
          prop;
      // Extend Parent properties with getter/setters.
      for (prop in Parent) {
        // Extend getter/setters for Parent if the function doesn't have them.
        if (!Func.hasOwnProperty(prop) && typeof Parent[prop] !== 'function') {
          /*jshint ignore:start*/
          (function () {
            var name = prop;
            Object.defineProperty(ParentPrototype, prop, {
              configurable : true,
              enumerable : true,
              get : function () {
                return Parent[name];
              },
              set : function (value) {
                Parent[name] = value;
              }
            });
          })();
          /*jshint ignore:end*/
        }
        else {
          ParentPrototype[prop] = Parent[prop];
        }
      }
      // Save the newly constructed parent prototype.
      Func.prototype = ParentPrototype;
      // Restore the original prototypes of the function.
      for (prop in OriginalPrototype) {
        Func.prototype[prop] = OriginalPrototype[prop];
      }
      // Instantiate the new subclass.
      var SubClass = Func.apply(new Func(), args);
      // Restore the function's original prototype.
      Func.prototype = OriginalPrototype;
      // Return the subclass.
      return SubClass;
    }

  };

}})(jQuery);

(function ($) { if (CKEDITOR && CKEDITOR.Comments && !CKEDITOR.CommentSidebar) {

  /**
   * This class manages the sidebar for CKEDITOR.Comments. This class should
   * not be used directly. It is automatically instantiated when a
   * CKEDITOR.Comments instance is created.
   *
   *      var Comments = new CKEDITOR.Comments(editor);
   *      console.log(Comments.sidebar)
   *      // returns CKEDITOR.CommentSidebar
   *
   * @extends CKEDITOR.Comments
   * @alias CKEDITOR.Comments._sidebar
   * @constructor
   *   Initializes an instance of this class. This class shouldn't be
   *   instantiated directly, but rather called with CKEDITOR.Comments.subclass.
   *
   * @returns {CKEDITOR.CommentSidebar}
   */
  CKEDITOR.CommentSidebar = function() {
    this.container = $();
    return this;
  };

  CKEDITOR.CommentSidebar.prototype = {
    /**
     * Create the sidebar container in the editor.
     */
    createContainer: function () {
      if (this.container.length) {
        return;
      }
      this.container = $('<comments/>').addClass('cke-comments-sidebar').attr('data-widget-wrapper', 'true').appendTo($(this.editor.document.$).find('html'));
      var self = this;
      $(self.editor.document.getWindow().$).on('resize.cke-comments-sidebar', function () {
        window.console.log('window resize');
        self.containerResize();
      });
    },

    /**
     * Re-positions the comment sidebar on resize events.
     * @event
     */
    containerResize: function () {
      var $document = $(this.editor.document.$);
      var $body = $document.find('body');
      this.container.css('left', (($document.find('html').width() - $body.outerWidth(false)) / 2) + $body.outerWidth(false) + 20) ;
    },

    /**
     * Sort comments in sidebar.
     */
    sort: function () {
      var i, $inlineComments = $(this.editor.document.$).find('body comment');
      for (i = 0; i < $inlineComments.length; i++) {
        if ($inlineComments[i]._ && $inlineComments[i]._.sidebarElement.get(0)) {
          $inlineComments[i]._.sidebarElement.get(0).commentIndex = i;
          $inlineComments[i]._.updateCharacterRange();
        }
      }
      var $sidebarComments = this.container.find('> comment');
      if ($sidebarComments.length) {
        // Sort based on inline comment positions in editor.
        $sidebarComments.sort(function(a, b) {
          if (a.commentIndex > b.commentIndex) {
            return 1;
          }
          else if (a.commentIndex < b.commentIndex) {
            return -1;
          }
          else {
            return 0;
          }
        });
        this.container.append($sidebarComments);
      }
    }

  };

}})(jQuery);

(function ($) { if (CKEDITOR && CKEDITOR.Comments && !CKEDITOR.Comment) {

  /**
   * Class that handles individual comments.
   *
   * @extends CKEDITOR.Comments
   * @constructor Creates a new comment in the editor.
   *
   *     var Comments = new CKEDITOR.Comments(editor);
   *     var comment = new Comments.Comment();
   *
   * @param {object} [options]
   *   The options used to create this comment.
   * @returns {CKEDITOR.Comment}
   */
  CKEDITOR.Comment = function(options) {

    var self = this;
    /**
     * State determining whether the comment is currently being saved.
     * @property {boolean} _saving
     * @private
     */
    self._saving = false;

    /**
     * State determining whether the comment is currently being edited.
     *
     * @property {boolean} _editing
     * @private
     */
    self._editing = false;

    /**
     * State determining whether the comment is new (not saved in database).
     *
     * @property {boolean} _new
     * @private
     */
    self._new = false;

    /**
     * The UNIX timestamp of when the comment was last modified.
     *
     * Setting this property will automatically update the corresponding <code>
     * &lt;time/&gt;</code> element inside the CKEDITOR.Comment.sidebarElement.
     *
     * @property {number} [changed=0]
     */
    var _changed = 0;
    self.changed = _changed;
    Object.defineProperty(self, 'changed', {
      configurable : true,
      enumerable : true,
      get : function () {
        return _changed;
      },
      set : function (_newChanged) {
        var _oldChanged = _changed;
        if (typeof _newChanged !== 'number') {
          _newChanged = parseInt(_newChanged, 10) || 0;
        }
        if (_oldChanged !== _newChanged) {
          _changed = _newChanged;
        }
        var $time = self.sidebarElement.find('time');
        if (_changed && $time.length) {
          var date = new Date(_changed * 1000);
          if ($time.length && jQuery.timeago) {
            $time.timeago('update', date);
          }
          else {
            $time.html(date.toLocaleDateString());
          }
        }
        else {
          $time.html('');
        }
      }
    });

    /**
     * The position of the inline comment.
     *
     * @property {Array} character_range
     * @uses rangy.saveCharacterRanges
     * @uses rangy.restoreCharacterRanges
     */
    self.character_range = [];

    /**
     * The unique identification number of the comment.
     *
     * @property {number} [cid=0]
     */
    var _cid = 0;
    self.cid = _cid;
    Object.defineProperty(self, 'cid', {
      configurable : true,
      enumerable : true,
      get : function () {
        return _cid;
      },
      set : function (_newCid) {
        var _oldCid = _cid;
        if (typeof _newCid !== 'number') {
          _newCid = parseInt(_newCid, 10) || 0;
        }
        // Only set cid if it differs from the original cid.
        if (_oldCid !== _newCid) {
          _cid = _newCid;
          if (self.inlineElement instanceof jQuery && self.inlineElement.length) {
            // Update the inlineElement's data-cid value.
            self.inlineElement.attr('data-cid', _cid);
            // Save a reference to this comment in the comments instance.
            if (_cid) {
              self.comments[_cid] = self;
            }
            // Remove the old reference to this comment in the comments instance.
            if (_oldCid && self.comments[_oldCid]) {
              delete self.comments[_oldCid];
            }
          }
        }
      }
    });

    /**
     * The display content of the comment.
     *
     * @property {string} content
     */
    self.content = '';

    /**
     * The jQuery Object of the comment located inside the editor BODY (content).
     *
     * @property {jQuery} [inlineElement=$()]
     */
    var _inlineElement = $();
    self.inlineElement = _inlineElement;
    Object.defineProperty(self, 'inlineElement', {
      configurable : true,
      enumerable : true,
      get : function () {
        return _inlineElement;
      },
      set : function (_newInlineElement) {
        var _oldInlineElement = _inlineElement;
        if (_oldInlineElement !== _newInlineElement && _newInlineElement instanceof jQuery && _newInlineElement.length) {
          _newInlineElement.get(0)._ = self;
        }
        else {
          _newInlineElement = $();
        }
        _inlineElement = _newInlineElement;
        if (_inlineElement.length) {
          self.sidebarElement = $('<comment><div class="color"></div><header></header><section></section><footer></footer></comment>')
            .addClass('cke-comment')
            .attr('data-widget-wrapper', 'true')
            .css('top', self.findTop() + 'px')
            .on('click', function () {
              self.activate();
            })
            .appendTo(self.sidebar.container);
          self.sidebar.sort();
          self.assignUser();
          self.arrangeComments();
        }
      }
    });

    /**
     * Name
     *
     * @property {(string|boolean)} name
     */
    self.name = false;

    /**
     * Picture
     * @property {(string|boolean)} picture
     */
    self.picture = false;

    /**
     * The jQuery Object of the comment located inside CKEDITOR.sidebar.
     *
     * @property {jQuery} [sidebarElement=$()]
     */
    var _sidebarElement = $();
    self.sidebarElement = _sidebarElement;
    Object.defineProperty(self, 'sidebarElement', {
      configurable : true,
      enumerable : true,
      get : function () {
        return _sidebarElement;
      },
      set : function (value) {
        if (value instanceof jQuery && value.length) {
          value.get(0)._ = self;
          value.find('section').html(self.content);
        }
        else {
          value = $();
        }
        _sidebarElement = value;
      }
    });

    /**
     * The unique identification number of the user whom created the comment.
     *
     * @property {number} uid
     */
    self.uid = 0;

    // Only extend comment with options that matter.
    options = options || {};
    for (var i in options) {
      if (options.hasOwnProperty(i) && self.hasOwnProperty(i)) {
        self[i] = options[i];
      }
    }
    return self;
  };
  CKEDITOR.Comment.prototype = {
    /**
     * Remove comment.
     *
     * This method will remove both the CKEDITOR.Comment.sidebarElement and the
     * CKEDITOR.Comment.inlineElement jQuery object DOM elements from the editor.
     *
     * This method also invokes CKEDITOR.Comments.arrangeComments() afterwards.
     */
    remove: function () {
      var self = this;
      if (self.inlineElement.length) {
        self.inlineElement.contents().unwrap();
      }
      if (self.sidebarElement.length) {
        self.sidebarElement.remove();
      }
      self.arrangeComments();
    },

    /**
     * Edit comment.
     */
    edit: function () {
      var self = this;
      if (!self._editing) {
        self.edit = true;
        var $section = self.sidebarElement.find('section');
        self.content = $section.html();
        var $textarea = $('<textarea/>').val(self.content);
        $section.html($textarea);
        $textarea.focus();
        $('<button/>')
          .text('Save')
          .addClass('primary')
          .appendTo($section)
          .bind('click', function () {
            self.content = $textarea.val();
            self.save(function () {
              $section.html(self.content);
              self._editing = false;
              self.arrangeComments();
            });
          });
        $('<button/>')
          .text('Cancel')
          .appendTo($section)
          .bind('click', function () {
            self._editing = false;
            if (!self.cid) {
              self.remove();
            }
            else {
              $section.html(self.content);
              self.arrangeComments();
            }
          });
        self.arrangeComments(self);
      }
    },

    /**
     * Assign user (creates sidebar element header information).
     */
    assignUser: function() {
      var self = this;
      function rand(min, max) {
        return parseInt(Math.random() * (max-min+1), 10) + min;
      }
      function random_color() {
        var h = rand(0, 360);
        var s = rand(20, 80);
        var l = rand(50, 70);
        return 'hsl(' + h + ',' + s + '%,' + l + '%)';
      }
      if (!self.uid) {
        self.uid = Drupal.settings.ckeditor_comment.currentUser.uid;
        self.name = Drupal.settings.ckeditor_comment.currentUser.name;
        self.picture = Drupal.settings.ckeditor_comment.currentUser.picture;
      }
      if (!self.users[self.uid]) {
        self.users[self.uid] = {
          uid: self.uid,
          name: self.name,
          picture: self.picture
        };
      }
      var user = self.users[self.uid];
      if (!user.color) {
        user.color = random_color();
      }

      // Assign the user color.
      self.inlineElement.css('borderColor', user.color);
      self.sidebarElement.find('.color').css('backgroundColor', user.color);

      // Create header with picture, name and timestamp.
      var $header = self.sidebarElement.find('header');
      $header.append(user.picture);
      $('<span/>').attr('rel', 'author').addClass('name').html(user.name).appendTo($header);

      // Last changed time.
      var $time = $('<time/>').appendTo($header);
      if (self.changed) {
        var date = new Date(self.changed * 1000);
        $time.attr('datetime', date.toISOString()).html(date.toLocaleString());
        if ($.timeago) {
          $time.timeago();
        }
      }
    },

    /**
     * Deactivate comment.
     *
     * This method removes the <code>.active</code> class from both
     * CKEDITOR.Comment.inlineElement and CKEDITOR.Comment.sidebarElement.
     */
    deactive: function() {
      var self = this;
      if (self.activeComment === self) {
        self.activeComment = false;
      }
      if (!self.cid && !self._saving) {
        self.remove();
      }
      else {
        self.inlineElement.removeClass('active');
        self.sidebarElement.removeClass('active');
      }
    },

    /**
     * Activate comment.
     *
     * This method adds the <code>.active</code> class to both
     * CKEDITOR.Comment.inlineElement and CKEDITOR.Comment.sidebarElement.
     *
     * This method also invokes CKEDITOR.Comments.arrangeComments() afterwards.
     */
    activate: function() {
      var self = this;
      // Blur the currently focused comment.
      if (self.activeComment && self.activeComment !== self) {
        self.activeComment.deactive();
      }
      // Set this comment as the currently focused comment.
      self.activeComment = self;

      // Focus this comment.
      self.inlineElement.addClass('active');
      self.sidebarElement.addClass('active');

      // Re-arrange touching comments.
      self.arrangeComments();
    },

    /**
     * Determines the current top position of CKEDITOR.Comment.inlineElement.
     * @returns {number}
     */
    findTop: function() {
      var self = this;
      if (self.inlineElement.length) {
        return self.inlineElement.position().top - (self.inlineElement.outerHeight(false) / 2);
      }
      return 0;
    },

    /**
     * Resolve comment.
     * @todo Add functionality to this method
     */
    resolve: function() {},

    /**
     * Save comment.
     * @param {Function} [callback]
     * @todo Allow dynamic field values to be saved.
     */
    save: function(callback) {
      var self = this;
      callback = callback || function () {};
      self._saving = true;
      self.ajax('comment_save', {
        data: {
          comments: [{
            cid: self.cid,
            character_range: self.character_range,
            ckeditor_comment_body: self.content
          }]
        },
        success: function (json) {
          self.cid = json.comments[0].cid;
          self.name = json.comments[0].name;
          self.picture = json.comments[0].picture;
          self.uid = json.comments[0].uid;
          self.content = json.comments[0].content;
          self._saving = false;
          callback(json);
        }
      });
    },

    /**
     * Set a property on the comment.
     *
     * If the <code>property</code> argument is of type: <code>string</code>, the
     * <code>value</code> argument is required.
     *
     * If the <code>property</code> argument is of type: <code>object</code>, the
     * <code>value</code> argument is ignored. The object must instead contain
     * <code>property: value</code> pairs.
     *
     * <code>property</code> must already exist in the CKEDITOR.Comment object.
     * Arbitrary properties cannot be set via this method.
     *
     *     comment.set('cid', 1234);
     *
     * or
     *
     *     comment.set({
     *       cid: 1234,
     *       content: 'Comment'
     *     });
     *
     * @param {(string|object)} property
     * @param {*} [value]
     */
    set: function(property, value) {
      var self = this;
      if (typeof property === 'string' && typeof self[property] !== 'undefined' && typeof value !== 'undefined') {
        self[property] = value;
      }
      else if (typeof property === 'object') {
        for (var prop in property) {
          if (typeof self[prop] !== 'undefined') {
            self[prop] = property[prop];
          }
        }
      }
    },

    /**
     * Update an element's character range, saving if necessary.
     */
    updateCharacterRange: function () {
      var selection = rangy.getSelection(this.editor.document.$);
      var _cke_ranges = this.editor.getSelection().getRanges();
      this.editor.getSelection().lock();
      selection.selectAlllChildren(this.inlineElement.get(0));
      var newCharacterRange = selection.saveCharacterRanges();
      if (JSON.stringify(newCharacterRange) !== JSON.stringify(this.character_range)) {
        //        window.console.log('"' + selection.toString() + '": new character range');
        this.character_range = newCharacterRange;
      }
      else {
        //        window.console.log('"' + selection.toString() + '": same character range');
      }
      this.editor.getSelection().selectRanges(_cke_ranges);
      this.editor.getSelection().unlock();
    }
  };

}})(jQuery);
