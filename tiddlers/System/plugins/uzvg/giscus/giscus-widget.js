/*\
title: $:/plugins/uzvg/giscus/widget.js
type: application/javascript
module-type: widget
Giscus widget with isolated iframe height management
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

        // 获取属性
        const dataRepo = this.getAttribute('data-repo', "");
        const dataRepoId = this.getAttribute('data-repo-id', "");
        const dataCategory = this.getAttribute('data-category', "Announcements");
        const dataCategoryId = this.getAttribute('data-category-id', "");
        const dataTerm = this.getAttribute('data-term', "");
        const dataStrict = this.getAttribute('data-strict', "1");
        const dataReactionsEnabled = this.getAttribute('data-reactions-enabled', "1");
        const emitMetadata = this.getAttribute('emit-metadata', "0");
        const inputPosition = this.getAttribute('data-input-position', "top");
        const dataTheme = this.getAttribute('data-theme', "preferred_color_scheme");
        const dataLang = this.getAttribute('data-lang', "en");
        const dataLoading = this.getAttribute('data-loading', "eager");

        // 检查必要参数
        if ([dataRepo, dataRepoId, dataCategoryId, dataTerm].some(value => value === "")) {
            console.error("Giscus widget: 缺少必要参数");
            return;
        }

        // 创建唯一的容器ID
        const containerId = `giscus-container-${dataTerm.replace(/\s+/g, '-')}-${Date.now()}`;

        // 创建评论区容器
        var commentNode = this.document.createElement('div');
        commentNode.setAttribute('id', containerId);
        commentNode.setAttribute('class', 'giscus');
        commentNode.setAttribute('tiddler-title', dataTerm);
        parent.insertBefore(commentNode, nextSibling);
        this.domNodes.push(commentNode);

        // 创建 giscus 脚本节点
        var scriptNode = this.document.createElement('script');
        scriptNode.setAttribute("src", "https://giscus.app/client.js");
        scriptNode.setAttribute("data-repo", dataRepo);
        scriptNode.setAttribute("data-repo-id", dataRepoId);
        scriptNode.setAttribute("data-category", dataCategory);
        scriptNode.setAttribute("data-category-id", dataCategoryId);
        scriptNode.setAttribute("data-mapping", "specific");
        scriptNode.setAttribute("data-term", dataTerm);
        scriptNode.setAttribute("data-strict", dataStrict);
        scriptNode.setAttribute("data-reactions-enabled", dataReactionsEnabled);
        scriptNode.setAttribute("data-emit-metadata", emitMetadata);
        scriptNode.setAttribute("data-input-position", inputPosition);
        scriptNode.setAttribute("data-theme", dataTheme);
        scriptNode.setAttribute("data-lang", dataLang);
        scriptNode.setAttribute("data-loading", dataLoading);
        scriptNode.setAttribute("crossorigin", "anonymous");
        scriptNode.setAttribute("async", "true");

        // 添加自定义高度管理脚本
        var heightScript = this.document.createElement('script');
        heightScript.textContent = `
            (function() {
                var container = document.getElementById('${containerId}');
                if (!container) return;

                function handleHeightMessage(event) {
                    if (event.origin !== 'https://giscus.app') return;
                    var iframe = container.querySelector('iframe.giscus-frame');
                    if (!iframe || event.source !== iframe.contentWindow) return;

                    var data = event.data;
                    if (data && data.giscus && data.giscus.height) {
                        iframe.style.height = data.giscus.height + 'px';
                        console.log('Updated height for ${containerId}: ' + iframe.style.height);
                    }
                }

                // 添加事件监听器
                window.addEventListener('message', handleHeightMessage, false);

                // 清理函数（可选，用于移除监听器）
                container.dataset.eventCleanup = function() {
                    window.removeEventListener('message', handleHeightMessage);
                };
            })();
        `;

        parent.insertBefore(scriptNode, nextSibling);
        parent.insertBefore(heightScript, nextSibling);
        this.domNodes.push(scriptNode, heightScript);
    };

    GiscusNodeWidget.prototype.execute = function() {};

    GiscusNodeWidget.prototype.refresh = function(changedTiddlers) {
        var changedAttributes = this.computeAttributes();
        if (Object.keys(changedAttributes).length > 0) {
            this.refreshSelf();
            return true;
        }
        return false;
    };

    exports.giscus = GiscusNodeWidget;
})();