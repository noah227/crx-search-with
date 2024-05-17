(() => {
    type TEngineItem = {
        id: string
        title: string
        pattern: string
        incognito?: boolean
    }
    const engineList: TEngineItem[] = [
        {
            id: "Baidu",
            title: "百度",
            pattern: "https://www.baidu.com/s?wd=%s"
        },
        {
            id: "BaiduIncognito",
            title: "百度（隐私模式）",
            pattern: "https://www.baidu.com/s?wd=%s",
            incognito: true
        },
        {
            id: "Bing",
            title: "Bing",
            pattern: "https://www.bing.com/search?q=%s"
        },
        {
            id: "BingIncognito",
            title: "BingIncognito（隐私模式）",
            pattern: "https://www.bing.com/search?q=%s",
            incognito: true
        }
    ]
    try {
        chrome.contextMenus.removeAll(() => {
            engineList.forEach(engine => {
                const {id, title} = engine
                chrome.contextMenus.create({
                    id: `crx-search-with-${id}`,
                    contexts: ["selection"],
                    type: "normal",
                    title: `使用${title}搜索 "%s"`,
                    documentUrlPatterns: ["*://*/*"]
                })
            })
        })

        chrome.contextMenus.onClicked.addListener((info, tab) => {
            chrome.windows.getAll().then(wList => {
                console.log(wList)
            })
            const text = info.selectionText ?? ""
            const engineId = (info.menuItemId as string).split("-").reverse()[0]
            const engine = engineList.find(item => item.id === engineId) as TEngineItem
            const targetUrl = engine.pattern.replace("%s", text)
            if (tab) {
                // 隐私模式
                if (engine.incognito) {
                    void chrome.windows.create({
                        incognito: true,
                        url: targetUrl
                    })
                } else {
                    void chrome.tabs.create({
                        windowId: tab.windowId,
                        url: targetUrl
                    })
                }
            }
        })
    } catch (e) {

    }
})()
