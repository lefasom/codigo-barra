import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/library';

const App = () => {
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const [result, setResult] = useState('No se ha leído ningún código de barras');

  const handleScan = async (result) => {
    if (result) {
      setResult(result.text);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  useEffect(() => {
    const initCamera = async () => {
      try {
        const videoInputDevices = await codeReader.current.listVideoInputDevices();
        let constraints;

        if (videoInputDevices && videoInputDevices.length > 0) {
          // Encuentra la cámara trasera, si está disponible
          const rearCamera = videoInputDevices.find((device) => device.label.toLowerCase().includes('rear'));

          if (rearCamera) {
            constraints = {
              video: {
                deviceId: { exact: rearCamera.deviceId },
              },
            };
          } else {
            // Si no hay cámara trasera, usa la primera cámara disponible
            constraints = {
              video: {
                deviceId: { exact: videoInputDevices[0].deviceId },
              },
            };
          }

          // Asegurarse de cerrar la cámara actual antes de usar la nueva cámara
          await codeReader.current.reset();
          await codeReader.current.decodeFromConstraints(constraints, videoRef.current, handleScan);
        } else {
          console.error('No se encontraron dispositivos de video.');
        }
      } catch (error) {
        console.error(error);
      }
    };
    initCamera();
  }, []);

  return (
    <div>
      <h1>Lector de Código de Barras</h1>
      <video ref={videoRef} style={{ width: '50%', margin: 'auto' }} onError={handleError} />
      <p>{result}</p>
    </div>
  );
};

export default App;
