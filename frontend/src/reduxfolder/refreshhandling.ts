export const saveInLocal = (obj:Object)=>{
    localStorage.setItem("persistedData",JSON.stringify(obj));
}

export const retrieveFromLocal=():object=>{
    const persisted = localStorage.getItem("persistedData");
    if(persisted==null||persisted==undefined)return {user:{name:"",email:"",isLoggedIn:false,id:""}};
    const persistedjson = JSON.parse(persisted);
    return persistedjson;
}