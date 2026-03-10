import React, { useState, useEffect, useMemo } from 'react';
import {
    Shield, Heart, User, Activity, ChevronRight, RefreshCw,
    Search, AlertCircle, CheckCircle, Info, ArrowLeft, Brain,
    Star, Zap, Lock, History, Briefcase, Users, MessageCircle, Eye,
    RotateCcw, Target, Lightbulb, BookOpen, Quote, Sparkles, Anchor,
    Clock, Wind, UserCheck, Award, ZapOff, Flame, Snowflake,
    Baby, Compass
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';


const cn = (...inputs) => twMerge(clsx(inputs));


// --- CONFIGURACIÓN MAESTRA DE LAS 5 HERIDAS ---
const WOUNDS_CONFIG = {
    rechazo: {
        name: "Rechazo",
        mask: "Huidizo",
        survivalResponse: "Huir",
        survivalDesc: "Tu sistema nervioso entra en modo escape. Buscas desaparecer, desconectarte emocionalmente o disociarte para no sentir el dolor del desprecio.",
        color: "#6366f1",
        longDesc: "Esta herida golpea el derecho fundamental a EXISTIR. El adulto 'Huidizo' vive en una ambivalencia constante: desea profundamente ser visto pero le aterra ser juzgado, lo que lo lleva a retirarse antes de ser rechazado.",
        genesis: "Se origina desde la concepción hasta el primer año de vida, generalmente vinculado al progenitor del mismo sexo. Ocurre cuando el bebé percibe que su llegada no es deseada o que su ser no es bienvenido, aprendiendo que 'estorba'.",
        awareness: "Tu sanación comienza al validar que tienes derecho a ocupar espacio sin pedir permiso. El rechazo que temes afuera es el reflejo del rechazo que tú te das al intentar ser invisible. Quedarte es tu mayor acto de libertad.",
        fear: "El Pánico a la invisibilidad o al desprecio total.",
        healingKey: "Validar tu derecho a ocupar espacio físico y emocional.",
        oppositeAction: "Quedarte y ocupar tu espacio. Expresar tu opinión aunque sientas el impulso de desaparecer.",
        reframe: "Merezco estar aquí. Mi existencia tiene un valor intrínseco e innegable."
    },
    abandono: {
        name: "Abandono",
        mask: "Dependiente",
        survivalResponse: "Reaccionar",
        survivalDesc: "Tu sistema nervioso busca conexión de forma ansiosa y urgente. Te vuelves demandante, complaciente o dramático para asegurar que el otro no se vaya.",
        color: "#ec4899",
        longDesc: "Nace de una falta de nutrición afectiva. El 'Dependiente' desarrolla una 'hipotonía' emocional: siente que necesita el soporte de otros para sostener su propia valía y existencia.",
        genesis: "Surge entre el primer y tercer año de vida, usualmente con el progenitor del sexo opuesto. Se da por una carencia real o percibida de apoyo o presencia. El niño siente que no puede valerse solo y que la soledad equivale a la muerte.",
        awareness: "Tu hambre de atención es en realidad una falta de auto-apoyo. Buscas que los demás llenen un vacío que solo tú puedes colmar siendo tu propio protector. Sanar es descubrir quién eres cuando nadie te mira.",
        fear: "La Soledad absoluta / Dejar de ser necesario para alguien.",
        healingKey: "Autonomía emocional. Aprender a ser tu propio refugio seguro.",
        oppositeAction: "Pasar tiempo a solas de calidad. Poner un límite claro aunque temas que eso aleje a la persona.",
        reframe: "Yo me acompaño y me sostengo. Mi seguridad nace de mi propio centro."
    },
    humillacion: {
        name: "Humillación",
        mask: "Masoquista",
        survivalResponse: "Paralizarse",
        survivalDesc: "Te bloqueas y absorbes el impacto emocional. Te vuelves pesado, lento y excesivamente servicial, cargando con problemas ajenos para evitar la vergüenza.",
        color: "#f59e0b",
        longDesc: "Es la herida de la LIBERTAD. El 'Masoquista' se castiga a sí mismo volviéndose el servidor del mundo, ocultando sus deseos 'sucios' tras una fachada de sacrificio infinito.",
        genesis: "Se despierta entre el primer y tercer año, coincidiendo con el control de esfínteres. Ocurre cuando un progenitor se avergüenza del niño o controla excesivamente sus impulsos naturales y su placer, tachándolos de vergonzosos.",
        awareness: "Te has convertido en el salvador de todos para no mirar tu propia vergüenza. Te cargas de peso ajeno porque crees que solo sufriendo eres digno de amor. Sanar es entender que el placer es un derecho sagrado, no un pecado.",
        fear: "La Libertad de ser tú mismo sin censura ni juicio social.",
        healingKey: "Darse permiso para el placer y el descanso sin tener que justificarse.",
        oppositeAction: "Priorizar una necesidad propia hoy. Decir NO a un favor que te agota o te degrada.",
        reframe: "Tengo derecho a disfrutar. Mi libertad y mi placer son lícitos y necesarios."
    },
    traicion: {
        name: "Traición",
        mask: "Controlador",
        survivalResponse: "Reaccionar",
        survivalDesc: "Modo lucha/combate. Tomas el mando de forma dominante, seductora o agresiva para anticiparte a cualquier posible engaño o pérdida de poder.",
        color: "#ef4444",
        longDesc: "Es la herida de la CONFIANZA. El 'Controlador' necesita mostrarse fuerte y capaz en todo momento. Su mente funciona como un radar que escanea mentiras o debilidades en los demás.",
        genesis: "Se desarrolla entre los dos y cuatro años, frecuentemente con el progenitor del sexo opuesto. El niño sintió que su confianza fue violada por promesas incumplidas o manipulaciones, aprendiendo que confiar es peligroso.",
        awareness: "Tu necesidad de control es un escudo contra la impotencia. Al no confiar, terminas solo en tu torre de vigilancia. Confiar no es garantizar que no te fallen, sino saber que tienes la fuerza para sobrevivir si sucede.",
        fear: "La Vulnerabilidad / Que alguien tome el mando y lo use en tu contra.",
        healingKey: "Soltar la necesidad de previsión total. Delegar y permitir la vulnerabilidad.",
        oppositeAction: "Delegar una tarea importante sin supervisar. Tolerar la incertidumbre sin interrogar al otro.",
        reframe: "Confío en el flujo de la vida. Soy resiliente ante cualquier circunstancia."
    },
    injusticia: {
        name: "Injusticia",
        mask: "Rígido",
        survivalResponse: "Paralizarse",
        survivalDesc: "Tu sistema se 'congela' en la perfección técnica. Te vuelves frío, distante y extremadamente cuadriculado para que ninguna emoción 'imperfecta' te toque.",
        color: "#10b981",
        longDesc: "Es la herida del SENTIR. El 'Rígido' confunde el amor con el rendimiento. Bloquea su sensibilidad para no parecer débil, exigiendo de sí mismo y de otros un orden impecable.",
        genesis: "Se manifiesta entre los cuatro y seis años, casi siempre con el progenitor del mismo sexo si este fue frío o muy exigente. El niño aprendió que solo se le aprecia por lo que hace bien, no por quien es.",
        awareness: "Has dejado de vivir para empezar a rendir. Tu rigidez corporal es una armadura contra la calidez que tanto anhelas. Sanar es permitirte ser humano, caótico y vulnerable; entender que la conexión real está en la imperfección.",
        fear: "La Imperfección / Ser juzgado como ineficiente, injusto o equivocado.",
        healingKey: "Reconectar con la sensibilidad corporal. Permitirse el error y la espontaneidad.",
        oppositeAction: "Aceptar un error propio sin castigo mental. Mostrar una emoción real (vulnerabilidad) ante alguien.",
        reframe: "Soy humano y tengo derecho a fallar. Mi valor trasciende mis resultados."
    }
};


const SCENARIOS = {
    personal: [
        { q: "Alguien critica una decisión que tomaste con mucha ilusión...", options: [{ t: "Me retiro y me callo", w: "rechazo" }, { t: "Busco que me entiendan desesperadamente", w: "abandono" }, { t: "Me siento culpable y pequeño", w: "humillacion" }, { t: "Ataco de vuelta cuestionando su vida", w: "traicion" }, { t: "Argumento lógicamente por qué es perfecta", w: "injusticia" }] },
        { q: "Ves una foto de amigos en una reunión donde no fuiste invitado...", options: [{ t: "Mejor, no quería ir de todos modos", w: "rechazo" }, { t: "Me siento solo y excluido", w: "abandono" }, { t: "Seguro se están riendo de mí", w: "humillacion" }, { t: "Lo planearon a propósito para molestarme", w: "traicion" }, { t: "Es una falta de ética y respeto social", w: "injusticia" }] },
        { q: "Te dan un reconocimiento público por algo que hiciste...", options: [{ t: "Quisiera ser invisible ahora mismo", w: "rechazo" }, { t: "Si no me felicitan todos, me entristezco", w: "abandono" }, { t: "Pienso que no merezco tanto crédito", w: "humillacion" }, { t: "Pienso que me lo dan por algún interés", w: "traicion" }, { t: "Analizo si el premio es justo y exacto", w: "injusticia" }] },
        { q: "Un amigo tarda 2 días en contestar un mensaje tuyo...", options: [{ t: "Ya no le intereso, no vuelvo a escribir", w: "rechazo" }, { t: "Reviso si hice algo mal para que se aleje", w: "abandono" }, { t: "Me siento ignorado y ridículo", w: "humillacion" }, { t: "Me está manipulando con el silencio", w: "traicion" }, { t: "Es una conducta informal e incorrecta", w: "injusticia" }] },
        { q: "Alguien te dice que te ve 'muy bien' y radiante...", options: [{ t: "Cambio de tema rápidamente", w: "rechazo" }, { t: "Necesito que me lo diga más veces", w: "abandono" }, { t: "Pienso que está exagerando o miente", w: "humillacion" }, { t: "Pienso que quiere pedirme un favor", w: "traicion" }, { t: "Intento corregir algún defecto que veo", w: "injusticia" }] },
        { q: "Debes pedir dinero prestado por una urgencia real...", options: [{ t: "Prefiero sufrir solo antes que pedir", w: "rechazo" }, { t: "Me da pánico que me digan que no", w: "abandono" }, { t: "Me muero de la vergüenza al pedir", w: "humillacion" }, { t: "Me siento humillado al perder poder", w: "traicion" }, { t: "No debería haberme pasado esto, es un error", w: "injusticia" }] },
        { q: "Un vecino te pide un favor que te quita mucho tiempo...", options: [{ t: "Digo que sí para evitar conflictos", w: "rechazo" }, { t: "Digo sí para que me valore y quiera", w: "abandono" }, { t: "Me sacrifico aunque me agote", w: "humillacion" }, { t: "Pienso cómo cobrárselo después", w: "traicion" }, { t: "Si es justo por norma, lo hago", w: "injusticia" }] },
        { q: "Alguien te halaga efusivamente en público...", options: [{ t: "Quiero que pare ya mismo", w: "rechazo" }, { t: "Me encanta, quiero que todos oigan", w: "abandono" }, { t: "Me siento indigno del halago", w: "humillacion" }, { t: "Pienso qué beneficio busca", w: "traicion" }, { t: "Analizo si el halago es técnicamente exacto", w: "injusticia" }] },
        { q: "Te equivocas de camino conduciendo con gente...", options: [{ t: "Me quedo mudo y tenso de estrés", w: "rechazo" }, { t: "Temo que se burlen o se harten", w: "abandono" }, { t: "Me siento el más tonto del mundo", w: "humillacion" }, { t: "Culpo al GPS o a las señales", w: "traicion" }, { t: "Me enfurezco por mi falta de precisión", w: "injusticia" }] },
        { q: "Estás solo en casa un viernes por la noche...", options: [{ t: "Me siento aliviado; nadie me juzga", w: "rechazo" }, { t: "Siento un vacío insoportable", w: "abandono" }, { t: "Me pongo a limpiar para sentirme útil", w: "humillacion" }, { t: "Vigilo redes para ver qué hacen otros", w: "traicion" }, { t: "Organizo mi agenda rígidamente", w: "injusticia" }] }
    ],
    pareja: [
        { q: "Tu pareja te pide un tiempo para pensar...", options: [{ t: "Me alejo y no llamo nunca más", w: "rechazo" }, { t: "Suplico desesperadamente que se quede", w: "abandono" }, { t: "Me lo merezco por ser como soy", w: "humillacion" }, { t: "Pienso que tiene a otra persona", w: "traicion" }, { t: "Es una falta de eficiencia relacional", w: "injusticia" }] },
        { q: "Tu pareja olvida tu plato favorito en una cena...", options: [{ t: "No digo nada y me cierro emocionalmente", w: "rechazo" }, { t: "Siento que ya no le intereso nada", w: "abandono" }, { t: "No soy lo bastante importante", w: "humillacion" }, { t: "Me está engañando con su atención", w: "traicion" }, { t: "Es injusto, yo recuerdo todo lo suyo", w: "injusticia" }] },
        { q: "Tu pareja te dice que te ve muy guapo/a hoy...", options: [{ t: "Me siento incómodo y cambio de tema", w: "rechazo" }, { t: "Necesito que me lo repita más veces", w: "abandono" }, { t: "Lo dice por lástima o costumbre", w: "humillacion" }, { t: "Sospecho qué querrá conseguir de mí", w: "traicion" }, { t: "Analizo si mi aspecto es realmente impecable", w: "injusticia" }] },
        { q: "Ves una llamada perdida de un ex en el móvil de tu pareja...", options: [{ t: "No pregunto y me distancio mudo", w: "rechazo" }, { t: "Me va a cambiar por alguien mejor", w: "abandono" }, { t: "El ex seguro es superior a mí", w: "humillacion" }, { t: "Exijo explicaciones inmediatas", w: "traicion" }, { t: "Es una violación de los términos de lealtad", w: "injusticia" }] },
        { q: "Hay un silencio largo durante una comida...", options: [{ t: "Me hundo en mis pensamientos solitarios", w: "rechazo" }, { t: "Me aterra que no haya conexión", w: "abandono" }, { t: "Siento que soy aburrido y pesado", w: "humillacion" }, { t: "Me está ocultando un secreto", w: "traicion" }, { t: "La comunicación debe ser fluida y correcta", w: "injusticia" }] },
        { q: "Tu pareja tiene un éxito laboral enorme...", options: [{ t: "Me alegro pero me siento pequeño", w: "rechazo" }, { t: "Temo que ahora ya no me necesite", w: "abandono" }, { t: "Siento envidia y luego vergüenza", w: "humillacion" }, { t: "Pienso cómo eso afecta a mi poder", w: "traicion" }, { t: "Es el resultado justo de su esfuerzo", w: "injusticia" }] },
        { q: "Propones intimidad y tu pareja dice que está cansada...", options: [{ t: "Me siento rechazado y me alejo", w: "rechazo" }, { t: "Temo que ya no le atraigo nada", w: "abandono" }, { t: "Me siento degradado y ridículo", w: "humillacion" }, { t: "Pienso que lo hace con otro/a", w: "traicion" }, { t: "Es injusto, yo siempre estoy disponible", w: "injusticia" }] },
        { q: "Tu pareja te critica el modo de gestionar el dinero...", options: [{ t: "No vuelvo a opinar de finanzas", w: "rechazo" }, { t: "Temo que peleemos y me deje", w: "abandono" }, { t: "Soy un desastre, tiene razón", w: "humillacion" }, { t: "Es un ataque a mi autonomía", w: "traicion" }, { t: "Mi método es el más equilibrado", w: "injusticia" }] },
        { q: "Tu pareja está muy cariñosa hoy sin motivo...", options: [{ t: "Me siento invadido con tanto contacto", w: "rechazo" }, { t: "Me relajo, pero quiero que sea eterno", w: "abandono" }, { t: "Siento que no merezco tanto afecto", w: "humillacion" }, { t: "Sospecho si ha hecho algo malo", w: "traicion" }, { t: "Analizo si este afecto es proporcional", w: "injusticia" }] },
        { q: "Tenéis una discusión y tu pareja se va a otra habitación...", options: [{ t: "Mejor así, prefiero mi soledad", w: "rechazo" }, { t: "Siento un pánico de abandono insoportable", w: "abandono" }, { t: "Seguro se ha cansado de mi torpeza", w: "humillacion" }, { t: "Pienso que me está castigando adrede", w: "traicion" }, { t: "No es la forma justa de debatir", w: "injusticia" }] }
    ],
    laboral: [
        { q: "Tu jefe pide corregir un trabajo delante de otros colegas...", options: [{ t: "Quiero renunciar de inmediato", w: "rechazo" }, { t: "Temo que ya no confíe en mí", w: "abandono" }, { t: "Me siento el más torpe del edificio", w: "humillacion" }, { t: "Quiere humillarme para ganar él", w: "traicion" }, { t: "Me enfurezco por mi falta de perfección", w: "injusticia" }] },
        { q: "Un compañero asciende y tú no, habiendo trabajado igual...", options: [{ t: "No encajo en esta empresa", w: "rechazo" }, { t: "Me siento dejado de lado", w: "abandono" }, { t: "Todos ven mi fracaso patente", w: "humillacion" }, { t: "Hay favoritismos y traiciones internas", w: "traicion" }, { t: "Es una injusticia meritocrática clara", w: "injusticia" }] },
        { q: "Te piden liderar una reunión estratégica...", options: [{ t: "Paso un estrés horrible por ser visto", w: "rechazo" }, { t: "Busco apoyo constante para no estar solo", w: "abandono" }, { t: "Temo hacer el ridículo y dar pena", w: "humillacion" }, { t: "Tomo el mando con mucha autoridad", w: "traicion" }, { t: "Debe ser una presentación impecable", w: "injusticia" }] },
        { q: "Recibes un bono extra mayor que el de otros...", options: [{ t: "Siento que es un error de contabilidad", w: "rechazo" }, { t: "Me alegra sentirme valorado y útil", w: "abandono" }, { t: "Me da vergüenza frente a mis colegas", w: "humillacion" }, { t: "Sospecho qué interés hay detrás", w: "traicion" }, { t: "Es lo justo por mi alto rendimiento", w: "injusticia" }] },
        { q: "Tu jefe no te saluda al entrar hoy por la mañana...", options: [{ t: "Mejor así, menos contacto social", w: "rechazo" }, { t: "He hecho algo mal, ya no me quiere", w: "abandono" }, { t: "Soy invisible para la empresa", w: "humillacion" }, { t: "Me está ninguneando a propósito", w: "traicion" }, { t: "Es una falta de profesionalidad total", w: "injusticia" }] },
        { q: "Un subordinado comete un error grave bajo tu mando...", options: [{ t: "No le digo nada por no entrar en líos", w: "rechazo" }, { t: "Temo que si le regaño me odie", w: "abandono" }, { t: "Me siento responsable de su torpeza", w: "humillacion" }, { t: "Le vigilaré de cerca, ya no confío", w: "traicion" }, { t: "Debe haber una consecuencia justa", w: "injusticia" }] },
        { q: "La empresa anuncia recortes de personal inminentes...", options: [{ t: "Me voy yo antes de que me echen", w: "rechazo" }, { t: "Me angustia perder mi 'familia' laboral", w: "abandono" }, { t: "Seguro me toca a mí por inútil", w: "humillacion" }, { t: "Busco alianzas para que no me toquen", w: "traicion" }, { t: "Es injusto tras todo mi esfuerzo", w: "injusticia" }] },
        { q: "Te asignan el proyecto más difícil del año...", options: [{ t: "Me siento abrumado y quiero huir", w: "rechazo" }, { t: "Espero que me feliciten mucho al acabar", w: "abandono" }, { t: "Siento que me están castigando", w: "humillacion" }, { t: "Es mi oportunidad de tener el control", w: "traicion" }, { t: "Debe ser ejecutado a la perfección", w: "injusticia" }] },
        { q: "Un colega te cuenta un secreto de oficina prohibido...", options: [{ t: "Hago como que no sé nada de nada", w: "rechazo" }, { t: "Le ayudo para que confíe en mí", w: "abandono" }, { t: "Me siento mal por saber algo prohibido", w: "humillacion" }, { t: "Uso la información como poder futuro", w: "traicion" }, { t: "Analizo si es éticamente correcto", w: "injusticia" }] },
        { q: "Te proponen un traslado a otra ciudad...", options: [{ t: "No quiero cambiar mi entorno seguro", w: "rechazo" }, { t: "Me da miedo perder mis vínculos aquí", w: "abandono" }, { t: "Haré el ridículo en un sitio nuevo", w: "humillacion" }, { t: "Negociaré el máximo poder allá", w: "traicion" }, { t: "Analizo si es un paso justo en mi carrera", w: "injusticia" }] }
    ]
};


const TEST_QUESTIONS = [
    { q: "¿Cuánto dura aproximadamente el pico de química emocional antes de poder actuar racionalmente?", options: ["15 segundos", "90 segundos", "10 minutos"], correct: 1 },
    { q: "¿Cuál es el objetivo principal del 'Etiquetado Cognitivo'?", options: ["Sentir más la emoción", "Activar la Corteza Prefrontal (desidentificación)", "Culpar a los demás"], correct: 1 },
    { q: "Si mi respuesta biológica es 'Huir', ¿cuál es mi Acción Alternativa?", options: ["Correr más rápido", "Quedarme y ocupar mi espacio físico", "Ignorar a todo el mundo"], correct: 1 }
];


// --- COMPONENTE PRINCIPAL ---
export default function App() {
    const [view, setView] = useState('home');
    const [scope, setScope] = useState(null);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState(null);
    const [detailedWound, setDetailedWound] = useState(null);
    const [testScore, setTestScore] = useState(0);
    const [testStep, setTestStep] = useState(0);


    // Persistencia Local
    useEffect(() => {
        const saved = localStorage.getItem('egoscan_ultimate_v2');
        if (saved) {
            try { setResults(JSON.parse(saved)); } catch (e) { console.error(e); }
        }
    }, []);


    const startQuiz = (s) => { setScope(s); setStep(0); setAnswers([]); setView('quiz'); };


    const handleOption = (w) => {
        const newAnswers = [...answers, w];
        if (step < SCENARIOS[scope].length - 1) {
            setAnswers(newAnswers);
            setStep(step + 1);
        } else {
            const counts = { rechazo: 0, abandono: 0, humillacion: 0, traicion: 0, injusticia: 0 };
            newAnswers.forEach(ans => counts[ans]++);
            const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
            const main = sorted[0][0];
            const res = {
                main, counts, date: new Date().toLocaleDateString(), scope: scope.charAt(0).toUpperCase() + scope.slice(1),
                allScores: Object.entries(counts).map(([k,v])=>({ subject: WOUNDS_CONFIG[k].name, value: v }))
            };
            setResults(res);
            localStorage.setItem('egoscan_ultimate_v2', JSON.stringify(res));
            setView('results');
        }
    };


    const handleTest = (idx) => {
        if (idx === TEST_QUESTIONS[testStep].correct) setTestScore(testScore + 1);
        if (testStep < TEST_QUESTIONS.length - 1) {
            setTestStep(testStep + 1);
        } else {
            setView('testResults');
        }
    };


    return (
        <div className="w-full max-w-2xl mx-auto min-h-screen bg-white flex flex-col font-sans border-x border-slate-50 shadow-2xl overflow-x-hidden">
            {/* Header */}
            <header className="p-4 border-b flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-40">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-900 text-white p-2 rounded-lg shadow-sm"><Brain size={18}/></div>
                    <span className="font-bold text-slate-800 tracking-tight italic">EgoScan Mastery v2</span>
                </div>
                {view !== 'home' && <button onClick={()=>setView('home')} className="text-slate-400 hover:text-slate-900 transition-colors"><RotateCcw size={18}/></button>}
            </header>


            <main className="flex-1 p-6">
                {view === 'home' && (
                    <div className="space-y-12 animate-fade-in">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-slate-900 leading-none tracking-tight text-balance">Tu Mapa <span className="text-indigo-600">Emocional</span>.</h1>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed">Detecta tu Herida y tu Mecanismo de Supervivencia biológico en 30 escenarios reales de vida.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { id: 'personal', label: 'Personal', icon: User, color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                                { id: 'pareja', label: 'Pareja', icon: Heart, color: 'bg-pink-50 border-pink-100 text-pink-700' },
                                { id: 'laboral', label: 'Laboral', icon: Briefcase, color: 'bg-emerald-50 border-emerald-100 text-emerald-700' }
                            ].map((item) => (
                                <button key={item.id} onClick={()=>startQuiz(item.id)} className={cn("p-8 border-2 rounded-[2.5rem] flex items-center justify-between transition-all group shadow-sm", item.color)}>
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:rotate-6 transition-transform"><item.icon size={32}/></div>
                                        <div className="font-black text-2xl tracking-tight">{item.label}</div>
                                    </div>
                                    <ChevronRight size={24}/>
                                </button>
                            ))}
                        </div>
                        {results && (
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <History size={20} className="text-slate-400"/>
                                    <div className="text-left">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Último Análisis</div>
                                        <div className="font-bold text-slate-700 uppercase italic leading-none">Herida de {results.main}</div>
                                    </div>
                                </div>
                                <button onClick={()=>setView('results')} className="text-indigo-600 font-bold text-sm underline">Ver de nuevo</button>
                            </div>
                        )}
                    </div>
                )}


                {view === 'quiz' && (
                    <div className="space-y-10 animate-fade-in h-auto">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <span>{scope}</span><span>{step+1} / 10</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-900 transition-all duration-700 ease-out" style={{width: `${(step+1)*10}%`}}></div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 leading-tight tracking-tight">{SCENARIOS[scope][step].q}</h2>
                        <div className="space-y-3">
                            {SCENARIOS[scope][step].options.map((opt, i) => (
                                <button key={i} onClick={()=>handleOption(opt.w)} className="w-full text-left p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/30 hover:border-slate-900 hover:bg-white transition-all text-base font-bold text-slate-700 flex gap-5 items-center group shadow-sm outline-none">
                                    <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xs font-black text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">{String.fromCharCode(65+i)}</span>
                                    {opt.t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                {view === 'results' && results && (
                    <div className="space-y-10 animate-fade-in text-center h-auto">
                        <div className="space-y-3">
                            <h2 className="text-6xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">HERIDA DE {WOUNDS_CONFIG[results.main].name}</h2>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                <span className="px-4 py-1.5 bg-slate-100 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-slate-200">
                                    <Shield size={14}/> Máscara: {WOUNDS_CONFIG[results.main].mask}
                                </span>
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border",
                                    WOUNDS_CONFIG[results.main].survivalResponse === 'Huir' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    WOUNDS_CONFIG[results.main].survivalResponse === 'Paralizarse' ? "bg-cyan-50 text-cyan-700 border-cyan-200" :
                                    "bg-orange-50 text-orange-700 border-orange-200"
                                )}>
                                    {WOUNDS_CONFIG[results.main].survivalResponse === 'Huir' ? <ZapOff size={14}/> :
                                     WOUNDS_CONFIG[results.main].survivalResponse === 'Paralizarse' ? <Snowflake size={14}/> : <Flame size={14}/>}
                                    {WOUNDS_CONFIG[results.main].survivalResponse}
                                </span>
                            </div>
                        </div>
                       
                        <div className="h-80 bg-slate-50 rounded-[4rem] p-8 border-2 border-slate-100 flex items-center justify-center shadow-inner relative overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={results.allScores}>
                                    <PolarGrid stroke="#cbd5e1" />
                                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fontWeight: 900, fill: '#64748b'}} />
                                    <Radar dataKey="value" stroke={WOUNDS_CONFIG[results.main].color} fill={WOUNDS_CONFIG[results.main].color} fillOpacity={0.65} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>


                        <div className="grid grid-cols-1 gap-4 pb-12">
                            <button onClick={()=>{setDetailedWound(results.main); setView('longExplanation');}} className="w-full bg-slate-900 text-white p-7 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl hover:bg-black transition-all">
                                <BookOpen size={24}/> Análisis Profundo
                            </button>
                            <button onClick={()=>setView('awareness')} className="w-full bg-indigo-600 text-white p-7 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                                <Zap size={24}/> Método de las 2A
                            </button>
                        </div>
                    </div>
                )}


                {view === 'longExplanation' && detailedWound && (
                    <div className="space-y-10 animate-fade-in pb-16 h-auto">
                        <button onClick={()=>setView('results')} className="text-slate-400 hover:text-slate-900 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors">
                            <ArrowLeft size={18}/> Volver
                        </button>
                       
                        <h2 className="text-5xl font-black text-slate-900 uppercase italic leading-none">Anatomía del {WOUNDS_CONFIG[detailedWound].name}</h2>
                        <div className="h-2 w-32 bg-indigo-600 rounded-full shadow-lg"></div>


                        <div className="space-y-8">
                            <div className="p-10 bg-slate-50 rounded-[4rem] border-2 border-slate-100 space-y-8 shadow-sm text-pretty">
                                <div className="flex gap-6">
                                    <Quote size={64} className="text-indigo-200 shrink-0 opacity-50"/>
                                    <p className="text-slate-700 text-xl leading-relaxed italic font-bold">"{WOUNDS_CONFIG[detailedWound].longDesc}"</p>
                                </div>
                               
                                {/* Sección: Génesis */}
                                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 text-indigo-600 font-black uppercase text-xs tracking-widest">
                                        <Baby size={20}/> Génesis de la Herida
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {WOUNDS_CONFIG[detailedWound].genesis}
                                    </p>
                                </div>


                                {/* Sección: Toma de Consciencia */}
                                <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl space-y-4">
                                    <div className="flex items-center gap-3 text-indigo-200 font-black uppercase text-xs tracking-widest">
                                        <Compass size={20}/> Toma de Consciencia
                                    </div>
                                    <p className="text-indigo-50 leading-relaxed font-bold italic">
                                        "{WOUNDS_CONFIG[detailedWound].awareness}"
                                    </p>
                                </div>


                                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm border-l-8 border-l-indigo-500">
                                    <h4 className="text-sm font-black text-indigo-600 uppercase mb-2 flex items-center gap-2">
                                        <Activity size={16}/> Respuesta Biológica: {WOUNDS_CONFIG[detailedWound].survivalResponse}
                                    </h4>
                                    <p className="text-slate-600 font-medium italic">{WOUNDS_CONFIG[detailedWound].survivalDesc}</p>
                                </div>
                               
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
                                        <div className="flex items-center gap-2 text-red-500 font-black uppercase text-xs tracking-widest"><AlertCircle size={16}/> Temor</div>
                                        <div className="text-2xl font-black text-slate-800 leading-tight">{WOUNDS_CONFIG[detailedWound].fear}</div>
                                    </div>
                                    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-3">
                                        <div className="flex items-center gap-2 text-emerald-500 font-black uppercase text-xs tracking-widest"><CheckCircle size={16}/> Sanación</div>
                                        <div className="text-2xl font-black text-slate-800 leading-tight">{WOUNDS_CONFIG[detailedWound].healingKey}</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <button onClick={()=>setView('awareness')} className="w-full bg-slate-900 text-white p-7 rounded-[2.5rem] font-black text-xl">Ir al Método 2A</button>
                    </div>
                )}


                {view === 'awareness' && (
                    <div className="space-y-12 animate-fade-in pb-16 h-auto">
                        <div className="space-y-4 text-center">
                            <h2 className="text-5xl font-black text-slate-900 leading-tight uppercase italic">Método 2A</h2>
                            <p className="text-slate-500 text-xl font-medium italic">"Etiquetado Cognitivo y Acción Alternativa"</p>
                        </div>
                       
                        <div className="space-y-10">
                            {/* A1: Autoconciencia */}
                            <section className="p-10 border-2 border-slate-100 rounded-[4rem] bg-indigo-50/30 space-y-6 shadow-sm border-l-8 border-l-indigo-600">
                                <div className="flex items-center gap-3 text-indigo-600 font-black text-sm uppercase tracking-widest">
                                    <Eye size={24}/> A de Autoconciencia
                                </div>
                                <h4 className="font-black text-3xl text-slate-900 leading-none tracking-tight">Detectar y Etiquetar</h4>
                                <p className="text-slate-600 text-lg leading-relaxed font-medium text-pretty">
                                    En el momento que sientas la activación biológica de tu sistema nervioso, detente y etiqueta:
                                    <span className="font-black text-indigo-600 block mt-4 text-2xl italic bg-white p-6 rounded-3xl shadow-inner border border-indigo-100 text-center">"Mi {WOUNDS_CONFIG[results.main].name} está hablando".</span>
                                </p>
                            </section>


                            {/* Diferenciación Educativa */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:scale-105">
                                    <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest mb-2"><Zap size={14}/> Emoción (Biología)</div>
                                    <p className="text-sm text-slate-500 italic">Respuesta física inmediata, breve e instintiva. Dura apenas unos segundos como un disparo químico.</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:scale-105">
                                    <div className="flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-widest mb-2"><Brain size={14}/> Sentimiento (Mente)</div>
                                    <p className="text-sm text-slate-500 italic">Emoción + Pensamiento. Dura días o años si alimentamos la historia mental que nos contamos.</p>
                                </div>
                            </div>


                            {/* A2: Acción Alternativa */}
                            <section className="p-10 bg-slate-900 text-white rounded-[4rem] space-y-10 shadow-2xl relative overflow-hidden">
                                <Anchor className="absolute -bottom-10 -right-10 text-white/5 w-64 h-64 -rotate-12" />
                                <div className="space-y-6 relative">
                                    <h4 className="font-black text-indigo-400 flex items-center gap-3 tracking-[0.2em] uppercase text-sm"><Target size={24}/> A de Acción Alternativa</h4>
                                    <p className="text-indigo-100 text-lg font-medium leading-relaxed">Reprograma tu respuesta biológica en 8 pasos técnicos:</p>
                                </div>
                                <ul className="space-y-6 relative">
                                    {[
                                        { icon: Clock, t: "Pausa de los 90s", d: "Espera a que el 'disparo' químico emocional se disipe de tu torrente sanguíneo." },
                                        { icon: Wind, t: "Respiración Coherente", d: "Inhala 4s, exhala 4s. Envía una señal biológica de seguridad al corazón." },
                                        { icon: Brain, t: "Etiquetado Cognitivo", d: "Nombra la herida para activar tu Corteza Prefrontal y salir del secuestro límbico." },
                                        { icon: Info, t: "Validación Interna", d: "Reconoce que tu niño interno tiene miedo y que sentirlo es natural y válido." },
                                        { icon: Activity, t: "Desafío al Pensamiento", d: "¿Esto es un hecho objetivo o es mi máscara proyectando un miedo del pasado?" },
                                        { icon: Zap, t: "El Acto Opuesto", d: `Realiza la acción contraria a tu máscara: ${WOUNDS_CONFIG[results.main].oppositeAction}` },
                                        { icon: UserCheck, t: "Sostén de la Sensación", d: "Tolera la incomodidad de no seguir tu patrón habitual. Es ahí donde ocurre la sanación." },
                                        { icon: Award, t: "Anclaje de Victoria", d: "Celébrate por haber elegido la consciencia sobre el impulso biológico ciego." }
                                    ].map((step, idx) => (
                                        <li key={idx} className="flex gap-6 group">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                                <step.icon size={20}/>
                                            </div>
                                            <div>
                                                <span className="font-black text-indigo-300 block mb-1 uppercase text-xs tracking-widest">{idx + 1}. {step.t}</span>
                                                <p className="text-slate-300 leading-relaxed text-sm font-medium">{step.d}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                        <button onClick={()=>{setTestStep(0); setTestScore(0); setView('test');}} className="w-full bg-slate-900 text-white p-7 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center justify-center gap-3 hover:bg-black transition-all">
                            Finalizar y Validar <ChevronRight size={24}/>
                        </button>
                    </div>
                )}


                {view === 'test' && (
                    <div className="space-y-12 animate-fade-in pb-16 h-auto">
                        <div className="space-y-4 text-center">
                            <h2 className="text-4xl font-black text-slate-900 uppercase italic">Test de Integración</h2>
                            <p className="text-slate-500 font-medium text-lg italic tracking-tight">¿Estás listo para aplicar lo aprendido en tu vida diaria?</p>
                        </div>
                        <div className="p-10 border-4 border-slate-50 rounded-[4rem] bg-slate-50/20 space-y-10 shadow-inner">
                            <h3 className="text-3xl font-black text-slate-800 leading-none">{TEST_QUESTIONS[testStep].q}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {TEST_QUESTIONS[testStep].options.map((opt, i) => (
                                    <button key={i} onClick={()=>handleTest(i)} className="p-6 bg-white border-2 border-slate-100 rounded-3xl text-left text-lg font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all outline-none shadow-sm hover:shadow-md">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {view === 'testResults' && (
                    <div className="space-y-10 animate-fade-in text-center pb-20 h-auto">
                        <div className="w-40 h-40 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-white shadow-[0_20px_60px_rgba(79,70,229,0.4)]">
                            <Award size={80} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-slate-900 uppercase italic">¡Maestría Integrada!</h2>
                            <p className="text-2xl text-slate-500 font-bold tracking-tight">Conceptos dominados: {testScore} de {TEST_QUESTIONS.length}</p>
                        </div>
                       
                        <div className="p-10 bg-slate-900 text-white rounded-[4rem] shadow-2xl relative overflow-hidden group">
                            <Sparkles className="absolute -top-10 -right-10 text-white/10 w-48 h-48 rotate-45 group-hover:scale-110 transition-transform duration-1000" />
                            <div className="relative">
                                <p className="text-2xl font-bold leading-relaxed italic text-indigo-50 text-pretty">
                                    "La emoción es la brújula que apunta hacia tu herida, pero el registro es el mapa que te guía hacia tu libertad."
                                </p>
                            </div>
                        </div>


                        <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 text-emerald-800 font-bold text-lg leading-relaxed italic text-pretty shadow-sm">
                            Recuerda: No registramos para controlar lo que sentimos, sino para dejar de ser controlados por aquello que aún no comprendemos.
                        </div>


                        <button onClick={()=>setView('home')} className="w-full bg-slate-900 text-white p-7 rounded-[2.5rem] font-black text-xl hover:bg-black transition-all shadow-xl">Cerrar Sesión Terapéutica</button>
                    </div>
                )}
            </main>


            <footer className="p-10 text-center border-t border-slate-50 bg-slate-50/30">
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em]">
                    EgoScan Ultimate • Bio-Consciencia • 2024
                </p>
            </footer>
        </div>
    );
}
