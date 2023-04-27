import React from 'react';
import ReactDOM from 'react-dom';

export const getMDXComponent = (code: string, globals: object = {}): any => {
  const scope = { React, ReactDOM, ...globals };
  const fn = new Function(...Object.keys(scope), code);
  return fn(...Object.values(scope)).default;
};

export const useMDXComponentCustom = (code: string, globals: object = {}): any => {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals]);
};
