import { GameObject, Input, KeyCode } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import PoolManager from './PoolManager'
import ResourceManager from './ResourceManager'

export default class UsingPool extends ZepetoScriptBehaviour {

    golist: GameObject[];
    
    Start() {
        this.golist = new Array<GameObject>();
    }

    Update()
    {
        if(Input.GetKeyDown(KeyCode.L))
        {
          this.golist.push(ResourceManager.GetInstance().Instantiate(`ObjectPool/PoolObject`, null));
        }

        if(Input.GetKeyDown(KeyCode.O))
        {
            ResourceManager.GetInstance().Destroy(this.golist.pop());
        }
    }
}