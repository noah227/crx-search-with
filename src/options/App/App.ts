export type TEngineItem = {
    id: string
    title: string
    pattern: string
    incognito?: boolean
}

export const dataKey = "ENGINE-LIST"

export const loadEngineList = (): Promise<TEngineItem[]> => new Promise((resolve, reject) => {
    chrome.storage.local.get(dataKey).then(res => {
        const dataList = (Object.values(res[dataKey]) || []) as TEngineItem[]
        console.log("ENGINEs LOADED", dataList, typeof dataList)
        resolve(dataList)
    })
})
