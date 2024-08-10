import fs from 'fs'

export const updateInMemory = (filepath: string, json: any) => {
    fs.writeFileSync(filepath, JSON.stringify(json, null, 2))
    return;
}
export function readFromMemory<T>(filepath: string) {
    const data = fs.readFileSync(filepath, "utf-8")
    const json = JSON.parse(data) as T;
    return json;
}
