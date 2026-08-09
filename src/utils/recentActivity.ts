export interface ActivityEntry {
  id: string
  name: string
  tool: string
  timestamp: number
  size: number
  resultUrl?: string // Temporary session URL
}

const DB_NAME = 'LsPdfDB'
const STORE_NAME = 'activity'
const DB_VERSION = 1

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    } catch (e) {
      reject(e)
    }
  })
}

export const addActivity = async (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
  try {
    const db = await openDB()
    const activity: ActivityEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now()
    }

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const addReq = store.add(activity)
      addReq.onerror = () => reject(addReq.error)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })

    // Cleanup: respect user setting
    const limitSetting = localStorage.getItem('historyLimit')
    const limit = limitSetting === '999' ? 999999 : parseInt(limitSetting || '10', 10)

    const db2 = await openDB()
    const tx2 = db2.transaction(STORE_NAME, 'readwrite')
    const store2 = tx2.objectStore(STORE_NAME)
    const getReq = store2.getAll()

    getReq.onsuccess = () => {
      const results = getReq.result as ActivityEntry[]
      if (results.length > limit) {
        const sorted = results.sort((a, b) => b.timestamp - a.timestamp)
        const oldest = sorted.slice(limit)
        oldest.forEach(o => store2.delete(o.id))
      }
    }
  } catch (e) {
    console.error('Failed to add activity record:', e)
  }
}

export const getRecentActivity = async (limit = 10): Promise<ActivityEntry[]> => {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)

    return new Promise((resolve) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const results = request.result as ActivityEntry[]
        resolve(results.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit))
      }
      request.onerror = () => resolve([])
    })
  } catch (e) {
    console.error('Failed to fetch recent activity:', e)
    return []
  }
}

export const clearActivity = async () => {
  try {
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.clear()
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (e) {
    console.error('Failed to clear activity:', e)
  }
}

export const updateLastSeen = () => {
  try {
    localStorage.setItem('lastSeen', String(Date.now()))
  } catch (e) {
    // Ignore storage quota error
  }
}

export const getLastSeen = () => {
  try {
    return Number(localStorage.getItem('lastSeen') || '0')
  } catch (e) {
    return 0
  }
}

