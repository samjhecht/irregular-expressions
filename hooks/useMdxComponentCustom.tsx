import React from 'react';
import ReactDOM from 'react-dom';
import { _jsx_runtime as _jsx } from '../jsx-runtime.cjs';

export const getMDXComponent = (code: string, globals: object = {}): any => {
  const scope = { React, ReactDOM, _jsx, ...globals };
  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope)).default;
};

export const useMDXComponentCustom = (code: string, globals: object = {}): any => {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals]);
};

// import { useMemo } from 'react';
// import { _jsx_runtime as _jsx } from '../jsx-runtime.cjs';
// import ReactDOM from 'react-dom';

// export const getMDXComponent = (code: string, globals: object = {}): any => {
//   const scope = { _jsx, ReactDOM, ...globals };
//   const fn = new Function(...Object.keys(scope), code);
//   return fn(...Object.values(scope)).default;
// };

// export const useMDXComponentCustom = (code: string, globals: object = {}): any => {
//   return useMemo(() => getMDXComponent(code, globals), [code, globals]);
// };
