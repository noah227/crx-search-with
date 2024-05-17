import {dataKey, loadEngineList, TEngineItem} from "@/options/App/App";

let engineList: TEngineItem[] = []

const createTabId = (id: string) => `crx-search-with-${id}`
const initContextMenus = async () => {
    engineList = await loadEngineList()
    try {
        chrome.contextMenus.removeAll(() => {
            engineList.forEach(engine => {
                const {id, title} = engine
                chrome.contextMenus.create({
                    id: createTabId(id),
                    contexts: ["selection"],
                    type: "normal",
                    title: `使用${title}搜索 "%s"`,
                    documentUrlPatterns: ["*://*/*"]
                })
            })
        })
    } catch (e) {

    }
}

const initContextMenusEvents = () => {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        chrome.windows.getAll().then(wList => {
            console.log(wList)
        })
        const text = info.selectionText ?? ""
        const engineId = (info.menuItemId as string).split("-").reverse()[0]
        const engine = engineList.find(item => item.id === engineId) as TEngineItem
        const targetUrl = engine.pattern.replace("%s", text)
        if (tab) {
            console.log("创建tab", engine.incognito)
            // 如果当前页面是隐私页面，新建页面继承当前页面窗口
            if(!engine.incognito || tab.incognito) {
                void chrome.tabs.create({
                    windowId: tab.windowId,
                    url: targetUrl
                })
            }
            // 隐私模式
            else {
                void chrome.windows.create({
                    incognito: true,
                    url: targetUrl
                })
            }
        }
    })
}

(() => {
    console.log("THIS IS background")
    void initContextMenus()
    initContextMenusEvents()
    chrome.storage.onChanged.addListener((changes) => {
        const {newValue: n, oldValue: o} = changes[dataKey]
        engineList = Object.values(n) as TEngineItem[]
        // 直接全部更新contextMenus
        void initContextMenus()
    })
})()
