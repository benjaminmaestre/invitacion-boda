import { useState, useEffect, useRef, FormEvent } from 'react';
import { CalendarHeart, Wine, Gift, MapPin, MailOpen, Music, Pause } from 'lucide-react';

const fechaBoda = new Date("2026-05-02T12:15:00");
const numeroWhatsApp = "573107379163";

function App() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [reproduciendo, setReproduciendo] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [invitado, setInvitado] = useState('');
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [iniciandoSalida, setIniciandoSalida] = useState(false);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // CAPTURAR NOMBRE DE URL
  useEffect(() => {
    // 1. Intentar desde el pathname (ej: /Valeria)
    const path = window.location.pathname.substring(1);
    const params = new URLSearchParams(window.location.search);
    const nombreURL = path ? decodeURIComponent(path) : params.get('n');

    if (nombreURL) {
      // Reemplazar guiones por & y signos + por espacios si vienen de la URL
      const nombreLimpio = nombreURL.replace(/-/g, '&').replace(/\+/g, ' ');
      setInvitado(nombreLimpio);
      setFormData(prev => ({ ...prev, nombre: nombreLimpio }));
    }
  }, []);
  
  // COUNTDOWN
  useEffect(() => {
    const actualizarContador = () => {
      const ahora = new Date();
      const diff = fechaBoda.getTime() - ahora.getTime();

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft({ d, h, m, s });
    };

    actualizarContador();
    const interval = setInterval(actualizarContador, 1000);
    return () => clearInterval(interval);
  }, []);

  // ANIMATION OBSERVER
  useEffect(() => {
    const elementos = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [invitado, estaAbierto]);

  // MÚSICA
  const abrirInvitacion = () => {
    setIniciandoSalida(true);
    
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setReproduciendo(true);
    }

    // Secuencia de animación tipo Apple
    setTimeout(() => {
      setMostrarContenido(true);
      window.scrollTo(0, 0);
    }, 400);

    setTimeout(() => {
      setEstaAbierto(true);
    }, 1200);
  };

  const toggleMusica = () => {
    if (audioRef.current) {
      if (reproduciendo) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setReproduciendo(!reproduciendo);
    }
  };

  // CALENDARIO
  const handleCalendario = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+Cesar+%26+Lorena&dates=20260502T121500/20260502T180000&details=¡Nos+casamos!&location=Cl+30A+%23+82-11,+Belén,+Medellín";
    window.open(url, "_blank");
  };

  // RSVP
  const [formData, setFormData] = useState({
    nombre: '',
    asistencia: '',
    alergias: '',
    mensaje: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlSubmit = (e: FormEvent) => {
    e.preventDefault();
    setRsvpSuccess(true);
    setFormData({ nombre: '', asistencia: '', alergias: '', mensaje: '' });
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.asistencia) {
      alert("Por favor escribe tu nombre y selecciona si asistirás o no.");
      return;
    }

    const asistenciaTexto = formData.asistencia === "si" ? "Sí, asistiré" : "No podré asistir";
    const texto = `Hola Cesar y Lorena 💛\nMi nombre es: ${formData.nombre}\nConfirmación: ${asistenciaTexto}\nAlergias o intolerancias: ${formData.alergias || "Ninguna"}\nMensaje: ${formData.mensaje || "Sin mensaje"}`;
    
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* OVERLAY DE REVELACIÓN (APPLE DEPTH) */}
      <div className={`glass-overlay ${iniciandoSalida ? 'hidden-overlay' : ''}`}></div>

      {/* PANTALLA DE INICIO (SOBRE) */}
      {!estaAbierto && (
        <div className={`fixed inset-0 z-[2000] flex items-end justify-center bg-[#140e0a] pb-[10vh] sm:pb-[15vh] transition-all duration-1000 ${iniciandoSalida ? 'landing-exit' : ''}`}>
          <div className="absolute inset-0 bg-[url('/portada.jpeg')] bg-cover bg-[center_35%] opacity-40"></div>
          <div className="relative z-10 text-center px-6">
            <div className="w-[60px] h-[1px] bg-[#c49d6f] mb-8 opacity-40 mx-auto"></div>
            <p className="text-[#f0d2ae] tracking-[4px] text-[0.7rem] mb-4">ESTÁS INVITADO A LA BODA DE</p>
            <h2 className="font-script text-white text-[3.8rem] leading-tight mb-8 drop-shadow-lg">Cesar & Lorena</h2>
            <button 
              onClick={abrirInvitacion}
              className="bg-[#c49d6f] text-white px-12 py-5 rounded-full text-[0.75rem] tracking-[3px] apple-easing hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_50px_rgba(0,0,0,0.3)] font-bold flex items-center justify-center gap-3 mx-auto"
            >
              <MailOpen size={18} /> ABRIR INVITACIÓN
            </button>
            <div className="w-[40px] h-[1px] bg-[#c49d6f] mt-10 opacity-30 mx-auto"></div>
          </div>
        </div>
      )}

      {/* REVEAL WRAPPER */}
      <div className={mostrarContenido ? "content-reveal" : "opacity-0"}>

      {/* HERO */}
      <section className="min-h-[100svh] relative flex flex-col justify-end items-center text-center p-4 sm:p-10 overflow-hidden bg-[url('/portada.jpeg')] bg-cover bg-[center_35%] bg-no-repeat w-full max-w-none border-b-0 pb-[8vh] sm:pb-[10vh]">
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(20,14,10,0.85)] via-[rgba(20,14,10,0.4)] to-[rgba(20,14,10,0.1)]"></div>
        <div className="absolute inset-4 sm:inset-[18px] border border-[rgba(255,255,255,0.38)] pointer-events-none"></div>
        <div className="relative z-10 text-white max-w-[400px] fade-up visible w-full px-2 pt-10 opacity-[0.95]">
          <p className="text-[0.65rem] sm:text-[0.72rem] tracking-[3px] sm:tracking-[4px] mb-[18px] text-[rgba(255,244,230,0.88)] drop-shadow-md">A DONDE TÚ VAYAS, YO IRÉ</p>
          <h1 className="font-script flex items-center justify-center gap-[6px] sm:gap-[12px] text-[3.6rem] sm:text-[4.8rem] font-normal leading-[1] drop-[0_4px_20px_rgba(0,0,0,0.25)] whitespace-nowrap" style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)' }}>
            <span>Cesar</span>
            <span className="text-[1.8rem] sm:text-[1.8rem] opacity-80 mt-2 pr-2 pl-3">&</span>
            <span>Lorena</span>
          </h1>
          <p className="mt-[14px] text-[0.7rem] sm:text-[0.8rem] tracking-[4px] sm:tracking-[6px] text-[rgba(255,244,230,0.92)] drop-shadow-md">NOS CASAMOS</p>
          <a href="#bienvenida" className="inline-block mt-[20px] sm:mt-[34px] text-[2rem] text-white no-underline scroll-invite opacity-85 hover:opacity-100" aria-label="Ir abajo">&#8964;</a>
        </div>
      </section>

      {/* FECHA */}
      <section className="bg-fondo-sec py-[46px] sm:py-[56px] text-center border-b border-[#e1d6c8] fade-up w-full">
        <p className="text-[0.68rem] sm:text-[0.74rem] tracking-[5px] sm:tracking-[7px] text-acento mb-[6px]">MAYO</p>
        <p className="font-serif text-[7.5rem] sm:text-[8.5rem] font-light leading-[0.95] text-texto">2</p>
        <p className="mt-[8px] font-serif text-[1.2rem] sm:text-[1.4rem] font-normal tracking-[8px] sm:tracking-[10px] text-acento">2026</p>
      </section>

      {/* BIENVENIDA */}
      <section id="bienvenida" className="fade-up">
        {invitado ? (
          <>
            <h2 className="mb-2">
              ¡Hola {invitado.includes('&') ? (
                <>
                  {invitado.split('&')[0]}
                  <span className="text-[0.6em] sm:text-[0.5em] opacity-80 mx-1 relative -top-[0.1em]">&</span>
                  {invitado.split('&')[1]}
                </>
              ) : invitado}!
            </h2>
            <p className="mb-6">Estás invitado a nuestra boda</p>
          </>
        ) : (
          <h2>¡Estás invitado!</h2>
        )}
        <p>Con mucha alegría queremos compartir contigo uno de los días más importantes de nuestra vida. Gracias por acompañarnos en este momento tan especial.</p>

        <div className="grid grid-cols-4 gap-[8px] sm:gap-[12px] my-[24px] sm:my-[30px] mx-0 w-full bg-transparent">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="bg-gradient-to-b from-[#d8b891] to-[#c49d6f] text-white rounded-[24px] sm:rounded-full min-h-[70px] sm:min-h-[78px] flex flex-col items-center justify-center shadow-custom w-full aspect-square sm:aspect-auto p-1 sm:p-0">
              <span className="text-[1.15rem] sm:text-[1.3rem] font-bold leading-none">
                {String(value).padStart(2, '0')}
              </span>
              <label className="mt-1 text-[0.45rem] tracking-[1.2px] sm:text-[0.48rem] sm:tracking-[1.8px] scale-90 sm:scale-100 origin-top">
                {label === 'd' ? 'DÍAS' : label === 'h' ? 'HORAS' : label === 'm' ? 'MIN' : 'SEG'}
              </label>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[12px] mt-[18px]">
          <a className="btn flex items-center justify-center gap-2" href="#" onClick={handleCalendario}>
            <CalendarHeart size={18} /> AGENDAR RECORDATORIO
          </a>
          {invitado && (
            <a className="btn btn-secundario flex items-center justify-center gap-2" href="#rsvp">
              <MailOpen size={18} /> CONFIRMAR ASISTENCIA
            </a>
          )}
        </div>
      </section>

      {/* VERSÍCULO */}
      <section className="bg-gradient-to-b from-acento to-acento-oscuro border-b-0 fade-up">
        <p className="text-[#fff6eb] font-serif italic text-[1.12rem] leading-[1.9] mb-[16px]">
          “A donde tú vayas, yo iré; y donde tú pases la noche, yo pasaré la noche. Tu pueblo será mi pueblo, y tu Dios será mi Dios”.
        </p>
        <p className="text-[#f0d2ae] tracking-[3px] text-[0.74rem]">— Rut 1:16 —</p>
      </section>

      {/* CEREMONIA */}
      <section className="fade-up flex flex-col items-center">
        <div className="text-acento mb-[12px] p-4 bg-[#fbf7f2] rounded-full shadow-sm">
          <MapPin size={38} strokeWidth={1.5} />
        </div>
        <h3>DISCURSO DE BODAS</h3>
        <div className="flex justify-center items-center gap-[14px] text-[1rem] my-[10px] font-serif text-texto">
          <span>02 MAYO 2026</span>
          <span className="text-acento-claro text-[1.5rem]">|</span>
          <span>12:15 PM</span>
        </div>
        <p className="text-[#9a836a] font-bold text-[0.9rem] mb-[2px]">Salón del Reino de los Testigos de Jehová</p>
        <p className="text-[#9a836a] text-[0.88rem] mb-[2px]">Cl 30A # 82-11, Brr. Belén</p>
        <p className="text-[#9a836a] text-[0.88rem] mb-[8px]">MEDELLÍN, ANTIOQUIA</p>
        <a className="btn w-auto inline-block mt-4 px-8" href="https://www.google.com/maps/search/?api=1&query=Cl+30A+%23+82-11+Belén+Medellín+Antioquia" target="_blank" rel="noopener noreferrer">VER UBICACIÓN</a>
      </section>

      {/* CELEBRACIÓN - SOLO CON NOMBRE */}
      {invitado && (
        <section className="fade-up flex flex-col items-center">
          <div className="text-acento mb-[12px] p-4 bg-[#fbf7f2] rounded-full shadow-sm">
            <Wine size={38} strokeWidth={1.5} />
          </div>
          <h3>CELEBRACIÓN</h3>
          <div className="flex justify-center items-center gap-[14px] text-[1rem] my-[10px] font-serif text-texto">
            <span>02 MAYO 2026</span>
            <span className="text-acento-claro text-[1.5rem]">|</span>
            <span>2:00 PM</span>
          </div>
          <p className="text-[#9a836a] text-[0.88rem] mb-[8px]">Salon de Eventos Residencias Plaza Vicuña</p>
          <a className="btn w-auto inline-block mt-4 px-8" href="https://maps.app.goo.gl/9rUdQrSbBHig1hCJ8" target="_blank" rel="noopener noreferrer">VER UBICACIÓN</a>
        </section>
      )}

      {/* GALERÍA */}
      <section className="bg-[#fbf7f2] fade-up">
        <h2>Nuestros momentos</h2>
        <p className="mb-[20px]">Algunos recuerdos de nuestro camino juntos.</p>
        <div className="grid grid-cols-2 gap-[8px]">
          {[1, 2, 3, 4].map(num => (
             <img 
               key={num} 
               src={`/foto${num}.jpeg`} 
               alt={`Cesar y Lorena ${num}`} 
               className={`w-full object-cover rounded-[18px] shadow-custom transition-transform duration-250 hover:scale-[1.05] aspect-[1/1.08] ${num === 2 ? 'object-[top_20%_left_50%]' : 'object-center'}`} 
             />
          ))}
        </div>
      </section>

      {/* MAPA - SOLO CON NOMBRE */}
      {invitado && (
        <section className="bg-fondo-sec fade-up">
          <h2>Cómo llegar</h2>
          <p>Aquí puedes ubicar fácilmente el lugar de la celebración.</p>
          <div className="mt-[18px] rounded-[18px] sm:rounded-[22px] overflow-hidden shadow-custom w-full max-w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d5773.481014367276!2d-75.60854120142237!3d6.231044206456496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x8e442993c7654615%3A0x7def4caf97181644!2zVXJiYW5pemFjacOzbiBQbGF6YSBWaWN1w7FhLCBDcmEuIDgyQyAjMzBhLTEwNSwgTWVkZWxsw61uLCBCZWzDqW4sIE1lZGVsbMOtbiwgQW50aW9xdWlh!3m2!1d6.2329104!2d-75.6053775!5e0!3m2!1ses!2sco!4v1773269181740!5m2!1ses!2sco"
              className="w-full h-[220px] sm:h-[260px] border-0 block"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de la celebración"
            ></iframe>
          </div>
        </section>
      )}

      {/* REGALOS - SOLO CON NOMBRE */}
      {invitado && (
        <section className="fade-up flex flex-col items-center">
          <div className="text-acento mb-[12px] p-4 bg-[#fbf7f2] rounded-full shadow-sm">
            <Gift size={38} strokeWidth={1.5} />
          </div>
          <h3>REGALOS</h3>
          <p>Tu presencia será nuestro mejor regalo. Pero si deseas tener un detalle con nosotros, lo recibiremos con mucho cariño.</p>
          <div className="mt-[16px] text-acento flex items-center justify-center gap-2 bg-[#fbf7f2] px-6 py-3 rounded-xl border border-[#e1d6c8]">
            <MailOpen size={20} strokeWidth={2} />
            <span className="text-[0.85rem] tracking-[2px] font-bold">LLUVIA DE SOBRES</span>
          </div>
        </section>
      )}

      {/* RSVP - SOLO CON NOMBRE */}
      {invitado && (
        <section id="rsvp" className="bg-fondo-sec fade-up">
          <h3>CONFIRMAR ASISTENCIA</h3>
          <p>Por favor confirma tu asistencia antes del 15 de abril.</p>

          <form onSubmit={handlSubmit} className="flex flex-col gap-[12px] mt-[22px] text-left">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre y apellido"
              required
              className="input-field"
            />

            <div className="flex flex-col gap-[8px] sm:gap-[10px] bg-[rgba(255,255,255,0.6)] px-[12px] sm:px-[16px] py-[10px] sm:py-[14px] rounded-[14px] sm:rounded-[18px] mt-1">
              <label className="radio-group-label">
                <input type="radio" name="asistencia" value="si" checked={formData.asistencia === 'si'} onChange={handleInputChange} required className="accent-acento w-[20px] h-[20px] sm:w-[18px] sm:h-[18px]" />
                ¡Sí, ahí estaré!
              </label>
              <label className="radio-group-label">
                <input type="radio" name="asistencia" value="no" checked={formData.asistencia === 'no'} onChange={handleInputChange} className="accent-acento w-[20px] h-[20px] sm:w-[18px] sm:h-[18px]" />
                No podré asistir
              </label>
            </div>

            <input
              type="text"
              name="alergias"
              value={formData.alergias}
              onChange={handleInputChange}
              placeholder="Intolerancias / alergias (opcional)"
              className="input-field"
            />

            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
              placeholder="Déjanos un mensaje"
              rows={4}
              className="input-field"
            ></textarea>

            <button type="submit" className="btn">ENVIAR RESPUESTA</button>
            
            <a className="btn btn-whatsapp text-center" href="#" onClick={handleWhatsApp} target="_blank" rel="noopener noreferrer">
              WHATSAPP RSVP
            </a>

            {rsvpSuccess && (
              <p className="text-[#476345] mt-[12px] text-center !text-[#476345]">
                ¡Gracias por confirmar! 💛
              </p>
            )}
          </form>
        </section>
      )}

      {/* FOOTER */}
      <footer className="fade-up px-[20px] sm:px-[28px] py-[36px] sm:py-[42px] text-center bg-acento">
        <p className="text-[#ebd9c5] text-[0.8rem] sm:text-[0.88rem]">Con amor</p>
        <p className="mt-[8px] font-script text-[2rem] sm:text-[2.4rem] text-white">Cesar & Lorena</p>
      </footer>

      {/* MÚSICA BTN */}
      <audio ref={audioRef} loop src="/musica.mp3"></audio>
      <button 
        onClick={toggleMusica}
        className={`fixed right-[16px] sm:right-[22px] bottom-[16px] sm:bottom-[22px] w-[50px] sm:w-[56px] h-[50px] sm:h-[56px] rounded-full border-none text-white cursor-pointer shadow-[0_12px_26px_rgba(55,39,27,0.28)] z-[1000] outline-none touch-manipulation transition-all duration-200 hover:scale-105 hover:opacity-95 flex items-center justify-center ${reproduciendo ? 'bg-acento-oscuro' : 'bg-acento'}`}
        title="Música"
        aria-label="Reproducir música"
      >
        {reproduciendo ? <Pause size={22} fill="currentColor" /> : <Music size={22} strokeWidth={2.5} />}
      </button>
      </div>
    </>
  );
}

export default App;
