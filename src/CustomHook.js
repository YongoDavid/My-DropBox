import { useReducer, useEffect } from "react"
import { useAuthenticate } from "./Context"
import { supabase } from "./supabaseConfig"

const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDERS: "set-child-folders",
  SET_CHILD_FILES: "set-child-files",
}

export const ROOT_FOLDER = { name: "Root Folder", id: null, path: [] }

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SELECT_FOLDER:
      return {
        folderId: payload.folderId,
        folder: payload.folder,
        childFiles: [],
        childFolders: [],
      }
    case ACTIONS.UPDATE_FOLDER:
      return {
        ...state,
        folder: payload.folder,
      }
    case ACTIONS.SET_CHILD_FOLDERS:
      return {
        ...state,
        childFolders: payload.childFolders,
      }
    case ACTIONS.SET_CHILD_FILES:
      return {
        ...state,
        childFiles: payload.childFiles,
      }
    default:
      return state
  }
}

export function useCustomHook(folderId = null, folder = null) {
  const [state, dispatch] = useReducer(reducer, {
    folderId,
    folder,
    childFolders: [],
    childFiles: [],
  })
  const { currentUser } = useAuthenticate()

  useEffect(() => {
    dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } })
  }, [folderId, folder])

  useEffect(() => {
    if (folderId == null) {
      return dispatch({
        type: ACTIONS.UPDATE_FOLDER,
        payload: { folder: ROOT_FOLDER },
      })
    }

    const getFolderDoc = async () => {
      try {
        const { data, error } = await supabase
          .from('folders')
          .select('*')
          .eq('id', folderId)
          .single()

        if (error) throw error

        if (data) {
          dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: { id: data.id, ...data } },
          })
        } else {
          dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: ROOT_FOLDER },
          })
        }
      } catch (error) {
        console.error("Error fetching folder:", error)
        dispatch({
          type: ACTIONS.UPDATE_FOLDER,
          payload: { folder: ROOT_FOLDER },
        })
      }
    }

    getFolderDoc()
  }, [folderId])

  useEffect(() => {
    if (!currentUser) return

    const fetchFolders = async () => {
      try {
        let query = supabase
          .from('folders')
          .select('*')
          .eq('user_id', currentUser.id)

        // Handle root folder case
        if (folderId === null) {
          query = query.is('parent_id', null)
        } else {
          query = query.eq('parent_id', folderId)
        }

        const { data, error } = await query

        if (error) throw error

        dispatch({
          type: ACTIONS.SET_CHILD_FOLDERS,
          payload: { childFolders: data || [] },
        })
      } catch (error) {
        console.error("Error fetching folders:", error)
        dispatch({
          type: ACTIONS.SET_CHILD_FOLDERS,
          payload: { childFolders: [] },
        })
      }
    }

    fetchFolders()

    // Set up real-time subscription
    const folderSubscription = supabase
      .channel('folders-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'folders',
          filter: folderId === null 
            ? `user_id=eq.${currentUser.id}`
            : `parent_id=eq.${folderId} AND user_id=eq.${currentUser.id}`
        },
        fetchFolders
      )
      .subscribe()

    return () => {
      folderSubscription.unsubscribe()
    }
  }, [folderId, currentUser])

  useEffect(() => {
    if (!currentUser) return

    const fetchFiles = async () => {
      try {
        let query = supabase
          .from('files')
          .select('*')
          .eq('user_id', currentUser.id)

        // Handle root folder case
        if (folderId === null) {
          query = query.is('folder_id', null)
        } else {
          query = query.eq('folder_id', folderId)
        }

        const { data, error } = await query

        if (error) throw error

        dispatch({
          type: ACTIONS.SET_CHILD_FILES,
          payload: { childFiles: data || [] },
        })
      } catch (error) {
        console.error("Error fetching files:", error)
        dispatch({
          type: ACTIONS.SET_CHILD_FILES,
          payload: { childFiles: [] },
        })
      }
    }

    fetchFiles()

    // Set up real-time subscription
    const fileSubscription = supabase
      .channel('files-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'files',
          filter: folderId === null 
            ? `user_id=eq.${currentUser.id}`
            : `folder_id=eq.${folderId} AND user_id=eq.${currentUser.id}`
        },
        fetchFiles
      )
      .subscribe()

    return () => {
      fileSubscription.unsubscribe()
    }
  }, [folderId, currentUser])

  return state
}