const useraction = {}
const forwardsetTime = {}
const deliverysetTime = {}
export function getUserAction(key){
    return useraction[key]
}
export function setUserAction(key,val){
    useraction[key]=val
}
export function deleteUserAction(key){
    delete useraction[key]
}
export function getUserTime(key){
    return forwardsetTime[key]
}
export function setUserTime(key,val){
    forwardsetTime[key]=val
}
export function deleteUserTime(key){
    delete forwardsetTime[key]
}
export function getUserDelivery(key){
    return deliverysetTime[key]
}
export function setUserDelivery(key,val){
    deliverysetTime[key]=val
}
export function deleteUserDelivery(key){
    delete deliverysetTime[key]
}