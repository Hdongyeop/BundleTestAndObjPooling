import { Debug, GameObject, Resources } from 'UnityEngine';
import { Button, InputField } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'


/**
 *  오브젝트 풀링 규칙!
 *  프리팹 이름과 Inspector 창에서 string Nanme 값 통일
 *  Resources/ObjectPool 안에 프리팹 넣어 놓기!!
 */
export default class ObjectPool extends ZepetoScriptBehaviour {

    public static Instance:ObjectPool;

    @SerializeField() private objectPoolPrefab:string[]; //오브젝트 스트링값을 받아오기 위한 배열
    private objectPoolDic:Map<string,GameObject>; //오브젝트를 생성하기 위한 Dic
    private poolingObjectQueues:Map<string, Array<GameObject>>; // 생성한 오브젝트를 관리하기 위한 Dic

    Awake()
    {
        ObjectPool.Instance = this;

        this.objectPoolDic = new Map<string,GameObject>();
        this.poolingObjectQueues = new Map<string,Array<GameObject>>();

        Debug.Log(this.objectPoolPrefab.length);
        for(let i = 0 ; i< this.objectPoolPrefab.length;i++)
        {
            this.objectPoolDic.set(this.objectPoolPrefab[i], Resources.Load<GameObject>(`ObjectPool/${this.objectPoolPrefab[i]}`));
            this.poolingObjectQueues.set(this.objectPoolPrefab[i] , new Array<GameObject>());
            Debug.Log("object Pool" + i);
        }

    }


    private CreateNewObject(name:string):GameObject 
    {

        let newObj = GameObject.Instantiate(this.objectPoolDic.get(name)) as GameObject;

        newObj.gameObject.SetActive(false);

        newObj.transform.SetParent(this.transform);

        return newObj;
    }

    GetObject(name:string):GameObject 
    {
        if (this.poolingObjectQueues.get(name).length > 0) {
            let obj = this.poolingObjectQueues.get(name).pop();
            obj.transform.SetParent(null);
            return obj;
        }
        else //비어있으면 새로 생성
        {
            var newObj = this.CreateNewObject(name);
            newObj.transform.SetParent(null);
            return newObj;
        }
    }

    public ReturnObject(name:string,  obj:GameObject) :void
    {
        obj.gameObject.SetActive(false);
        obj.transform.SetParent(this.transform);
        this.poolingObjectQueues.get(name).unshift(obj);
    }

    
}