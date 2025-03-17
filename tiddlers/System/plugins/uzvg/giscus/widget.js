/*\
title: $:/plugins/uzvg/giscus/widget.js
type: application/javascript
module-type: widget

Giscus widget

\*/
(function() {
    "use strict";
    var Widget = require("$:/core/modules/widgets/widget.js").widget;
    var GiscusNodeWidget = function(parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };
    GiscusNodeWidget.prototype = new Widget();
    GiscusNodeWidget.prototype.render = function(parent, nextSibling) {
        this.parentDomNode = parent;
        this.computeAttributes();
        this.execute();
				const dataRepo = this.getAttribute('data-repo', "");
				const dataRepoId = this.getAttribute('data-repo-id', "");
				const dataCategory = this.getAttribute('data-category', "Announcements");
				const dataCategoryId = this.getAttribute('data-category-id', "");
				const dataTerm = this.getAttribute('data-term', "");
				const dataStrict = this.getAttribute('data-strict', "1");
				const dataReactionsEnabled = this.getAttribute('data-reactions-enabled', "1");
				const emitMetadata = this.getAttribute('emit-metadata', "0");
				const inputPosition = this.getAttribute('input-position', "top");
				const dataTheme = this.getAttribute('data-theme', "preferred_color_scheme");
				const dataLang = this.getAttribute('data-lang', "en");
				const dataLoading = this.getAttribute('data-loading', "eager");

				// 统一检测所有变量（任一为空字符串时返回）
				const allValues = [dataRepo, dataRepoId, dataCategoryId, dataTerm,];
				// 核心判断逻辑
				if (allValues.some(value => value === "")) {
					return;
				}
        var scriptNode = this.document.createElement('script');
        scriptNode.setAttribute("src", "https://giscus.app/client.js");
        scriptNode.setAttribute("data-repo", dataRepo);
        scriptNode.setAttribute("data-repo-id", dataRepoId);
        scriptNode.setAttribute("data-category", dataCategory);
        scriptNode.setAttribute("data-category-id", dataCategoryId);
        scriptNode.setAttribute("data-mapping", "specific");
        scriptNode.setAttribute("data-term", dataTerm);
        scriptNode.setAttribute("data-reactions-enabled", dataReactionsEnabled);
        scriptNode.setAttribute("data-emit-metadata", emitMetadata);
        scriptNode.setAttribute("data-theme", dataTheme);
        scriptNode.setAttribute("data-lang", dataLang);
        scriptNode.setAttribute("crossorigin", "anonymous");
        scriptNode.setAttribute("async", "true");

        // Clear other comment nodes' giscus class
        var commentNodes = this.document.querySelectorAll('.giscus');
        for (var i = 0, len = commentNodes.length; i < len; i++) {
            commentNodes[i].classList.remove('giscus');
        }
        // Find or create
      var commentNode = this.document.querySelector('.gk0wk-giscus[tiddler-title="' + dataTerm.replace('"', '\\"') + '"]');
      if (!commentNode) {
        commentNode = this.document.createElement('div');
        commentNode.setAttribute('class', 'giscus gk0wk-giscus');
        commentNode.setAttribute('tiddler-title', dataTerm);
        parent.insertBefore(commentNode, nextSibling);
        this.domNodes.push(commentNode);
      }
        parent.insertBefore(scriptNode, nextSibling);
        this.domNodes.push(scriptNode);
    };
    GiscusNodeWidget.prototype.execute = function() {};
    GiscusNodeWidget.prototype.refresh = function() {
        var changedAttributes = this.computeAttributes();
        if (Object.keys(changedAttributes).length > 0) {
            this.refreshSelf();
            return true;
        } else {
            return false;
        }
    };
    exports.giscus = GiscusNodeWidget;
})();