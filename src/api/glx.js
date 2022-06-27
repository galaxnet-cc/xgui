import axios from 'axios'
import { useTargetStore } from '@/stores/target'

// Init baseURL using default value.
let service = null

const ensureService = () => {
  if (service === null) {
    let targetStore = useTargetStore()
    service = axios.create({
      baseURL: 'http://' + targetStore.targetIp + ':' + targetStore.targetPort + '/public/v1/config',
      timeout: 5000
    })
  }
}

export const updateApiEndpoint = () => {
  let targetStore = useTargetStore()
  // Generate a new service instance using new config.
  service = axios.create({
    baseURL: 'http://' + targetStore.targetIp + ':' + targetStore.targetPort + '/public/v1/config',
    timeout: 5000
  })
}

export const getObjects = (objectName) => {
  ensureService()
  return service({
    // turn to plural URL Name
    url: objectName+'s',
    method: 'get'
  })
}

export const getObjectById = (objectName, objId) => {
  ensureService()
  return service({
    url: objectName + '/' + objId,
    method: 'get'
  })
}

export const updateObjectById = (objectName, objId, data) => {
  ensureService()
  return service({
    url: objectName + '/' + objId,
    method: 'patch',
    data: data
  })
}

export const deleteObjectById = (objectName, objId, data) => {
  ensureService()
  return service({
    url: objectName + '/' + objId,
    method: 'delete',
    data: data
  })
}

export const createObject = (objectName, data) => {
  ensureService()
  return service({
    url: objectName,
    method: 'post',
    data: data
  })
}
