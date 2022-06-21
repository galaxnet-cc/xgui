import axios from 'axios'
import { useTargetStore } from '@/stores/target'

// Init baseURL using default value.
let baseURL = 'http://127.0.0.1:8080/public/v1/config'
const service = axios.create({
  baseURL: baseURL,
  timeout: 5000
})


// http request 拦截器
service.interceptors.request.use(
    config => {
        config.headers = {
            'Content-Type': 'application/json',
            ...config.headers
        }
        return config
    },
    error => {
        return error
    }
)

export const updateApiEndpoint = () => {
  let targetStore = useTargetStore()

  // Update service baseURL.
  service.baseURL = 'http://' + targetStore.targetIp + ':' + targetStore.targetPort + '/public/v1/config'

  console.log("api updated to: " + service.baseURL)
}

export const getObjects = (objectName) => {
  return service({
    // turn to plural URL Name
    url: objectName+'s',
    method: 'get'
  })
}
