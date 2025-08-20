// delete this eventually once we figure out why using chakra-ui breaks the workaround
// for this react bug in next-contentlayer: https://github.com/contentlayerdev/contentlayer/issues/440
import React from 'react'
import ReactDOM from 'react-dom'
import { _jsx_runtime } from './jsx-runtime.cjs'

const getMDXComponent = (code, globals = {}) => {
  const scope = { React, ReactDOM, _jsx_runtime, ...globals }
  const fn = new Function(...Object.keys(scope), code)
  return fn(...Object.values(scope)).default
}

export const useMDXComponentCustom = (code, globals = {}) => {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals])
}
