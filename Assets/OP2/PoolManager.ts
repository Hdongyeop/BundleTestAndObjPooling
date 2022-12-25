import { GameObject, Transform } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Poolable from './Poolable';

class Pool
{
    public original: GameObject;
    public root: Transform;

    private poolStack: Array<Poolable>;

    Init(original: GameObject, count: int)
    {
        this.poolStack = new Array<Poolable>();

        this.original = original;
        this.root = new GameObject().transform;
        this.root.name = `${original.name}_Root`;

        for(let i = 0; i < count; i++)
        {
            this.Push(this.Create());
        }
    }

    Create(): Poolable
    {
        let go: GameObject = GameObject.Instantiate(this.original, this.root) as GameObject;
        go.name = this.original.name;
        return go.GetComponent<Poolable>();
    }

    Push(poolable: Poolable)
    {
        if(!poolable) return;

        poolable.transform.SetParent(this.root);
        poolable.gameObject.SetActive(false);
        poolable.isUsing = false;

        this.poolStack.push(poolable);
    }

    Pop() : Poolable
    {
        let poolable: Poolable;
        if(this.poolStack.length > 0)
            poolable = this.poolStack.pop();
        else
            poolable = this.Create();

        poolable.gameObject.SetActive(true);
        poolable.isUsing = true;

        return poolable;
    }
}

export default class PoolManager extends ZepetoScriptBehaviour {

    private defaultPoolCount = 5;
    private poolMap: Map<string, Pool>;
    private root: Transform;

    //#region [ Singleton ]
    
    private static instance: PoolManager;

    static GetInstance(): PoolManager
    {
        if(!PoolManager.instance)
        {
            const targetObj = GameObject.Find("@PoolManager");
            if (targetObj) PoolManager.instance = targetObj.GetComponent<PoolManager>();
        }

        return PoolManager.instance;
    }
    
    //#endregion
    
    Awake()
    {        
        if(!this.root)
        {
            // console.log(`[ TEST ] PoolManager Awake`);
            this.poolMap = new Map<string, Pool>();
            this.root = new GameObject().transform;
            this.root.name = `PoolRoot`;
        }
    }

    CreatePool(original: GameObject, count: int)
    {
        let pool: Pool = new Pool();
        pool.Init(original, count);
        pool.root.SetParent(this.root);

        this.poolMap.set(original.name, pool);
    }

    Push(poolable: Poolable)
    {
        let name:string = poolable.gameObject.name;
        if(this.poolMap.has(name) == false)
        {
            GameObject.Destroy(poolable.gameObject);
            return;
        }

        this.poolMap.get(name).Push(poolable);
    }
    
    Pop(original: GameObject): Poolable
    {
        if(this.poolMap.has(original.name) == false)
        {
            console.log(`[ TEST ] createpool`);
            this.CreatePool(original, this.defaultPoolCount);
        }
        return this.poolMap.get(original.name).Pop();
    }

    GetOriginal(name: string) : GameObject
    {
        if(this.poolMap.has(name) == false)
            return null;
        return this.poolMap[name].original;
    }

    Clear()
    {
        const childCnt = this.root.childCount;
        for(let i = 0; i < childCnt; i++)
            GameObject.Destroy(this.root.GetChild(i));

        this.poolMap.clear();
    }
}