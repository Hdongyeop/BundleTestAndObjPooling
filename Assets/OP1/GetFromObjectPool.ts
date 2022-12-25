import { GameObject, Input, KeyCode } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import ObjectPool from './ObjectPool'

export default class GetFromObjectPool extends ZepetoScriptBehaviour {

    private go: GameObject;
    
    Start()
    {
        // let go: GameObject = ObjectPool.Instance.GetObject(`PoolObject`);
    }

    Update()
    {
        if(Input.GetKeyDown(KeyCode.A))
        {
            this.go = ObjectPool.Instance.GetObject(`PoolObject`);
        }

        if(Input.GetKeyDown(KeyCode.D))
        {
            ObjectPool.Instance.ReturnObject(`PoolObject`, this.go);
        }
    }

}