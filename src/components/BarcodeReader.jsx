import React, { useRef, useEffect } from 'react';
import Quagga from 'quagga';

const BarcodeReader = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = {
      video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });

    Quagga.init({
      inputStream: {
        constraints: {
          video: true,
        },
        area: {
          top: '0%',
          right: '0%',
          left: '0%',
          bottom: '0%',
        },
        singleChannel: false,
      },
      locate: true,
      decoder: {
        readers: ['ean_reader'], // Specify the barcode format you want to read (EAN in this case)
      },
    }, (err) => {
      if (err) {
        console.error('Error initializing Quagga:', err);
      } else {
        Quagga.start();
      }
    });

    Quagga.onDetected(handleBarcodeDetected);

    return () => {
      Quagga.offDetected(handleBarcodeDetected);
      Quagga.stop();
    };
  }, []);

  const handleBarcodeDetected = (result) => {
    if (result && result.codeResult && result.codeResult.code) {
      alert(`Barcode detected: ${result.codeResult.code}`);
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default BarcodeReader;
