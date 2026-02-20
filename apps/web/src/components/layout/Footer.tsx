import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-400 py-12'>
      <div className='container-page'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-2xl'>🎯</span>
              <span className='text-xl font-bold text-white'>AidesMax</span>
            </div>
            <p className='text-sm'>
              Découvrez toutes les aides et subventions auxquelles vous avez droit
              en France, en quelques minutes.
            </p>
          </div>

          <div>
            <h3 className='text-white font-semibold mb-4'>Liens rapides</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/questionnaire' className='hover:text-white transition-colors'>
                  Questionnaire
                </Link>
              </li>
              <li>
                <Link href='/auth/login' className='hover:text-white transition-colors'>
                  Connexion
                </Link>
              </li>
              <li>
                <Link href='/auth/register' className='hover:text-white transition-colors'>
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-white font-semibold mb-4'>Informations</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <span className='text-gray-500'>
                  MVP en développement
                </span>
              </li>
              <li>
                <span className='text-gray-500'>
                  Les estimations sont indicatives
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-sm'>
          <p>© {new Date().getFullYear()} AidesMax. Projet MVP.</p>
        </div>
      </div>
    </footer>
  );
}
