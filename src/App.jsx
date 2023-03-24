import { useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import Send from './assets/send.png';
import Loader from './components/Loader';


function App() {
  const [telefonos, setTelefonos] = useState([]);
  const [textareaNumeros, setTextAreaNumeros] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const agregarNumeros = () => {
    const arrayNumeros = textareaNumeros.trim().split('\n');
    setTelefonos(arrayNumeros);
  }

  const ejecutarEnvio = () => {
    event.preventDefault();
    setLoading(true);
    let noEnviados = 0;
    let enviados = 0;
    telefonos.map(async telefono => {
      const start = Date.now();
      try {
        // setTimeout(async () => {
          const response = await axios.post('http://localhost:3001/lead', {
            phone: telefono,
            message: message
          });

          if (response.status == 200) {
            enviados = enviados + 1;
          }
        // }, 2000);
      } catch (error) {
        console.log(error)
        noEnviados++;
      }
      const mensajes = enviados + noEnviados;
      if(mensajes == telefonos.length){
        setLoading(false);
        Swal.fire({
          title: 'Los mensajes se han enviado correctamente',
          icon: 'success'
        }).then(result => {
          if(result.isConfirmed){
            reset();
          }
        });
      }
      const end = Date.now();
      console.log('Diferencia: ', end - start);
    });
    console.log(enviados + noEnviados, ' mensajes enviados');
  }

  const reset = () => {
    setTelefonos([]);
    setMessage('');
    setTextAreaNumeros('');
    setLoading(false);
  }

  return (
    <div className='h-screen bg-gray-50 w-full flex gap-5 justify-between'>
      {/* PERSONAS */}

      <div className='w-4/12 pl-3 py-5 border my-5 ml-2 rounded bg-white overflow-y-auto'>
        <div className='flex flex-col'>
          <label htmlFor="phone" className='font-bold'>Número Teléfonico:</label>
          <textarea
            id='phone'
            name='phone'
            rows={10}
            placeholder='Escribe el número de la persona'
            className='border rounded px-1 py-1 outline-none focus:border-blue-600 focus:border-2 pl-3 mr-2'
            value={textareaNumeros}
            onChange={e => setTextAreaNumeros(e.target.value)}
          />
        </div>
        <div className='my-4 mr-2'>
          <button
            type='button'
            className='w-full border bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md'
            onClick={() => agregarNumeros()}
          >
            Agregar Número Teléfonico
          </button>
        </div>
        <hr />
        <div className='pl-3 mt-4'>
          {telefonos.map((telefono, key) => (
            <div key={key} className='my-1 flex gap-2'>
              <span className='font-bold'>{`${key + 1})`}</span>
              <p>{telefono}</p>
            </div>
          ))}
        </div>
      </div>
      {/* MENSAJE Y ENVIAR */}
      <div className='w-8/12 px-3 py-5 border my-5 mx-3 rounded bg-white'>
        <div className='flex flex-col'>
          <label htmlFor="message" className='font-bold'>Mensaje:</label>
          <input
            id='message'
            name='message'
            placeholder='Mensaje a enviar...'
            type='text'
            className='border rounded px-1 py-1 outline-none focus:border-blue-600 focus:border-2 pl-3 mr-2'
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
        <div className='my-2 flex justify-end mx-2'>
          <button
            type='button'
            className='border bg-blue-600 hover:bg-blue-700 text-white px-5 py-1 rounded-md flex items-center justify-center gap-1'
            onClick={() => ejecutarEnvio()}
          >
            Enviar
            <img src={Send} alt="send" width={18} />
          </button>
        </div>
        {loading && (
          <Loader />
        )}
      </div>
    </div>
  )
}

export default App
