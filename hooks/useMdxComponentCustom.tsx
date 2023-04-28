// hooks/useMDXComponent.js
import React from 'react';
import ReactDOM from 'react-dom';
import { _jsx_runtime } from './jsx-runtime.cjs';

const getMDXComponent = (code, globals = {}) => {
  const scope = { React, ReactDOM, _jsx_runtime, ...globals };
  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope)).default;
};

export const useMDXComponentCustom = (code, globals = {}) => {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals]);
};




// import React from 'react';
// import ReactDOM from 'react-dom';
// import { _jsx_runtime as _jsx } from '../jsx-runtime';

// export const getMDXComponent = (code: string, globals: object = {}): any => {
//   const scope = { React, ReactDOM, _jsx, ...globals };
//   const fn = new Function(...Object.keys(scope), code);
//   return fn(...Object.values(scope)).default;
// };

// export const useMDXComponentCustom = (code: string, globals: object = {}): any => {
//   return React.useMemo(() => getMDXComponent(code, globals), [code, globals]);
// };