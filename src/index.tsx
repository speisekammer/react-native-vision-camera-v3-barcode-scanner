import React, { forwardRef, type ForwardedRef } from 'react';
import {
  Camera as VisionCamera,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { useRunInJS } from 'react-native-worklets-core';
import { scanBarcodes } from './scanBarcodes';
import type {
  CameraTypes,
  Frame,
  FrameProcessor,
  BarcodeDataMap,
} from './types';

export { scanBarcodes } from './scanBarcodes';
export type { BarcodeData, BarcodeDataMap } from './types';

export const Camera = forwardRef(function Camera(
  props: CameraTypes,
  ref: ForwardedRef<any>
) {
  const { callback, device, options } = props;
  const processWorklets = useRunInJS((data: BarcodeDataMap): void => {
    callback(data);
  }, []);
  const frameProcessor: FrameProcessor = useFrameProcessor(
    (frame: Frame): void => {
      'worklet';
      const data = scanBarcodes(frame, options);
      processWorklets(data);
    },
    []
  );
  return (
    !!device && (
      <VisionCamera ref={ref} frameProcessor={frameProcessor} {...props} />
    )
  );
});
