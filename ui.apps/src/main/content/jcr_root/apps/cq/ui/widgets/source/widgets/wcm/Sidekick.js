//Jquery Highlight 

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);
    
    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function(word, i){
      return word != '';
    });
    words = jQuery.map(words, function(word, i) {
      return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);
    
    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};





/*
 * Copyright 1997-2008 Day Management AG
 * Barfuesserplatz 6, 4001 Basel, Switzerland
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Day Management AG, ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Day.
 */

/**
 * The Sidekick is a floating helper providing the user with common tools
 * for page editing.
 * @class CQ.wcm.Sidekick
 * @extends CQ.Dialog
 * @constructor
 * Creates a new Sidekick.
 * @param {Object} config The config object
 */
CQ.wcm.Sidekick = CQ.Ext.extend(CQ.Dialog, {

    /**
     * @cfg {String} pathParam
     * The parameter name used to send the content path (defaults to "path").
     */
    pathParam: null,

    /**
     * @cfg {String} createText
     * The text for the Create button (defaults to "Create Page...").
     * @deprecated No longer in use.
     */
    createText: null,

    /**
     * @cfg {String/Object} createDialog
     * The dialog to show when the Create button is clicked (defaults to
     * "/libs/wcm/core/content/tools/sidekickcreatepagedialog").
     * @deprecated No longer in use.
     */
    createDialog: null,

    /**
     * @cfg {String} templateSelectionId
     * The ID of the template selection widget (defaults to "templateselection").
     */
    templateSelectionId: null,

    /**
     * @cfg {String/Object} templateList
     * The list of templates or a URL used to retrieve them (defaults to
     * "/bin/wcmcommand?cmd=getTemplates").
     */
    templateList: null,

    /**
     * @cfg {String} createChildPageText
     * The text for the Create Sub Page button (defaults to "Create Sub Page").
     */
    createChildPageText: null,

    /**
     * @cfg {String} copyPageText
     * The text for the Copy Page button (defaults to "Copy Page").
     */
    copyPageText: null,

    /**
     * @cfg {String} movePageText
     * The text for the Move Page button (defaults to "Move Page").
     */
    movePageText: null,

    /**
     * @cfg {String} deleteText
     * The text for the Delete button (defaults to "Delete Page").
     */
    deleteText: null,

    /**
     * @cfg {String} deleteUrl
     * The URL used to delete pages (defaults to
     * "/bin/wcmcommand?cmd=deletePage").
     */
    deleteUrl: null,

    /**
     * @cfg {String} publishText
     * The text for the Publish button (defaults to "Activate Page").
     */
    publishText: null,

    /**
     * @cfg {String} publishUrl
     * The URL used to publish pages (defaults to "/bin/replicate.json").
     */
    publishUrl: null,

    /**
     * @cfg {String} deactivateText
     * The text for the Deactivate button (defaults to "Deactivate Page").
     */
    deactivateText: null,

    /**
     * @cfg {String} rolloutText
     * The text for the Rollout button (defaults to "Rollout Page").
     */
    rolloutText: null,

    /**
     * @cfg {String} rolloutUrl
     * The URL used to rollout pages (defaults to "/bin/wcmcommand?cmd=rollout").
     */
    rolloutUrl: null,

    /**
     * @cfg {String} scaffoldingText
     * The text for the Scaffolding button (defaults to "Scaffolding").
     */
    scaffoldingText: null,

    /**
     * @cfg {String} referencesText
     * The text for the References button (defaults to "Show References...").
     */
    referencesText: null,

    /**
     * @cfg {String} lockText
     * The text for the Lock button (defaults to "Lock Page").
     */
    lockText: null,

    /**
     * @cfg {String} lockedByText
     * The text to display when the user is not allowed to unlock.
     */
    lockedByText: null,

    /**
     * @cfg {String} unlockText
     * The text for the Unlock button (defaults to "Unlock Page").
     */
    unlockText: null,

    /**
     * @cfg {String} lockUrl
     * The URL used to lock pages (defaults to "/bin/wcmcommand?cmd=lockPage").
     */
    lockUrl: null,

    /**
     * @cfg {Boolean} locked
     * True if the current page is locked (defaults to false).
     */
    /**
     * @property {Boolean} locked
     * True if the current page is locked (defaults to false).
     */
    locked: false,

    /**
     * @cfg {String} unlockUrl
     * The URL used to unlock pages (defaults to "/bin/wcmcommand?cmd=unlockPage").
     */
    unlockUrl: null,

    /**
     * @cfg {String} readOnly
     * True to render the Sidekick read-only (defaults to false).
     */
    readOnly: false,

    /**
     * @cfg {String} versionText
     * The text for the Version button (defaults to "Create Version...").
     */
    versionText: null,

    /**
     * @cfg {String/Object} versionDialog
     * The dialog to show when the Version button is clicked (defaults to
     * "/libs/wcm/core/content/tools/createversiondialog").
     * @deprecated No longer in use.
     */
    versionDialog: null,

    /**
     * @cfg {String} versionSelectionId
     * The ID of the version selection widget (defaults to "versionselection").
     */
    versionSelectionId: null,

    /**
     * @cfg {String/Object} versionList
     * The list of versions or URL used to retrieve them
     * (defaults to "/bin/wcmcommand?cmd=getRevisions").
     */
    versionList: null,

    /**
     * @cfg {String} restoreText
     * The text for the Restore button (defaults to "Restore").
     */
    restoreText: null,

    /**
     * @cfg {String/Object} restoreDialog
     * The dialog to show when the Restore button is clicked (defaults to
     * "/libs/wcm/core/content/tools/restoreversiondialog").
     * @deprecated No longer in use.
     */
    restoreDialog: null,

    /**
     * @cfg {String} promoteText
     * The text for the Promote button (defaults to "Promote Launch").
     */
    promoteText: null,

    /**
     * @cfg {String} markProductionReadyText
     * The text for the Mark Production Ready button (defaults to "Mark Launch Production Ready").
     */
    markProductionReadyText: null,

    /**
     * @cfg {String} unmarkProductionReadyText
     * The text for the Unmark Production Ready button (defaults to "Unmark Launch Production Ready").
     */
    unmarkProductionReadyText: null,

    /**
     * @cfg {String} productionReadyText
     * The text for the Production Ready status (defaults to "Launch marked Production Ready").
     */
    productionReadyText: null,

    /**
     * @cfg {String} productionNotReadyText
     * The text for the Production Not Ready status (defaults to "Launch is no more Production Ready").
     */
    productionNotReadyText: null,

    /**
     * @cfg {String} auditText
     * The text for the Audit Log button (defaults to "Audit Log...").
     */
    auditText: null,

    /**
     * @cfg {String/Object} auditDialog
     * The dialog to show when the Audit Log button is clicked (defaults
     * to "/libs/wcm/core/content/tools/auditlogdialog").
     */
    auditDialog: null,

    /**
     * @cfg {String} permsText
     * The text for the Permissions button (defaults to "Permissions...").
     */
    permsText: null,

    /**
     * @cfg {String/Object} permsDialog
     * The dialog to show when the Permissions button is clicked (defaults to
     * "/libs/wcm/core/content/tools/permissiondialog").
     */
    permsDialog: null,

    /**
     * @cfg {String} propsText
     * The text for the Properties button (defaults to "Properties...").
     */
    propsText: null,

    /**
     * @cfg {String/Object} propsDialog
     * The dialog to show when the Properties button is clicked (defaults to
     * "/libs/foundation/components/page/dialog").
     */
    propsDialog: null,

    /**
     * @cfg {String} startWorkflowText
     * The text for the Start Workflow button (defaults to "Start Workflow").
     */
    startWorkflowText: null,

    /**
     * @cfg {String/Object} startWorkflowDialog
     * The dialog to show when the Start Workflow button is clicked (defaults
     * to "/libs/wcm/core/content/tools/startworkflowdialog").
     * @deprecated No longer in use.
     */
    startWorkflowDialog: null,

    /**
     * @cfg {String} previewText
     * The text for the Preview button (defaults to "Preview").
     */
    previewText: null,

    /**
     * @cfg {String} editText
     * The text for the Edit button (defaults to "Edit").
     */
    editText: null,

    /**
     * @cfg {String} designText
     * The text for the Design button (defaults to "Design").
     */
    designText: null,

    /**
     * @cfg {String} adminText
     * The text for the Websites button (defaults to "Websites").
     */
    adminText: null,

    /**
     * @cfg {String} clientContextText
     * The text for the ClientContext button (defaults to "Client Context").
     */
    clientContextText: null,

    /**
     * @cfg {String} analyticsText
     * The text for the Analytics button (defaults to "Analytics").
     */
    analyticsText: null,

    /**
     * @cfg {String} miscText
     * The text for the Tools button (defaults to "Tools").
     */
    miscText: null,

    /**
     * @cfg {String} adminUrl
     * The URL for the Websites button (defaults to
     * "/siteadmin.html").
     */
    adminUrl: null,

    /**
     * @cfg {String} miscUrl
     * The URL for the Websites button if path starts with /etc (defaults to
     * "/miscadmin.html").
     */
    miscUrl: null,

    /**
     * @cfg {String} liveCopyStatusText
     * The text for the Live Copy Status button (defaults to "Live Copy Status").
     */
    liveCopyStatusText: null,

    /**
     * @cfg {String} gotoText
     * The text for the Go To menu item.
     * @deprecated No longer in use.
     */
    gotoText: null,

    /**
     * @cfg {Object[]} actions
     * The actions displayed in the Sidekick (defaults to
     * {@link #Sidekick.DEFAULT_ACTIONS CQ.wcm.Sidekick.DEFAULT_ACTIONS}).
     * <p>Example:
     * <pre><code>
[
    CQ.wcm.Sidekick.DELETE,
    CQ.wcm.Sidekick.PUBLISH,
    {
        text: "Custom Action",
        handler: ...
    },
    CQ.wcm.Sidekick.PROPS
]
       </code></pre></p>
     */

    /**
     * @cfg {Boolean} previewReload
     * True to force reloading of the page when changing to preview mode
     * (defaults to false).
     * <p>This option is only required if there are components that render
     * themselves differently based on the WCM mode.</p>
     */
    previewReload: false,

    /**
     * The actions in the sidekick.
     * @private
     * @type CQ.Ext.Action[]
     */
    actns: null,

    /**
     * The buttons.
     * @private
     * @type Object
     */
    buttons: null,

    /**
     * The panels holding the actions.
     * @private
     * @type CQ.Ext.Panel
     */
    panels: null,

    /**
     * Returns the content path of the sidekick.
     * @return {String} The path
     */
    getPath: function() {
        // Note: This simple getter is an exception for easier path
        //       retrieval in action handlers.
        return this.path;
    },

    /**
     * Sets the content path of the sidekick.
     * @param {String} path The path
     */
    setPath: function(path) {
        this.path = path;
    },

    loadContent: function(content, config) {
        // Only set the path and the config
        this.setPath(content);
        this.loadedConfig = config;

        if ( !this.collapsed ) {
            this.panelsLoaded = false;
            this.panels = {};
            this.removeAll(true);
            this.addLoadingPanel();
            this.doLayout();
            this.lazyLoadContent.defer(10, this);
        }

        // scrolling the content must be done when the page is rendered,
        // hence using the (content) window onload event
        var sk = this;
        CQ.WCM.getContentWindow().CQ.Ext.onLoad(function() {
            sk.scrollContentToLastPosition();
        });
    },

    /**
     * Method which really loads the content
     * @private
     * @since 5.5
     */
    lazyLoadContent: function() {
        if (!this.panelsLoaded) {
            for (var i = CQ.wcm.Sidekick.componentsWithDragZone.length - 1; i>=0; i--) {
                if (CQ.wcm.Sidekick.componentsWithDragZone[i].dragZone) {
                    CQ.wcm.Sidekick.componentsWithDragZone[i].dragZone.destroy();
                    delete CQ.wcm.Sidekick.componentsWithDragZone[i].dragZone;
                }
            }
            CQ.wcm.Sidekick.componentsWithDragZone = [];

            this.initButtons(this.getPath(), this.initialConfig);
            this.addButtons();
            this.loadPanels(this.getPath(), this.loadedConfig);
            this.fireEvent("loadcontent", this);
        }
    },

    /**
     * Adds the loading panel to the sidekick.
     * @private
     * @since 5.5
     */
    addLoadingPanel: function() {
        this.removeLoadingPanel();
        this.add(this.getLoadingPanelConfig());
        this.doLayout();
    },

    /**
     * Returns the loading panel config.
     * @private
     * @since 5.5
     */
    getLoadingPanelConfig: function() {
        return {
            "xtype":"panel",
            "cls":"cq-sidekick-loading",
            "id":"cq-sidekick-loading"
        };
    },

    /**
     * Removes the loading panel for the sidekick.
     * @private
     * @since 5.5
     */
    removeLoadingPanel: function() {
        this.remove("cq-sidekick-loading", true);
    },

    /**
     * Adds a new action to the Sidekick.
     * <p>Action config options:
     * <ul>
     *   <li><code>text</code>: String<div class="sub-desc">The text</div></li>
     *   <li><code>handler</code>: Function<div class="sub-desc">The click
     *   handler or</div></li>
     *   <li><code>dialog</code>: String/Object<div class="sub-desc">The dialog
     *   config or URL to retrieve it from</div></li>
     *   <li><code>context</code>: String<div class="sub-desc">(Optional) The
     *   tab the action appears on (defaults to {@link CQ.wcm.Sidekick#PAGE})</div></li>
     * </ul></p>
     * <p>Note: you can either use an own handler or specify a dialog which will
     * be shown when the action is clicked.</p>
     * @private
     * @param {Object} config The config object for the action
     * @param {Boolean} i18n (optional) True if text should be translated
     */
    addAction: function(config, i18n) {
        if (config instanceof Array) {
            for (var i = 0; i < config.length; i++) {
                this.addAction(config[i], i18n);
            }
        } else {
            if (!config.xtype) config.xtype = "button";
            if (!config.scope) config.scope = this;
            if (!config.handler && config.dialog) {
                config.handler = function() {
                    try {
                        var dlg = CQ.WCM.getDialog(config.dialog);
                        dlg.loadContent(this.getPath());
                        dlg.show();
                    } catch (e) { }
                };
            }
            if (!config.context) config.context = CQ.wcm.Sidekick.PAGE;
            if (!this.actns) this.actns = [];
            if (config.context instanceof Array) {
                for (var i = 0; i < config.context.length; i++) {
                    var button = this.panels[config.context[i]].add(config);
                    this.actns.push(button);
                    this.buttons[config.name] = button;
                }
            } else {
                var panel = this.panels[config.context];
                try {
                if (!panel.hasClass("cq-sidekick-buttons")) {
                    panel.addClass("cq-sidekick-buttons");
                }
                } catch (e) {
//                    console.log(e);
                }
                var button = panel.add(config);
                this.actns.push(button);
                this.buttons[config.name] = button;
            }
        }
    },

    /**
     * Returns the config for the default Create button.
     * @private
     * @return {Object} The config for the default Create button
     * @deprecated
     */
    getCreateConfig: function() {
        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
        var allowed = sidekick.initialConfig.createDialog != undefined;
        return {
        "text": this.createText,
        "disabled": !allowed,
        "handler": function() {
                if (!(sidekick.createDialog instanceof CQ.Dialog)) {
                    try {
                        if (!sidekick.initialConfig.createDialog) {
                            CQ.Log.warn("CQ.wcm.Sidekick#getCreateConfig: no create dialog specified");
                            return;
                        }
                        sidekick.createDialog = CQ.WCM.getDialog(sidekick.initialConfig.createDialog);
                        if (sidekick.templateSelectionId && sidekick.templateList) {
                            var templates = sidekick.templateList;
                            if (typeof sidekick.templateList == "string") {
                                var url = sidekick.templateList;
                                url = CQ.HTTP.addParameter(url, sidekick.pathParam, this.getPath());
                                templates = CQ.HTTP.eval(url);
                            }
                            CQ.Ext.getCmp(sidekick.templateSelectionId).setOptions(templates, true);
                        }
                    } catch (e) {
                        CQ.Log.error("CQ.wcm.Sidekick#getCreateConfig: failed to build create dialog: {0}", e.message);
                        return;
                    }
                }
                sidekick.createDialog.show();
            },
            "context": [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },

    /**
     * Returns the config for the default Create Sub Page button.
     * @private
     * @return {Object} The config for the default Create Sub Page button
     */
    getCreateChildPageConfig: function() {
        var allowed = CQ.User.getCurrentUser().hasPermissionOn("create", this.getPath());
        return {
            "text": this.createChildPageText,
            "disabled": !allowed,
            "handler": function() {
                var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                var path = this.getPath();
                var dialog = CQ.wcm.Page.getCreatePageDialog(path);
                dialog.success = function(form,slingSubmit) {
                    if( slingSubmit && slingSubmit.result &&  slingSubmit.result["Path"]) {
                        CQ.Util.reload(CQ.WCM.getContentWindow(),
                                CQ.HTTP.externalize(slingSubmit.result["Path"] + CQ.HTTP.EXTENSION_HTML));
                    } else {
                        CQ.Util.reload(CQ.WCM.getContentWindow());
                    }
                };
                dialog.failure = function() {
                    CQ.Ext.Msg.alert(
                            CQ.I18n.getMessage("Error"),
                            CQ.I18n.getMessage("Could not create page.")
                            );
                };
                dialog.show();
            },
            "context": [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },



    /**
     * Returns the config for the default Copy button.
     * @private
     * @return {Object} The config for the default Copy button
     */
    getCopyPageConfig: function() {
        var allowed = CQ.User.getCurrentUser().hasPermissionOn("create", this.getPath());
        return {
            "text": this.copyPageText,
            "disabled": !allowed,
            "handler": function() {
                var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                var path = this.getPath();
                var dialog = CQ.wcm.Page.getCopyPageDialog(path);
                dialog.success = function(form, xhr) {
                    var response = CQ.HTTP.buildPostResponseFromHTML(xhr.response);
                    var newPath = $CQ.trim(response.headers["Message"]);
                    var msg = CQ.I18n.getMessage("Current page has been copied to <a href=\"{0}\">{1}</a>",[CQ.shared.HTTP.reloadHook(CQ.HTTP.externalize(newPath + CQ.HTTP.EXTENSION_HTML)),newPath]);
                    CQ.Notification.notify(CQ.I18n.getMessage("Page copied"), msg);
                };
                dialog.failure = function() {
                    CQ.Ext.Msg.alert(
                            CQ.I18n.getMessage("Error"),
                            CQ.I18n.getMessage("Could not copy page.")
                            );
                };
                dialog.show();
            },
            "context": [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },

    /**
     * Returns the config for the default Move button.
     * @private
     * @return {Object} The config for the default Move button
     */
    getMovePageConfig: function() {
        var allowed = CQ.User.getCurrentUser().hasPermissionOn("delete", this.getPath());
        return {
            "text": this.movePageText,
            "disabled": !allowed,
            "handler": function() {
                var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                var path = this.getPath();
                var label = path.substring(path.lastIndexOf("/") + 1);
                var dialog = CQ.wcm.Page.getMovePageDialog(path, true);

                dialog.success = function(form) {
                    var newPath = "";
                    try {
                        var dst = form.findField("destParentPath").getValue();
                        var name = form.findField("destName").getValue();
                        newPath = dst + "/" + name;
                    } catch (e) {
                        newPath = path.substring(0, path.lastIndexOf("/"));

                    }
                    CQ.Util.reload(CQ.WCM.getContentWindow(),
                            CQ.HTTP.externalize(newPath + CQ.HTTP.EXTENSION_HTML));
                };

                dialog.failure = function() {
                    CQ.Ext.Msg.alert(
                            CQ.I18n.getMessage("Error"),
                            CQ.I18n.getMessage("Could not move page.")
                            );
                };
                dialog.show();
            },
            "context": [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },

    /**
     * Returns the config for the default Delete button.
     * @private
     * @return {Object} The config for the default Delete button
     */
    getDeleteConfig: function() {
        var allowed = CQ.User.getCurrentUser().hasPermissionOn("delete", this.getPath());
        return {
            "text": this.deleteText,
            "disabled": !allowed,
            "handler": function() {
                var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                var path = this.getPath();
                var label = path.substring(path.lastIndexOf("/") + 1);
                CQ.Ext.Msg.confirm(
                    sidekick.deleteText,
                    CQ.I18n.getMessage("Do you really want to delete '{0}'?", label),
                    function(btnId) {
                        if (btnId == "yes") {
                            sidekick.internalDelete(false);
                        }
                    },
                    this
                 );
            },
            "context": [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },

    /**
     * Internally deletes this page. If the page is referenced, it shows an
     * dialog.
     * @private
     * @param {Boolean} force if true, no reference check is performed
     */
    internalDelete: function(/* boolean */ force) {
        var callback = function(options, success, response) {
            var status = response.headers[CQ.utils.HTTP.HEADER_STATUS];
            if (status == 200) {
                var parent = this.path.substring(0, this.path.lastIndexOf("/"));
                CQ.Util.reload(CQ.WCM.getContentWindow(),
                    CQ.HTTP.externalize(parent + CQ.HTTP.EXTENSION_HTML));

            } else if (status == 412) {
                CQ.Ext.Msg.show({
                "title":CQ.I18n.getMessage("Delete Page"),
                    "msg":"This page is referenced. Click 'yes' to proceed deleting the page, click 'no' to review the references or 'cancel' to cancel the operation.",
                    "buttons":CQ.Ext.Msg.YESNOCANCEL,
                    "icon":CQ.Ext.MessageBox.QUESTION,
                    "fn":function(btnId) {
                        if (btnId == "yes") {
                            this.internalDelete(true);
                        } else if (btnId == "no") {
                            this.showReferences();
                        }
                    },
                    "scope":this
                });

            } else {
                CQ.Notification.notifyFromResponse(response);
            }
        };

        var params = {
            "path":this.path,
            "_charset_":"utf-8",
            "cmd":"deletePage",
            "force": force
        };

        CQ.shared.HTTP.post("/bin/wcmcommand", callback, params, this);
    },

    /**
     * Returns the config for the default Publish button.
     * @private
     * @param {Object} currentPage The current page
     * @return {Object} The config for the default Publish button
     */
    getPublishConfig: function(currentPage) {
        currentPage = currentPage || CQ.WCM.getPage(this.path);
        return {
            "text": this.publishText,
            "hidden": currentPage.isLaunch(),
            "handler": function() {
                var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                var data = {
                    id: CQ.Util.createId("cq-asset-reference-search-dialog"),
                    path: [sidekick.getPath()],
                    callback: function(p) {
                        CQ.wcm.SiteAdmin.internalActivatePage(p, function(options, success, response) {
                            if (success) {
                                CQ.Notification.notify(sidekick.publishText,
                                        CQ.I18n.getMessage("Page successfully activated"));
                            } else {
                                CQ.Notification.notifyFromResponse(response);
                            }
                        });
                    }
                };
                new CQ.wcm.AssetReferenceSearchDialog(data);
            },
            "context": [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },

    /**
     * Returns the config for the default Deactivate button.
     * @private
     * @param {Object} currentPage The current page
     * @return {Object} The config for the default Deactivate button
     */
    getDeactivateConfig: function(currentPage) {
        var self = this;
        currentPage = currentPage || CQ.WCM.getPage(self.path);
        return {
            text: this.deactivateText,
            hidden: currentPage.isLaunch(),
            name: CQ.wcm.Sidekick.DEACTIVATE,
            handler: function() {
                CQ.wcm.SiteAdmin.deactivatePage([{ id: self.path }], function (opts, success, response) {
                    if (success) {
                        CQ.Notification.notify(self.deactivateText, CQ.I18n.getMessage("Page successfully deactivated"));
                    } else {
                        CQ.Notification.notifyFromResponse(response);
                    }
                });
            },
            context: [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },

    /**
     * Returns the config for the default Rollout button.
     * @private
     * @param {Object} currentPage The current page
     * @return {Object} The config for the default Rollout button
     */
    getRolloutConfig: function(currentPage) {
        var self = this;
        var path = this.path;
        currentPage = currentPage || CQ.WCM.getPage(path);
        var isLaunch = currentPage.isLaunch();
        var isLiveCopySource = currentPage.isLiveCopySource();
        return {
            "disabled": !(isLiveCopySource || isLaunch),
            "text": isLaunch ? this.promoteText : this.rolloutText,
            "handler": function() {
                if (isLaunch) {
                    var pageInfo = CQ.WCM.getPageInfo(path);
                    self.rolloutWizard = new CQ.wcm.Launches.PromoteLaunchWizard({
                        path: path
                    });
                } else {
                    self.rolloutWizard = new CQ.wcm.msm.RolloutWizard({
                        path: path
                    });
                }
                self.rolloutWizard.show();

            },
            "context": [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },

    /**
     * Returns the config for the default Rollout button.
     * @private
     * @return {Object} The config for the default Rollout button
     */
    getReferencesConfig: function() {
        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
        return {
        "text": this.referencesText,
        "handler": function() {
                sidekick.showReferences();
            },
            "context": [
                CQ.wcm.Sidekick.PAGE
            ]
        };
    },

    /**
     * Shows a dialog with the references to the current page
     * @private
     */
    showReferences: function() {
        var dlg = new CQ.wcm.ReferencesDialog({
            path: this.path
        });
        dlg.on("pageopen", function(d, p) {
            d.close();
            CQ.Util.reload(CQ.WCM.getContentWindow(),
                CQ.HTTP.externalize(p + CQ.HTTP.EXTENSION_HTML));
        });
        dlg.show();
    },

    /**
     * Returns the config for the default Lock button.
     * @private
     * @param {Object} currentPage The current page
     * @return {Object} The config for the default Lock button
     */
    getLockConfig: function(currentPage) {
        currentPage = currentPage || CQ.WCM.getPage(this.path);
        var text;
        if (currentPage.isLocked()) {
            if (!currentPage.canUnlock()) {
                text = CQ.Util.patchText(this.lockedByText, currentPage.getLockOwner());
            } else {
                text = this.unlockText;
            }
        } else {
            text = this.lockText;
        }
        return {
            "text": text,
            "disabled": currentPage.isLocked() && !currentPage.canUnlock(),
            "handler": function() {
                if (this.ignoreClicks) {
                    return;
                }
                var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                var currentPage = CQ.WCM.getPage(sidekick.path);
                if(currentPage) {
                    var button = this.buttons[CQ.wcm.Sidekick.LOCK];
                    button.ignoreClicks = true;
                    if(this.pageLocked || currentPage.isLocked()) {
                        currentPage.unlock(function(opts, success, response) {
                            if (success) {
                                sidekick.pageLocked = false;
                                button.setText(sidekick.lockText);
                            }
                            button.ignoreClicks = false;
                        });
                    } else {
                        currentPage.lock(function(opts, success, response) {
                            if (success) {
                                sidekick.pageLocked = true;
                                button.setText(sidekick.unlockText);
                            }
                            button.ignoreClicks = false;
                        });
                    }
                }
            },
            "context": CQ.wcm.Sidekick.PAGE
        };
    },

    /**
     * Returns the config for the default Version button.
     * @private
     * @return {Object} The config for the default Version button
     */
    getVersionConfig: function() {
        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
        var allowed = sidekick.initialConfig.versionDialog != undefined;
        return {
            "text": this.versionText,
            "disabled": !allowed,
            "handler": function() {
                if (!(sidekick.versionDialog instanceof CQ.Dialog)) {
                    try {
                        if (!sidekick.initialConfig.versionDialog) {
                            CQ.Log.warn("CQ.wcm.Sidekick#getVersionConfig: no version dialog specified");
                            return;
                        }
                        sidekick.versionDialog = CQ.WCM.getDialog(sidekick.initialConfig.versionDialog);
                    } catch (e) {
                        CQ.Log.error("CQ.wcm.Sidekick#getVersionConfig: failed to build version dialog: {0}", e.message);
                        return;
                    }
                }
                sidekick.versionDialog.loadContent(this.getPath());
                sidekick.versionDialog.show();
            },
            "context": CQ.wcm.Sidekick.VERSIONING
        };
    },

    /**
     * Returns the config for the default Restore button.
     * @private
     * @return {Object} The config for the default Restore button
     */
    getRestoreConfig: function() {
        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
        var allowed = sidekick.initialConfig.restoreDialog != undefined;
        return {
            "text": this.restoreText,
            "disabled": !allowed,
            "handler": function() {
                if (!(sidekick.restoreDialog instanceof CQ.Dialog)) {
                    try {
                        if (!sidekick.initialConfig.restoreDialog) {
                            CQ.Log.warn("CQ.wcm.Sidekick#getRestoreConfig: no restore dialog specified");
                            return;
                        }
                        sidekick.restoreDialog = CQ.WCM.getDialog(sidekick.initialConfig.restoreDialog);
                    } catch (e) {
                        CQ.Log.error("CQ.wcm.Sidekick#getRestoreConfig: failed to build restore dialog: {0}", e.message);
                        return;
                    }
                }
                sidekick.restoreDialog.loadContent(this.getPath());
                sidekick.restoreDialog.success = function() {
                    window.setTimeout(function() {
                        CQ.Util.reload(CQ.WCM.getContentWindow());
                    }, 1000);
                };
                sidekick.restoreDialog.show();
            },
            "context": CQ.wcm.Sidekick.VERSIONING
        };
    },

    /**
     * Returns the config for the default Audit log button.
     * @private
     * @return {Object} The config for the default Audit log button
     */
    getAuditConfig: function() {
        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
        var allowed = sidekick.initialConfig.auditDialog != undefined;
        return {
            "text": this.auditText,
            "disabled": !allowed,
            "handler": function() {
                if (!(sidekick.auditDialog instanceof CQ.Dialog)) {
                    try {
                        if (!sidekick.initialConfig.auditDialog) {
                            CQ.Log.warn("CQ.wcm.Sidekick#getAuditConfig: no audit log dialog specified");
                            return;
                        }
                        sidekick.auditDialog = CQ.WCM.getDialog(sidekick.initialConfig.auditDialog);
                    } catch (e) {
                        CQ.Log.error("CQ.wcm.Sidekick#getAuditConfig: failed to build audit log dialog: {0}", e.message);
                        return;
                    }
                }
                sidekick.auditDialog.loadContent(this.getPath());
                sidekick.auditDialog.show();
            },
            "context": CQ.wcm.Sidekick.INFO
        };
    },

    /**
     * Returns the config for the default Permissions button.
     * @param {Object} config The config
     * @private
     * @return {Object} The config for the default Permissions button
     */
    getPermsConfig: function(config) {
        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
        var allowed = config.permsDialog != undefined ||
              sidekick.initialConfig.permsDialog != undefined;
        return {
            "text": this.permsText,
            "disabled": !allowed,
            "handler": function() {

                // todo: cache propsDialog of same path?
                // create propsDialog on each call (because of calls from Content Finder)
                var dialogPath = config.permsDialog ? config.permsDialog :
                        sidekick.initialConfig.permsDialog;

                var permsDialog;
                try {
                    if (!dialogPath) {
                        CQ.Log.warn("CQ.wcm.Sidekick#getPermsConfig: no permissions dialog specified");
                        return;
                    }
                    permsDialog = CQ.WCM.getDialog(dialogPath);
                } catch (e) {
                    CQ.Log.error("CQ.wcm.Sidekick#getPermsConfig: failed to build permissions dialog: {0}", e.message);
                    return;
                }
                permsDialog.loadContent(this.getPath());
                permsDialog.show();
            },
            "context": CQ.wcm.Sidekick.INFO
        };
    },

    /**
     * Returns the config for the default Properties button.
     * @param {Object} config The config
     * @private
     * @return {Object} The config for the default Properties button
     */
    getPropsConfig: function(config) {
        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
        var dialogPath = config.propsDialog ? config.propsDialog :
                sidekick.initialConfig.propsDialog;
        var allowed = dialogPath &&
                  CQ.User.getCurrentUser().hasPermissionOn("read", dialogPath) !== false;
        return {
            "text": this.propsText,
            "disabled": !allowed,
            "handler": function() {

                // todo: cache propsDialog of same path?
                // create propsDialog on each call (because of calls from Content Finder)

                var propsDialog;
                try {
                    var contentWindow = CQ.utils.WCM.getContentWindow();
                    if (!dialogPath) {
                        CQ.Log.warn("CQ.wcm.Sidekick#getPropsConfig: no properties dialog specified");
                        return;
                    }
                    var propsDialogConfig = contentWindow.CQ.WCM.getDialogConfig(dialogPath);
                    if (!propsDialogConfig.success) {
                        propsDialogConfig.success = function(form, action) {
                            CQ.Util.reload(CQ.WCM.getContentWindow());
                        };
                    }
                    if (!propsDialogConfig.failure) {
                        propsDialogConfig.failure = function(form, action) {
                            var response = CQ.HTTP.buildPostResponseFromHTML(action.response);
                            CQ.Ext.Msg.alert(response.headers[CQ.HTTP.HEADER_MESSAGE]);
                        };
                    }
                    propsDialog = contentWindow.CQ.WCM.getDialog(propsDialogConfig, dialogPath);
                    propsDialog.fieldEditLockMode = true;
                    propsDialog.loadContent(this.getPath() + "/jcr:content");
                    propsDialog.setTitle(CQ.I18n.getMessage("Page Properties of {0}", this.getPath()));
                } catch (e) {
                    CQ.Log.error("CQ.wcm.Sidekick#getPropsConfig: failed to build properties dialog: {0}", e.message);
                    return;
                }
                propsDialog.show();
            },
            "context": CQ.wcm.Sidekick.PAGE
        };
    },

    /**
     * Returns the config for the default start workflow button.
     * @private
     * @return {Object} The config for the default Audit log button
     */
    getStartWorkflowConfig: function() {
        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
        var allowed = sidekick.initialConfig.startWorkflowDialog != undefined;
        return {
            "text": this.startWorkflowText,
            "disabled": !allowed,
            "handler": function() {
                if (!(sidekick.startWorkflowDialog instanceof CQ.Dialog)) {
                    try {
                        if (!sidekick.initialConfig.startWorkflowDialog) {
                            CQ.Log.warn("CQ.wcm.Sidekick#getStartWorkflowConfig: no start workflow dialog specified");
                            return;
                        }
                        var startWorkflowDialog  = {
                            "jcr:primaryType": "cq:Dialog",
                            "title": CQ.I18n.getMessage("Start Workflow"),
                            "formUrl":"/etc/workflow/instances",
                            "params": {
                                "_charset_":"utf-8",
                                "payloadType":"JCR_PATH"
                            },
                            "items": {
                                "jcr:primaryType": "cq:Panel",
                                "items": {
                                    "jcr:primaryType": "cq:WidgetCollection",
                                    "model": {
                                        "xtype":"combo",
                                        "name":"model",
                                        "hiddenName":"model",
                                        "fieldLabel":CQ.I18n.getMessage("Workflow"),
                                        "displayField":"label",
                                        "valueField":"wid",
                                        "title":CQ.I18n.getMessage("Available Workflows"),
                                        "selectOnFocus":true,
                                        "triggerAction":"all",
                                        "allowBlank":false,
                                        "editable":false,
                                        "store":new CQ.Ext.data.Store({
                                            "proxy":new CQ.Ext.data.HttpProxy({
                                                "url":"/libs/cq/workflow/content/console/workflows.json",
                                                "method":"GET"

                                            }),
                                            "baseParams": { tags: 'wcm' },
                                            "reader":new CQ.Ext.data.JsonReader(
                                                {
                                                    "totalProperty":"results",
                                                    "root":"workflows"
                                                },
                                                [ {"name":"wid"}, {"name":"label"} ]
                                            )
                                        })
                                    },
                                    "comment": {
                                        "jcr:primaryType": "cq:TextArea",
                                        "fieldLabel":CQ.I18n.getMessage("Comment"),
                                        "name":"startComment",
                                        "height":200
                                    },
                                    "title": {
                                        xtype: 'textfield',
                                        name:'workflowTitle',
                                        fieldLabel:CQ.I18n.getMessage('Workflow Title')
                                    }
                                }
                            },
                            "okText":CQ.I18n.getMessage("Start")
                        };
                        var dialog = CQ.WCM.getDialog(startWorkflowDialog);
                        dialog.addHidden({ "payload":this.getPath() });
                        dialog.failure = function() {
                            CQ.Ext.Msg.alert("Error", "Could not start workflow.");
                        };
                        sidekick.startWorkflowDialog = dialog;
                    } catch (e) {
                        CQ.Log.error("CQ.wcm.Sidekick#getStartWorkflowConfig: failed to build start workflow dialog: {0}", e.message);
                        return;
                    }
                }
                // check if page is already in workflow
                var pageInfo = CQ.WCM.getPageInfo(this.getPath());
                var isInWorkflow = pageInfo.workflow && pageInfo.workflow.isRunning;
                if (!isInWorkflow) {
                    sidekick.startWorkflowDialog.getField("payload").setValue(this.getPath());
                    sidekick.startWorkflowDialog.show();
                } else {
                    CQ.Ext.Msg.alert(CQ.I18n.getMessage("Information"),
                        CQ.I18n.getMessage("Page is already subject to a workflow!"));
                }
            },
            "context": CQ.wcm.Sidekick.WORKFLOW
        };
    },

    /**
     * Loads the panels from the given data store or path.
     * @private
     * @param {Store/String} content The data store or path
     * @param {Object} config The config
     */
    loadPanels: function(content, config) {
        var sidekick = this;
        if (!config) config = {};
        config = CQ.Ext.applyIf(config, this.initialConfig);
        if (!this.panelsLoaded) {
            this.panels = {};
            for (var i = 0; i < CQ.wcm.Sidekick.CONTEXTS.length; i++) {
                if (CQ.wcm.Sidekick.CONTEXTS[i] == CQ.wcm.Sidekick.COMPONENTS) {
                    this.panels[CQ.wcm.Sidekick.CONTEXTS[i]] = new CQ.Ext.Panel({
                        "border": false,
                        "autoScroll":true,
                        "layout":"accordion",
                        "stateful": false,
                        "id": "cq-sk-tab-" + CQ.wcm.Sidekick.CONTEXTS[i]
                    });
                }
                else if (CQ.wcm.Sidekick.CONTEXTS[i] == CQ.wcm.Sidekick.VERSIONING ||
                         CQ.wcm.Sidekick.CONTEXTS[i] == CQ.wcm.Sidekick.WORKFLOW){
                    this.panels[CQ.wcm.Sidekick.CONTEXTS[i]] = new CQ.Ext.Panel({
                        "border": false,
                        "stateful": false,
                        "layout": "fit",
                        "id": "cq-sk-tab-" + CQ.wcm.Sidekick.CONTEXTS[i]
                    });
                }
                else {
                    this.panels[CQ.wcm.Sidekick.CONTEXTS[i]] = new CQ.Ext.Panel({
                        "autoScroll":true,
                        "border": false,
                        "stateful": false,
                        "id": "cq-sk-tab-" + CQ.wcm.Sidekick.CONTEXTS[i]
                    });
                }
            }

            this.items.get(0).getEl().fadeOut({
                callback: function(element) {
                    sidekick.removeLoadingPanel();
                    sidekick.add({
                        "xtype":"tabpanel",
                        "border": false,
                        "enableTabScroll":true,
                        "deferredRender":false,
                        "activeTab":0,
                        "stateful": true,
                        "id": "cq-sk-tabpanel",
                        "listeners": {
                            "tabchange": function(tabPanel, tab, currentTab) {
                                tab.doLayout();
                            }
                        },
                        "items": [
                            {
                                "tabTip": CQ.I18n.getMessage("Components"),
                                "iconCls": "cq-sidekick-tab cq-sidekick-tab-icon-components",
                                "items": sidekick.panels[CQ.wcm.Sidekick.COMPONENTS],
                                "layout":"fit"
                            },{
                                "tabTip": CQ.I18n.getMessage("Page"),
                                "iconCls": "cq-sidekick-tab cq-sidekick-tab-icon-page",
                                "items": sidekick.panels[CQ.wcm.Sidekick.PAGE],
                                "layout":"fit"
                            },{
                                "tabTip": CQ.I18n.getMessage("Information"),
                                "iconCls": "cq-sidekick-tab cq-sidekick-tab-icon-info",
                                "items": sidekick.panels[CQ.wcm.Sidekick.INFO],
                                "layout":"fit"
                            },{
                                "tabTip": CQ.I18n.getMessage("Versioning"),
                                "iconCls": "cq-sidekick-tab cq-sidekick-tab-icon-versioning",
                                "items": sidekick.panels[CQ.wcm.Sidekick.VERSIONING],
                                "layout":"fit"
                            },{
                                "tabTip": CQ.I18n.getMessage("Workflow"),
                                "iconCls": "cq-sidekick-tab cq-sidekick-tab-icon-workflow",
                                "items": sidekick.panels[CQ.wcm.Sidekick.WORKFLOW],
                                "layout":"fit"
                            }
                        ],
                        footerCfg: sidekick.getLaunchesTabpanelFooter()
                    });
                    sidekick.doLayout();
                    try {
                        sidekick.items.get(0).getEl().fadeIn({
                            duration: .5
                        });
                    } catch(e) {
                    }
                },
                duration: .5
            });
            this.panelsLoaded = true;
        } else {
            // check for and remove existing content in panels
            for (var context in this.panels) {
                if (this.panels[context].items) {
                    while (this.panels[context].items.getCount() > 0) {
                        this.panels[context].remove(this.panels[context].items.get(0), true);
                    }
                }
            }
        }
        this.loadActions(config);
        var cl = CQ.WCM.getComponentList(this.path);
        if( CQ.WCM.getContentWindow().CQ.WCM.areEditablesReady()) {
            CQ.wcm.ComponentList.loadPanel(cl, sidekick.panels[CQ.wcm.Sidekick.COMPONENTS]);
        } else {
            CQ.WCM.getContentWindow().CQ.WCM.on("editablesready", function() {
                var cl = CQ.WCM.getComponentList();

                // remove old panels first
                var panel = this.panels[CQ.wcm.Sidekick.COMPONENTS];
                if (panel.items) {
                    panel.items.each(function(item){
                        this.remove(item, true);
                    }, panel);
                }
                CQ.wcm.ComponentList.loadPanel(cl, panel);
            }, sidekick);
        }
        cl.addListener("updatecomponents", function(cl) {
            if( CQ.WCM.getContentWindow().CQ.WCM.areEditablesReady()) {
                // remove old panels first
                var panel = this.panels[CQ.wcm.Sidekick.COMPONENTS];
                if (panel.items) {
                    panel.items.each(function(item){
                        this.remove(item, true);
                    }, panel);
                }
                CQ.wcm.ComponentList.loadPanel(cl, panel);
            }
        }, sidekick);
        (function() {
            // use timeout to load component list asynchronously
            sidekick.loadVersioningTab(config);
            sidekick.loadWorkflowTab();
        }).defer(16);
        this.doLayout();
    },

    loadVersioningTab: function(config) {
        var rFields = [
           {"name": 'name'},
           {"name": 'title'},
           {"name": 'comment'},
           {"name": 'created'},
           {"name": 'label'},
           {"name": 'id'},
           {"name": 'deleted'},
           {"name": 'isBaseVersion'}
        ];

        var rReader = new CQ.Ext.data.JsonReader({
            "root": "versions",
            "fields":rFields
        });

        var csm = new CQ.Ext.grid.CheckboxSelectionModel({
            "singleSelect":true
        });

        var lineRenderer = function(value, metadata, record) {
            if (record.data.deleted) {
                metadata.attr = 'style="color:grey;"';
            } else if (record.data.isBaseVersion) {
                metadata.attr = 'style="font-weight:bold;"';
            }
            var comment = record.data.comment;
            if (comment) {
                comment = CQ.Ext.util.Format.htmlEncode(comment);
                if (CQ.Ext.QuickTips.isEnabled()) {
                    metadata.attr += ' ext:qtip="' + comment + '"';
                } else {
                    metadata.attr += ' title="' + comment + '"';
                }
            }
            return value;
        };

        var rGrid = new CQ.Ext.grid.GridPanel({
            "border":false,
            "width":"auto",
            "autoHeight": true,
            "loadMask":true,
            "stripeRows":true,
            "autoExpandColumn": "created",
            "cm":new CQ.Ext.grid.ColumnModel([
                csm,
                {
                    "header":CQ.I18n.getMessage("Label"),
                    "dataIndex":"label",
                    "sortable":false,
                    "width":50,
                    "renderer":lineRenderer
                },
                {
                    "id": "created",
                    "header":CQ.I18n.getMessage("Created"),
                    "dataIndex":"created",
                    "sortable":false,
                    "renderer":lineRenderer // todo: render nice date
                },
                {
                    "header":CQ.I18n.getMessage("Title"),
                    "dataIndex":"title",
                    "sortable":false,
                    "hidden":true,
                    "width":80,
                    "renderer":lineRenderer
                },
                {
                    "header":CQ.I18n.getMessage("Name"),
                    "dataIndex":"name",
                    "hidden":true,
                    "sortable":false,
                    "width":80,
                    "renderer":lineRenderer // todo: render nice date
                }
            ]),
            "sm":csm,
            "store":new CQ.Ext.data.SimpleStore({
                "fields":rFields
            }),
            "enableHdMenu":true
        });

        var versionPanel = this.panels[CQ.wcm.Sidekick.VERSIONING];
        var isDiffView = CQ.HTTP.getParameter(CQ.WCM.getContentUrl(), "cq_diffTo") != null;
        var aPanel = {
            "xtype":"panel",
            "layout":"accordion",
            "defaults":{
                "xtype":"panel",
                "border":false,
                "autoScroll":true
            },
            "border":false,
            "items":[
                {
                    "title":CQ.I18n.getMessage("Create Version"),
                    "collapsed": isDiffView,
                    "layout":"form",
                    "cls":"cq-sidekick-form",
                    "items":[
                        {
                            "xtype":"textfield",
                            "name":"label",
                            "id":"cq-sk-cv-label",
                            "fieldLabel":CQ.I18n.getMessage("Label"),
                            "listeners": {
                                "render": function() {
                                    this.el.parent().parent().setStyle("display", "none");
                                }
                            }
                        },
                        {
                            "xtype":"textarea",
                            "name":"comment",
                            "id":"cq-sk-cv-comment",
                            "growMin":30,
                            "fieldLabel":CQ.I18n.getMessage("Comment"),
                            "defaultValue":CQ.I18n.getMessage("Created by {0}", CQ.User.getCurrentUser().getUserName())
                        },
                        {
                            "xtype":"panel",
                            "layout":"column",
                            "border":false,
                            "defaults": {
                                "border":false
                            },
                            "items":[
                                {
                                    "xtype":"panel",
                                    "items": {
                                        "xtype":"button",
                                        "text":CQ.I18n.getMessage("Create Version"),
                                        "disabled":config.readOnly,
                                        "handler": function() {
                                            var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                                            var url = CQ.HTTP.externalize("/bin/wcmcommand");
                                            var params = {};
                                            params[CQ.Sling.CHARSET] = "utf-8";
                                            params[CQ.Sling.STATUS] = CQ.Sling.STATUS_BROWSER;
                                            params["cmd"] = "createVersion";
                                            params["label"] = CQ.Ext.getCmp("cq-sk-cv-label").getValue();
                                            params["comment"] = CQ.Ext.getCmp("cq-sk-cv-comment").getValue();
                                            params[sidekick.pathParam] = sidekick.getPath();
                                            var callback = function(options, success, xhr) {
                                                if (success) {
                                                    var res = CQ.HTTP.buildPostResponseFromHTML(xhr.responseText);
                                                    if (res.headers[CQ.HTTP.HEADER_STATUS] == "200") {
                                                        CQ.Notification.notifyFromResponse(res, null, true);
                                                        CQ.Ext.getCmp("cq-sk-cv-label").reset();
                                                        CQ.Ext.getCmp("cq-sk-cv-comment").reset();
                                                    }
                                                }
                                            };
                                            CQ.HTTP.post(url, callback, params);
                                        }
                                    }
                                },
                                {
                                    "xtype":"panel",
                                    "items": {
                                        "xtype":"button",
                                        "text":CQ.I18n.getMessage("More") + " &raquo;",
                                        "handler": function() {
                                            var l = CQ.Ext.getCmp("cq-sk-cv-label").el.parent().parent();
                                            if (l.isVisible()) {
                                                l.setStyle("display", "none");
                                                this.setText(CQ.I18n.getMessage("More") + " &raquo;");
                                            } else {
                                                l.setStyle("display", "");
                                                this.setText(CQ.I18n.getMessage("Less") + " &laquo;");
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                { // restore version
                    "title":CQ.I18n.getMessage("Restore Version"),
                    "collapsed": !isDiffView,
                    "layout":"form",
                    "cls":"cq-sidekick-form",
                    "listeners": {
                        "activate": function() {
                            var sidekick = CQ.wcm.Sidekick.findSidekick(this);

                            var url = "/bin/wcm/versions.json";
                            url = CQ.HTTP.addParameter(url, sidekick.pathParam, sidekick.getPath());
                            url = CQ.HTTP.noCaching(url);

                            var r = rReader.read(CQ.HTTP.get(CQ.shared.HTTP.externalize(url)));
                            var revisionsTable = {};

                            for (var i = 0; i < r.records.length; i++) {
                                var data = r.records[i].data;
                                revisionsTable[data.id] = [
                                    data.name,
                                    data.title,
                                    data.comment,
                                    data.created,
                                    data.label,
                                    data.id,
                                    data.deleted,
                                    data.isBaseVersion
                                ];
                            }
                            var revisions = [];
                            for (var id in revisionsTable) {
                                revisions[revisions.length] = revisionsTable[id];
                            }
                            rGrid.getStore().loadData(revisions);

                            if (isDiffView) {
                                rGrid.on("render", function(grid) {
                                    grid.el.mask();
                                });
                            }
                        }
                    },
                    "items":[
                        {
                            "xtype":"panel",
                            "layout":"column",
                            "border":false,
                            "defaults": {
                                "border":false,
                                "autoScroll":true
                            },
                            "items":[
                                {
                                    "xtype":"button",
                                    "hidden":true,
                                    "text":CQ.I18n.getMessage("View"),
                                    "handler": function() {
                                        // todo: implement TimeWarp jump directly to version
                                    }
                                },
                                {
                                    "xtype":"button",
                                    "text": isDiffView ? "&laquo; " + CQ.I18n.getMessage("Back") : CQ.I18n.getMessage("Diff"),
                                    "handler": function() {
                                        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                                        if (isDiffView) {
                                            this.setText(CQ.I18n.getMessage("Diff"));
                                            rGrid.el.unmask();
                                            var url = CQ.HTTP.externalize(sidekick.getPath() + ".html");
                                            url = CQ.HTTP.noCaching(url);
                                            CQ.Util.reload(CQ.WCM.getContentWindow(), url);
                                        } else {
                                            var rec = rGrid.getSelectionModel().getSelected();
                                            if (!rec) {
                                                CQ.Ext.Msg.alert(CQ.I18n.getMessage("Info"), CQ.I18n.getMessage("Please select a version first."));
                                                return;
                                            }
                                            var url = CQ.HTTP.externalize(sidekick.getPath() + ".html");
                                            url = CQ.HTTP.addParameter(url, "cq_diffTo", rec.data.label);
                                            url = CQ.HTTP.addParameter(url, "wcmmode", "preview");
                                            url = CQ.HTTP.noCaching(url);
                                            this.setText("&laquo; " + CQ.I18n.getMessage("Back"));
                                            rGrid.el.mask();
                                            CQ.Util.reload(CQ.WCM.getContentWindow(), url);
                                        }
                                    }
                                },
                                {
                                    "xtype":"button",
                                    "text":CQ.I18n.getMessage("Restore"),
                                    "disabled":config.readOnly,
                                    "handler": function() {
                                        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                                        var rec = rGrid.getSelectionModel().getSelected();
                                        if (!rec) {
                                            CQ.Ext.Msg.alert(CQ.I18n.getMessage("Info"), CQ.I18n.getMessage("Please select a version first."));
                                            return;
                                        }
                                        CQ.Ext.Msg.confirm(
                                            CQ.I18n.getMessage("Restore"),
                                            CQ.I18n.getMessage("Do you really want to restore the selected version of this page?"),
                                            function(btn) {
                                                if (btn == 'yes') {
                                                    var url = CQ.HTTP.externalize("/bin/wcmcommand");
                                                    var params = {};
                                                    params[CQ.Sling.CHARSET] = "utf-8";
                                                    params[CQ.Sling.STATUS] = CQ.Sling.STATUS_BROWSER;
                                                    params["cmd"] = "restoreVersion";
                                                    params["id"] = rec.data.id;
                                                    params[sidekick.pathParam] = sidekick.getPath();
                                                    var callback = function(options, success, xhr){
                                                        if (success) {
                                                            var res = CQ.HTTP.buildPostResponseFromHTML(xhr.responseText);
                                                            if (res.headers[CQ.HTTP.HEADER_STATUS] == "200") {
                                                                var url = CQ.HTTP.externalize(sidekick.getPath() + ".html");
                                                                url = CQ.HTTP.noCaching(url);
                                                                CQ.Util.reload(CQ.WCM.getContentWindow(), url);
                                                            }
                                                        }
                                                    };
                                                    CQ.HTTP.post(url, callback, params);
                                                }
                                            },
                                            this
                                        );
                                    }
                                }
                            ]
                        },
                        {
                            "xtype":"panel",
                            "border":false,
                            "style":"border-top-width:1px",
                            "items": rGrid
                        }
                    ]
                },
                // Future versions
                this.getLaunchesPanelConfig(isDiffView),
                { // time warp
                    "title": CQ.I18n.getMessage("Timewarp"),
                    "layout":"form",
                    "cls":"cq-sidekick-form",
                    "items": [
                        {
                            "xtype":"datetime",
                            "id":"cq.sidekick.timewarp.datetime",
                            "dateWidth": 90,
                            "timeWidth": 90,
                            "value": "now"
                        },
                        {
                            "xtype": "panel",
                            "layout": "column",
                            "border":false,
                            "defaults": {
                                "border":false,
                                "autoScroll":true
                            },
                            "items": [
                                {
                                    "xtype":"button",
                                    "text":CQ.I18n.getMessage("Go"),
                                    "id": "cq.sidekick.timewarp.go_button",
                                    "handler": function(){
                                        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                                        var d = CQ.Ext.getCmp("cq.sidekick.timewarp.datetime").getDateValue();
                                        if(d){
                                            CQ.HTTP.setCookie(CQ.WCM.TIMEWARP_COOKIE,d.getTime(),"/", 0);
                                            var url = CQ.HTTP.externalize(sidekick.getPath()+".html");
                                            sidekick.destroy();
                                            CQ.WCM.getTopWindow().CQ_Sidekick = null;
                                            CQ.Util.reload(CQ.WCM.getContentWindow(),url);
                                        }
                                    }
                                },
                                {
                                    "xtype": "button",
                                    "text": CQ.I18n.getMessage("Show Timeline"),
                                    "handler": function() {
                                        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                                        var win = new CQ.Dialog(sidekick.getTimelineWindowConfig());
                                        win.show();
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        versionPanel.add(aPanel);
        versionPanel.doLayout();
    },

    loadWorkflowTab: function() {
        var workflowPanel = this.panels[CQ.wcm.Sidekick.WORKFLOW];
        var pagePath = this.path;
        var workflowSubPanels = [];

        // populate workflow options
        var pageInfo = CQ.WCM.getPageInfo(this.getPath());

        // start workflow panel
        var workflowConsolePanel = {
            "xtype":"panel",
            "title": CQ.I18n.getMessage("Workflow"),
            "layout": "form",
            "layoutConfig": {
                "defaultAnchor": null
            },
            "cls": "cq-sidekick-form",
            "border":false
        };

        // Get workflow package information
        var workflowPackageInfo = pageInfo.workflowPackageInfo;

        // Get workflow packages
        var wPackages = pageInfo.workflowPackageInfo && pageInfo.workflowPackageInfo.workflowPackages ?
                pageInfo.workflowPackageInfo.workflowPackages : [];

        // Check page workflow status
        var isInWorkflow = pageInfo.workflowInfo && pageInfo.workflowInfo.isRunning;
        var isInWorkflowPackage = workflowPackageInfo && workflowPackageInfo.selectedWorkflowPackages.length > 0;
        var isInRunningWorkflowPackage = workflowPackageInfo && workflowPackageInfo.runningSelectedWorkflowPackages.length > 0;

        var wpPanelItems;
        if (!isInWorkflowPackage) {
            // Page is NOT in any workflow package

            if (isInWorkflow) {
                // Page is in a workflow

                wpPanelItems = [
                    {
                        "xtype": "label",
                        "text": CQ.I18n.getMessage("Unable to add to a package because of a running workflow.")
                    }
                ];

            } else {
                // Page is NOT is a workflow

                wpPanelItems = [
                    {
                        "xtype": "selection",
                        "type": "select",
                        "name": "workflowPackage",
                        "fieldLabel": CQ.I18n.getMessage("Package"),
                        "options": CQ.WCM.getWorkflowPackageOptions(wPackages),
                        "listeners": {
                            "selectionchanged": function() {
                                CQ.Util.toggleComponent(CQ.Ext.getCmp("cq.sidekick.workflow.package.add"), this.getValue() != "");
                            }
                        }
                    },
                    {
                        "xtype": "panel",
                        "border": false,
                        "cls": "cq-sidekick-form",
                        "defaults": {
                            "border": false
                        },
                        "items": [
                            {
                                "xtype": "panel",
                                "layout": "column",
                                "items": [
                                    {
                                        "xtype": "button",
                                        "id": "cq.sidekick.workflow.package.add",
                                        "disabled": true,
                                        "text": CQ.I18n.getMessage("Add to package"),
                                        "handler": function() {
                                            // There is no need to check if a value has been selected in the list,
                                            // button is only enabled if a value is selected

                                            var sidekick = CQ.wcm.Sidekick.findSidekick(this);

                                            // Check if a workflow package has been selected
                                            var fWorkflowPackage = sidekick.getField("workflowPackage").hiddenField;

                                            var params = {
                                                "./root": pagePath,
                                                "./sling:resourceType": "cq/workflow/components/collection/definition/resource",
                                                ":nameHint": "resource",
                                                "_charset_": "utf-8",
                                                "parentResourceType": "cq/workflow/components/collection/definition/resourcelist"
                                            };

                                            var callback = function(options, success, xhr) {
                                                if (success) {
                                                    var url = CQ.HTTP.externalize(sidekick.getPath() + CQ.HTTP.EXTENSION_HTML);
                                                    CQ.Util.reload(CQ.WCM.getContentWindow(), CQ.HTTP.noCaching(url));
                                                } else {
                                                    CQ.Ext.Msg.alert(CQ.I18n.getMessage("Error"), CQ.I18n.getMessage("The page could not be added to that workflow package. Please retry."));
                                                }
                                            };

                                            var formUrl = fWorkflowPackage.getValue() + "/jcr:content/vlt:definition/filter/";
                                            CQ.HTTP.post(formUrl, callback, params, null, true);
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ];
            }

        } else {
            // Page is already in at least one workflow package
            // NOTE: The first association found will be displayed
            // TODO: Support multiple workflow packages

            // Workflow package to show is:
            // - either the "running" one if available
            // - or the first one in the page's workflow packages
            var displayedWP = wPackages[isInRunningWorkflowPackage ? workflowPackageInfo.runningSelectedWorkflowPackages[0] : workflowPackageInfo.selectedWorkflowPackages[0]];

            wpPanelItems = [
                {
                    "xtype": "label",
                    "text": CQ.I18n.getMessage("This page is part of package:", null, "Label used to show that a page is part of a workflow package")
                },
                {
                    "xtype": "panel",
                    "border": false,
                    "cls": "cq-sidekick-form",
                    "items": {
                        "xtype":"label",
                        "text": displayedWP.title,
                        "style": {
                            "font-weight": "bold"
                        }
                    }
                },
                {
                    "xtype": "panel",
                    "border": false,
                    "cls": "cq-sidekick-form",
                    "defaults": {
                        "border": false
                    },
                    "items": [
                        {
                            "xtype": "panel",
                            "layout": "column",
                            "items": [
                                {
                                    "xtype": "button",
                                    "text": CQ.I18n.getMessage("Show"),
                                    "handler": function() {
                                        // Go to workflow package
                                        CQ.shared.Util.open(CQ.HTTP.externalize(displayedWP.path + CQ.HTTP.EXTENSION_HTML));
                                    }
                                },
                                {
                                    "xtype": "button",
                                    "text": CQ.I18n.getMessage("Remove"),
                                    "handler": function() {
                                        // Remove current page from workflow package
                                        var sidekick = CQ.wcm.Sidekick.findSidekick(this);

                                        CQ.Ext.Msg.confirm(
                                            CQ.I18n.getMessage("Remove page from workflow package"),
                                            CQ.I18n.getMessage("You are going to remove this page from the workflow package:<br/>{0}<br/><br/>Are you sure?", [displayedWP.title]),
                                            function(btnId) {
                                                if (btnId == "yes") {
                                                    var params = {
                                                        ":command": "REMOVE_MEMBER",
                                                        "rcPath": displayedWP.path,
                                                        "rcMemberPath": pagePath
                                                    };

                                                    var callback = function(options, success, xhr) {
                                                        if (success) {
                                                            var url = CQ.HTTP.externalize(sidekick.getPath() + CQ.HTTP.EXTENSION_HTML);
                                                            CQ.Util.reload(CQ.WCM.getContentWindow(), CQ.HTTP.noCaching(url));
                                                        } else {
                                                            CQ.Ext.Msg.alert(CQ.I18n.getMessage("Error"), CQ.I18n.getMessage("The page could not be removed from that workflow package. Please retry."));
                                                        }
                                                    };

                                                    CQ.HTTP.post("/libs/wcm/bin/resourcecollection", callback, params, null, true);
                                                }
                                            },
                                            this
                                        );
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];
        }

        // Workflow package fieldset will contain:
        // - The first workflow package that is retrieved, with Remove and Show buttons
        // - A combo containing all workflow packages if the page is not yet member of a workflow package
        var wpFieldset = {
            "collapsed": !isInWorkflowPackage,
            "layoutConfig": {
                "defaultAnchor": null
            },
            "collapsible": true,
            "xtype": "fieldset",
            "title": CQ.I18n.getMessage("Workflow Package"),
            "cls": "cq-sidekick-fieldset cq-sidekick-wfp-fieldset",
            "items": wpPanelItems,
            "listeners": {
                "expand": function() {
                    this.doLayout();
                }
            }
        };

        // check if page is already in workflow
        if (!isInWorkflow) {
            // show start workflow panel
            var workflowOptions = [];
            var translateWorkflowOptions = [];
            var wData = pageInfo && pageInfo.workflows && pageInfo.workflows.wcm ? pageInfo.workflows.wcm.models : [];
            for (var i=0; i<wData.length;++i){
                workflowOptions.push({
                    "value": wData[i]["wid"],
                    "text": wData[i]["label"],
                    "text_xss": CQ.shared.XSS.getXSSTablePropertyValue(wData[i], "label")
                });
            }
            var twData = pageInfo && pageInfo.workflows && pageInfo.workflows.translation ? pageInfo.workflows.translation.models : [];
            for (var i=0; i<twData.length;++i){
                translateWorkflowOptions.push({
                    "value": twData[i]["wid"],
                    "text": twData[i]["label"],
                    "text_xss": CQ.shared.XSS.getXSSTablePropertyValue(twData[i], "label")
                });
            }

            workflowConsolePanel.items = [
                {
                    "xtype":"selection",
                    "type": "select",
                    "name":"startWorkflowModel",
                    "triggerAction": "all",
                    "fieldLabel":CQ.I18n.getMessage("Workflow"),
                    "selectOnFocus":true,
                    "cls": "x-form-element",
                    "options": workflowOptions,
                    "listeners": {
                        "selectionchanged": function() {
                            CQ.Util.toggleComponent(CQ.Ext.getCmp("cq.sidekick.workflow.start"), this.getValue() != "");
                        }
                    }
                },
                {
                    "xtype": "fieldset",
                    "collapsed": true,
                    "collapsible": true,
                    "cls": "cq-sidekick-fieldset",
                    "title": CQ.I18n.getMessage("Additional information"),
                    "items": [
                        {
                            "xtype": "textarea",
                            "fieldLabel": CQ.I18n.getMessage("Comment"),
                            "cls": "x-form-element",
                            "name":"startComment",
                            "height": 38
                        },
                        {
                            "xtype": "textfield",
                            "fieldLabel": CQ.I18n.getMessage("Workflow Title"),
                            "cls": "x-form-element",
                            "name": "workflowTitle"
                        }
                    ]
                },
                {
                    "xtype":"panel",
                    "border": false,
                    "cls": "cq-sidekick-form",
                    "items": [
                        new CQ.Ext.Button({
                            "id": "cq.sidekick.workflow.start",
                            "disabled": true,
                            "text": CQ.I18n.getMessage("Start Workflow"),
                            "handler": function() {
                                // There is no need to check if a value has been selected in the list,
                                // button is only enabled if a value is selected

                                var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                                var fModel = sidekick.getField("startWorkflowModel").hiddenField;
                                var fComment = sidekick.getField("startComment");

                                var params = {
                                    "_charset_": "utf-8",
                                    "payloadType": "JCR_PATH",
                                    "payload": pagePath,
                                    "model": fModel.getValue(),
                                    "startComment": fComment.getValue(),
                                    "workflowTitle": sidekick.getField("workflowTitle").getValue()
                                };
                                var formUrl = "/etc/workflow/instances";
                                var callback = function(options, success, xhr) {
                                    if (success) {
                                        var res = CQ.HTTP.buildPostResponseFromHTML(xhr.responseText);
                                        if (res.headers[CQ.HTTP.HEADER_STATUS] == "201") {
                                            var url = CQ.Util.externalize(sidekick.getPath() + ".html");
                                            url = CQ.HTTP.noCaching(url);
                                            CQ.Util.reload(CQ.WCM.getContentWindow(), url);
                                        }
                                    }
                                };
                                CQ.HTTP.post(formUrl, callback, params);
                            }
                        })
                    ]
                },
                wpFieldset
            ];
        } else {
            // page is in workflow and assigned to the current user
            var workItems = pageInfo.workflowInfo.workitems;
            var workflowName = (pageInfo.workflowInfo.title) ?
                               pageInfo.workflowInfo.title + " (" + pageInfo.workflowInfo.model.title + ")" :
                               pageInfo.workflowInfo.model.title;
            var isWorkflowAssignedToCurrentUser = workItems.length > 0;
            var showWorkflowActions = isInWorkflow && !isInRunningWorkflowPackage && isWorkflowAssignedToCurrentUser;
            if (!showWorkflowActions) {
                // show notice that page is subject to workflow, but assigned to someone else
                workflowConsolePanel.items = [
                    {
                        "xtype": "panel",
                        "border": false,
                        "cls": "cq-sidekick-wf-info-panel",
                        "items": [
                            {
                                "xtype": "label",
                                "text": CQ.I18n.getMessage("This page is subject to workflow:", null, "Label used to show that a page is subject to a workflow")
                            },
                            {
                                "xtype": "panel",
                                "border": false,
                                "cls": "cq-sidekick-form",
                                "items": {
                                    "xtype":"label",
                                    "text": workflowName,
                                    "style": {
                                        "font-weight": "bold"
                                    }
                                }
                            }
                        ]
                    },
                    wpFieldset
                ];
            } else {
                var fnGetWorkItemPath = function() {
                    var sel = CQ.Ext.getCmp("cq.sidekick.workflow.workitems");
                    return sel.getValue();
                };
                var fnGetWorkItemDialog = function(wiPath) {
                    var dlgPath = "";
                    var wis = pageInfo.workflowInfo.workitems;
                    if (wis.length > 0) {
                        for (var j=0;j<wis.length;++j){
                            if (wis[j].id == wiPath) {
                                dlgPath = wis[j].dialog_path;
                                break;
                            }
                        }
                    }
                    return dlgPath;
                };
                var fnReload = function() {
                    var pi = CQ.WCM.getPageInfo(CQ.WCM.getPagePath(), true);
                    var sel = CQ.Ext.getCmp("cq.sidekick.workflow.workitems");

                    var wis = pi.workflowInfo.workitems;
                    if (wis && wis.length > 0) {
                        var options = [];
                        for (var j=0;j<wis.length;++j){
                            options.push({
                                "text": wis[j]["title"],
                                "value": wis[j]["id"]
                            });
                        }
                        sel.setOptions(options);
                        sel.setValue(wis[0]["id"]);
                    } else {
                        // reload completely
                        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                        var url = CQ.Util.externalize(sidekick.getPath() + ".html");
                        url = CQ.HTTP.noCaching(url);
                        CQ.Util.reload(CQ.WCM.getContentWindow(), url);
                    }
                };

                var completeAction = new CQ.Ext.Action({
                    cls:'cq.workflow.sidekick.complete',
                    text:CQ.I18n.getMessage('Complete'),
                    getWorkItemPath: fnGetWorkItemPath,
                    reload: fnReload,
                    handler: function() {
                        var workItemUrl = this.getWorkItemPath();
                        if (null === workItemUrl) {
                            this.disable();
                        } else {
                            /* load step specific dialog */
                            var wfDlg = [{
                                xtype:"textarea",
                                name:"comment",
                                height:100,
                                fieldLabel:CQ.I18n.getMessage("Comment"),
                                fieldDescription:CQ.I18n.getMessage("Optional comment to describe what has been done.")
                            }];
                            var dlgPath = fnGetWorkItemDialog(workItemUrl);
                            if(dlgPath) {
                                var dialogData = CQ.HTTP.get(CQ.HTTP.externalize(dlgPath + ".infinity.json"));
                                var tmp = CQ.Util.formatData(CQ.HTTP.eval(dialogData));
                                wfDlg.unshift(tmp.items);
                            };
                            var panelItems = [{
                                    xtype:"selection",
                                    id:"cq.workflow.sidekick.complete.dialog.combo",
                                    type: "select",
                                    name: 'route',
                                    fieldLabel:CQ.I18n.getMessage('Next Step'),
                                    selectOnFocus:true,
                                    cls: "x-form-element",
                                    options: workItemUrl + ".routes.json",
                                    optionsRoot: "routes",
                                    optionsTextField: "label",
                                    optionsValueField: "rid",
                                    // TODO: optionsConfig is private ...
                                    optionsConfig:{
                                        emptyText:CQ.I18n.getMessage('Select a destination ...'),
                                        title:CQ.I18n.getMessage('Available Destinations'),
                                        allowBlank: false
                                    },
                                    editable:false
                                },{
                                    xtype:"hidden",
                                    name:"item",
                                    value:workItemUrl
                            }];
                            panelItems.push(wfDlg);

                            var completeDialogConfig = {
                                xtype: 'dialog',
                                title:CQ.I18n.getMessage('Complete Work Item'),
                                formUrl: CQ.shared.HTTP.externalize('/bin/workflow/inbox'),
                                params: {
                                    item: workItemUrl,
                                    _charset_:"utf-8"
                                },
                                items:{
                                    xtype:"panel",
                                    items:panelItems
                                },
                                responseScope: this,
                                success: function(){
                                    this.reload();
                                },
                                failure:function(){
                                    CQ.Ext.Msg.alert(
                                        CQ.I18n.getMessage("Error"),
                                        CQ.I18n.getMessage("Could not complete workflow step.")
                                    );
                                },
                                buttons:CQ.Dialog.OKCANCEL,
                                listeners: {
                                    show : function(dialog){
                                        // preselect option 0
                                        var combo = dialog.getField("route");
                                        combo.setValue(combo.comboBox.store.getAt(0).data.value);
                                    }
                                }
                            };
                            CQ.WCM.unregisterDialog("cq.workflow.sidekick.complete.dialog");  // the only way to reload the store...
                            var completeDialog = CQ.WCM.getDialog(completeDialogConfig, "cq.workflow.sidekick.complete.dialog");
                            completeDialog.on("beforesubmit", function() {
                                var combo = CQ.Ext.getCmp("cq.workflow.sidekick.complete.dialog.combo");
                                combo.setDisabled(false);

                                /* if item has a dialog, post dialog fields to payload first */
                                if(dlgPath) {
                                    var payloadUrl = CQ.HTTP.externalize(CQ.WCM.getPagePath());
                                    var action = new CQ.form.SlingSubmitAction(this.form, {
                                        "url": payloadUrl
                                    });

                                    this.form.doAction(action);
                                }

                                this.noUnregisterOnHide = true;
                                return true;
                            }, completeDialog);
                            completeDialog.show();
                        }
                    },
                    tooltip: {
                        title:CQ.I18n.getMessage('Complete Item'),
                        text:CQ.I18n.getMessage('Completes the selected inbox item and advances workflow to the next step'),
                        autoHide:true
                    }
                });


                var stepBackAction = new CQ.Ext.Action({
                    cls:'cq.workflow.sidekick.stepBack',
                    text: CQ.I18n.getMessage('Step Back'),
                    getWorkItemPath: fnGetWorkItemPath,
                    reload: fnReload,
                    handler: function() {
                        var workItemUrl = this.getWorkItemPath();
                        if (null === workItemUrl) {
                            this.disable();
                        } else {
                            var stepBackDialogConfig = {
                                xtype: 'dialog',
                                title: CQ.I18n.getMessage('Step Back'),
                                formUrl: '/bin/workflow/inbox',
                                params: {
                                    item: workItemUrl,
                                    _charset_:"utf-8"
                                },
                                items: {
                                    xtype:'panel',
                                    items:[
                                        {
                                            xtype:"selection",
                                            id:"cq.workflow.sidekick.back.dialog.combo",
                                            type: "select",
                                            name: 'backroute',
                                            fieldLabel: CQ.I18n.getMessage('Previous Step'),
                                            selectOnFocus:true,
                                            cls: "x-form-element",
                                            options: workItemUrl + ".backroutes.json",
                                            optionsRoot: "backroutes",
                                            optionsTextField: "label",
                                            optionsValueField: "rid",
                                            optionsConfig:{
                                                emptyText:CQ.I18n.getMessage('Select a destination ...'),
                                                title:CQ.I18n.getMessage('Available Destinations'),
                                                allowBlank: false
                                            },
                                            editable:false
                                        },
                                        {
                                            xtype: 'textarea',
                                            name:'comment',
                                            fieldLabel:CQ.I18n.getMessage('Comment')
                                        }
                                    ]
                                },
                                responseScope: this,
                                success: function() {
                                    this.reload();
                                },
                                failure:function() {
                                    CQ.Ext.Msg.alert(
                                        CQ.I18n.getMessage("Error"),
                                        CQ.I18n.getMessage("Could not assign the work item to the step specified.")
                                    );
                                },
                                buttons:CQ.Dialog.OKCANCEL,
                                listeners: {
                                    show : function(dialog){
                                        // preselect option 0
                                        var combo = dialog.getField("backroute");
                                        combo.setValue(combo.comboBox.store.getAt(0).data.value);
                                    }
                                }
                            };
                            CQ.WCM.unregisterDialog("cq.workflow.sidekick.back.dialog");  // the only way to reload the store...
                            var stepBackDialog = CQ.WCM.getDialog(stepBackDialogConfig, "cq.workflow.sidekick.back.dialog");
                            stepBackDialog.show();
                        }
                    },
                    tooltip: {
                        title:CQ.I18n.getMessage('Step Back'),
                        text:CQ.I18n.getMessage('Go one step back in the workflow'),
                        autoHide:true
                    }
                });


                var delegateAction = new CQ.Ext.Action({
                    cls:'cq.workflow.sidekick.delegate',
                    text:CQ.I18n.getMessage('Delegate'),
                    getWorkItemPath: fnGetWorkItemPath,
                    reload: fnReload,
                    handler: function() {
                         var workItemUrl = this.getWorkItemPath();
                        if (null === workItemUrl) {
                            this.disable();
                        } else {
                            var delegateDialogConfig = {
                                xtype: 'dialog',
                                title: 'Delegate Work Item',
                                formUrl: '/bin/workflow/inbox',
                                params: {
                                    item:workItemUrl,
                                    _charset_:"utf-8"
                                },
                                items: {
                                    xtype:'panel',
                                    items:[
                                        {
                                            xtype:"selection",
                                            type: "select",
                                            name: 'delegatee',
                                            hiddenName: 'delegatee',
                                            fieldLabel: CQ.I18n.getMessage('User'),
                                            selectOnFocus:true,
                                            cls: "x-form-element",
                                            options: workItemUrl + ".delegatees.json",
                                            optionsRoot: "delegatees",
                                            optionsTextField: "label",
                                            optionsValueField: "rid",
                                            optionsConfig:{
                                                emptyText:CQ.I18n.getMessage('Select a user ...'),
                                                title:CQ.I18n.getMessage("Available Users"),
                                                allowBlank: false
                                            },
                                            editable:false
                                        },
                                        {
                                            xtype: 'textarea',
                                            name:'comment',
                                            fieldLabel:CQ.I18n.getMessage('Comment')
                                        }
                                    ]
                                },
                                responseScope: this,
                                success: function(){
                                    CQ.Notification.notify(null,
                                            CQ.I18n.getMessage("Work item has been delegated."));
                                    this.reload();
                                },
                                failure:function(){
                                    CQ.Ext.Msg.alert(
                                           CQ.I18n.getMessage("Error"),
                                        CQ.I18n.getMessage("Could not delegate work item.")
                                    );
                                },
                                buttons:CQ.Dialog.OKCANCEL
                            };
                            var delegateDialog = CQ.WCM.getDialog(delegateDialogConfig);
                            delegateDialog.show();
                        }
                    },
                    tooltip: {
                        title:CQ.I18n.getMessage('Delegate Item'),
                        text:CQ.I18n.getMessage('Delegates the selected inbox item to another user or group'),
                        autoHide:true
                    }
                });

                // select 1st workitem and show its status
                // offer complete, step back and delegate buttons
                var workitemOptions = [];
                for (var j=0;j< workItems.length;++j){
                    workitemOptions.push({
                        "text": workItems[j]["title"],
                        "text_xss": CQ.shared.XSS.getXSSTablePropertyValue(workItems[j], "title"),
                        "value": workItems[j]["id"]
                    });
                }

                // TODO: add additional information about the current workflow
                //       e.g. the model's title
                workflowConsolePanel.items = [
                    {
                        "xtype": "panel",
                        "border": false,
                        "cls": "cq-sidekick-wf-info-panel",
                        "items": {
                            "xtype": "label",
                            "text": workflowName,
                            "style": {
                                "font-weight": "bold"
                            }
                        }
                    },
                    {
                        "xtype": "selection",
                        "id": "cq.sidekick.workflow.workitems",
                        "type": "select",
                        "name":"selectedWorkItem",
                        "triggerAction": "all",
                        "fieldLabel": CQ.I18n.getMessage("Current Step"),
                        "selectOnFocus": true,
                        "allowBlank": false,
                        "cls": "x-form-element",
                        "options": workitemOptions,
                        "value": workItems[0]["id"],
                        "editable":false
                    },
                    new CQ.Ext.Button(completeAction),
                    new CQ.Ext.Button(stepBackAction),
                    new CQ.Ext.Button(delegateAction),
                    wpFieldset
                ];
            }
        }

        workflowSubPanels.push(workflowConsolePanel);

        var isInTranslation = false;
        var transData = {};
        try {
            // get translation info
            transData = pageInfo.translation;
            if (pageInfo.workflow && pageInfo.workflow.isRunning) {
                isInTranslation = true;
            } else {
                // fill language map (don't need this in translation mode)
                var flagRoot = CQ.HTTP.externalize("/libs/wcm/msm/resources/flags/");
                var languages = pageInfo.languages.rows;
                var langOptions = [];
                if (languages){
                    for (var i = 0; i<languages.length; i++){
                        var row = languages[i];
                        if(row['path'] != this.path){
                            var img = "";
                            var cls = "cursor:pointer;";
                            if(row['exists']){
                                cls += "color:black;";
                                img = "<a href='" + CQ.shared.HTTP.getXhrHookedURL(CQ.HTTP.externalize(row['path']) + ".html") + "' target='_new' style=\'"+cls+"\' title='"+CQ.I18n.getMessage(row['language'])+"'><img style=\'vertical-align:text-bottom;width:20px;margin-left:5px;\' src=\'" + CQ.shared.HTTP.getXhrHookedURL(flagRoot + row['country'] + ".gif") + "\'></a>";
                            }
                            else{
                                cls += "color:#888888;";
                                img = "<a href='" + CQ.shared.HTTP.getXhrHookedURL(CQ.HTTP.externalize(row['path']) + ".html") + "' target='_new' style=\'"+cls+"\' title='"+CQ.I18n.getMessage(row['language'])+"'><img style=\'vertical-align:text-bottom;opacity:0.4;filter:alpha(opacity=40);width:20px;margin-left:5px\' src=\'" + CQ.shared.HTTP.getXhrHookedURL(flagRoot + row['country'] + ".gif") + "\'></a>";
                            }
                            var lbl = "<span style=\'"+cls+"\'><a href='" + CQ.shared.HTTP.getXhrHookedURL(CQ.HTTP.externalize(row['path']) + ".html") + "' target='_new' title='"+CQ.I18n.getMessage(row['language'])+"' style=\'"+cls+"\'>"+CQ.I18n.getMessage(row['language'])+"</a></span>";
                            langOptions.push({
                                "text": img+" "+lbl,
                                "value": row['path']
                            });
                        }
                    }
                }
            }
        } catch(e){
//            console.log("Sidekick::loadTranslation: "+e);
        }

        // translation panel (non client page)
        var languagePanel;
        if (!isInTranslation) {

            languagePanel = new CQ.Ext.Panel({
                "title": CQ.I18n.getMessage("Translation"),
                "layout": "form",
                "labelAlign": "top",
                "cls": "cq-sidekick-form",
                "items": [ {
                        "xtype":"panel",
                        "height": 1,
                        "border": false
                    },{
                        "xtype": "selection",
                        "ctCls": "x-form-element-label-top",
                        "name": "langTargets",
                        "fieldLabel": CQ.I18n.getMessage("Select Languages"),
                        "type": "checkbox",
                        "options": langOptions
                    },{
                        "xtype":"panel",
                        "height": 3,
                        "border": false
                    },{
                        "xtype":"selection",
                        "type": "select",
                        "name":"model",
                        "fieldLabel":CQ.I18n.getMessage("Workflow"),
                        "selectOnFocus":true,
                        "allowBlank":false,
                        "ctCls": "x-form-element-label-top",
                        "options": translateWorkflowOptions
                    }, {
                        "xtype":"panel",
                        "layout":"column",
                        "border": false,
                        "cls": "cq-sidekick-form",
                        "defaults": {
                            "border": false
                        },
                        "items": [ {
                                "xtype":"button",
                                "text":CQ.I18n.getMessage("Translate"),
                                "handler": function(){
                                    var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                                    var targets = sidekick.getField("langTargets").getValue();
                                    var fModel = sidekick.getField("model").hiddenField;
                                    var formUrl = "/libs/wcm/msm/content/commands/translate";
                                    if(fModel.getValue() == ''){
                                        CQ.Ext.Msg.alert(CQ.I18n.getMessage("Info"), CQ.I18n.getMessage("Please select a workflow first."));
                                        return;
                                    }

                                    if(targets.length == 0){
                                        CQ.Ext.Msg.alert(CQ.I18n.getMessage("Info"), CQ.I18n.getMessage("You have to select at least one target."));
                                        return;
                                    }
                                    var params = {
                                        "_charset_": "utf-8",
                                        "path": pagePath,
                                        "target": targets,
                                        "model": fModel.getValue()
                                    };
                                    // check if page is already in workflow
                                    CQ.HTTP.post(formUrl, null, params);

                                    var url = CQ.HTTP.externalize(sidekick.getPath() + ".html");
                                    url = CQ.HTTP.noCaching(url);
                                    CQ.Util.reload(CQ.WCM.getContentWindow(), url);
                                }
                            }
                        ]
                    }

                ]
            });
        } else { // isInTranslation
            // translate panel (on destination page)
            var langCSM= new CQ.Ext.grid.CheckboxSelectionModel({
                "singleSelect":true
            });

            var lineRenderer = function(value, metadata, record) {
                if (record.data.deleted) {
                    metadata.attr = 'style="color:grey;"';
                }
                var comment = record.data.comment;
                if (comment) {
                    comment = CQ.Ext.util.Format.htmlEncode(comment);
                    if (CQ.Ext.QuickTips.isEnabled()) {
                        metadata.attr += ' ext:qtip="' + comment + '"';
                    } else {
                        metadata.attr += ' title="' + comment + '"';
                    }
                }
                return value;
            };

            var langGrid = new CQ.Ext.grid.GridPanel({
                "border":false,
                "width":"auto",
                "autoHeight": true,
                "loadMask":true,
                "stripeRows":true,
                "cm":new CQ.Ext.grid.ColumnModel([
                    langCSM,
                    {
                        "header":CQ.I18n.getMessage("Label"),
                        "dataIndex":"label",
                        "sortable":false,
                        "width":50,
                        "renderer": lineRenderer
                    },
                    {
                        "header":CQ.I18n.getMessage("Created"),
                        "dataIndex":"created",
                        "sortable":false,
                        "width":116,
                        "renderer": lineRenderer
                    },
                    {
                        "header":CQ.I18n.getMessage("Title"),
                        "dataIndex":"title",
                        "sortable":false,
                        "hidden":true,
                        "width":80,
                        "renderer": lineRenderer
                    },
                    {
                        "header":CQ.I18n.getMessage("Name"),
                        "dataIndex":"name",
                        "hidden":true,
                        "sortable":false,
                        "width":80,
                        "renderer": lineRenderer
                    }
                ]),
                "sm":langCSM,
                "store":new CQ.Ext.data.SimpleStore({
                    "fields":[
                       {"name": 'name'},
                       {"name": 'title'},
                       {"name": 'comment'},
                       {"name": 'created'},
                       {"name": 'label'},
                       {"name": 'id'},
                       {"name": 'deleted'}
                    ]
                }),
                "enableHdMenu":true
            });

            var btnTextShow = CQ.I18n.getMessage("Show Side-By-Side");
            var btnTextHide = CQ.I18n.getMessage("Hide");
            languagePanel = new CQ.Ext.Panel({
                "title":CQ.I18n.getMessage("Translation"),
                "layout":"form",
                "cls":"cq-sidekick-form",
                "listeners": {
                    "beforeexpand": function() {
                        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                        var revisionsTable = {};
                        var vs = transData.original.versions;
                        for (var i = 0; i < vs.length; i++) {
                            var data = vs[i];
                            revisionsTable[data.id] = [
                                data.name,
                                data.title,
                                data.comment,
                                data.created,
                                data.label,
                                data.id,
                                data.deleted
                            ];
                        }
                        var revisions = [];
                        for (var id in revisionsTable) {
                            revisions[revisions.length] = revisionsTable[id];
                        }
                        langGrid.getStore().loadData(revisions);
                        if (CQ.HTTP.getParameter(CQ.WCM.getContentUrl(), "cq_diffTo") != null) {
                            langGrid.on("render", function(grid) {
                                grid.el.mask();
                            });
                        }
                    }
                },
                "items": [ {
                        "xtype":"panel",
                        "layout":"column",
                        "border":true,
                        "defaults": {
                            "border":false,
                            "autoScroll":true
                        },
                        "items": [ {
                                "xtype":"panel",
                                "items":{
                                    "xtype":"button",
                                    "text": CQ.WCM.getContentFinder() && CQ.WCM.getContentFinder().isSideBoardCollapsed()
                                                ? btnTextShow
                                                : btnTextHide,
                                    "handler": function() {
                                        var sidekick = CQ.wcm.Sidekick.findSidekick(this);
                                        if (CQ.WCM.getContentFinder().isSideBoardCollapsed()) {
                                            var rec = langGrid.getSelectionModel().getSelected();
                                            if (!rec) {
                                                CQ.Ext.Msg.alert(CQ.I18n.getMessage("Info"), CQ.I18n.getMessage("Please select a version first."));
                                                return;
                                            }
                                            var url = CQ.HTTP.externalize(transData.original.path + ".html");
                                            url = CQ.HTTP.addParameter(url, "cq_diffTo", rec.data.label);
                                            url = CQ.HTTP.addParameter(url, "wcmmode", "disabled");
                                            url = CQ.HTTP.noCaching(url);
                                            this.setText(btnTextHide);
                                            langGrid.el.mask();
                                            CQ.WCM.getContentFinder().openSideBoard(url, 400);
                                        } else {
                                            langGrid.el.unmask();
                                            this.setText(btnTextShow);
                                            CQ.WCM.getContentFinder().closeSideBoard();
                                        }
                                    }
                                }
                            }, {
                                "xtype": "panel",
                                "border": false,
                                "style": "border-top-width: 1px",
                                "items": langGrid
                            }
                        ]
                    }
                ]
            });
        }

        workflowSubPanels.push(languagePanel);

        // the accordion panel of the workflow tab
        var workflowAccordeonPanel = new CQ.Ext.Panel({
            "layout": "accordion",
            "border": false,
            "forceLayout": true,
            "defaults": {
                "autoScroll": true,
                "xtype": "panel",
                "border": false
            },
            "items": workflowSubPanels
        });

        workflowPanel.add(workflowAccordeonPanel);
        workflowPanel.doLayout();
    },

    /**
     * Returns the config for the timeline window
     * @private
     * @return {Object} The config for the timeline window
     */
    getTimelineWindowConfig: function(){
        return {
            "cls":         "cq-timewarpdialog",
            "title":       CQ.I18n.getMessage("Timeline"),
            "layout":      "fit",
            "y":           100,
            "width":       800,
            "height":      300,
            "minWidth":    CQ.themes.Dialog.MIN_WIDTH,
            "minHeight":   CQ.themes.Dialog.MIN_HEIGHT,
            "closable":    true,
            "closeAction": "hide",
            "stateful":    false,
            "buttons":  [
                {
                    "text": CQ.I18n.getMessage("Go"),
                    "handler": function(e){
                        var dt = (CQ.WCM.isTimewarpMode())?
                                    CQ.Ext.getCmp("cq.sidekick.timewarp.datetime_outside"):
                                    CQ.Ext.getCmp("cq.sidekick.timewarp.datetime");
                        if(dt){
                            CQ.HTTP.setCookie(window.parent.CQ.WCM.TIMEWARP_COOKIE,dt.getValue().getTime(),"/", 0);
                        }
                        var url = CQ.shared.HTTP.getXhrHookedURL(CQ.HTTP.externalize(CQ.WCM.getSidekick().getPath()+".html"));
                        CQ.WCM.getSidekick().destroy();
                        CQ.WCM.getTopWindow().CQ_Sidekick = null;
                        CQ.Util.reload(CQ.WCM.getContentWindow(), url);
                        this.close();
                    }
                },
                CQ.Dialog.CANCEL
            ],
            "items": [{
                "html": '<iframe frameborder="0" width="100%" height="100%" ' +
                        'src="'+CQ.shared.HTTP.getXhrHookedURL(CQ.HTTP.externalize("/libs/wcm/core/content/tools/timewarp.html")+'?path=' + this.getPath()) + '"></iframe>'
            }]
        };
    },

    /**
     * Returns the menu config for any emulators defined on the page
     * @private
     * @return {Object} The config for the emulator menu
     */
    getEmulatorMenuConfig: function(path) {
        if( path ) {
            var pageInfo = CQ.WCM.getPageInfo(path);

            if( pageInfo && pageInfo["emulators"]) {

                var cfg = pageInfo["emulators"];
                var items = [];

                //convert emulator info into proper combo button config
                if (cfg.groups) {
                    for (var groupName in cfg.groups) {
                        var group = cfg.groups[groupName];

                        items.push({
                            "xtype": "titleseparator",
                            "title": CQ.I18n.getVarMessage(group.title)
                        });

                        for (var emulatorName in group) {

                            var emulator = group[emulatorName];

                            // skip non-emulators
                            if (null == emulator || !emulator.path) {
                                continue;
                            }

                            items.push({
                                "text": CQ.I18n.getVarMessage(emulator.text),
                                "icon": emulator.path
                                    ? CQ.HTTP.externalize(emulator.path + "/resources/sidekick-icon-" + emulatorName + ".png")
                                    : CQ.HTTP.externalize("/libs/cq/ui/resources/0.gif"),
                                "checked": emulator.isDefault === true || emulator.isDefault == "true",
                                "group": "emulators",
                                "value": emulatorName,
                                "action": emulator.action,
                                "checkHandler": function(item, checked) {
                                    var emulatorMgr = CQ.WCM.getEmulatorManager();
                                    if( emulatorMgr ) {
                                        if(checked) {
                                            if( item.action == "start") {
                                                emulatorMgr.switchEmulator(item.value);
                                            } else {
                                                emulatorMgr.stopEmulator();
                                            }
                                        }
                                    }
                                },
                                scope: this
                            });
                        }
                    }
                } else {
                    for(var name in cfg) {
                        var c = cfg[name];
                        items.push({
                            "text": c.text,
                            "icon": c.path ?
                                c.path + "/resources/sidekick-icon-" + name + ".png" :
                                "/libs/cq/ui/resources/0.gif",
                            "checked": c.isDefault === true || c.isDefault == "true",
                            "group": "emulators",
                            "value": name,
                            "action": c.action,
                            "checkHandler": function(item, checked) {
                                var emulatorMgr = CQ.WCM.getEmulatorManager();
                                if( emulatorMgr ) {
                                    if(checked) {
                                        if( item.action == "start") {
                                            emulatorMgr.switchEmulator(item.value);
                                        } else {
                                            emulatorMgr.stopEmulator();
                                        }
                                    }
                                }
                            },
                            scope: this
                        });
                    }
                }

                if (items.length > 0) {
                    return {
                        "menu": {
                            "items": items
                        }
                    };
                }
            }
        }

        return {};
    },

    /**
     * Loads the actions.
     * @private
     * @param {Object} config The config
     * @see CQ.Dialog#loadContent
     */
    loadActions: function(config) {
        // texts for default actions

        CQ.Timing.stamp("Start rendering sidekick");

        var currentPage = CQ.WCM.getPage(this.getPath());

        // add actions
        this.buttons = {};
        var actions = config.actions;
        for (var i = 0; i < actions.length; i++) {
            var actn = actions[i];
            var actnConf, actnName;
            if (typeof actn == "string") {
                actnName = actn;
                if (actn == CQ.wcm.Sidekick.CREATE) {
                    actnConf = this.getCreateConfig();
                }
                if (actn == CQ.wcm.Sidekick.CREATECHILDPAGE) {
                    actnConf = this.getCreateChildPageConfig();
                }
                if (actn == CQ.wcm.Sidekick.COPYPAGE) {
                    actnConf = this.getCopyPageConfig();
                }
                if (actn == CQ.wcm.Sidekick.MOVEPAGE) {
                    actnConf = this.getMovePageConfig();
                }
                if (actn == CQ.wcm.Sidekick.DELETE) {
                    actnConf = this.getDeleteConfig();
                }
                if (actn == CQ.wcm.Sidekick.PUBLISH) {
                    actnConf = this.getPublishConfig(currentPage);
                }
                if (actn == CQ.wcm.Sidekick.DEACTIVATE) {
                    actnConf = this.getDeactivateConfig(currentPage);
                }
                if (actn == CQ.wcm.Sidekick.ROLLOUT) {
                    actnConf = this.getRolloutConfig(currentPage);
                }
                if (actn == CQ.wcm.Sidekick.PRODUCTION_READY && this.getProductionReadyConfig) {
                    actnConf = this.getProductionReadyConfig(currentPage);
                }
                if (actn == CQ.wcm.Sidekick.REFERENCES) {
                    actnConf = this.getReferencesConfig();
                }
                if (actn == CQ.wcm.Sidekick.LOCK) {
                    actnConf = this.getLockConfig(currentPage);
                }
                if (actn == CQ.wcm.Sidekick.VERSION) {
                    actnConf = this.getVersionConfig();
                }
                if (actn == CQ.wcm.Sidekick.RESTORE) {
                    actnConf = this.getRestoreConfig();
                }
                if (actn == CQ.wcm.Sidekick.AUDIT) {
                    actnConf = this.getAuditConfig();
                }
                if (actn == CQ.wcm.Sidekick.PERMS) {
                    actnConf = this.getPermsConfig(config);
                }
                if (actn == CQ.wcm.Sidekick.PROPS) {
                    actnConf = this.getPropsConfig(config);
                }
                if (actn == CQ.wcm.Sidekick.START_WORKFLOW) {
                    actnConf = this.getStartWorkflowConfig();
                }
            } else {
                if(typeof actn == "function"){
                    actn = actn.call(this, config, currentPage);
                }
                actnConf = actn;
                actnName = actn ? actn.text : "";
            }
            if (actnConf) {
                actnConf.name = actnName;
                actnConf.disabled |= config.readOnly;
                if (!actnConf.hidden) {
                    this.addAction(actnConf, true);
                }
            }
        }
        for (var p in this.panels) {
            this.panels[p].doLayout();
        }
        CQ.Timing.stamp("Completed rendering sidekick");
    },

    initComponent: function() {
        CQ.wcm.Sidekick.superclass.initComponent.call(this);

        this.on("render", function() {
            if (CQ.WCM.getContentFinder()) {
                this.header.on("mousedown", function(e) {
                    window.setTimeout(function() {
                        CQ.wcm.ContentFinder.maskFrame();
                    }, 1);
                });
            }
            this.header.on("dblclick", function() {
                if (!this.collapsed) {
                    this.collapse();
                } else {
                    this.expand();
                }
            }, this);
            this.header.on("mousedown", function() {
                this.suspendObservation = true;
            }, this);
            this.header.on("mouseup", function() {
                this.suspendObservation = false;
            }, this);
            this.previewSwitch = this.header.child(".x-tool-toggle");
            this.previewSwitch.on("click", function() {
                var scaffoldMode = CQ.WCM.getContentUrl().indexOf(".scaffolding.") > 0;
                if (this.collapsed && (!CQ.WCM.isEditMode() || scaffoldMode)) {
                    var currentPage = CQ.WCM.getPage(this.path);
                    var designMode = CQ.WCM.isDesignMode();
                    var previewMode = CQ.WCM.isPreviewMode();
                    this.wcmMode = CQ.WCM.setMode(CQ.WCM.MODE_EDIT);
                    if (scaffoldMode) {
                        CQ.Util.reload(CQ.WCM.getContentWindow(),
                            CQ.HTTP.externalize(this.path + ".html"));
                    } else if (designMode) {
                        CQ.Util.reload(CQ.WCM.getContentWindow());
                    } else if (!this.pageLocked && !currentPage.isReadOnly()) {
                        CQ.WCM.getContentWindow().CQ.WCM.show();
                    }
                    if (previewMode) {
                        this.hideSimulatorPanel();
                    }
                    if (this.editButton) {
                        this.editButton.toggle(true);
                    }
                }
            }, this);
            var sidekick = this;
            CQ.Util.observeComponent.defer(16, this, [sidekick, 307]);
            CQ.Ext.EventManager.onWindowResize(function() {
                this.lastCheckedPos = null;
            }, this);
        });

        this.on("beforeshow", function() {
            var state = CQ.Ext.state.Manager.get(this.stateId || this.id);
            var doPin = true;
            if (state) {
                var winWidth = CQ.Ext.lib.Dom.getViewportWidth();
                var winHeight = CQ.Ext.lib.Dom.getViewportHeight();
                if (state.winWidth == winWidth && state.winHeight == winHeight) {
                    // do not pin to top right if the window size did not change
                    doPin = false;

                    // subtract scroll offset from x and y states
                    var scroll = CQ.Ext.getDoc().getScroll();
                    state.x = state.x - scroll.left;
                    state.y = state.y - scroll.top;
                    this.pin();
                }
            }
            if (doPin) {
                this.pin("tr");
            }

            // if we are in timewarp mode, render an additional panel
            if(CQ.WCM.isTimewarpMode()){
                var date = new Date(parseInt(CQ.HTTP.getCookie(CQ.WCM.TIMEWARP_COOKIE)));
                var timewarpPanel = new CQ.Ext.Panel({
                    "xtype": "panel",
                    "width": this.width,
                    "title": CQ.I18n.getMessage("Timewarp"),
                    "cls":"cq-sidekick-form-timewarp cq-sidekick-form",
                    "renderTo": this.getEl(),
                    "items": {
                        "xtype": "panel",
                        "border": false,
                        "cls": "cq-sidekick-timewarp-panel",
                        "layout": "form",
                        "items": [
                            {
                                "xtype": "panel",
                                "layout": "column",
                                "border": false,
                                "items": [
                                    {
                                        "xtype": "panel",
                                        "border": false,
                                        "cls": "cq-sidekick-timewarp-datetime",
                                        "items": {
                                           "xtype":"datetime",
                                            "id":"cq.sidekick.timewarp.datetime_outside",
                                            "dateWidth": 85,
                                            "timeWidth": 85,
                                            "value": date
                                        }
                                    },
                                    {
                                        "xtype":"button",
                                        "text":CQ.I18n.getMessage("Go"),
                                        "id": "cq.sidekick.timewarp.go_button_outside",
                                        "handler": function(){
                                            var sidekick = CQ.WCM.getSidekick();
                                            var d = CQ.Ext.getCmp("cq.sidekick.timewarp.datetime_outside").getDateValue();
                                            if(d){
                                                CQ.HTTP.setCookie(CQ.WCM.TIMEWARP_COOKIE,d.getTime(),"/", 0);
                                                var url = CQ.HTTP.externalize(sidekick.getPath()+".html");
                                                sidekick.destroy();
                                                CQ.WCM.getTopWindow().CQ_Sidekick = null;
                                                CQ.Util.reload(CQ.WCM.getContentWindow(),url);

                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                "xtype": "panel",
                                "layout": "column",
                                "border": false,
                                "defaults": {
                                    "border": false
                                },
                                "items": [
                                    {
                                        "xtype":"button",
                                        "text":CQ.I18n.getMessage("Exit Timewarp"),
                                        "handler": function(){
                                            var sidekick = CQ.WCM.getSidekick();
                                            CQ.HTTP.clearCookie(CQ.WCM.TIMEWARP_COOKIE, "/");
                                            var url = CQ.HTTP.externalize(sidekick.getPath()+".html");
                                            sidekick.destroy();
                                            CQ.WCM.getTopWindow().CQ_Sidekick = null;
                                            CQ.Util.reload(CQ.WCM.getContentWindow(),url);
                                            var cf = CQ.WCM.getContentFinder();
                                            if(cf){
                                                cf.expand();
                                            }
                                        }
                                    },
                                    {
                                        "xtype": "button",
                                        "text": CQ.I18n.getMessage("Show Timeline"),
                                        "handler": function() {
                                            var sidekick = CQ.WCM.getSidekick();
                                            var win = new CQ.Dialog(sidekick.getTimelineWindowConfig());
                                            win.show();
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                });

                var cf = CQ.WCM.getContentFinder();
                if(cf){
                    cf.collapse();
                }
                timewarpPanel.show();
            }

            if (CQ.WCM.isPreviewMode()) {
                this.showSimulatorPanel();
            }
        });

        this.on("beforestatesave", function(comp, state) {
            state.winWidth = CQ.Ext.lib.Dom.getViewportWidth();
            state.winHeight = CQ.Ext.lib.Dom.getViewportHeight();
            var scroll = CQ.Ext.getDoc().getScroll();
            state.x = state.x - scroll.left;
            state.y = state.y - scroll.top;
            return true;
        });

        this.on("loadcontent", function(dlg) {
            var currentPage = CQ.WCM.getPage(this.path);
            if(currentPage.isLiveCopy()) {
                this.liveCopyStatusButton.show();
                this.liveCopyStatusButton.toggle(CQ.WCM.isShownLayer(CQ.utils.WCM.LAYER_LCSTATUS));
            } else {
                this.liveCopyStatusButton.hide();
            }
            if (currentPage.isDesignable()) {
                this.designButton.show();
            } else {
                this.designButton.hide();
            }

            var win = CQ.WCM.getContentWindow();
            var checkClientContextStatus = function() {
                var analytics = win ? win["CQ_Analytics"] : null;
                var isClientContext = analytics && analytics.ClientContextUI && analytics.ClientContextUI.isAvailable();
                if( isClientContext ) {
                    this.clientContextButton.show();
                } else {
                    this.clientContextButton.hide();
                }
            };
            var checkAnalyticsStatus = function() {
            	var analytics = win ? win["CQ_Analytics"] : null;
            	var tnt = win ? win["mboxVersion"] : null;
                var isAnalytics = analytics && (analytics.Sitecatalyst || tnt);
                if( isAnalytics ) {
                    this.analyticsButton.show();
                } else {
                    this.analyticsButton.hide();
                }
            };

            if( win.CQ.WCM.areEditablesReady()) {
                checkClientContextStatus.call(this);
                checkAnalyticsStatus.call(this);
            } else {
                win.CQ.WCM.on("editablesready", checkClientContextStatus, this);
                win.CQ.WCM.on("editablesready", checkAnalyticsStatus, this);
            }

        });

        this.on("move", function() {
            this.suspendObservation = false;
        }, this);
    },

    /**
     * Overrides the current position of the dialog before it is shown,
     * taking the scrolling offsets of the document into account.
     * @private
     * @see CQ.Dialog#overridePosition
     */
    overridePosition: function() {
//        this.checkPosition();
    },

    // handle pinning internally, see also CQ.Dialog#pin
    pin: function(align) {
        this.alignToViewport(align);
        if (CQ.WCM.isContentWindow(window)) {
            // pinning handled internally
            this.isPinned = true;
        }
    },

    // handle pinning internally, see also CQ.Dialog#unpin
    unpin: function() {
        if (this.isPinned) {
            this.isPinned = false;
        }
    },

    /**
     * Called by observer. Makes sure the sidekick is always inside the
     * view port.
     * @private
     * @see CQ.Dialog#observe
     */
    observe: function() {
        if (!this.suspendObservation) {
            this.checkPosition();
        }
    },

    /**
     * Makes sure sidekick is never moved completely out of view.
     * This method should not have to be used directly, it is called
     * after the sidekick has been moved or the window has been resized.
     * @private
     */
    checkPosition: function() {
        var box = this.getBox();
        var pos = {
            "x": box.x,
            "y": box.y
        };
        var scroll = CQ.Ext.getDoc().getScroll();
        var scrolling = false;

        // handle scrolling
        if (!this.lastScroll) {
            this.lastScroll = {
                "left": 0,
                "top": 0
            };
        }
        if (this.lastScroll.top != scroll.top ||
                                    this.lastScroll.left != scroll.left) {
            scrolling = true;
            if (this.isPinned && !this.startScroll) {
                // remember start scrolling
                this.startScroll = this.lastScroll;
            }
        } else {
            if (this.isPinned && this.startScroll) {
                pos.x += scroll.left - this.startScroll.left;
                pos.y += scroll.top - this.startScroll.top;
                if (box.x != pos.x || box.y != pos.y) {
                    this.setPosition(pos.x,pos.y);
                    this.lastCheckedPos = pos;
                }
                this.startScroll = null;
                return;
            }
        }
        if (scrolling) {
            // remember last scrolling
            this.lastScroll = scroll;
            this.lastCheckedPos = null;
            return;
        }

        if (this.lastCheckedPos &&
            this.lastCheckedPos.x == pos.x &&
            this.lastCheckedPos.y == pos.y) {
            return;
        }

        // handle perimeter
        var minX = scroll.left;
        var minY = scroll.top;
        var maxX = minX + CQ.Ext.lib.Dom.getViewportWidth();
        var maxY = minY + CQ.Ext.lib.Dom.getViewportHeight() - 18; // bottom scrollbar
        if (box.x + CQ.themes.Dialog.CORNER_X > maxX) {
            pos.x = maxX - CQ.themes.Dialog.CORNER_X;
        }
        if (box.x + (box.width - CQ.themes.Dialog.CORNER_X) < minX) {
            pos.x = -box.width + CQ.themes.Dialog.CORNER_X;
        }
        if (box.y + CQ.themes.Dialog.CORNER_Y > maxY) {
            pos.y = maxY - CQ.themes.Dialog.CORNER_Y;
        }
        if (box.y < minY) {
            pos.y = minY;
        }
        this.lastCheckedPos = pos;

        if (box.x != pos.x || box.y != pos.y) {
            this.setPosition(pos.x,pos.y);
        }

    },

    /**
     * Scrolls the page content to the last position (e.g. before a reload).
     * @private
     */
    scrollContentToLastPosition: function() {
        var win = CQ.WCM.getContentWindow();
        var body = win.CQ.Ext.getBody();

        var cookieName = CQ.wcm.Sidekick.SCROLLPOS_COOKIE;
        var cookiePath = win.location.pathname;
        if (CQ.Ext.isIE) {
            // IE cookie issue: http://stackoverflow.com/questions/2156399
            // can't use full page path, must use parent path + / and encode page name in cookie
            var lastSlash = cookiePath.lastIndexOf("/");
            cookieName = cookieName + "-" + cookiePath.substring(lastSlash + 1);
            cookiePath = cookiePath.substring(0, lastSlash + 1); // include trailing slash
        }

        var pos = win.CQ.HTTP.getCookie(cookieName);
        if (typeof pos !== undefined && pos !== null) {
            CQ.Log.info("CQ.wcm.Sidekick: scrolling content to y = {0}", [pos]);
            // Note: ExtJS CQ.Ext.getBody().scrollTo("top", pos) does not work in FF
            win.scrollTo(0, pos);
        }

        win.CQ.Ext.EventManager.on(win, "unload", function(e) {
            var pos = body.getScroll().top;
            CQ.HTTP.setCookie(cookieName, pos, cookiePath, 0); // session cookie
        });
    },

    /**
     * Override CQ.Ext.Window.toFront() to avoid focusing it (or better the dummy focus element).
     * This is needed to avoid scroll jumps on the page, as scrollContentToLastPosition() should
     * take care of this.
     * @private
     * @see CQ.Ext.Window#toFront
     */
    toFront : function(e){
        // only bring to front
        this.manager.bringToFront(this);

        // but not calling this.focus()
        return this;
    },

    /**
     * Apply custom class to header of ghost.
     * @private
     * @see CQ.Ext.Window#createGhost
     */
    createGhost: function(){
        var el = CQ.wcm.Sidekick.superclass.createGhost.apply(this, arguments);
        el.first().addClass("cq-sidekick");
        return el;
    },

    constructor: function(config) {
        // config for default actions
        CQ.Util.applyDefaults(config, {
            "actions": CQ.wcm.Sidekick.DEFAULT_ACTIONS,
            "pathParam": "path",
            "reloadText": CQ.I18n.getMessage("Reload"),
            "previewText": CQ.I18n.getMessage("Preview"),
            "editText": CQ.I18n.getMessage("Edit"),
            "designText": CQ.I18n.getMessage("Design"),
            "adminText": CQ.I18n.getMessage("Websites"),
            "clientContextText": CQ.I18n.getMessage("Client Context"),
            "analyticsText": CQ.I18n.getMessage("Analytics"),
            "miscText": CQ.I18n.getMessage("Tools"),
            "adminUrl": "/siteadmin.html",
            "miscUrl": "/miscadmin.html",
            "liveCopyStatusText": CQ.I18n.getMessage("Live Copy Status"),
            "createText": CQ.I18n.getMessage("Create Page..."),
            "createDialog": "/libs/wcm/core/content/tools/sidekickcreatepagedialog",
            "templateList": "/bin/wcmcommand?cmd=getTemplates",
            "templateSelectionId": "templateselection",
            "scaffoldingText": CQ.I18n.getMessage("Scaffolding"),
            "deleteText": CQ.I18n.getMessage("Delete Page"),
            "deleteUrl": "/bin/wcmcommand?cmd=deletePage",
            "createChildPageText": CQ.I18n.getMessage("Create Child Page"),
            "copyPageText": CQ.I18n.getMessage("Copy Page"),
            "movePageText": CQ.I18n.getMessage("Move Page"),
            "publishText": CQ.I18n.getMessage("Activate Page"),
            "publishUrl": "/bin/replicate.json",
            "deactivateText": CQ.I18n.getMessage("Deactivate Page"),
            "referencesText": CQ.I18n.getMessage("Show References..."),
            "rolloutText": CQ.I18n.getMessage("Rollout Page"),
            "rolloutUrl": "/bin/wcmcommand?cmd=rollout",
            "lockText": CQ.I18n.getMessage("Lock Page"),
            "lockedByText": CQ.I18n.getMessage("Locked by {0}"),
            "unlockText": CQ.I18n.getMessage("Unlock Page"),
            "lockUrl": "/bin/wcmcommand?cmd=lockPage",
            "unlockUrl": "/bin/wcmcommand?cmd=unlockPage",
            "versionText": CQ.I18n.getMessage("Create Version..."),
            "versionDialog": "/libs/wcm/core/content/tools/createversiondialog",
            "versionList": "/bin/wcmcommand?cmd=getRevisions",
            "versionSelectionId": "versionselection",
            "restoreText": CQ.I18n.getMessage("Restore"),
            "restoreDialog": "/libs/wcm/core/content/tools/restoreversiondialog",
            "promoteText": CQ.I18n.getMessage("Promote Launch..."),
            "markProductionReadyText": CQ.I18n.getMessage("Mark Launch Production Ready"),
            "unmarkProductionReadyText": CQ.I18n.getMessage("Unmark Launch Production Ready"),
            "productionReadyText": CQ.I18n.getMessage("Launch is Production Ready"),
            "productionNotReadyText": CQ.I18n.getMessage("Launch is not Production Ready"),
            "auditText": CQ.I18n.getMessage("Audit Log..."),
            "auditDialog": "/libs/wcm/core/content/tools/auditlogdialog",
            "permsText": CQ.I18n.getMessage("Permissions..."),
            "permsDialog": "/libs/wcm/core/content/tools/permissiondialog",
            "propsText": CQ.I18n.getMessage("Page Properties..."),
            "propsDialog": "/libs/foundation/components/page/dialog",
            "startWorkflowText": CQ.I18n.getMessage("Start Workflow"),
            "startWorkflowDialog": "/libs/wcm/core/content/tools/startworkflowdialog",
            "helpPath":"en/cq/current/wcm.html",
            "warnIfModified":false
        });

//        // add events
//        this.addEvents(
//            /**
//             * @event loadContent
//             * Fires after content been loaded.
//             */
//            'loadContent'
//        );

        this.wcmMode = CQ.WCM.getMode();

        var scaffoldMode = CQ.WCM.getContentUrl().indexOf(".scaffolding.") > 0;
        var sidekick = this;
        this.applyConfigDefaults(config, {
            "dialog": {
                "id": "cq-sk",
                "stateful": true,
                "closable": false,
                "collapsible": true,
                "collapsed": !(CQ.WCM.isEditMode() && !scaffoldMode && !CQ.shared.HTTP.getCookie(CQ.wcm.Sidekick.COLLAPSE_COOKIE)),
                "expandOnShow": false,
                "border": false,
                "bodyStyle": CQ.themes.wcm.Sidekick.BODY_STYLE,
                "width": CQ.themes.wcm.Sidekick.WIDTH,
                "height": CQ.themes.wcm.Sidekick.HEIGHT,
                "minWidth": CQ.themes.wcm.Sidekick.MIN_WIDTH,
                "minHeight": CQ.themes.wcm.Sidekick.MIN_HEIGHT,
                "resizable": CQ.themes.wcm.Sidekick.RESIZABLE,
                "resizeHandles": CQ.themes.wcm.Sidekick.RESIZE_HANDLES,
                "headerAsText":false,
                "autoHeight": false,
                "autoWidth": false,
                "cls": "cq-sidekick",
                "tools": [ {
                    "id": "help",
                    "handler": function() {
                        CQ.wcm.HelpBrowser.show(config.helpPath);
                    }
                } ],
                "bbar": {},
                "items": this.getLoadingPanelConfig(),
                "listeners": {
                    "collapse": function() {
                        CQ.shared.HTTP.setCookie(CQ.wcm.Sidekick.COLLAPSE_COOKIE, "true", CQ.wcm.Sidekick.COLLAPSE_COOKIE_PATH);
                    },
                    "expand": function() {
                        CQ.shared.HTTP.clearCookie(CQ.wcm.Sidekick.COLLAPSE_COOKIE, CQ.wcm.Sidekick.COLLAPSE_COOKIE_PATH);
                        if( !CQ.WCM.isContentWindowLoading()) {
                            this.lazyLoadContent();
                        }
                    }
                }
            }
        });
        CQ.wcm.Sidekick.superclass.constructor.call(this, config);
    },

    initButtons: function(path, config) {
        this.spellCheckButton = new CQ.Ext.Button({
            "iconCls": "cq-sidekick-reload",
            "tooltip": {
                "title": "spell Check",
                "text": CQ.I18n.getMessage("Spell check the page"),
                "autoHide": true
            },
            "handler": function() {
            	var arr = {};
            	var bodyText = $('body').html();
                var bodyFrameText = $('iframe').contents().find('body').html();
                if(bodyFrameText.length>bodyText.length){
					bodyText=bodyFrameText;
                }
            	arr ['bodyText'] = bodyText;
            	$.ajax({
        			url: "/bin/aemfeatures/spellChecker", 
        			type: 'POST',
        			data: arr,
        			async: false, 
        			success: 
        				function(data, textStatus, xhr) {
					    $("body").highlight($.unique(xhr.responseJSON));
					    $('iframe').contents().find('body').highlight($.unique(xhr.responseJSON), {wordsOnly: true});
        			},
        			error: 
        				function(xhr, textStatus, errorThrown) {
        				$("#result").html("textStatus : " + textStatus);

        			}
        		});
            }
        });

        this.previewButton = new CQ.Ext.Button({
            "iconCls": "cq-sidekick-preview",
            "tooltip": {
                "title": config.previewText,
                "text": CQ.I18n.getMessage("Switch to preview mode"),
                "autoHide": true
            },
            "pressed": CQ.WCM.isPreviewMode(),
            "toggleGroup": "wcmMode",
            "enableToggle": true,
            "handler": function() {
                if (!CQ.WCM.isPreviewMode()) {
                    this.wcmMode = CQ.WCM.setMode(CQ.WCM.MODE_PREVIEW);
                    if (this.previewReload || CQ.utils.Form.requiresReloadForPreview()) {
                        CQ.Util.reload(CQ.WCM.getContentWindow());
                    } else {
                        CQ.WCM.getContentWindow().CQ.WCM.hide();
                    }
                    this.collapse();
                } else {
                    // make sure the button stays pressed
                    this.previewButton.toggle(true);
                }
                this.showSimulatorPanel();
            },
            "scope": this
        });

        this.scaffoldingButton = new CQ.Ext.Button({
            "iconCls": "cq-sidekick-scaffolding",
            "tooltip": {
                "title": config.scaffoldingText,
                "text": CQ.I18n.getMessage("Switch to scaffolding mode"),
                "autoHide": true
            },
            "pressed": CQ.WCM.getContentUrl().indexOf(".scaffolding.") > 0,
            "handler": function() {
                var scMode = CQ.WCM.getContentUrl().indexOf(".scaffolding.") > 0;
                if (!scMode) {
                    //this.wcmMode = CQ.WCM.setMode(CQ.WCM.MODE_PREVIEW);
                    CQ.Util.reload(CQ.WCM.getContentWindow(),
                        CQ.HTTP.externalize(this.path + ".scaffolding.html"));
                    this.collapse();
//                } else {
//                    // make sure the button stays pressed
//                    this.scaffoldingButton.toggle(true);
                }
            },
            "scope": this
        });

        var editButtonDefault = {
            "iconCls": "cq-sidekick-edit",
            "tooltip": {
                "title": config.editText,
                "text": CQ.I18n.getMessage("Switch to edit mode"),
                "autoHide": true
            },
            "pressed": CQ.WCM.isEditMode(),
            "toggleGroup": "wcmMode",
            "enableToggle": true,
            "handler": function() {
                if (!CQ.WCM.isEditMode()) {
                    this.wcmMode = CQ.WCM.setMode(CQ.WCM.MODE_EDIT);
                    CQ.WCM.getContentWindow().CQ.WCM.show();
                } else {
                    this.editButton.toggle(true);
                }
                this.hideSimulatorPanel();
            },
            "scope": this
        };

        //Add emulator items to edit button if the device simulator hasn't been launched
        if (!CQ.WCM.getContentWindow().CQ.WCM.isResponsiveMode()) {
            editButtonDefault = CQ.Util.applyDefaults(this.getEmulatorMenuConfig(path), editButtonDefault);
        }
        this.editButton = new CQ.Ext.Button(editButtonDefault);

        this.designButton = new CQ.Ext.Button({
            "iconCls": "cq-sidekick-design",
            "tooltip": {
                "title": config.designText,
                "text": CQ.I18n.getMessage("Switch to design mode"),
                "autoHide": true
            },
            "pressed": CQ.WCM.isDesignMode(),
            "toggleGroup": "wcmMode",
            "enableToggle": true,
            "handler": function() {
                if (!CQ.WCM.isDesignMode()) {
                    this.wcmMode = CQ.WCM.setMode(CQ.WCM.MODE_DESIGN);
                    CQ.Util.reload(CQ.WCM.getContentWindow());
                    this.collapse();
                } else {
                    this.designButton.toggle(true);
                }
            },
            "scope": this
        });
        var isMisc = path.indexOf("/etc/") == 0;
        this.adminButton = new CQ.Ext.Button({
            "iconCls": isMisc
                    ? "cq-sidekick-miscadmin"
                    : "cq-sidekick-siteadmin",
            "tooltip": {
                "title": isMisc
                        ? config.miscText
                        : config.adminText,
                "text": isMisc
                        ? CQ.I18n.getMessage("Go to Tools")
                        : CQ.I18n.getMessage("Go to Websites"),
                "autoHide": true
            },
            "handler": function(cmp, evt) {
                // check for multi window mode
                if (this.multiWinMode == undefined) {
                    var wm = CQ.User.getCurrentUser().getPreference("winMode");
                    this.multiWinMode = (wm != "single");
                }
                var adminUrl = CQ.HTTP.externalize(config.adminUrl);
                var path = this.getPath();
                if (path.indexOf("/etc/") == 0) {
                    adminUrl = CQ.HTTP.externalize(config.miscUrl);
                }
                path = path.substring(0, path.lastIndexOf("/"));
                adminUrl = CQ.HTTP.setAnchor(adminUrl, path);
                if (evt.shiftKey || this.multiWinMode) {
                    window.open(adminUrl);
                } else {
                    window.location.href = adminUrl;
                }
            },
            "scope": this
        });
        this.clientContextButton = new CQ.Ext.Button({
            "iconCls": "cq-sidekick-clientcontext",
            "hidden": true,
            "tooltip": {
                "title": config.clientContextText,
                "text": CQ.I18n.getMessage("Show the Client Context"),
                "autoHide": true
            },
            "handler": function(cmp, evt) {
                var win = CQ.WCM.getContentWindow();
                var analytics = win ? win["CQ_Analytics"] : null;
                var isClientContext = analytics && analytics.ClientContextUI && analytics.ClientContextUI.isAvailable();
                if( isClientContext ) {
                    analytics.ClientContextUI.toggle();
                }
            },
            "scope": this
        });

        this.liveCopyStatusButton = new CQ.Ext.Button({
            "disabled": false,
            "iconCls": "cq-sidekick-layer-livecopy",
            "tooltip": {
                "title": config.liveCopyStatusText,
                "text": CQ.I18n.getMessage("Display Live Copy status"),
                "autoHide": true
            },
            "handler": function() {
                if (CQ.WCM.isShownLayer(CQ.utils.WCM.LAYER_LCSTATUS)) {
                    CQ.WCM.hideLayer(CQ.utils.WCM.LAYER_LCSTATUS);
                } else {
                    CQ.WCM.showLayer(CQ.utils.WCM.LAYER_LCSTATUS);
                }
                this.liveCopyStatusButton.toggle(CQ.WCM.isShownLayer(CQ.utils.WCM.LAYER_LCSTATUS));
            },
            "scope": this
        });

        this.analyticsButton = new CQ.Ext.Button({
        	"hidden": true,
        	"iconCls": "cq-sidekick-analytics",
        	"tooltip": {
                "title": config.analyticsText,
                "text": CQ.I18n.getMessage("Switch to analytics mode"),
                "autoHide": true
        	},
        	"pressed": CQ.WCM.isAnalyticsMode(),
            "toggleGroup": "wcmMode",
            "enableToggle": true,
        	"handler": function() {
                var win = CQ.WCM.getContentWindow();
                var analytics = win ? win["CQ_Analytics"] : null;
                var tnt = win ? win["mboxVersion"] : null;
                var isAnalytics = analytics && (analytics.Sitecatalyst || tnt);
        		if(isAnalytics) {
    			    if (!CQ.WCM.isAnalyticsMode()) {
		                this.wcmMode = CQ.WCM.setMode(CQ.WCM.MODE_ANALYTICS);
		                CQ.Util.reload(CQ.WCM.getContentWindow());
		                this.collapse();
		            } else {
		            	this.analyticsButton.toggle(true);
		            }
        		}
        	},
        	"scope": this
        });

    },

    addButtons: function() {
        var bbar = this.getBottomToolbar();
        bbar.removeAll(true);
        bbar.add([
            this.editButton,
            this.previewButton,
            this.designButton,
            this.analyticsButton,
            this.scaffoldingButton,
            this.liveCopyStatusButton,
            this.clientContextButton,
            "-",
            this.adminButton,
            this.spellCheckButton
        ]);
    }
});

CQ.wcm.Sidekick.componentsWithDragZone = [];

/**
 * The name of the Sidekick CSS class.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.CLASSNAME = "cq-sidekick";

/**
 * Returns the corresponding sidekick. Use in action handlers where the
 * scope can be either the sidekick or a component.
 * @private
 * @static
 * @param {CQ.wcm.Sidekick/CQ.Ext.Component} obj The object
 * @return {CQ.wcm.Sidekick} The sidekick
 */
CQ.wcm.Sidekick.findSidekick = function(obj) {
    var sidekick = null;
    if (obj instanceof CQ.wcm.Sidekick) {
        sidekick = obj;
    } else {
        sidekick = obj.findParentByType("sidekick");
    }
    return sidekick;
};

/**
 * The value for {@link #actions} to create a Create button.
 * @static
 * @final
 * @type String
 * @deprecated No longer in use.
 */
CQ.wcm.Sidekick.CREATE = "CREATE";

/**
 * The value for {@link #actions} to create a Create Sub Page button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.CREATECHILDPAGE = "CREATECHILDPAGE";

/**
 * The value for {@link #actions} to create a Copy Page button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.COPYPAGE = "COPYPAGE";

/**
 * The value for {@link #actions} to create a Move Page button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.MOVEPAGE = "MOVEPAGE";

/**
 * The value for {@link #actions} to create a Delete button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.DELETE = "DELETE";

/**
 * The value for {@link #actions} to create a Publish button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.PUBLISH = "PUBLISH";

/**
 * The value for {@link #actions} to create a Deactivate button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.DEACTIVATE = "DEACTIVATE";

/**
 * The value for {@link #actions} to create a Rollout button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.ROLLOUT = "ROLLOUT";

/**
 * The value for {@link #actions} to create a (Un-)Mark Production Ready button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.PRODUCTION_READY = "PRODUCTION_READY";

/**
 * The value for {@link #actions} to create a References button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.REFERENCES = "REFERENCES";

/**
 * The value for {@link #actions} to create a Lock button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.LOCK = "LOCK";

/**
 * The value for {@link #actions} to create a Version button.
 * @static
 * @final
 * @type String
 * @deprecated No longer in use.
 */
CQ.wcm.Sidekick.VERSION = "VERSION";

/**
 * The value for {@link #actions} to create a Restore button.
 * @static
 * @final
 * @type String
 * @deprecated No longer in use.
 */
CQ.wcm.Sidekick.RESTORE = "RESTORE";

/**
 * The value for {@link #actions} to create an Audit log button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.AUDIT = "AUDIT";

/**
 * The value for {@link #actions} to create a Permissions button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.PERMS = "PERMS";

/**
 * The value for {@link #actions} to create a Properties button.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.PROPS = "PROPS";

/**
 * The value for {@link #actions} to create a Properties button.
 * @static
 * @final
 * @type String
 * @deprecated No longer in use.
 */
CQ.wcm.Sidekick.START_WORKFLOW = "START_WORKFLOW";

/**
 * The value for {@link #actions} to create the default set of buttons:
 * <ul>
 * <li>{@link #Sidekick.PROPS CQ.wcm.Sidekick.PROPS} Properties button</li>
 * <li>{@link #Sidekick.DELETE CQ.wcm.Sidekick.DELETE} Delete button</li>
 * <li>{@link #Sidekick.PUBLISH CQ.wcm.Sidekick.PUBLISH} Publish button</li>
 * <li>{@link #Sidekick.DEACTIVATE CQ.wcm.Sidekick.DEACTIVATE} Deactivate button</li>
 * <li>{@link #Sidekick.LOCK CQ.wcm.Sidekick.LOCK} Lock button</li>
 * <li>{@link #Sidekick.REFERENCES CQ.wcm.Sidekick.REFERENCES} References button</li>
 * <li>{@link #Sidekick.ROLLOUT CQ.wcm.Sidekick.ROLLOUT} Rollout button</li>
 * <li>{@link #Sidekick.AUDIT CQ.wcm.Sidekick.AUDIT} Audit Log button</li>
 * <li>{@link #Sidekick.PERMS CQ.wcm.Sidekick.PERMS} Permissions button</li>
 * <ul>
 * @static
 * @final
 * @type String[]
 */
CQ.wcm.Sidekick.DEFAULT_ACTIONS = [
    CQ.wcm.Sidekick.PROPS,
    CQ.wcm.Sidekick.CREATECHILDPAGE,
    CQ.wcm.Sidekick.COPYPAGE,
    CQ.wcm.Sidekick.MOVEPAGE,
    CQ.wcm.Sidekick.DELETE,
    CQ.wcm.Sidekick.PUBLISH,
    CQ.wcm.Sidekick.DEACTIVATE,
    CQ.wcm.Sidekick.LOCK,
    CQ.wcm.Sidekick.REFERENCES,
    CQ.wcm.Sidekick.ROLLOUT,
    CQ.wcm.Sidekick.PRODUCTION_READY,
//    CQ.wcm.Sidekick.VERSION,
//    CQ.wcm.Sidekick.RESTORE,
    CQ.wcm.Sidekick.AUDIT,
    CQ.wcm.Sidekick.PERMS
//    CQ.wcm.Sidekick.START_WORKFLOW
];

/**
 * The context value for actions to appear on the page tab.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.PAGE = "PAGE";

/**
 * The context value for actions to appear on the components tab.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.COMPONENTS = "COMPONENTS";

/**
 * The context value for actions to appear on the workflow tab.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.WORKFLOW = "WORKFLOW";

/**
 * The context value for actions to appear on the versioning tab.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.VERSIONING = "VERSIONING";

/**
 * The context value for actions to appear on the information tab.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.INFO = "INFO";

/**
 * All action contexts.
 * @private
 * @static
 * @final
 * @type String[]
 */
CQ.wcm.Sidekick.CONTEXTS = [
    CQ.wcm.Sidekick.PAGE,
    CQ.wcm.Sidekick.COMPONENTS,
    CQ.wcm.Sidekick.WORKFLOW,
    CQ.wcm.Sidekick.VERSIONING,
    CQ.wcm.Sidekick.INFO
];

CQ.Ext.reg("sidekick", CQ.wcm.Sidekick);

CQ.wcm.Sidekick.DragZoneBase = {
    getDragData : function(e) {
    	var target = e.getTarget(this.view.itemSelector);
        if (target) {
            var view = this.view;
            if (!view.isSelected(target)) {
                view.onClick(e);
            }
            var selNodes = view.getSelectedNodes();
            var selRecords = view.getSelectedRecords();
            var dragData = {
            	"nodes":selNodes,
            	"records":selRecords,
                "srcObject":target
            };

            if (selNodes.length == 1) {
                var ddel = target;
                if(selRecords[0].data && selRecords[0].data.thumbnail) {
                    ddel = document.createElement("div");
                    ddel.innerHTML = "<img src='"+selRecords[0].data.thumbnail+"'>";
                }
                dragData.ddel = ddel;
                dragData.single = true;
            }
            return dragData;
        }
        return false;
    },

    // the default action is to "highlight" after a bad drop
    // but since an image can't be highlighted, let's frame it
    afterRepair:function() {
        this.dragging = false;
    },

    // override the default repairXY with one offset for the margins and padding
    getRepairXY : function(e) {
        if (!this.dragData.multi){
            var xy = CQ.Ext.Element.fly(this.dragData.srcObject).getXY();
            xy[0] += 3;
            xy[1] += 3;
            return xy;
        }
        return false;
    },

    /**
     * Implements action of a drop of this drag zone to a drop target.
     * Called by <code>CQ.wcm.EditBase.DropTarget</code> objects.
     * @param {CQ.wcm.EditBase.DropTarget} dropTarget The calling drop target.
     * @see CQ.wcm.EditBase.DropTarget#notifyDrop
     * @private
     */
    notifyDropDT: function(dropTarget, e, data) {
        if (this.isDropAllowed(dropTarget)) {

            // hack, prevent multiple invocations
            /*if (dropTarget.editComponent.newDefinition) {
                return false;
            }*/
            dropTarget.editComponent.maskTarget(CQ.wcm.EditBase.INSERTING_PARAGRAPH);

            var editComponent = dropTarget.editComponent;
            var definition = CQ.Util.copyObject(data.records[0].data);
            window.setTimeout(function() {
                editComponent.createParagraph(definition);
                dropTarget.editComponent.hideTarget();
            },1);

            return this;
        }
        return false;
    },

    /**
     * Implements action when this drag zone enters over a drop target.
     * Called by <code>CQ.wcm.EditBase.DropTarget</code> objects.
     * @param {CQ.wcm.EditBase.DropTarget} dropTarget The calling drop target.
     * @see CQ.wcm.EditBase.DropTarget#notifyEnter
     * @private
     */
    notifyEnterDT: function(dropTarget, e, data) {
        if (this.isDropAllowed(dropTarget)) {
            dropTarget.editComponent.showTarget();
        }
        return '';
    },

    /**
     * Implements action when this drag zone gets out of a drop target.
     * Called by <code>CQ.wcm.EditBase.DropTarget</code> objects.
     * @param {CQ.wcm.EditBase.DropTarget} dropTarget The calling drop target.
     * @see CQ.wcm.EditBase.DropTarget#notifyOut
     * @private
     */
    notifyOutDT: function(dropTarget, e, data) {
        if (this.isDropAllowed(dropTarget)) {
            dropTarget.editComponent.hideTarget(true);
        }
        return '';
    },

    /**
     * Implements action when this drag zone gets over of a drop target.
     * Called by <code>CQ.wcm.EditBase.DropTarget</code> objects.
     * @param {CQ.wcm.EditBase.DropTarget} dropTarget The calling drop target.
     * @see CQ.wcm.EditBase.DropTarget#notifyOver
     * @private
     */
    notifyOverDT : function(dropTarget, e, data) {
        if (this.isDropAllowed(dropTarget)) {
            return this.dropAllowed;
        } else {
            return this.dropNotAllowed;
        }
    },

    /**
     * Returns if drop is allowed on the <code>dropTarget</code> param.
     * @param {CQ.wcm.EditBase.DropTarget} dropTarget The calling drop target.
     * @return {Boolean} True if drop is allowed, else false
     * @private
     */
    isDropAllowed: function(dropTarget) {
        var dragData = this.dragData ? this.dragData.records[0].data : null;
        return (dropTarget &&
                dropTarget.groups &&
                CQ.Util.isIntersecting(this.groups,dropTarget.groups) &&
                dropTarget.editComponent &&
                dragData &&
                dropTarget.editComponent.isInsertAllowed(dragData.virtual ? dragData.virtualResourceType : dragData.resourceType));
    },

    onDragCancel: function(e, dropTarget) {
        if(dropTarget && dropTarget.editComponent && dropTarget.editComponent.hideTarget) {
            dropTarget.editComponent.hideTarget();
        }
    }

};

/**
 * The name of the cookie holding if the sidekick is collapsed.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.COLLAPSE_COOKIE = "cq-sk-collapsed";

/**
 * The path for of the cookie holding if the sidekick is collapsed.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.COLLAPSE_COOKIE_PATH = CQ.HTTP.externalize("/");

/**
 * The (base) name of the cookie holding the position of the content scroll.
 * @static
 * @final
 * @type String
 */
CQ.wcm.Sidekick.SCROLLPOS_COOKIE = "cq-scrollpos";

CQ.wcm.Sidekick.DragZone4ContentFinder = function(view, config) {
    CQ.wcm.Sidekick.DragZone4ContentFinder.superclass.constructor.call(this, view.getEl(), config);
    this.view = view;
};

CQ.Ext.extend(CQ.wcm.Sidekick.DragZone4ContentFinder,CQ.wcm.ContentFinderDragZone,CQ.wcm.Sidekick.DragZoneBase);

CQ.wcm.Sidekick.DragZone = function(view, config) {
    CQ.wcm.Sidekick.DragZone.superclass.constructor.call(this, view.getEl(), config);
    this.view = view;
};

CQ.Ext.extend(CQ.wcm.Sidekick.DragZone,CQ.Ext.dd.DragZone,CQ.wcm.Sidekick.DragZoneBase);
