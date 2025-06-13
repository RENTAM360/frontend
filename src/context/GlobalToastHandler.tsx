"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useSnackbar } from "notistack"
import { RootState } from "../../src/lib/redux/store"
import { clearMessages } from "../../src/lib/redux/slices/authSlice"

const GlobalToastHandler = () => {
  const { error, successMessage } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (successMessage) {
      enqueueSnackbar(successMessage, { variant: "success" })
      dispatch(clearMessages())
    }
    if (error) {
      enqueueSnackbar(error, { variant: "error" })
      dispatch(clearMessages())
    }
  }, [error, successMessage, dispatch, enqueueSnackbar])

  return null
}

export default GlobalToastHandler
