import { Search, Heart, Shuffle, Smartphone } from 'lucide-react'

interface Props {
  onDismiss: () => void
}

const features = [
  { icon: <Search size={28} />, title: 'Buscá recetas', desc: 'Miles de recetas de todo el mundo' },
  { icon: <Heart size={28} />, title: 'Guardá favoritas', desc: 'Tus recetas siempre a mano' },
  { icon: <Shuffle size={28} />, title: 'Sorprendete', desc: 'Dejá que la app elija por vos' },
]

export default function Landing({ onDismiss }: Props) {
  return (
    <div className="landing">
      <div className="landing-content">
        <img src="/logo.png" alt="Cookly" className="landing-logo" />
        <h1 className="landing-title">Cookly</h1>
        <p className="landing-tagline">Descubrí tu próxima receta favorita</p>

        <div className="landing-features">
          {features.map((f, i) => (
            <div key={i} className="card landing-feature">
              <span className="landing-feature-icon">{f.icon}</span>
              <span className="landing-feature-title">{f.title}</span>
              <span className="landing-feature-desc">{f.desc}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-light fw-bold rounded-pill px-5 py-3 landing-btn" onClick={onDismiss}>
          Empezar
        </button>

        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="landing-mobile">
          <Smartphone size={15} />
          <span>Disponible desde Android</span>
        </a>
      </div>
    </div>
  )
}
