import { GameObject, Resources, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Poolable from './Poolable';
import PoolManager from './PoolManager';

export default class ResourceManager extends ZepetoScriptBehaviour {

    //#region [ Singleton ]
    
    private static instance: ResourceManager;

    static GetInstance(): ResourceManager
    {
        if(!ResourceManager.instance)
        {
            const targetObj = GameObject.Find("@ResourceManager");
            if (targetObj) ResourceManager.instance = targetObj.GetComponent<ResourceManager>();
        }

        return ResourceManager.instance;
    }
    
    //#endregion

    Instantiate(path: string, parent: Transform) : GameObject
    {
        let original = Resources.Load<GameObject>(path);
        if(!original) return null;

        if(original.GetComponent<Poolable>())
            return PoolManager.GetInstance().Pop(original).gameObject;
        
        let go: GameObject = GameObject.Instantiate(original, parent) as GameObject;
        go.name = original.name;

        return go;
    }

    Destroy(go: GameObject)
    {
        if(!go) return;

        let poolable: Poolable = go.GetComponent<Poolable>();
        if(poolable)
        {
            PoolManager.GetInstance().Push(poolable);
            return;
        }
        
        GameObject.Destroy(go);
    }
}