interface data {
    type: string;
    message: string;
}
export interface IElectronAPI{
    openWeb:(url:string)=>Promise<void>,
    exit:()=>Promise<void>,
    openFile:()=>Promise<string>,
    log:(obj:data)=>Promise<void>,
    desktop:string
}

declare global{
    interface Window {
        electronAPI:IElectronAPI
    }
}