import { AssetBundle, GameObject, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class LoadManager extends ZepetoScriptBehaviour {

    Start() 
    {    
        console.log(`test1`);

        let asset: AssetBundle = AssetBundle.LoadFromFile("Bundle/bird");

        console.log(`test2`);
        
        
        if(!asset)
        {
            console.log(`Bundle 폴더에 에셋번들이 없습니다`);
            return;
        }

        let bird = asset.LoadAsset<GameObject>(`Omoknuni`);
        let img = GameObject.Instantiate(bird) as GameObject;
        img.transform.position = Vector3.zero;
    }

}