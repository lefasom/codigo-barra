import React, { useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeReader = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const constraints = { video: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;

        codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            console.log('Barcode detected:', result.getText());
          }
          if (err) {
            console.error('Error reading barcode:', err);
          }
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startScanner();

    return () => {
      codeReader.reset();
    };
  }, []);

  return <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />;
};

export default BarcodeReader;
